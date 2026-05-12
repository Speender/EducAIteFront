import { useMemo, useState } from "react";
import { FolderPlus, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCurrentStudentQuery } from "@/features/auth/api/hooks";
import {
  useCreateWorkspaceMajorDeckMutation,
  useCreateWorkspaceSubDeckMutation,
  useDeleteWorkspaceMajorDeckMutation,
  useFlashcardWorkspaceLatestQuery,
  useUpdateWorkspaceMajorDeckMutation,
} from "@/features/flashcards/api/hooks";
import { useStudentCourseGroupsQuery } from "@/features/student-courses/api/hooks";
import type { FlashcardDeckResponseDto } from "@/features/flashcards/api/dto";
import { getFlashcardMajorDeckPath } from "@/features/flashcards/routes";
import { getAuthSession } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/errors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ToastProvider";
import logo from "../../../assets/educAIte-logo.svg";

import { CreateMajorDeckDialog } from "../components/CreateMajorDeckDialog";
import { CreateSubDeckDialog } from "../components/CreateSubDeckDialog";
import DeckCard from "../components/DeckCard";
import SearchBar from "../components/SearchBar";

export function FlashcardsOverviewPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const session = getAuthSession();
  const currentStudentQuery = useCurrentStudentQuery();
  const studentSqid = currentStudentQuery.data?.sqid ?? session?.student.sqid ?? null;
  const courseGroupsQuery = useStudentCourseGroupsQuery(studentSqid);
  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const createMajorDeckMutation = useCreateWorkspaceMajorDeckMutation();
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [subDeckTarget, setSubDeckTarget] = useState<FlashcardDeckResponseDto | null>(null);
  const [editingDeck, setEditingDeck] = useState<FlashcardDeckResponseDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FlashcardDeckResponseDto | null>(null);
  const createSubDeckMutation = useCreateWorkspaceSubDeckMutation(subDeckTarget?.majorDeckSqid ?? null);
  const updateMajorDeckMutation = useUpdateWorkspaceMajorDeckMutation(editingDeck?.majorDeckSqid ?? null);
  const deleteMajorDeckMutation = useDeleteWorkspaceMajorDeckMutation();

  const decks = useMemo(() => workspaceQuery.data?.decks ?? [], [workspaceQuery.data?.decks]);
  const filteredDecks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return decks;
    }

    return decks.filter((deck) =>
      [deck.deckName, deck.edpCode ?? "", deck.sourceType, ...deck.subDecks.map((subDeck) => subDeck.title)]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [decks, search]);

  const totals = useMemo(() => {
    return decks.reduce(
      (acc, deck) => ({
        decks: acc.decks + 1,
        flashcards: acc.flashcards + deck.flashcardCount,
        subDecks: acc.subDecks + deck.subDecks.length,
        practiceItems: acc.practiceItems + deck.subDecks.reduce((sum, subDeck) => sum + subDeck.quizItemCount, 0),
      }),
      { decks: 0, flashcards: 0, subDecks: 0, practiceItems: 0 },
    );
  }, [decks]);

  const courseOptions = useMemo(
    () =>
      (courseGroupsQuery.data ?? []).flatMap((group) =>
        group.courses.map((course) => ({
          value: course.studentCourseSqid,
          label: `${course.edpCode} · ${course.courseName}`,
        })),
      ),
    [courseGroupsQuery.data],
  );

  async function handleCreateMajorDeck(payload: { title: string; description: string; studentCourseSqid: string | null }) {
    try {
      await createMajorDeckMutation.mutateAsync(payload);
      setIsCreateDialogOpen(false);
      showSuccess("Deck created.");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function handleUpdateMajorDeck(payload: { title: string; description: string; studentCourseSqid: string | null }) {
    try {
      await updateMajorDeckMutation.mutateAsync({
        title: payload.title,
        description: payload.description,
        studentCourseSqid: payload.studentCourseSqid,
      });
      setEditingDeck(null);
      showSuccess("Deck updated.");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function handleCreateSubDeck(payload: { title: string; description: string; sourceType: number }) {
    try {
      await createSubDeckMutation.mutateAsync({
        ...payload,
        difficultyFloor: 0,
        difficultyCeiling: 100,
        visibility: 0,
        status: 1,
      });
      setSubDeckTarget(null);
      showSuccess("Subdeck created.");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function handleDeleteMajorDeck() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMajorDeckMutation.mutateAsync(deleteTarget.majorDeckSqid);
      setDeleteTarget(null);
      showSuccess("Deck deleted.");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white antialiased">
      <header className="mx-auto max-w-[1600px] px-6 pt-24 md:pt-32 xl:px-12">
        <div className="flex items-center gap-4 md:gap-6">
          <img src={logo} alt="educAIte" className="h-8 md:h-10" />
        </div>
      </header>

      <main className="mx-auto flex max-w-[1600px] gap-12 px-6 pb-10 pt-8 md:pt-12 xl:px-12">
        <aside className="hidden w-[320px] shrink-0 space-y-6 xl:block">
          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-8">
            <h2 className="mb-8 text-2xl font-bold">Flashcard Overview</h2>
            <div className="space-y-5 text-sm">
              <SidebarStat label="Total Decks" value={totals.decks} />
              <SidebarStat label="Total Flashcards" value={totals.flashcards} />
              <SidebarStat label="Subdecks" value={totals.subDecks} />
              <SidebarStat label="Practice Items" value={totals.practiceItems} accent />
            </div>

            <div className="mt-10 flex items-center gap-5 rounded-3xl border border-white/5 bg-white/[0.02] p-5">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#00CEC8] border-r-transparent border-b-transparent -rotate-45">
                <span className="text-sm font-black rotate-45">
                  {totals.decks === 0 ? "0%" : `${Math.min(99, Math.max(12, Math.round((totals.practiceItems / Math.max(totals.subDecks, 1)) * 10)))}%`}
                </span>
              </div>
              <div className="text-[11px] leading-tight">
                <p className="mb-1 font-bold uppercase tracking-wider text-[#00CEC8]">Workspace readiness</p>
                <p className="text-white/50">
                  Subdecks: <span className="text-white">{totals.subDecks}</span>
                </p>
                <p className="text-white/50">
                  Practice items: <span className="text-white">{totals.practiceItems}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#00CEC8]">Workspace Flow</h3>
            <div className="space-y-3 text-xs text-white/50">
              <p>
                Major Decks: <span className="text-white">{totals.decks}</span>
              </p>
              <p>
                Subdeck Containers: <span className="text-white">{totals.subDecks}</span>
              </p>
              <p>
                Practice Items: <span className="text-white">{totals.practiceItems}</span>
              </p>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="flex items-center gap-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                <span className="text-[#00CEC8]">My Deck</span>
              </h1>
              <p className="mt-3 text-lg text-white/40">
                Keep the original workspace layout, then open each deck for subdecks and smart practice.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-[320px]">
                <SearchBar value={search} onChange={setSearch} placeholder="Search decks..." />
              </div>
              <Button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full px-6 text-sm font-semibold"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <FolderPlus data-icon="inline-start" />
                Add Deck
              </Button>
            </div>
          </div>

          {workspaceQuery.isPending ? (
            <WorkspaceLoadingGrid />
          ) : workspaceQuery.isError ? (
            <div className="rounded-[32px] border border-rose-500/20 bg-rose-500/5 p-12 text-center text-rose-200">
              {getErrorMessage(workspaceQuery.error)}
            </div>
          ) : filteredDecks.length === 0 ? (
            <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-12 text-center text-white/60">
              No decks found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredDecks.map((deck) => (
                <WorkspaceDeckCard
                  key={deck.majorDeckSqid}
                  deck={deck}
                  isMutating={deleteMajorDeckMutation.isPending}
                  onAddSubDeck={() => setSubDeckTarget(deck)}
                  onDeleteDeck={() => setDeleteTarget(deck)}
                  onEditDeck={() => setEditingDeck(deck)}
                  onOpenWorkspace={() => navigate(getFlashcardMajorDeckPath(deck.majorDeckSqid))}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateMajorDeckDialog
        key={isCreateDialogOpen ? "create-open" : "create-closed"}
        open={isCreateDialogOpen}
        isSubmitting={createMajorDeckMutation.isPending}
        courses={courseOptions}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateMajorDeck}
      />
      <CreateMajorDeckDialog
        key={`${editingDeck?.majorDeckSqid ?? "none"}-${editingDeck ? "open" : "closed"}`}
        open={Boolean(editingDeck)}
        mode="edit"
        initialValues={editingDeck ? {
          title: editingDeck.deckName,
          description: editingDeck.description,
          studentCourseSqid: editingDeck.studentCourseSqid ?? null,
        } : null}
        isSubmitting={updateMajorDeckMutation.isPending}
        courses={courseOptions}
        onOpenChange={(open) => {
          if (!open) {
            setEditingDeck(null);
          }
        }}
        onSubmit={handleUpdateMajorDeck}
      />
      <CreateSubDeckDialog
        open={Boolean(subDeckTarget)}
        isSubmitting={createSubDeckMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setSubDeckTarget(null);
          }
        }}
        onSubmit={handleCreateSubDeck}
      />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent className="dark bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deck?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deleteTarget?.deckName ?? "this deck"} from your flashcard workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMajorDeckMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMajorDeckMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteMajorDeck();
              }}
            >
              Delete deck
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function WorkspaceDeckCard({
  deck,
  isMutating,
  onAddSubDeck,
  onDeleteDeck,
  onEditDeck,
  onOpenWorkspace,
}: {
  deck: FlashcardDeckResponseDto;
  isMutating: boolean;
  onAddSubDeck: () => void;
  onDeleteDeck: () => void;
  onEditDeck: () => void;
  onOpenWorkspace: () => void;
}) {
  const quizItemCount = deck.subDecks.reduce((sum, subDeck) => sum + subDeck.quizItemCount, 0);
  const subtitle = [
    `Subdecks: ${deck.subDecks.length}`,
    `Practice Items: ${quizItemCount}`,
  ].join("  •  ");
  const meta = deck.edpCode ?? deck.sourceType;

  return (
    <DeckCard
      title={deck.deckName}
      subtitle={subtitle}
      meta={meta}
      actions={[
        {
          label: "Add subdeck",
          icon: <PlusIcon className="h-4 w-4" />,
          onSelect: onAddSubDeck,
        },
        {
          label: "Edit deck",
          icon: <PencilIcon className="h-4 w-4" />,
          onSelect: onEditDeck,
        },
        {
          label: "Delete deck",
          icon: <Trash2Icon className="h-4 w-4" />,
          onSelect: onDeleteDeck,
          disabled: isMutating,
          variant: "destructive",
        },
      ]}
      onClick={onOpenWorkspace}
    />
  );
}

function SidebarStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between text-white/60">
      <span>{label}:</span>
      <span className={`font-semibold ${accent ? "text-[#00CEC8]" : "text-white"}`}>{value}</span>
    </div>
  );
}

function WorkspaceLoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="h-64 animate-pulse rounded-[32px] bg-white/5" />
      ))}
    </div>
  );
}

export default FlashcardsOverviewPage;
