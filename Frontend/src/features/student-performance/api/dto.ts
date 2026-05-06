import { z } from "zod";

const decimalNumber = z.number().finite();

export const overallPerformanceDtoSchema = z.object({
  trackedCoursesCount: z.number().int().nonnegative(),
  trackedFlashcardsCount: z.number().int().nonnegative(),
  masteredFlashcardsCount: z.number().int().nonnegative(),
  flashcardAccuracyRate: decimalNumber,
  learningRetentionRate: decimalNumber,
  confidenceScore: decimalNumber,
  overallPerformanceScore: decimalNumber,
  riskLevel: z.string().trim().min(1),
  aiStatus: z.string().trim().min(1),
  aiInsight: z.string(),
  improvementSuggestion: z.string(),
  lastComputedAt: z.coerce.date().nullable(),
});

export const courseStudyTimeItemDtoSchema = z.object({
  studentCourseSqid: z.string().trim().min(1),
  courseName: z.string().trim().min(1),
  edpCode: z.string().trim().min(1),
  studyTimeHours: decimalNumber,
});

export const courseOverallPerformanceItemDtoSchema = z.object({
  studentCourseSqid: z.string().trim().min(1),
  courseName: z.string().trim().min(1),
  edpCode: z.string().trim().min(1),
  overallPerformanceScore: decimalNumber,
});

export const courseLearningRetentionItemDtoSchema = z.object({
  studentCourseSqid: z.string().trim().min(1),
  courseName: z.string().trim().min(1),
  edpCode: z.string().trim().min(1),
  learningRetentionRate: decimalNumber,
});

export const coursePerformanceSummaryItemDtoSchema = z.object({
  studentCourseSqid: z.string().trim().min(1),
  courseName: z.string().trim().min(1),
  edpCode: z.string().trim().min(1),
  overallPerformanceScore: decimalNumber,
});

export const learningTrendAnalysisDtoSchema = z.object({
  items: z.array(courseStudyTimeItemDtoSchema),
});

export const bestPerformingCourseDtoSchema = z.object({
  items: z.array(courseOverallPerformanceItemDtoSchema),
});

export const learningRetentionRateDtoSchema = z.object({
  items: z.array(courseLearningRetentionItemDtoSchema),
});

export const performanceSummaryRateDtoSchema = z.object({
  items: z.array(coursePerformanceSummaryItemDtoSchema),
});

export const studentAnalyticsDashboardResponseDtoSchema = z.object({
  overallPerformance: overallPerformanceDtoSchema,
  learningTrendAnalysis: learningTrendAnalysisDtoSchema,
  bestPerformingCourse: bestPerformingCourseDtoSchema,
  learningRetentionRate: learningRetentionRateDtoSchema,
  performanceSummaryRate: performanceSummaryRateDtoSchema,
});

export const studentOverallPerformanceSummaryResponseDtoSchema = overallPerformanceDtoSchema.extend({
  lastComputedAt: z.coerce.date(),
});

export const studentCoursePerformanceSummaryResponseDtoSchema = z.object({
  studentCourseSqid: z.string().trim().min(1),
  trackedFlashcardsCount: z.number().int().nonnegative(),
  masteredFlashcardsCount: z.number().int().nonnegative(),
  flashcardAccuracyRate: decimalNumber,
  learningRetentionRate: decimalNumber,
  confidenceScore: decimalNumber,
  overallPerformanceScore: decimalNumber,
  riskLevel: z.string().trim().min(1),
  aiStatus: z.string().trim().min(1),
  aiInsight: z.string(),
  improvementSuggestion: z.string(),
  lastComputedAt: z.coerce.date(),
});

export type StudentAnalyticsDashboardResponseDto = z.output<typeof studentAnalyticsDashboardResponseDtoSchema>;
export type StudentOverallPerformanceSummaryResponseDto = z.output<typeof studentOverallPerformanceSummaryResponseDtoSchema>;
export type StudentCoursePerformanceSummaryResponseDto = z.output<typeof studentCoursePerformanceSummaryResponseDtoSchema>;
