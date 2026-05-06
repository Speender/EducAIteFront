import { z } from "zod";

export const documentResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  documentName: z.string().trim().min(1),
  folderSqid: z.string().trim().min(1),
  fileMetadataSqid: z.string().trim().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const documentSignedUrlResponseDtoSchema = z.object({
  url: z.string().trim().url(),
});

export const updateDocumentRequestDtoSchema = z.object({
  documentName: z.string().trim().min(1),
  folderSqid: z.string().trim().min(1).optional(),
  fileMetadataSqid: z.string().trim().min(1).optional(),
});

export type DocumentResponseDto = z.output<typeof documentResponseDtoSchema>;
export type DocumentSignedUrlResponseDto = z.output<typeof documentSignedUrlResponseDtoSchema>;
export type UpdateDocumentRequestDto = z.output<typeof updateDocumentRequestDtoSchema>;
