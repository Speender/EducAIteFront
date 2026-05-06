import { z } from "zod";

export const loginRequestSchema = z.object({
  studentIdNumber: z.string().trim().min(1, "School ID is required."),
  password: z.string().min(1, "Password is required."),
});

export const authResultDtoSchema = z.object({
  success: z.boolean(),
  token: z.string().nullable().optional(),
  expiration: z.coerce.date().nullable().optional(),
  error: z.string().nullable().optional(),
});

export const currentStudentDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  studentIdNumber: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  middleName: z.string().trim().nullable().optional(),
  lastName: z.string().trim().min(1),
  email: z.string().trim(),
  phoneNumber: z.string().optional().nullable(),
  program: z.string().optional().nullable(),
  semester: z.number().optional().nullable(),
});

export type LoginRequest = z.output<typeof loginRequestSchema>;
export type AuthResultDto = z.output<typeof authResultDtoSchema>;
export type CurrentStudentDto = z.output<typeof currentStudentDtoSchema>;
