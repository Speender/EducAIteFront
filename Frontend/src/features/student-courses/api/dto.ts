import { z } from "zod";

import { studentAnalyticsDashboardResponseDtoSchema } from "@/features/student-performance/api/dto";

export const studyLoadResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  schoolYearStart: z.string().trim().min(1),
  schoolYearEnd: z.string().trim().min(1),
  semester: z.string().trim().min(1),
  totalUnits: z.number().finite().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export const studentCourseResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  courseSqid: z.string().trim().min(1),
  studyLoadSqid: z.string().trim().min(1),
  edpCode: z.string().trim().min(1),
  courseName: z.string().trim().min(1),
  units: z.number().finite(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const studyLoadResponseListDtoSchema = z.array(studyLoadResponseDtoSchema);
export const studentCourseResponseListDtoSchema = z.array(studentCourseResponseDtoSchema);
export const studentCourseDashboardDtoSchema = studentAnalyticsDashboardResponseDtoSchema;

export type StudyLoadResponseDto = z.output<typeof studyLoadResponseDtoSchema>;
export type StudentCourseResponseDto = z.output<typeof studentCourseResponseDtoSchema>;
export type StudentCourseDashboardDto = z.output<typeof studentCourseDashboardDtoSchema>;
