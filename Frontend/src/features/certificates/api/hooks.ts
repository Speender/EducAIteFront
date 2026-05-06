import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/api/auth";
import {
  getCertificates,
  getCertificateDetail,
  uploadCertificates,
  updateCertificate,
  deleteCertificate,
  startProcessing,
  startBatchProcessing,
  getProcessingStatus,
  confirmCertificate,
} from "./service";
import type { UpdateCertificateRequest, ConfirmCertificateRequest } from "./dto";

export const certificateQueryKeys = {
  all: ["certificates"] as const,
  list: (params: Record<string, unknown> | undefined) => [...certificateQueryKeys.all, "list", params] as const,
  detail: (sqid: string) => [...certificateQueryKeys.all, "detail", sqid] as const,
  status: (sqid: string) => [...certificateQueryKeys.all, "status", sqid] as const,
};

export function useCertificatesQuery(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  schoolYear?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: certificateQueryKeys.list(params),
    queryFn: () => getCertificates(params),
    enabled: Boolean(getAccessToken()),
  });
}

export function useCertificateDetailQuery(sqid: string | null) {
  return useQuery({
    queryKey: sqid ? certificateQueryKeys.detail(sqid) : ["certificates", "detail", "null"],
    queryFn: () => {
      if (!sqid) throw new Error("Sqid is required");
      return getCertificateDetail(sqid);
    },
    enabled: Boolean(getAccessToken() && sqid),
  });
}

export function useUploadCertificatesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ files, source, autoProcess }: { files: File[]; source?: string; autoProcess?: boolean }) =>
      uploadCertificates(files, source, autoProcess),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.all });
    },
  });
}

export function useUpdateCertificateMutation(sqid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCertificateRequest) => updateCertificate(sqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.detail(sqid) });
      queryClient.invalidateQueries({ queryKey: ["certificates", "list"] });
    },
  });
}

export function useDeleteCertificateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sqid: string) => deleteCertificate(sqid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.all });
    },
  });
}

export function useStartProcessingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sqid: string) => startProcessing(sqid),
    onSuccess: (_, sqid) => {
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.status(sqid) });
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.detail(sqid) });
    },
  });
}

export function useStartBatchProcessingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sqids: string[]) => startBatchProcessing(sqids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.all });
    },
  });
}

export function useCertificateProcessingStatusQuery(sqid: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: sqid ? certificateQueryKeys.status(sqid) : ["certificates", "status", "null"],
    queryFn: () => {
      if (!sqid) throw new Error("Sqid is required");
      return getProcessingStatus(sqid);
    },
    enabled: Boolean(getAccessToken() && sqid && enabled),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === "completed" || data.status === "failed")) {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
  });
}

export function useConfirmCertificateMutation(sqid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConfirmCertificateRequest) => confirmCertificate(sqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.detail(sqid) });
      queryClient.invalidateQueries({ queryKey: ["certificates", "list"] });
    },
  });
}
