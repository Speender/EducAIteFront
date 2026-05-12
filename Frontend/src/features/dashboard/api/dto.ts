import { z } from "zod";

const percentDtoSchema = z.number().finite();
const countDtoSchema = z.number().int().nonnegative();

export const studentDashboardInsightDtoSchema = z.object({
  title: z.string().default(""),
  masteryPercent: percentDtoSchema.nullable().optional(),
  hasSufficientData: z.boolean().nullable().optional(),
  insufficientData: z.boolean().nullable().optional(),
  isInsufficientData: z.boolean().nullable().optional(),
  status: z.string().trim().nullable().optional(),
  message: z.string().trim().nullable().optional(),
  reason: z.string().trim().nullable().optional(),
});

export const studentDashboardAiInsightsDtoSchema = z.object({
  strength: studentDashboardInsightDtoSchema.nullable().optional(),
  weakness: studentDashboardInsightDtoSchema.nullable().optional(),
  hasSufficientData: z.boolean().nullable().optional(),
  insufficientData: z.boolean().nullable().optional(),
  isInsufficientData: z.boolean().nullable().optional(),
  status: z.string().trim().nullable().optional(),
  message: z.string().trim().nullable().optional(),
  reason: z.string().trim().nullable().optional(),
}).nullable().optional().transform((value) => ({
  strength: value?.strength ?? null,
  weakness: value?.weakness ?? null,
  hasSufficientData: value?.hasSufficientData ?? null,
  insufficientData: value?.insufficientData ?? null,
  isInsufficientData: value?.isInsufficientData ?? null,
  status: value?.status ?? null,
  message: value?.message ?? null,
  reason: value?.reason ?? null,
}));

export const studentDashboardResponseDtoSchema = z.object({
  student: z.object({
    firstName: z.string(),
  }),
  weeklyPerformance: z.object({
    goalPercent: percentDtoSchema,
    deltaFromLastWeekPercent: z.number().finite(),
    label: z.string(),
  }),
  upcomingTasks: z.object({
    deadlineCountThisWeek: countDtoSchema,
    items: z.array(
      z.object({
        sqid: z.string(),
        title: z.string(),
        dueLabel: z.string(),
        startAtUtc: z.string(),
        category: z.string(),
      })
    ),
  }),
  aiInsights: studentDashboardAiInsightsDtoSchema,
  flashcardsToday: z.object({
    completedCount: countDtoSchema,
    targetCount: countDtoSchema,
    completionPercent: percentDtoSchema,
    streakDays: countDtoSchema,
  }),
  resumeSnapshot: z.object({
    resumeSqid: z.string().nullable(),
    newCertificationsThisSemester: countDtoSchema,
  }),
  generatedAtUtc: z.string(),
});

export type StudentDashboardInsightDto = z.infer<typeof studentDashboardInsightDtoSchema>;
export type StudentDashboardResponseDto = z.infer<typeof studentDashboardResponseDtoSchema>;
