import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import logo from '../../../assets/educAIte-logo.svg';
import AImpatin from '../../../assets/robot.svg';
import { useToast } from '@/components/ToastProvider';
import { useCurrentStudentQuery } from '@/features/auth/api/hooks';
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useFolderContentsQuery,
  useFoldersQuery,
  useFolderSearchQuery,
  useUpdateFolderMutation,
  useUploadFolderDocumentMutation,
} from '@/features/folders/api/hooks';
import type { FolderResponseDto } from '@/features/folders/api/dto';
import { buildUniqueFolderKey } from '@/features/folders/lib/folderKey';
import { useStudentCourseGroupsQuery } from '@/features/student-courses/api/hooks';
import { getAuthSession } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/api/errors';
import { useDeleteDocumentMutation, useDocumentQuery, useUpdateDocumentMutation } from '@/features/documents/api/hooks';
import { useDeleteNoteMutation, usePatchNoteMutation } from '@/features/notes/api/hooks';

import EmptyFolderState from './EmptyFolderState';
import ExplorerItemCard from './ExplorerItemCard';
import ImportFileModal from './ImportFileModal';
import CreateFolder from '../modal/CreateFolder';
import RenameItemModal from './RenameItemModal';
import DeleteItemModal from './DeleteItemModal';

type DisplayItem = {
  sqid: string;
  name: string;
  type: 'folder' | 'document' | 'note';
  typeLabel: string;
  createdAtLabel: string;
  updatedAtLabel: string;
  detailLabel?: string;
  detailValue?: string;
};

type ActionTarget = {
  sqid: string;
  name: string;
  type: 'folder' | 'document' | 'note';
};

function formatDateTimeLabel(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function buildBreadcrumbs(currentFolder: FolderResponseDto | null, folders: FolderResponseDto[]) {
  if (!currentFolder) {
    return [];
  }

  const folderBySqid = new Map(folders.map((folder) => [folder.sqid, folder]));
  const chain: FolderResponseDto[] = [];
  let pointer: FolderResponseDto | null = currentFolder;

  while (pointer) {
    chain.unshift(pointer);
    pointer = pointer.parentFolderSqid ? folderBySqid.get(pointer.parentFolderSqid) ?? null : null;
  }

  return chain;
}

const CourseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useToast();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getAuthSession();
  const currentStudentQuery = useCurrentStudentQuery();
  const studentSqid = currentStudentQuery.data?.sqid ?? session?.student.sqid ?? null;
  const courseGroupsQuery = useStudentCourseGroupsQuery(studentSqid);
  const foldersQuery = useFoldersQuery();
  const createFolderMutation = useCreateFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<ActionTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActionTarget | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [autoProvisionError, setAutoProvisionError] = useState<string | null>(null);
  const autoProvisionedCourseRef = useRef<string | null>(null);

  const selectedGroup = courseGroupsQuery.data?.find((group) =>
    group.courses.some((course) => course.studentCourseSqid === id),
  );
  const selectedCourse = selectedGroup?.courses.find((course) => course.studentCourseSqid === id);

  const rootFolder = useMemo(
    () =>
      foldersQuery.data?.find(
        (folder) => folder.studentCourseSqid === id && folder.parentFolderSqid === null,
      ) ??
      foldersQuery.data?.find((folder) => folder.studentCourseSqid === id) ??
      null,
    [foldersQuery.data, id],
  );

  const folderSqidFromUrl = searchParams.get('folder');
  const activeFolderSqid = folderSqidFromUrl?.trim() || rootFolder?.sqid || null;

  const currentFolder = useMemo(
    () =>
      foldersQuery.data?.find((folder) => folder.sqid === activeFolderSqid) ??
      null,
    [activeFolderSqid, foldersQuery.data],
  );
  const renameDocumentQuery = useDocumentQuery(renameTarget?.type === 'document' ? renameTarget.sqid : null);
  const updateFolderMutation = useUpdateFolderMutation(renameTarget?.type === 'folder' ? renameTarget.sqid : null);
  const updateDocumentMutation = useUpdateDocumentMutation(renameTarget?.type === 'document' ? renameTarget.sqid : null);
  const patchNoteMutation = usePatchNoteMutation(renameTarget?.type === 'note' ? renameTarget.sqid : null);
  const deleteDocumentMutation = useDeleteDocumentMutation();
  const deleteNoteMutation = useDeleteNoteMutation();
  const uploadFolderDocumentMutation = useUploadFolderDocumentMutation(activeFolderSqid);

  const breadcrumbs = useMemo(
    () => buildBreadcrumbs(currentFolder ?? rootFolder, foldersQuery.data ?? []),
    [currentFolder, foldersQuery.data, rootFolder],
  );

  const folderContentsQuery = useFolderContentsQuery(activeFolderSqid);
  const folderSearchQuery = useFolderSearchQuery(activeFolderSqid, debouncedSearchQuery);

  useEffect(() => {
    if (!rootFolder) {
      return;
    }

    if (!folderSqidFromUrl) {
      return;
    }

    const exists = foldersQuery.data?.some((folder) => folder.sqid === folderSqidFromUrl);
    if (!exists) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('folder');
      setSearchParams(nextParams, { replace: true });
    }
  }, [folderSqidFromUrl, foldersQuery.data, rootFolder, searchParams, setSearchParams]);

  useEffect(() => {
    setSearchInput('');
    setDebouncedSearchQuery('');
  }, [activeFolderSqid]);

  useEffect(() => {
    autoProvisionedCourseRef.current = null;
    setAutoProvisionError(null);
  }, [id]);

  useEffect(() => {
    if (!id || !selectedCourse || !selectedGroup || rootFolder || foldersQuery.isPending || createFolderMutation.isPending) {
      return;
    }

    if (autoProvisionedCourseRef.current === id) {
      return;
    }

    autoProvisionedCourseRef.current = id;
    setAutoProvisionError(null);

    const reservedFolderKeys = new Set((foldersQuery.data ?? []).map((folder) => folder.folderKey));
    const folderName = selectedCourse.courseName.trim() || selectedCourse.edpCode.trim() || 'Course Folder';

    void createFolderMutation
      .mutateAsync({
        folderKey: buildUniqueFolderKey(folderName, reservedFolderKeys),
        name: folderName,
        schoolYearStart: selectedGroup.schoolYearStart,
        schoolYearEnd: selectedGroup.schoolYearEnd,
        semester: selectedGroup.semester,
        studentCourseSqid: selectedCourse.studentCourseSqid,
        parentFolderSqid: null,
      })
      .then(() => {
        setAutoProvisionError(null);
      })
      .catch((error: unknown) => {
        autoProvisionedCourseRef.current = null;
        setAutoProvisionError(getErrorMessage(error));
      });
  }, [
    createFolderMutation,
    foldersQuery.data,
    foldersQuery.isPending,
    id,
    rootFolder,
    selectedCourse,
    selectedGroup,
  ]);

  useEffect(() => {
    const trimmedQuery = searchInput.trim();
    if (trimmedQuery.length < 2) {
      setDebouncedSearchQuery('');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(trimmedQuery);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const displayItems = useMemo<DisplayItem[]>(() => {
    if (debouncedSearchQuery.trim().length >= 2 && folderSearchQuery.data) {
      return folderSearchQuery.data.results.map((result) => ({
        sqid: result.sqid,
        name: result.name,
        type:
          result.itemType.toLowerCase().includes('folder')
            ? 'folder'
            : result.itemType.toLowerCase().includes('note')
              ? 'note'
              : 'document',
        typeLabel: result.itemType,
        createdAtLabel: 'Unavailable',
        updatedAtLabel: 'Unavailable',
        detailLabel: 'Path',
        detailValue: result.locationDisplayPath,
      }));
    }

    if (!folderContentsQuery.data) {
      return [];
    }

    return [
      ...folderContentsQuery.data.subFolders.map((item) => ({
        sqid: item.sqid,
        name: item.name,
        type: 'folder' as const,
        typeLabel: 'Folder',
        createdAtLabel: formatDateTimeLabel(item.createdAt),
        updatedAtLabel: formatDateTimeLabel(item.updatedAt),
      })),
      ...folderContentsQuery.data.documents.map((item) => ({
        sqid: item.sqid,
        name: item.name,
        type: 'document' as const,
        typeLabel: 'Document',
        createdAtLabel: formatDateTimeLabel(item.createdAt),
        updatedAtLabel: formatDateTimeLabel(item.updatedAt),
      })),
      ...folderContentsQuery.data.notes.map((item) => ({
        sqid: item.sqid,
        name: item.name,
        type: 'note' as const,
        typeLabel: 'Note',
        createdAtLabel: formatDateTimeLabel(item.createdAt),
        updatedAtLabel: formatDateTimeLabel(item.updatedAt),
      })),
    ];
  }, [debouncedSearchQuery, folderContentsQuery.data, folderSearchQuery.data]);

  const isLoading =
    courseGroupsQuery.isPending ||
    foldersQuery.isPending ||
    (Boolean(activeFolderSqid) && folderContentsQuery.isPending);

  const activeError =
    courseGroupsQuery.error ??
    foldersQuery.error ??
    folderContentsQuery.error ??
    folderSearchQuery.error ??
    null;

  const showFolderEmptyState =
    debouncedSearchQuery.trim().length < 2 &&
    !folderContentsQuery.isPending &&
    folderContentsQuery.data !== undefined &&
    folderContentsQuery.data.subFolders.length === 0 &&
    folderContentsQuery.data.documents.length === 0 &&
    folderContentsQuery.data.notes.length === 0;
  const renameError =
    updateFolderMutation.error ??
    updateDocumentMutation.error ??
    patchNoteMutation.error ??
    renameDocumentQuery.error ??
    null;
  const deleteError =
    deleteFolderMutation.error ??
    deleteDocumentMutation.error ??
    deleteNoteMutation.error ??
    null;
  const isRenaming =
    updateFolderMutation.isPending ||
    updateDocumentMutation.isPending ||
    patchNoteMutation.isPending ||
    renameDocumentQuery.isLoading;
  const isDeleting =
    deleteFolderMutation.isPending ||
    deleteDocumentMutation.isPending ||
    deleteNoteMutation.isPending;

  async function handleCreateFolder(folderName: string) {
    const folderContext = currentFolder ?? rootFolder;
    if (!folderContext || !selectedCourse?.studentCourseSqid) {
      return;
    }

    const parentFolderSqid = folderSqidFromUrl?.trim() || rootFolder?.sqid || null;
    const reservedFolderKeys = new Set((foldersQuery.data ?? []).map((folder) => folder.folderKey));

    try {
      await createFolderMutation.mutateAsync({
        folderKey: buildUniqueFolderKey(folderName, reservedFolderKeys),
        name: folderName.trim(),
        schoolYearStart: folderContext.schoolYearStart,
        schoolYearEnd: folderContext.schoolYearEnd,
        semester: folderContext.semester,
        studentCourseSqid: selectedCourse.studentCourseSqid,
        parentFolderSqid,
      });

      setIsCreateFolderModalOpen(false);
      createFolderMutation.reset();
      showSuccess('Folder created successfully.');
    } catch {
      // Mutation error is rendered from createFolderMutation.error.
    }
  }

  async function handleUploadDocument(file: File, documentName?: string) {
    if (!activeFolderSqid) {
      return;
    }

    try {
      await uploadFolderDocumentMutation.mutateAsync({ file, documentName });
      setIsImportModalOpen(false);
      uploadFolderDocumentMutation.reset();
      showSuccess('File added successfully.');
    } catch {
      // mutation error rendered in modal
    }
  }

  async function handleRenameItem(nextName: string) {
    if (!renameTarget) {
      return;
    }

    try {
      if (renameTarget.type === 'folder') {
        const folder = foldersQuery.data?.find((item) => item.sqid === renameTarget.sqid);
        if (!folder) {
          return;
        }

        await updateFolderMutation.mutateAsync({
          folderKey: folder.folderKey,
          name: nextName,
          schoolYearStart: folder.schoolYearStart,
          schoolYearEnd: folder.schoolYearEnd,
          semester: folder.semester,
          studentCourseSqid: folder.studentCourseSqid,
          parentFolderSqid: folder.parentFolderSqid,
        });
      } else if (renameTarget.type === 'document') {
        const document = renameDocumentQuery.data;
        if (!document) {
          return;
        }

        await updateDocumentMutation.mutateAsync({
          documentName: nextName,
          folderSqid: document.folderSqid,
          fileMetadataSqid: document.fileMetadataSqid,
        });
      } else {
        await patchNoteMutation.mutateAsync({
          name: nextName,
        });
      }

      setRenameTarget(null);
      showSuccess(
        `${renameTarget.type === 'folder' ? 'Folder' : renameTarget.type === 'document' ? 'Document' : 'Note'} renamed successfully.`,
      );
    } catch {
      // error shown in modal
    }
  }

  async function handleDeleteItem() {
    if (!deleteTarget) {
      return;
    }

    try {
      if (deleteTarget.type === 'folder') {
        await deleteFolderMutation.mutateAsync(deleteTarget.sqid);

        if (activeFolderSqid === deleteTarget.sqid) {
          navigateToFolder(currentFolder?.parentFolderSqid ?? null);
        }
      } else if (deleteTarget.type === 'document') {
        await deleteDocumentMutation.mutateAsync(deleteTarget.sqid);
      } else {
        await deleteNoteMutation.mutateAsync(deleteTarget.sqid);
      }

      setDeleteTarget(null);
      showSuccess(
        `${deleteTarget.type === 'folder' ? 'Folder' : deleteTarget.type === 'document' ? 'Document' : 'Note'} deleted successfully.`,
      );
    } catch {
      // error shown in modal
    }
  }

  async function handleItemClick(item: DisplayItem) {
    if (item.type === 'folder') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('folder', item.sqid);
      setSearchParams(nextParams);
      return;
    }

    if (item.type === 'note') {
      navigate(`/notes/${item.sqid}`, {
        state: {
          from: `${location.pathname}${location.search}`,
        },
      });
      return;
    }

    if (item.type === 'document') {
      navigate(`/documents/${item.sqid}`, {
        state: {
          from: `${location.pathname}${location.search}`,
        },
      });
    }
  }

  function navigateToFolder(folderSqid: string | null) {
    const nextParams = new URLSearchParams(searchParams);
    if (folderSqid) {
      nextParams.set('folder', folderSqid);
    } else {
      nextParams.delete('folder');
    }

    setSearchParams(nextParams);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-48 w-full max-w-xl animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
      </div>
    );
  }

  if (activeError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-xl rounded-[32px] border border-rose-400/20 bg-rose-950/20 p-8">
          <h1 className="text-2xl font-bold">Unable to load course details</h1>
          <p className="mt-3 text-white/70">{getErrorMessage(activeError)}</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Course not found</p>
        <button onClick={() => navigate('/courses')} className="ml-4 underline">
          Go back
        </button>
      </div>
    );
  }

  if (!rootFolder) {
    const isPreparingCourseFolder = createFolderMutation.isPending && !isCreateFolderModalOpen;

    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-xl rounded-[32px] border border-white/10 bg-[#050505] p-8">
          <h1 className="text-2xl font-bold">
            {isPreparingCourseFolder ? 'Preparing course folder' : 'No course folder yet'}
          </h1>
          <p className="mt-3 text-white/70">
            {isPreparingCourseFolder
              ? 'Setting up the root folder for this course so its documents and notes can load.'
              : 'This course is linked, but there is no folder root available yet for its documents and notes.'}
          </p>

          {autoProvisionError && (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-950/20 px-4 py-3 text-sm text-rose-100">
              {autoProvisionError}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {!isPreparingCourseFolder && (
              <button
                type="button"
                onClick={() => {
                  autoProvisionedCourseRef.current = null;
                  setAutoProvisionError(null);
                }}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-[#00CEC8]/70 hover:text-[#00CEC8]"
              >
                Retry setup
              </button>
            )}
            <button
              onClick={() => navigate('/courses')}
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black"
            >
              Back to courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen bg-black p-6 font-sans text-white antialiased transition-all duration-500 lg:px-16 lg:py-10 ${
          isImportModalOpen || isCreateFolderModalOpen || Boolean(renameTarget) || Boolean(deleteTarget) ? 'blur-md' : ''
        }`}
      >
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/courses')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md transition-all hover:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <img src={logo} alt="educAIte" className="h-10" />
          </div>
        </div>

        <div className="mb-16 flex flex-col items-start justify-between gap-8 lg:flex-row">
          <div>
            <h1 className="mb-4 text-5xl font-medium tracking-tight">Files</h1>
            <h2 className="text-4xl font-semibold leading-tight text-[#00CEC8]">
              {selectedCourse.courseName}
            </h2>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white">
                {selectedCourse.edpCode}
              </span>
              <span>{selectedCourse.units.toFixed(1)} units</span>
              {selectedGroup && <span>{selectedGroup.groupLabel}</span>}
              <span title={(currentFolder ?? rootFolder).name} className="max-w-[14rem] truncate">
                {(currentFolder ?? rootFolder).name}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => navigateToFolder(currentFolder?.parentFolderSqid ?? null)}
                disabled={!currentFolder?.parentFolderSqid}
                className={`rounded-full border px-4 py-2 transition-all ${
                  currentFolder?.parentFolderSqid
                    ? 'border-white/20 bg-white/5 text-white hover:border-[#00CEC8]/70 hover:text-[#00CEC8]'
                    : 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30'
                }`}
              >
                Back Folder
              </button>

              <div className="flex flex-wrap items-center gap-2 text-white/50">
                {breadcrumbs.map((folder, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <div key={folder.sqid} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigateToFolder(folder.sqid === rootFolder.sqid ? null : folder.sqid)}
                        className={`max-w-[10rem] truncate rounded-full px-3 py-1.5 text-sm transition-colors ${
                          isLast ? 'bg-white/10 text-white' : 'hover:text-[#00CEC8]'
                        }`}
                        title={folder.name}
                      >
                        {folder.name}
                      </button>
                      {!isLast && <span className="text-white/25">/</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => {
                  createFolderMutation.reset();
                  setIsCreateFolderModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-8 py-3 font-normal text-white transition-all hover:border-[#00CEC8]/70 hover:text-[#00CEC8]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Folder
              </button>

              <button
                onClick={() => {
                  uploadFolderDocumentMutation.reset();
                  setIsImportModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-full bg-white px-10 py-3 font-normal text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Import file
              </button>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <p className="mb-4 text-xl font-medium text-white">Search files</p>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-white/20 bg-black py-3 pl-12 pr-4 outline-none transition-all focus:border-[#00CEC8]"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="ml-2 mt-3 text-[11px] font-bold uppercase tracking-widest text-white/40">
              Search starts automatically after 2 characters
            </p>
          </div>
        </div>

        {debouncedSearchQuery.trim().length >= 2 && (
          <div className="mb-8 rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4">
            <p className="text-sm text-white/65">
              Showing search results for <span className="font-semibold text-white">"{debouncedSearchQuery}"</span>
            </p>
          </div>
        )}

        {debouncedSearchQuery.trim().length >= 2 && folderSearchQuery.isPending && (
          <div className="py-12 text-center text-white/40">
            <p className="text-lg">Searching folder contents...</p>
          </div>
        )}

        {showFolderEmptyState ? (
          <EmptyFolderState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {displayItems.length === 0 && !folderSearchQuery.isPending && debouncedSearchQuery.trim().length >= 2 && (
              <div className="col-span-full py-12 text-center text-white/40">
                <p className="text-lg">No files found matching "{debouncedSearchQuery}"</p>
              </div>
            )}

            {displayItems.map((item) => {
              const isInteractive = true;
              return (
                <ExplorerItemCard
                  key={`${item.type}-${item.sqid}`}
                  name={item.name}
                  type={item.type}
                  typeLabel={item.typeLabel}
                  createdAtLabel={item.createdAtLabel}
                  updatedAtLabel={item.updatedAtLabel}
                  detailLabel={item.detailLabel}
                  detailValue={item.detailValue}
                  isInteractive={isInteractive}
                  onClick={() => void handleItemClick(item)}
                  onEdit={() => {
                    updateFolderMutation.reset();
                    updateDocumentMutation.reset();
                    patchNoteMutation.reset();
                    setRenameTarget({ sqid: item.sqid, name: item.name, type: item.type });
                  }}
                  onDelete={() => {
                    deleteFolderMutation.reset();
                    deleteDocumentMutation.reset();
                    deleteNoteMutation.reset();
                    setDeleteTarget({ sqid: item.sqid, name: item.name, type: item.type });
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="fixed bottom-8 right-8 z-50">
          <div className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[#050505] shadow-xl transition-all hover:scale-110">
            <img src={AImpatin} alt="bot" className="h-9 w-9 object-contain" />
          </div>
        </div>
      </div>

      {isCreateFolderModalOpen && (
        <CreateFolder
          isOpen={isCreateFolderModalOpen}
          onClose={() => {
            if (!createFolderMutation.isPending) {
              setIsCreateFolderModalOpen(false);
              createFolderMutation.reset();
            }
          }}
          isSubmitting={createFolderMutation.isPending}
          errorMessage={createFolderMutation.error ? getErrorMessage(createFolderMutation.error) : null}
          onCreate={handleCreateFolder}
        />
      )}
      <ImportFileModal
        isOpen={isImportModalOpen}
        onClose={() => {
          if (!uploadFolderDocumentMutation.isPending) {
            setIsImportModalOpen(false);
            uploadFolderDocumentMutation.reset();
          }
        }}
        isSubmitting={uploadFolderDocumentMutation.isPending}
        errorMessage={uploadFolderDocumentMutation.error ? getErrorMessage(uploadFolderDocumentMutation.error) : null}
        onUpload={handleUploadDocument}
      />
      <RenameItemModal
        isOpen={Boolean(renameTarget)}
        title={
          renameTarget?.type === 'folder'
            ? 'Rename Folder'
            : renameTarget?.type === 'document'
              ? 'Rename Document'
              : 'Rename Note'
        }
        initialName={renameTarget?.name ?? ''}
        isSubmitting={isRenaming}
        errorMessage={renameError ? getErrorMessage(renameError) : null}
        onClose={() => {
          if (!isRenaming) {
            setRenameTarget(null);
            updateFolderMutation.reset();
            updateDocumentMutation.reset();
            patchNoteMutation.reset();
          }
        }}
        onSubmit={handleRenameItem}
      />
      <DeleteItemModal
        isOpen={Boolean(deleteTarget)}
        title={
          deleteTarget?.type === 'folder'
            ? 'Delete Folder'
            : deleteTarget?.type === 'document'
              ? 'Delete Document'
              : 'Delete Note'
        }
        itemName={deleteTarget?.name ?? ''}
        isSubmitting={isDeleting}
        errorMessage={deleteError ? getErrorMessage(deleteError) : null}
        onClose={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
            deleteFolderMutation.reset();
            deleteDocumentMutation.reset();
            deleteNoteMutation.reset();
          }
        }}
        onConfirm={handleDeleteItem}
      />
    </>
  );
};

export default CourseDetails;
