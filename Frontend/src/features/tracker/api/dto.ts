import { z } from "zod";

export const trackerHonorThresholdDtoSchema = z.object({
  label: z.string().trim().min(1),
  minAverage: z.number().finite(),
  maxAverage: z.number().finite(),
});

export const trackerAggregateDtoSchema = z.object({
  totalCourses: z.number().int().nonnegative(),
  gradedCourses: z.number().int().nonnegative(),
  totalUnits: z.number().int().nonnegative(),
  gradedUnits: z.number().int().nonnegative(),
  gpa: z.number().finite().nullable(),
  gwa: z.number().finite().nullable(),
  gpaHonorLabel: z.string().trim().min(1),
  gwaHonorLabel: z.string().trim().min(1),
});

export const trackerCourseDtoSchema = z.object({
  studentCourseSqid: z.string().trim().min(1),
  courseSqid: z.string().trim().min(1),
  courseCode: z.string().trim().min(1),
  courseName: z.string().trim().min(1),
  units: z.number().int().nonnegative(),
  midtermGrade: z.number().finite().nullable().optional(),
  finalGrade: z.number().finite().nullable(),
  finalRemarks: z.string().trim().min(1).optional(),
  hasFinalGrade: z.boolean(),
});

export const trackerSemesterDtoSchema = z.object({
  studyLoadSqid: z.string().trim().min(1),
  yearOrdinal: z.number().int().positive(),
  schoolYearStart: z.number().int().positive(),
  schoolYearEnd: z.number().int().positive(),
  semesterOrder: z.number().int().positive(),
  semesterLabel: z.string().trim().min(1),
  displayLabel: z.string().trim().min(1),
  courses: z.array(trackerCourseDtoSchema),
  official: trackerAggregateDtoSchema,
});

export const gradeTrackerResponseDtoSchema = z.object({
  projectionDisclaimer: z.string().trim().min(1),
  noHonorLabel: z.string().trim().min(1),
  honorThresholds: z.array(trackerHonorThresholdDtoSchema),
  semesters: z.array(trackerSemesterDtoSchema),
  accumulated: trackerAggregateDtoSchema,
});

export const updateTrackerFinalGradeRequestSchema = z.object({
  gradeValue: z.number().min(1).max(5).nullable(),
});

export const trackerGradeTypeSchema = z.enum(["MIDTERM", "FINAL"]);

export type GradeTrackerResponseDto = z.output<typeof gradeTrackerResponseDtoSchema>;
export type TrackerCourseDto = z.output<typeof trackerCourseDtoSchema>;
export type TrackerAggregateDto = z.output<typeof trackerAggregateDtoSchema>;
export type TrackerSemesterDto = z.output<typeof trackerSemesterDtoSchema>;
export type UpdateTrackerFinalGradeRequestDto = z.output<typeof updateTrackerFinalGradeRequestSchema>;
export type TrackerGradeTypeDto = z.output<typeof trackerGradeTypeSchema>;
