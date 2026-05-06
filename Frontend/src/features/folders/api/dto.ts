import { z } from "zod";

export const folderResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  studentSqid: z.string().trim().min(1),
  folderKey: z.string().trim().min(1),
  name: z.string().trim().min(1),
  schoolYearStart: z.number().int(),
  schoolYearEnd: z.number().int(),
  schoolYearDisplayName: z.string().trim().min(1),
  semester: z.number().int(),
  studentCourseSqid: z.string().trim().min(1),
  parentFolderSqid: z.string().trim().min(1).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createFolderRequestDtoSchema = z.object({
  folderKey: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(200),
  schoolYearStart: z.number().int(),
  schoolYearEnd: z.number().int(),
  semester: z.number().int().min(1).max(3),
  studentCourseSqid: z.string().trim().min(1),
  parentFolderSqid: z.string().trim().min(1).nullable(),
});

export const updateFolderRequestDtoSchema = createFolderRequestDtoSchema;

export const folderContentItemResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  name: z.string().trim().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const folderContentsResponseDtoSchema = z.object({
  folder: folderResponseDtoSchema,
  subFolders: z.array(folderContentItemResponseDtoSchema),
  documents: z.array(folderContentItemResponseDtoSchema),
  notes: z.array(folderContentItemResponseDtoSchema),
});

export const folderSearchResultResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  itemType: z.string().trim().min(1),
  name: z.string().trim().min(1),
  locationDisplayPath: z.string().trim(),
});

export const folderSearchResponseDtoSchema = z.object({
  folderSqid: z.string().trim().min(1),
  query: z.string(),
  results: z.array(folderSearchResultResponseDtoSchema),
});

export const signedUrlResponseDtoSchema = z.object({
  url: z.string().trim().url(),
});

export const uploadFolderDocumentResponseDtoSchema = z.object({
  document: z.object({
    sqid: z.string().trim().min(1),
    documentName: z.string().trim().min(1),
    folderSqid: z.string().trim().min(1),
    fileMetadataSqid: z.string().trim().min(1),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  fileMetadata: z.object({
    sqid: z.string().trim().min(1),
  }).passthrough(),
});

export const folderResponseListDtoSchema = z.array(folderResponseDtoSchema);

export type FolderResponseDto = z.output<typeof folderResponseDtoSchema>;
export type CreateFolderRequestDto = z.output<typeof createFolderRequestDtoSchema>;
export type UpdateFolderRequestDto = z.output<typeof updateFolderRequestDtoSchema>;
export type FolderContentsResponseDto = z.output<typeof folderContentsResponseDtoSchema>;
export type FolderSearchResponseDto = z.output<typeof folderSearchResponseDtoSchema>;
export type SignedUrlResponseDto = z.output<typeof signedUrlResponseDtoSchema>;
export type UploadFolderDocumentResponseDto = z.output<typeof uploadFolderDocumentResponseDtoSchema>;
