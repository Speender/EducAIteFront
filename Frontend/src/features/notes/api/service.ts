import { apiClient } from "@/lib/api/client";

import {
  generateNoteFromDocumentRequestDtoSchema,
  generateNoteFromDocumentResponseDtoSchema,
  noteResponseDtoSchema,
  patchNoteRequestDtoSchema,
  summarizeNoteRequestDtoSchema,
  summarizeNoteResponseDtoSchema,
  updateNoteRequestDtoSchema,
  type GenerateNoteFromDocumentRequestDto,
  type PatchNoteRequestDto,
  type SummarizeNoteRequestDto,
  type UpdateNoteRequestDto,
} from "./dto";

export async function getNoteBySqid(noteSqid: string) {
  const { data } = await apiClient.get(`/Note/${encodeURIComponent(noteSqid)}`);
  return noteResponseDtoSchema.parse(data);
}

export async function getNotesByDocument(documentSqid: string) {
  const { data } = await apiClient.get(`/Note/document/${encodeURIComponent(documentSqid)}`);
  return noteResponseDtoSchema.array().parse(data);
}

export async function updateNote(noteSqid: string, payload: UpdateNoteRequestDto) {
  const parsedPayload = updateNoteRequestDtoSchema.parse(payload);
  await apiClient.put(`/Note/${encodeURIComponent(noteSqid)}`, parsedPayload);
}

export async function patchNote(noteSqid: string, payload: PatchNoteRequestDto) {
  const parsedPayload = patchNoteRequestDtoSchema.parse(payload);
  await apiClient.patch(`/Note/${encodeURIComponent(noteSqid)}`, parsedPayload);
}

export async function deleteNote(noteSqid: string) {
  await apiClient.delete(`/Note/${encodeURIComponent(noteSqid)}`);
}

export async function summarizeNote(noteSqid: string, payload: SummarizeNoteRequestDto) {
  const parsedPayload = summarizeNoteRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(`/Note/${encodeURIComponent(noteSqid)}/ai/summarize`, parsedPayload);
  return summarizeNoteResponseDtoSchema.parse(data);
}

export async function generateNoteFromDocument(documentSqid: string, payload?: GenerateNoteFromDocumentRequestDto) {
  const parsedPayload = generateNoteFromDocumentRequestDtoSchema.parse(payload ?? {});
  const { data } = await apiClient.post(
    `/Note/document/${encodeURIComponent(documentSqid)}/ai/generate`,
    parsedPayload,
  );

  return generateNoteFromDocumentResponseDtoSchema.parse(data);
}
