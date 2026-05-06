import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import {
  createFolder,
  deleteFolder,
  getDocumentSignedUrl,
  getFolderContents,
  getFolders,
  searchFolderContents,
  updateFolder,
  uploadFolderDocument,
} from "./service";
import type { UpdateFolderRequestDto } from "./dto";

export const folderQueryKeys = {
  all: ["folders", "all"] as const,
  contents: (folderSqid: string) => ["folders", "contents", folderSqid] as const,
  search: (folderSqid: string, query: string) => ["folders", "search", folderSqid, query] as const,
};

export function useFoldersQuery() {
  return useQuery({
    queryKey: folderQueryKeys.all,
    queryFn: getFolders,
    enabled: Boolean(getAccessToken()),
  });
}

export function useFolderContentsQuery(folderSqid: string | null) {
  return useQuery({
    queryKey: folderSqid ? folderQueryKeys.contents(folderSqid) : ["folders", "contents", "missing"] as const,
    queryFn: () => {
      if (!folderSqid) {
        throw new Error("A folder identifier is required.");
      }

      return getFolderContents(folderSqid);
    },
    enabled: Boolean(getAccessToken() && folderSqid),
  });
}

export function useFolderSearchQuery(folderSqid: string | null, query: string) {
  return useQuery({
    queryKey:
      folderSqid && query
        ? folderQueryKeys.search(folderSqid, query)
        : ["folders", "search", "missing"] as const,
    queryFn: () => {
      if (!folderSqid) {
        throw new Error("A folder identifier is required.");
      }

      return searchFolderContents(folderSqid, query);
    },
    enabled: Boolean(getAccessToken() && folderSqid && query.trim().length >= 2),
  });
}

export function useDocumentSignedUrlMutation() {
  return useMutation({
    mutationFn: getDocumentSignedUrl,
  });
}

export function useCreateFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useUpdateFolderMutation(folderSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFolderRequestDto) => {
      if (!folderSqid) {
        throw new Error("A folder identifier is required.");
      }

      return updateFolder(folderSqid, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useUploadFolderDocumentMutation(folderSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, documentName }: { file: File; documentName?: string }) => {
      if (!folderSqid) {
        throw new Error("A folder identifier is required.");
      }

      return uploadFolderDocument(folderSqid, file, documentName);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
