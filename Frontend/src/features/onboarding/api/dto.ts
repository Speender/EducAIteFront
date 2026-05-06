import { z } from "zod";

export const registerWithStudyLoadFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  middleName: z.string().trim().optional().or(z.literal("")),
  lastName: z.string().trim().min(1, "Last name is required."),
  studentIdNumber: z.string().trim().min(1, "School ID is required."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
  expiresInMinutes: z.coerce.number().int().min(1).max(1440).default(60),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const onboardingStudentDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  id: z.number().int().positive(),
  studentIdNumber: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  program: z.string(),
  semester: z.number().int(),
  email: z.string().trim().email(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date(),
});

const onboardingAuthDtoSchema = z.object({
  success: z.boolean(),
  token: z.string().nullable().optional(),
  expiration: z.coerce.date().nullable().optional(),
  error: z.string().nullable().optional(),
});

const uploadedStudyLoadDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  semester: z.string().trim().min(1),
  totalUnits: z.number().nonnegative(),
});

const parsedCourseDtoSchema = z.object({
  edpCode: z.string().trim().min(1),
  courseName: z.string().trim().min(1),
  units: z.number().nonnegative(),
});

export const registerWithStudyLoadResponseDtoSchema = z.object({
  student: onboardingStudentDtoSchema,
  auth: onboardingAuthDtoSchema,
  studyLoad: z.object({
    uploadedStudyLoad: uploadedStudyLoadDtoSchema,
    parseResult: z.object({
      parsedSemester: z.number().int().min(1).max(4),
      parsedSchoolYearStart: z.number().int(),
      parsedSchoolYearEnd: z.number().int(),
      parsedCourses: z.array(parsedCourseDtoSchema),
    }),
  }),
});

export type RegisterWithStudyLoadFormInput = z.input<typeof registerWithStudyLoadFormSchema>;
export type RegisterWithStudyLoadFormValues = z.output<typeof registerWithStudyLoadFormSchema>;
export type RegisterWithStudyLoadResponseDto = z.output<typeof registerWithStudyLoadResponseDtoSchema>;
