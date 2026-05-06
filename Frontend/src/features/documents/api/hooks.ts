import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import { deleteDocument, getDocumentBySqid, getDocumentSignedUrl, updateDocument } from "./service";
import type { UpdateDocumentRequestDto } from "./dto";

export const documentQueryKeys = {
  all: ["documents"] as const,
  detail: (documentSqid: string) => [...documentQueryKeys.all, "detail", documentSqid] as const,
  signedUrl: (documentSqid: string) => [...documentQueryKeys.all, "signed-url", documentSqid] as const,
};

export function useDocumentQuery(documentSqid: string | null) {
  return useQuery({
    queryKey: documentSqid ? documentQueryKeys.detail(documentSqid) : [...documentQueryKeys.all, "detail", "missing"] as const,
    queryFn: () => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return getDocumentBySqid(documentSqid);
    },
    enabled: Boolean(getAccessToken() && documentSqid),
    refetchOnWindowFocus: false,
  });
}

export function useDocumentSignedUrlQuery(documentSqid: string | null) {
  return useQuery({
    queryKey: documentSqid ? documentQueryKeys.signedUrl(documentSqid) : [...documentQueryKeys.all, "signed-url", "missing"] as const,
    queryFn: () => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return getDocumentSignedUrl(documentSqid);
    },
    enabled: Boolean(getAccessToken() && documentSqid),
    refetchOnWindowFocus: false,
  });
}

export function useUpdateDocumentMutation(documentSqid: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentRequestDto) => {
      if (!documentSqid) {
        throw new Error("A document identifier is required.");
      }

      return updateDocument(documentSqid, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      await queryClient.invalidateQueries({ queryKey: documentSqid ? documentQueryKeys.detail(documentSqid) : ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
