import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import {
  abandonQuizSession,
  generateAndSaveQuizItems,
  generateQuizItemsPreview,
  getActiveQuizSession,
  getNextQuizItem,
  getQuizGenerationJob,
  getQuizItemsByDeck,
  restartQuizSession,
  retryQuizGenerationHydration,
  resumeQuizSession,
  saveGeneratedQuizItems,
  startQuizSession,
  submitQuizAnswer,
} from "./service";
import type {
  GeneratedQuizItemDraftDto,
  GenerateQuizItemsPreviewRequestDto,
  StartQuizSessionRequestDto,
  SubmitQuizAnswerRequestDto,
} from "./dto";

const terminalQuizGenerationHydrationStatuses = new Set(["Ready", "PartiallyReady", "Failed"]);

export const smartQuizQueryKeys = {
  all: ["smart-quiz"] as const,
  deckItems: (deckSqid: string) => [...smartQuizQueryKeys.all, "deck", deckSqid, "items"] as const,
  generationJob: (generationJobSqid: string) =>
    [...smartQuizQueryKeys.all, "generation-job", generationJobSqid] as const,
  activeSession: (scopeType: 1 | 2, deckSqid?: string | null, courseSqid?: string | null) =>
    [...smartQuizQueryKeys.all, "session", "active", scopeType, deckSqid ?? "no-deck", courseSqid ?? "no-course"] as const,
  sessionNext: (sessionSqid: string) => [...smartQuizQueryKeys.all, "session", sessionSqid, "next"] as const,
};

export function useQuizItemsByDeckQuery(deckSqid: string | null) {
  return useQuery({
    queryKey: deckSqid ? smartQuizQueryKeys.deckItems(deckSqid) : [...smartQuizQueryKeys.all, "deck", "missing"] as const,
    queryFn: () => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return getQuizItemsByDeck(deckSqid);
    },
    enabled: Boolean(getAccessToken() && deckSqid),
  });
}

export function useGenerateQuizItemsPreviewMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateQuizItemsPreviewRequestDto) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return generateQuizItemsPreview(deckSqid, payload);
    },
    onSuccess: (response) => {
      queryClient.setQueryData(smartQuizQueryKeys.generationJob(response.generationJobSqid), response);
    },
  });
}

export function useQuizGenerationJobQuery(generationJobSqid: string | null, enabled = true) {
  return useQuery({
    queryKey: generationJobSqid
      ? smartQuizQueryKeys.generationJob(generationJobSqid)
      : [...smartQuizQueryKeys.all, "generation-job", "missing"] as const,
    queryFn: () => {
      if (!generationJobSqid) {
        throw new Error("A generation job identifier is required.");
      }

      return getQuizGenerationJob(generationJobSqid);
    },
    enabled: Boolean(getAccessToken() && generationJobSqid && enabled),
    refetchInterval: (query) => (
      isQuizGenerationHydrationTerminal(query.state.data?.hydrationStatus) ? false : 2000
    ),
  });
}

export function useRetryQuizGenerationHydrationMutation(generationJobSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!generationJobSqid) {
        throw new Error("A generation job identifier is required.");
      }

      return retryQuizGenerationHydration(generationJobSqid);
    },
    onSuccess: (response) => {
      queryClient.setQueryData(smartQuizQueryKeys.generationJob(response.generationJobSqid), response);
    },
  });
}

export function useGenerateAndSaveQuizItemsMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateQuizItemsPreviewRequestDto) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return generateAndSaveQuizItems(deckSqid, payload);
    },
    onSuccess: async () => {
      if (deckSqid) {
        await queryClient.invalidateQueries({ queryKey: smartQuizQueryKeys.deckItems(deckSqid) });
      }
    },
  });
}

export function useSaveGeneratedQuizItemsMutation(deckSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: GeneratedQuizItemDraftDto[]) => {
      if (!deckSqid) {
        throw new Error("A deck identifier is required.");
      }

      return saveGeneratedQuizItems(deckSqid, items);
    },
    onSuccess: async () => {
      if (deckSqid) {
        await queryClient.invalidateQueries({ queryKey: smartQuizQueryKeys.deckItems(deckSqid) });
      }
    },
  });
}

export function useActiveQuizSessionQuery(
  scopeType: 1 | 2,
  deckSqid?: string | null,
  courseSqid?: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: smartQuizQueryKeys.activeSession(scopeType, deckSqid, courseSqid),
    queryFn: () => getActiveQuizSession(scopeType, deckSqid, courseSqid),
    enabled: Boolean(getAccessToken() && enabled),
  });
}

export function useStartQuizSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartQuizSessionRequestDto) => startQuizSession(payload),
    onSuccess: async (session) => {
      await queryClient.invalidateQueries({
        queryKey: smartQuizQueryKeys.activeSession(
          session.scopeType === "Deck" ? 1 : 2,
          session.deckSqid,
          session.courseSqid,
        ),
      });
    },
  });
}

export function useResumeQuizSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionSqid: string) => resumeQuizSession(sessionSqid),
    onSuccess: async (session) => {
      await queryClient.invalidateQueries({ queryKey: smartQuizQueryKeys.sessionNext(session.sessionSqid) });
    },
  });
}

export function useNextQuizItemQuery(sessionSqid: string | null, enabled = true) {
  return useQuery({
    queryKey: sessionSqid ? smartQuizQueryKeys.sessionNext(sessionSqid) : [...smartQuizQueryKeys.all, "session", "missing", "next"] as const,
    queryFn: () => {
      if (!sessionSqid) {
        throw new Error("A session identifier is required.");
      }

      return getNextQuizItem(sessionSqid);
    },
    enabled: Boolean(getAccessToken() && sessionSqid && enabled),
  });
}

export function useSubmitQuizAnswerMutation(sessionSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitQuizAnswerRequestDto) => {
      if (!sessionSqid) {
        throw new Error("A session identifier is required.");
      }

      return submitQuizAnswer(sessionSqid, payload);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: smartQuizQueryKeys.sessionNext(response.session.sessionSqid) });
    },
  });
}

export function useRestartQuizSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionSqid: string) => restartQuizSession(sessionSqid),
    onSuccess: async (session) => {
      await queryClient.invalidateQueries({ queryKey: smartQuizQueryKeys.sessionNext(session.sessionSqid) });
    },
  });
}

export function useAbandonQuizSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionSqid: string) => abandonQuizSession(sessionSqid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: smartQuizQueryKeys.all });
    },
  });
}

export function isQuizGenerationHydrationTerminal(status: string | null | undefined) {
  return Boolean(status && terminalQuizGenerationHydrationStatuses.has(status));
}
