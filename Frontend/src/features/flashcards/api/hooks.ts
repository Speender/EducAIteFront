import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import {
  analyzeFlashcardCodeSubmission,
  abandonFlashcardLearnSession,
  createDeckFlashcard,
  createWorkspaceMajorDeck,
  createWorkspaceSubDeck,
  createWorkspaceFlashcard,
  deleteDeckFlashcard,
  deleteFlashcardGenerationJob,
  deleteWorkspaceMajorDeck,
  executeFlashcardCode,
  extractDeckFlashcardSource,
  generateAndSaveDeckFlashcards,
  generateDeckFlashcardsPdfPreview,
  generateDeckFlashcardsPreview,
  generateFlashcardsFromNote,
  getActiveRecentFlashcardGenerationJobs,
  deleteWorkspaceFlashcard,
  getActiveFlashcardLearnSession,
  getDeckFlashcards,
  getDeckFlashcardsPdfGenerationJob,
  getFlashcardBySqid,
  getFlashcardDocuments,
  getFlashcardGenerationJob,
  getFlashcardGenerationJobs,
  getFlashcardReviewQueue,
  getFlashcardsByDocument,
  getLatestFlashcardWorkspace,
  getWorkspaceSubDecks,
  restartFlashcardLearnSession,
  resumeFlashcardLearnSession,
  saveGeneratedDeckFlashcards,
  startFlashcardLearnSession,
  startFlashcardLearnSessionFlow,
  startDeckFlashcardsPdfGenerationJob,
  submitAndAnalyzeFlashcard,
  submitFlashcardLearnAnswer,
  updateDeckFlashcard,
  updateWorkspaceMajorDeck,
  updateWorkspaceFlashcard,
} from "./service";
import type { FlashcardGenerationJobScope } from "./service";
import type {
  CreateFlashcardRequestDto,
  CreateWorkspaceMajorDeckRequestDto,
  CreateWorkspaceSubDeckRequestDto,
  ExecuteFlashcardCodeRequestDto,
  FlashcardPdfGenerationJobResponseDto,
  FlashcardPdfGenerationJobStatusDto,
  FlashcardLearnSessionScopeTypeDto,
  GeneratedFlashcardDraftDto,
  GenerateDeckFlashcardsPdfPreviewRequestDto,
  GenerateDeckFlashcardsPreviewRequestDto,
  GenerateFlashcardsFromNoteRequestDto,
  StartFlashcardLearnSessionRequestDto,
  SubmitFlashcardLearnAnswerRequestDto,
  SubmitAndAnalyzeFlashcardRequestDto,
  UpdateWorkspaceMajorDeckRequestDto,
  UpdateFlashcardRequestDto,
} from "./dto";

export const flashcardQueryKeys = {
  all: ["flashcards"] as const,
  workspaceLatest: () => [...flashcardQueryKeys.all, "workspace", "latest"] as const,
  subDecks: (majorDeckSqid: string) => [...flashcardQueryKeys.all, "workspace", "major-deck", majorDeckSqid, "subdecks"] as const,
  deckCards: (deckSqid: string) => [...flashcardQueryKeys.all, "deck", deckSqid, "cards"] as const,
  pdfGenerationJob: (deckSqid: string, jobSqid: string) => [...flashcardQueryKeys.all, "deck", deckSqid, "pdf-generation-job", jobSqid] as const,
  generationJob: (jobSqid: string) => [...flashcardQueryKeys.all, "generation-job", jobSqid] as const,
  generationJobs: (scope: FlashcardGenerationJobScope) => [...flashcardQueryKeys.all, "generation-jobs", scope] as const,
  activeRecentGenerationJobs: () => [...flashcardQueryKeys.all, "generation-jobs", "active-recent"] as const,
  documents: (studentCourseSqid: string) => [...flashcardQueryKeys.all, "documents", studentCourseSqid] as const,
  cards: (documentSqid: string) => [...flashcardQueryKeys.all, "cards", documentSqid] as const,
  detail: (flashcardSqid: string) => [...flashcardQueryKeys.all, "detail", flashcardSqid] as const,
  reviewQueue: () => [...flashcardQueryKeys.all, "review-queue"] as const,
  learnActiveSession: (
    scopeType: FlashcardLearnSessionScopeTypeDto,
    studentCourseSqid: string | null,
    documentSqid: string | null,
  ) => [...flashcardQueryKeys.all, "learn", "active", scopeType, studentCourseSqid ?? "overall", documentSqid ?? "all-documents"] as const,
};

const terminalPdfGenerationJobStatuses = new Set<FlashcardPdfGenerationJobStatusDto>([
  "completed",
  "failed",
  "canceled",
]);

export function isFlashcardPdfGenerationJobActive(status: FlashcardPdfGenerationJobStatusDto) {
  return !terminalPdfGenerationJobStatuses.has(status);
}

export function useFlashcardWorkspaceLatestQuery() {
  return useQuery({
    queryKey: flashcardQueryKeys.workspaceLatest(),
    queryFn: getLatestFlashcardWorkspace,
    enabled: Boolean(getAccessToken()),
  });
}

export function useWorkspaceSubDecksQuery(majorDeckSqid: string | null) {
  return useQuery({
    queryKey: majorDeckSqid
      ? flashcardQueryKeys.subDecks(majorDeckSqid)
      : [...flashcardQueryKeys.all, "workspace", "major-deck", "missing", "subdecks"] as const,
    queryFn: () => {
      if (!majorDeckSqid) {
        throw new Error("A major deck identifier is required.");
      }

      return getWorkspaceSubDecks(majorDeckSqid);
    },
    enabled: Boolean(getAccessToken() && majorDeckSqid),
  });
}

export function useCreateWorkspaceMajorDeckMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkspaceMajorDeckRequestDto) => createWorkspaceMajorDeck(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
    },
  });
}

export function useUpdateWorkspaceMajorDeckMutation(majorDeckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceMajorDeckRequestDto) => {
      if (!majorDeckSqid) {
        throw new Error("A major deck identifier is required.");
      }

      return updateWorkspaceMajorDeck(majorDeckSqid, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
    },
  });
}

export function useDeleteWorkspaceMajorDeckMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (majorDeckSqid: string) => deleteWorkspaceMajorDeck(majorDeckSqid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
    },
  });
}

export function useCreateWorkspaceSubDeckMutation(majorDeckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkspaceSubDeckRequestDto) => {
      if (!majorDeckSqid) {
        throw new Error("A major deck identifier is required.");
      }

      return createWorkspaceSubDeck(majorDeckSqid, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      if (majorDeckSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.subDecks(majorDeckSqid) });
      }
    },
  });
}

export function useFlashcardDocumentsQuery(studentCourseSqid: string | null) {
  return useQuery({
    queryKey: studentCourseSqid
      ? flashcardQueryKeys.documents(studentCourseSqid)
      : [...flashcardQueryKeys.all, "documents", "missing"] as const,
    queryFn: () => {
      if (!studentCourseSqid) {
        throw new Error("A student course identifier is required.");
      }

      return getFlashcardDocuments(studentCourseSqid);
    },
    enabled: Boolean(getAccessToken() && studentCourseSqid),
  });
}

export function useFlashcardsByDocumentQuery(documentSqid: string | null) {
  return useQuery({
    queryKey: documentSqid ? flashcardQueryKeys.cards(documentSqid) : [...flashcardQueryKeys.all, "cards", "missing"] as const,
    queryFn: () => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return getFlashcardsByDocument(documentSqid);
    },
    enabled: Boolean(getAccessToken() && documentSqid),
  });
}

export function useFlashcardDetailQuery(flashcardSqid: string | null) {
  return useQuery({
    queryKey: flashcardSqid ? flashcardQueryKeys.detail(flashcardSqid) : [...flashcardQueryKeys.all, "detail", "missing"] as const,
    queryFn: () => {
      if (!flashcardSqid) {
        throw new Error("A flashcard identifier is required.");
      }

      return getFlashcardBySqid(flashcardSqid);
    },
    enabled: Boolean(getAccessToken() && flashcardSqid),
  });
}

export function useDeckFlashcardsQuery(deckSqid: string | null) {
  return useQuery({
    queryKey: deckSqid ? flashcardQueryKeys.deckCards(deckSqid) : [...flashcardQueryKeys.all, "deck", "missing", "cards"] as const,
    queryFn: () => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return getDeckFlashcards(deckSqid);
    },
    enabled: Boolean(getAccessToken() && deckSqid),
  });
}

export function useCreateFlashcardMutation(documentSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFlashcardRequestDto) => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return createWorkspaceFlashcard(documentSqid, payload);
    },
    onSuccess: async () => {
      if (documentSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.cards(documentSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useCreateDeckFlashcardMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFlashcardRequestDto) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return createDeckFlashcard(deckSqid, payload);
    },
    onSuccess: async () => {
      if (deckSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.deckCards(deckSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useUpdateFlashcardMutation(flashcardSqid: string | null, documentSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFlashcardRequestDto) => {
      if (!flashcardSqid || !documentSqid) {
        throw new Error("A flashcard and document identifier are required.");
      }

      return updateWorkspaceFlashcard(documentSqid, flashcardSqid, payload);
    },
    onSuccess: async () => {
      if (flashcardSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.detail(flashcardSqid) });
      }
      if (documentSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.cards(documentSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useUpdateDeckFlashcardMutation(flashcardSqid: string | null, deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFlashcardRequestDto) => {
      if (!flashcardSqid || !deckSqid) {
        throw new Error("A flashcard and deck identifier are required.");
      }

      return updateDeckFlashcard(deckSqid, flashcardSqid, payload);
    },
    onSuccess: async () => {
      if (flashcardSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.detail(flashcardSqid) });
      }
      if (deckSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.deckCards(deckSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useDeleteFlashcardMutation(documentSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flashcardSqid: string) => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return deleteWorkspaceFlashcard(documentSqid, flashcardSqid);
    },
    onSuccess: async () => {
      if (documentSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.cards(documentSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useDeleteDeckFlashcardMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flashcardSqid: string) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return deleteDeckFlashcard(deckSqid, flashcardSqid);
    },
    onSuccess: async () => {
      if (deckSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.deckCards(deckSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useGenerateFlashcardsFromNoteMutation(documentSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { noteSqid: string } & Partial<GenerateFlashcardsFromNoteRequestDto>) => {
      const { noteSqid, ...request } = payload;
      if (!noteSqid) {
        throw new Error("A note identifier is required.");
      }

      return generateFlashcardsFromNote(noteSqid, { flashcardCount: request.flashcardCount ?? 5, ...request });
    },
    onSuccess: async () => {
      if (documentSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.cards(documentSqid) });
      }

      await queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useGenerateDeckFlashcardsPreviewMutation(deckSqid: string | null) {
  return useMutation({
    mutationFn: (payload: GenerateDeckFlashcardsPreviewRequestDto) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return generateDeckFlashcardsPreview(deckSqid, payload);
    },
  });
}

export function useGenerateDeckFlashcardsPdfPreviewMutation(deckSqid: string | null) {
  return useMutation({
    mutationFn: (payload: GenerateDeckFlashcardsPdfPreviewRequestDto) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return generateDeckFlashcardsPdfPreview(deckSqid, payload);
    },
  });
}

export function useStartDeckFlashcardsPdfGenerationJobMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateDeckFlashcardsPdfPreviewRequestDto) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return startDeckFlashcardsPdfGenerationJob(deckSqid, payload);
    },
    onSuccess: async (job) => {
      queryClient.setQueryData<FlashcardPdfGenerationJobResponseDto[]>(
        flashcardQueryKeys.activeRecentGenerationJobs(),
        (jobs = []) => [job, ...jobs.filter((item) => item.jobSqid !== job.jobSqid)],
      );
      queryClient.setQueryData<FlashcardPdfGenerationJobResponseDto[]>(
        flashcardQueryKeys.generationJobs("all"),
        (jobs = []) => [job, ...jobs.filter((item) => item.jobSqid !== job.jobSqid)],
      );
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.activeRecentGenerationJobs() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.generationJobs("all") });
    },
  });
}

export function useDeckFlashcardsPdfGenerationJobQuery(deckSqid: string | null, jobSqid: string | null) {
  return useQuery({
    queryKey: deckSqid && jobSqid
      ? flashcardQueryKeys.pdfGenerationJob(deckSqid, jobSqid)
      : [...flashcardQueryKeys.all, "deck", deckSqid ?? "missing", "pdf-generation-job", "missing"] as const,
    queryFn: () => {
      if (!deckSqid || !jobSqid) {
        throw new Error("A deck and generation job identifier are required.");
      }

      return getDeckFlashcardsPdfGenerationJob(deckSqid, jobSqid);
    },
    enabled: Boolean(getAccessToken() && deckSqid && jobSqid),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && !isFlashcardPdfGenerationJobActive(status) ? false : 2500;
    },
  });
}

export function useActiveRecentFlashcardGenerationJobsQuery() {
  return useQuery({
    queryKey: flashcardQueryKeys.activeRecentGenerationJobs(),
    queryFn: getActiveRecentFlashcardGenerationJobs,
    enabled: Boolean(getAccessToken()),
    refetchInterval: (query) => {
      const jobs = query.state.data ?? [];
      return jobs.some((job) => isFlashcardPdfGenerationJobActive(job.status)) ? 5000 : false;
    },
  });
}

export function useFlashcardGenerationJobsQuery(scope: FlashcardGenerationJobScope, enabled = true) {
  return useQuery({
    queryKey: flashcardQueryKeys.generationJobs(scope),
    queryFn: () => getFlashcardGenerationJobs(scope),
    enabled: Boolean(getAccessToken() && enabled),
    refetchInterval: (query) => {
      const jobs = query.state.data ?? [];
      return jobs.some((job) => isFlashcardPdfGenerationJobActive(job.status)) ? 5000 : false;
    },
  });
}

export function useFlashcardGenerationJobQuery(jobSqid: string | null) {
  return useQuery({
    queryKey: jobSqid
      ? flashcardQueryKeys.generationJob(jobSqid)
      : [...flashcardQueryKeys.all, "generation-job", "missing"] as const,
    queryFn: () => {
      if (!jobSqid) {
        throw new Error("A generation job identifier is required.");
      }

      return getFlashcardGenerationJob(jobSqid);
    },
    enabled: Boolean(getAccessToken() && jobSqid),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && !isFlashcardPdfGenerationJobActive(status) ? false : 2500;
    },
  });
}

export function useDeleteFlashcardGenerationJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlashcardGenerationJob,
    onSuccess: async (_, jobSqid) => {
      queryClient.removeQueries({ queryKey: flashcardQueryKeys.generationJob(jobSqid) });
      queryClient.setQueryData<FlashcardPdfGenerationJobResponseDto[]>(
        flashcardQueryKeys.activeRecentGenerationJobs(),
        (jobs = []) => jobs.filter((job) => job.jobSqid !== jobSqid),
      );
      queryClient.setQueryData<FlashcardPdfGenerationJobResponseDto[]>(
        flashcardQueryKeys.generationJobs("all"),
        (jobs = []) => jobs.filter((job) => job.jobSqid !== jobSqid),
      );
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.activeRecentGenerationJobs() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.generationJobs("all") });
    },
  });
}

export function useDeckFlashcardGenerationJobsQuery(majorDeckSqid: string | null, deckSqid: string | null) {
  const jobsQuery = useActiveRecentFlashcardGenerationJobsQuery();
  const jobs = useMemo(() => {
    const filteredJobs = (jobsQuery.data ?? []).filter((job) => {
      if (majorDeckSqid && job.majorDeckSqid !== majorDeckSqid) {
        return false;
      }

      if (deckSqid && job.deckSqid !== deckSqid) {
        return false;
      }

      return true;
    });

    return [...filteredJobs].sort((left, right) => {
      const leftUpdatedAt = left.updatedAtUtc?.getTime() ?? left.updatedAt?.getTime() ?? left.createdAtUtc?.getTime() ?? 0;
      const rightUpdatedAt = right.updatedAtUtc?.getTime() ?? right.updatedAt?.getTime() ?? right.createdAtUtc?.getTime() ?? 0;
      return rightUpdatedAt - leftUpdatedAt;
    });
  }, [deckSqid, jobsQuery.data, majorDeckSqid]);

  return {
    ...jobsQuery,
    jobs,
  };
}

export function useExtractDeckFlashcardSourceMutation(deckSqid: string | null) {
  return useMutation({
    mutationFn: (file: File) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return extractDeckFlashcardSource(deckSqid, file);
    },
  });
}

export function useGenerateAndSaveDeckFlashcardsMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateDeckFlashcardsPreviewRequestDto) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return generateAndSaveDeckFlashcards(deckSqid, payload);
    },
    onSuccess: async () => {
      if (deckSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.deckCards(deckSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useSaveGeneratedDeckFlashcardsMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      items: GeneratedFlashcardDraftDto[];
      sourceNoteSqid?: string | null;
      sourceDocumentSqid?: string | null;
    }) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return saveGeneratedDeckFlashcards(deckSqid, payload);
    },
    onSuccess: async () => {
      if (deckSqid) {
        await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.deckCards(deckSqid) });
      }
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useFlashcardReviewQueueQuery() {
  return useQuery({
    queryKey: flashcardQueryKeys.reviewQueue(),
    queryFn: getFlashcardReviewQueue,
    enabled: Boolean(getAccessToken()),
  });
}

export function useActiveFlashcardLearnSessionQuery(
  scopeType: FlashcardLearnSessionScopeTypeDto,
  studentCourseSqid: string | null,
  deckSqid: string | null,
  documentSqid: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: [...flashcardQueryKeys.learnActiveSession(scopeType, studentCourseSqid, documentSqid), deckSqid ?? "all-decks"] as const,
    queryFn: () => getActiveFlashcardLearnSession(scopeType, studentCourseSqid, deckSqid, documentSqid),
    enabled: Boolean(getAccessToken() && enabled),
  });
}

export function useStartFlashcardLearnSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartFlashcardLearnSessionRequestDto) => startFlashcardLearnSession(payload),
    onSuccess: async (session) => {
      await queryClient.invalidateQueries({
        queryKey: flashcardQueryKeys.learnActiveSession(
          session.scopeType as FlashcardLearnSessionScopeTypeDto,
          session.studentCourseSqid,
          session.documentSqid,
        ),
      });
    },
  });
}

export function useStartFlashcardLearnSessionFlowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartFlashcardLearnSessionRequestDto) => startFlashcardLearnSessionFlow(payload),
    onSuccess: async (result) => {
      const session = result.session ?? result.activeSession;
      if (!session) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: flashcardQueryKeys.learnActiveSession(
          session.scopeType as FlashcardLearnSessionScopeTypeDto,
          session.studentCourseSqid,
          session.documentSqid,
        ),
      });
    },
  });
}

export function useResumeFlashcardLearnSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionSqid: string) => resumeFlashcardLearnSession(sessionSqid),
    onSuccess: async (session) => {
      await queryClient.invalidateQueries({
        queryKey: flashcardQueryKeys.learnActiveSession(
          session.scopeType as FlashcardLearnSessionScopeTypeDto,
          session.studentCourseSqid,
          session.documentSqid,
        ),
      });
    },
  });
}

export function useRestartFlashcardLearnSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionSqid: string) => restartFlashcardLearnSession(sessionSqid),
    onSuccess: async (session) => {
      await queryClient.invalidateQueries({
        queryKey: flashcardQueryKeys.learnActiveSession(
          session.scopeType as FlashcardLearnSessionScopeTypeDto,
          session.studentCourseSqid,
          session.documentSqid,
        ),
      });
    },
  });
}

export function useAbandonFlashcardLearnSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionSqid: string) => abandonFlashcardLearnSession(sessionSqid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
    },
  });
}

export function useSubmitFlashcardLearnAnswerMutation(sessionSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitFlashcardLearnAnswerRequestDto) => {
      if (!sessionSqid) {
        throw new Error("A flashcard session identifier is required.");
      }

      return submitFlashcardLearnAnswer(sessionSqid, payload);
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.reviewQueue() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: ["student-performance", "course", result.answer.analytics.studentCourseSqid] });
      await queryClient.invalidateQueries({ queryKey: ["student-performance", "dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["student-performance", "overall"] });
    },
  });
}

export function useSubmitAndAnalyzeFlashcardMutation(flashcardSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAndAnalyzeFlashcardRequestDto) => {
      if (!flashcardSqid) {
        throw new Error("A flashcard identifier is required.");
      }

      return submitAndAnalyzeFlashcard(flashcardSqid, payload);
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.reviewQueue() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.workspaceLatest() });
      await queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: ["student-performance", "course", result.analytics.studentCourseSqid] });
      await queryClient.invalidateQueries({ queryKey: ["student-performance", "dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["student-performance", "overall"] });
    },
  });
}

export function useAnalyzeFlashcardCodeSubmissionMutation(flashcardSqid: string | null) {
  return useMutation({
    mutationFn: (payload: SubmitAndAnalyzeFlashcardRequestDto) => {
      if (!flashcardSqid) {
        throw new Error("A flashcard identifier is required.");
      }

      return analyzeFlashcardCodeSubmission(flashcardSqid, payload);
    },
  });
}

export function useExecuteFlashcardCodeMutation() {
  return useMutation({
    mutationFn: (payload: ExecuteFlashcardCodeRequestDto) => executeFlashcardCode(payload),
  });
}
