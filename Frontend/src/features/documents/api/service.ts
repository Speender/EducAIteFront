import { apiClient } from "@/lib/api/client";

import { documentResponseDtoSchema, documentSignedUrlResponseDtoSchema, updateDocumentRequestDtoSchema, type UpdateDocumentRequestDto } from "./dto";

export async function getDocumentBySqid(documentSqid: string) {
  const { data } = await apiClient.get(`/Document/${encodeURIComponent(documentSqid)}`);
  return documentResponseDtoSchema.parse(data);
}

export async function getDocumentSignedUrl(documentSqid: string) {
  const { data } = await apiClient.get(`/Document/${encodeURIComponent(documentSqid)}/signed-url`);
  return documentSignedUrlResponseDtoSchema.parse(data);
}

export async function updateDocument(documentSqid: string, payload: UpdateDocumentRequestDto) {
  const request = updateDocumentRequestDtoSchema.parse(payload);
  await apiClient.put(`/Document/${encodeURIComponent(documentSqid)}`, request);
}

export async function deleteDocument(documentSqid: string) {
  await apiClient.delete(`/Document/${encodeURIComponent(documentSqid)}`);
}
