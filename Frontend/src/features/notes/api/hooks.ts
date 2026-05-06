import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import { deleteNote, generateNoteFromDocument, getNoteBySqid, getNotesByDocument, patchNote, summarizeNote, updateNote } from "./service";
import type { GenerateNoteFromDocumentRequestDto, PatchNoteRequestDto, SummarizeNoteRequestDto, UpdateNoteRequestDto } from "./dto";

export const noteQueryKeys = {
  all: ["notes"] as const,
  detail: (noteSqid: string) => [...noteQueryKeys.all, "detail", noteSqid] as const,
  document: (documentSqid: string) => [...noteQueryKeys.all, "document", documentSqid] as const,
};

export function useNoteQuery(noteSqid: string | null) {
  return useQuery({
    queryKey: noteSqid ? noteQueryKeys.detail(noteSqid) : [...noteQueryKeys.all, "detail", "missing"] as const,
    queryFn: () => {
      if (!noteSqid) {
        throw new Error("A note identifier is required.");
      }

      return getNoteBySqid(noteSqid);
    },
    enabled: Boolean(getAccessToken() && noteSqid),
    refetchOnWindowFocus: false,
  });
}

export function useNotesByDocumentQuery(documentSqid: string | null) {
  return useQuery({
    queryKey: documentSqid ? noteQueryKeys.document(documentSqid) : [...noteQueryKeys.all, "document", "missing"] as const,
    queryFn: () => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return getNotesByDocument(documentSqid);
    },
    enabled: Boolean(getAccessToken() && documentSqid),
    refetchOnWindowFocus: false,
  });
}

export function useUpdateNoteMutation(noteSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNoteRequestDto) => {
      if (!noteSqid) {
        throw new Error("A note identifier is required.");
      }

      return updateNote(noteSqid, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function usePatchNoteMutation(noteSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PatchNoteRequestDto) => {
      if (!noteSqid) {
        throw new Error("A note identifier is required.");
      }

      return patchNote(noteSqid, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useSummarizeNoteMutation(noteSqid: string | null) {
  return useMutation({
    mutationFn: (payload: SummarizeNoteRequestDto) => {
      if (!noteSqid) {
        throw new Error("A note identifier is required.");
      }

      return summarizeNote(noteSqid, payload);
    },
  });
}

export function useGenerateNoteFromDocumentMutation(documentSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: GenerateNoteFromDocumentRequestDto) => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return generateNoteFromDocument(documentSqid, payload);
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(noteQueryKeys.detail(data.note.sqid), data.note);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}
