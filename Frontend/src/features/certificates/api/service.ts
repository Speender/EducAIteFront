import { apiClient } from "@/lib/api/client";
import {
  certificateDetailResponseSchema,
  certificateListResponseSchema,
  certificateProcessingStatusResponseSchema,
  uploadCertificatesResponseSchema,
  startCertificateProcessingResponseSchema,
  batchProcessCertificatesResponseSchema,
  type UpdateCertificateRequest,
  type ConfirmCertificateRequest,
} from "./dto";

/**
 * Upload certificates
 */
export async function uploadCertificates(files: File[], source: string = "resume_builder", autoProcess: boolean = true) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("source", source);
  formData.append("autoProcess", String(autoProcess));

  const { data } = await apiClient.post("/certificates/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return uploadCertificatesResponseSchema.parse(data);
}

/**
 * List certificates
 */
export async function getCertificates(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  schoolYear?: string;
  search?: string;
}) {
  const { data } = await apiClient.get("/certificates", { params });
  return certificateListResponseSchema.parse(data);
}

/**
 * Get certificate detail
 */
export async function getCertificateDetail(certificationSqid: string) {
  const { data } = await apiClient.get(`/certificates/${encodeURIComponent(certificationSqid)}`);
  return certificateDetailResponseSchema.parse(data);
}

/**
 * Update certificate fields
 */
export async function updateCertificate(certificationSqid: string, payload: UpdateCertificateRequest) {
  const { data } = await apiClient.put(`/certificates/${encodeURIComponent(certificationSqid)}`, payload);
  return certificateDetailResponseSchema.parse(data);
}

/**
 * Delete certificate
 */
export async function deleteCertificate(certificationSqid: string) {
  const { data } = await apiClient.delete(`/certificates/${encodeURIComponent(certificationSqid)}`);
  return data; // { certificationSqid: string; deleted: boolean; }
}

/**
 * Start parsing for a single certificate
 */
export async function startProcessing(certificationSqid: string) {
  const { data } = await apiClient.post(`/certificates/${encodeURIComponent(certificationSqid)}/process`);
  return startCertificateProcessingResponseSchema.parse(data);
}

/**
 * Start batch parsing
 */
export async function startBatchProcessing(certificationSqids: string[]) {
  const { data } = await apiClient.post("/certificates/process-batch", { certificationSqids });
  return batchProcessCertificatesResponseSchema.parse(data);
}

/**
 * Get processing status
 */
export async function getProcessingStatus(certificationSqid: string) {
  const { data } = await apiClient.get(`/certificates/${encodeURIComponent(certificationSqid)}/processing-status`);
  return certificateProcessingStatusResponseSchema.parse(data);
}

/**
 * Confirm reviewed data
 */
export async function confirmCertificate(certificationSqid: string, payload: ConfirmCertificateRequest) {
  const { data } = await apiClient.post(`/certificates/${encodeURIComponent(certificationSqid)}/confirm`, payload);
  return certificateDetailResponseSchema.parse(data);
}
