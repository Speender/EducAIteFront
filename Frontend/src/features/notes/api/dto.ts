import { z } from "zod";

export const noteResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  name: z.string().trim().min(1),
  noteContent: z.string(),
  documentSqid: z.string().trim().min(1),
  sequenceNumber: z.coerce.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const updateNoteRequestDtoSchema = z.object({
  name: z.string().trim().min(1),
  noteContent: z.string().trim().min(1),
  documentSqid: z.string().trim().min(1),
});

export const patchNoteRequestDtoSchema = z.object({
  name: z.string().trim().min(1).optional(),
  noteContent: z.string().optional(),
  documentSqid: z.string().trim().min(1).optional(),
});

export const summarizeNoteStyleDtoSchema = z.enum(["concise", "default", "detailed"]);

export const summarizeNoteRequestDtoSchema = z.object({
  style: summarizeNoteStyleDtoSchema.optional(),
});

export const summarizeNoteResponseDtoSchema = z.object({
  noteSqid: z.string().trim().min(1),
  originalContent: z.string().trim().min(1),
  summarizedContent: z.string().trim().min(1),
  model: z.string().trim().min(1),
  generatedAt: z.coerce.date(),
});

export const generateNoteFromDocumentRequestDtoSchema = z.object({
  expiresInMinutes: z.number().int().min(1).max(1440).optional().default(60),
});

export const generateNoteFromDocumentResponseDtoSchema = z.object({
  documentSqid: z.string().trim().min(1),
  source: z.enum(["generated", "existing"]),
  note: noteResponseDtoSchema,
});

export type NoteResponseDto = z.output<typeof noteResponseDtoSchema>;
export type UpdateNoteRequestDto = z.output<typeof updateNoteRequestDtoSchema>;
export type PatchNoteRequestDto = z.output<typeof patchNoteRequestDtoSchema>;
export type SummarizeNoteStyleDto = z.output<typeof summarizeNoteStyleDtoSchema>;
export type SummarizeNoteRequestDto = z.output<typeof summarizeNoteRequestDtoSchema>;
export type SummarizeNoteResponseDto = z.output<typeof summarizeNoteResponseDtoSchema>;
export type GenerateNoteFromDocumentRequestDto = z.output<typeof generateNoteFromDocumentRequestDtoSchema>;
export type GenerateNoteFromDocumentResponseDto = z.output<typeof generateNoteFromDocumentResponseDtoSchema>;
