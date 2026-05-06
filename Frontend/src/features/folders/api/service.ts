import { apiClient } from "@/lib/api/client";

import {
  createFolderRequestDtoSchema,
  folderContentsResponseDtoSchema,
  folderResponseListDtoSchema,
  folderResponseDtoSchema,
  folderSearchResponseDtoSchema,
  signedUrlResponseDtoSchema,
  updateFolderRequestDtoSchema,
  uploadFolderDocumentResponseDtoSchema,
  type CreateFolderRequestDto,
  type UpdateFolderRequestDto,
} from "./dto";

export async function getFolders() {
  const { data } = await apiClient.get("/Folder/me");
  return folderResponseListDtoSchema.parse(data);
}

export async function getFolderContents(folderSqid: string) {
  const { data } = await apiClient.get(`/Folder/${encodeURIComponent(folderSqid)}/contents`);
  return folderContentsResponseDtoSchema.parse(data);
}

export async function searchFolderContents(folderSqid: string, query: string) {
  const { data } = await apiClient.get(`/Folder/${encodeURIComponent(folderSqid)}/search`, {
    params: { q: query },
  });

  return folderSearchResponseDtoSchema.parse(data);
}

export async function getDocumentSignedUrl(documentSqid: string) {
  const { data } = await apiClient.get(`/Document/${encodeURIComponent(documentSqid)}/signed-url`);
  return signedUrlResponseDtoSchema.parse(data);
}

export async function createFolder(payload: CreateFolderRequestDto) {
  const request = createFolderRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post("/Folder", request);
  return folderResponseDtoSchema.parse(data);
}

export async function updateFolder(folderSqid: string, payload: UpdateFolderRequestDto) {
  const request = updateFolderRequestDtoSchema.parse(payload);
  await apiClient.put(`/Folder/${encodeURIComponent(folderSqid)}`, request);
}

export async function deleteFolder(folderSqid: string) {
  await apiClient.delete(`/Folder/${encodeURIComponent(folderSqid)}`);
}

export async function uploadFolderDocument(folderSqid: string, file: File, documentName?: string) {
  const formData = new FormData();
  formData.append("file", file);

  const trimmedDocumentName = documentName?.trim();
  if (trimmedDocumentName) {
    formData.append("documentName", trimmedDocumentName);
  }

  const { data } = await apiClient.post(`/Folder/${encodeURIComponent(folderSqid)}/documents`, formData);

  return uploadFolderDocumentResponseDtoSchema.parse(data);
}
