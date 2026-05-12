import { z } from "zod";

const quizItemTypeByValue = {
  0: "Flashcard",
  1: "Conceptual",
  2: "CodeReading",
  3: "Debugging",
  4: "Sql",
  5: "Algorithm",
  6: "OutputPrediction",
  7: "FillInCode",
  8: "MultipleChoice",
  9: "ShortAnswer",
  10: "Flowchart",
} as const;

const cognitiveSkillByValue = {
  0: "Recall",
  1: "Understand",
  2: "Apply",
  3: "Analyze",
  4: "Debug",
  5: "Design",
} as const;

const learningDomainByValue = {
  0: "Unknown",
  1: "Programming",
  2: "Database",
  3: "Math",
  4: "Writing",
  5: "Business",
  6: "GeneralEducation",
} as const;

const quizSessionScopeTypeByValue = {
  1: "Deck",
  2: "Course",
} as const;

const quizSessionStatusByValue = {
  1: "InProgress",
  2: "Completed",
  3: "Abandoned",
  4: "Restarted",
} as const;

const scoringVerdictByValue = {
  1: "ExactCorrect",
  2: "ConceptuallyCorrect",
  3: "Partial",
  4: "Incorrect",
} as const;

const scoringSourceByValue = {
  1: "FallbackRules",
  2: "Ai",
  3: "Compiler",
  4: "Hybrid",
} as const;

export const quizDraftValidationStatusDtoSchema = z.enum(["Ready", "Pending", "Downgraded", "Failed"]);
export const quizGenerationHydrationStatusDtoSchema = z.enum([
  "PreviewReady",
  "Hydrating",
  "Ready",
  "PartiallyReady",
  "Failed",
]);
export const quizItemTypeDtoSchema = enumValueSchema(quizItemTypeByValue);
export const cognitiveSkillDtoSchema = enumValueSchema(cognitiveSkillByValue);
export const learningDomainDtoSchema = enumValueSchema(learningDomainByValue);
export const quizSessionScopeTypeDtoSchema = enumValueSchema(quizSessionScopeTypeByValue);
export const quizSessionStatusDtoSchema = enumValueSchema(quizSessionStatusByValue);
export const scoringVerdictDtoSchema = enumValueSchema(scoringVerdictByValue);
export const scoringSourceDtoSchema = enumValueSchema(scoringSourceByValue);

const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const tagsJsonSchema = z.preprocess((value) => parseJsonValue(value, []), z.array(z.string()));
const objectJsonSchema = z.preprocess((value) => parseJsonValue(value, {}), z.record(z.string(), jsonValueSchema));
const messageListSchema = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
}, z.array(z.string()));

export const generatedQuizItemDraftDtoSchema = z.object({
  itemType: quizItemTypeDtoSchema,
  question: z.string().trim().min(1),
  expectedAnswer: z.string().default(""),
  explanation: z.string().default(""),
  answeringGuidance: z.string().default(""),
  difficulty: z.number().int().min(0).max(100),
  cognitiveSkill: cognitiveSkillDtoSchema,
  learningDomain: learningDomainDtoSchema,
  technicalLanguage: z.string().default(""),
  tagsJson: tagsJsonSchema.default([]),
  rubricJson: objectJsonSchema.default({}),
  validationConfigJson: objectJsonSchema.default({}),
  validationStatus: quizDraftValidationStatusDtoSchema.default("Ready"),
  warnings: messageListSchema.default([]),
  errors: messageListSchema.default([]),
}).transform((item) => ({
  itemType: item.itemType,
  question: item.question,
  expectedAnswer: item.expectedAnswer,
  explanation: item.explanation,
  answeringGuidance: item.answeringGuidance,
  difficulty: item.difficulty,
  cognitiveSkill: item.cognitiveSkill,
  learningDomain: item.learningDomain,
  technicalLanguage: item.technicalLanguage,
  tags: item.tagsJson,
  rubric: item.rubricJson,
  validationConfig: item.validationConfigJson,
  validationStatus: item.validationStatus,
  warnings: item.warnings,
  errors: item.errors,
}));

export const quizItemDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  deckSqid: z.string().trim().min(1),
  itemType: quizItemTypeDtoSchema,
  question: z.string().trim().min(1),
  expectedAnswer: z.string().default(""),
  explanation: z.string().default(""),
  answeringGuidance: z.string().default(""),
  difficulty: z.number().int().min(0).max(100),
  cognitiveSkill: cognitiveSkillDtoSchema,
  learningDomain: learningDomainDtoSchema,
  technicalLanguage: z.string().default(""),
  tagsJson: tagsJsonSchema.default([]),
  rubricJson: objectJsonSchema.default({}),
  validationConfigJson: objectJsonSchema.default({}),
  sourceFlashcardSqid: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}).transform((item) => ({
  sqid: item.sqid,
  deckSqid: item.deckSqid,
  itemType: item.itemType,
  question: item.question,
  expectedAnswer: item.expectedAnswer,
  explanation: item.explanation,
  answeringGuidance: item.answeringGuidance,
  difficulty: item.difficulty,
  cognitiveSkill: item.cognitiveSkill,
  learningDomain: item.learningDomain,
  technicalLanguage: item.technicalLanguage,
  tags: item.tagsJson,
  rubric: item.rubricJson,
  validationConfig: item.validationConfigJson,
  sourceFlashcardSqid: item.sourceFlashcardSqid ?? null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
}));

export const sourceMaterialTypeByValue = {
  0: "Note",
  1: "LessonText",
  2: "PastedContent",
} as const;

export const sourceMaterialDtoSchema = z.object({
  type: enumValueSchema(sourceMaterialTypeByValue),
  content: z.string().trim().min(1),
  sourceNoteSqid: z.string().trim().min(1).nullable().optional(),
  sourceDocumentSqid: z.string().trim().min(1).nullable().optional(),
});

export const generateQuizItemsPreviewRequestDtoSchema = z.object({
  sourceText: z.string().trim().min(1).max(20000).optional(),
  sourceMaterial: sourceMaterialDtoSchema.optional(),
  learningDomain: z.number().int().min(0).max(6).default(0),
  technicalLanguage: z.string().trim().optional(),
  itemTypes: z.array(z.number().int().min(0).max(10)).default([]),
  cognitiveSkill: z.number().int().min(0).max(5).optional(),
  difficulty: z.number().int().min(0).max(100).default(50),
  count: z.number().int().min(3).max(10).default(5),
  programContext: z.string().trim().optional(),
});

export const quizGenerationJobDtoSchema = z.object({
  generationJobSqid: z.string().trim().min(1),
  requestedCount: z.number().int().nonnegative().default(0),
  deckSqid: z.string().trim().min(1).optional(),
  learningDomain: learningDomainDtoSchema.default("Unknown"),
  technicalLanguage: z.string().default(""),
  hydrationStatus: quizGenerationHydrationStatusDtoSchema.optional(),
  status: quizGenerationHydrationStatusDtoSchema.optional(),
  drafts: z.array(generatedQuizItemDraftDtoSchema).optional(),
  items: z.array(generatedQuizItemDraftDtoSchema).optional(),
  warnings: messageListSchema.default([]),
  errors: messageListSchema.default([]),
}).transform((job) => {
  const drafts = job.drafts ?? job.items ?? [];
  const hydrationStatus = job.hydrationStatus ?? job.status ?? "PreviewReady";

  return {
    generationJobSqid: job.generationJobSqid,
    requestedCount: job.requestedCount || drafts.length,
    deckSqid: job.deckSqid ?? null,
    learningDomain: job.learningDomain,
    technicalLanguage: job.technicalLanguage,
    hydrationStatus,
    status: hydrationStatus,
    drafts,
    items: drafts,
    warnings: job.warnings,
    errors: job.errors,
  };
});

export const generateQuizItemsPreviewResponseDtoSchema = quizGenerationJobDtoSchema;

export const saveGeneratedQuizItemsRequestDtoSchema = z.object({
  items: z.array(generatedQuizItemDraftDtoSchema).default([]),
});

export const generateQuizItemsResponseDtoSchema = z.object({
  deckSqid: z.string().trim().min(1),
  generatedCount: z.number().int().nonnegative(),
  items: z.array(quizItemDtoSchema).optional(),
  quizItems: z.array(quizItemDtoSchema).optional(),
}).transform((response) => ({
  deckSqid: response.deckSqid,
  generatedCount: response.generatedCount,
  quizItems: response.quizItems ?? response.items ?? [],
}));

export const startQuizSessionRequestDtoSchema = z.object({
  scopeType: z.number().int().min(1).max(2).default(1),
  deckSqid: z.string().trim().min(1).optional(),
  courseSqid: z.string().trim().min(1).optional(),
  take: z.number().int().min(1).max(100).default(10),
});

export const quizSessionItemDtoSchema = z.object({
  quizItemSqid: z.string().trim().min(1),
  deckSqid: z.string().trim().min(1),
  itemType: quizItemTypeDtoSchema,
  question: z.string().trim().min(1),
  difficulty: z.number().int().min(0).max(100),
  cognitiveSkill: cognitiveSkillDtoSchema,
  learningDomain: learningDomainDtoSchema,
  order: z.number().int(),
  isCurrent: z.boolean(),
});

export const quizSessionDtoSchema = z.object({
  sessionSqid: z.string().trim().min(1),
  scopeType: quizSessionScopeTypeDtoSchema,
  status: quizSessionStatusDtoSchema,
  deckSqid: z.string().nullable().optional(),
  courseSqid: z.string().nullable().optional(),
  currentItemIndex: z.number().int(),
  take: z.number().int(),
  startedAt: z.coerce.date(),
  lastActiveAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable().optional(),
  items: z.array(quizSessionItemDtoSchema).default([]),
});

export const quizSessionNextItemDtoSchema = z.object({
  session: quizSessionDtoSchema,
  nextItem: quizSessionItemDtoSchema.nullable(),
});

export const submitQuizAnswerRequestDtoSchema = z.object({
  quizItemSqid: z.string().trim().min(1),
  answer: z.string().trim().min(1).max(20000),
  responseTimeMs: z.number().int().nonnegative(),
  attemptContextJson: z.string().optional(),
});

export const studentAttemptDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  quizSessionSqid: z.string().nullable().optional(),
  quizItemSqid: z.string().trim().min(1),
  submittedAnswer: z.string(),
  responseTimeMs: z.number().int(),
  attemptNumber: z.number().int(),
  attemptContextJson: objectJsonSchema.default({}),
  answeredAt: z.coerce.date(),
});

export const scoringResultDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  scorePercent: z.number().int().min(0).max(100),
  qualityScore: z.number().int().min(0).max(5),
  correctnessScore: z.number().int().min(0).max(100),
  completenessScore: z.number().int().min(0).max(100),
  confidenceScore: z.number().int().min(0).max(100),
  clarityScore: z.number().int().min(0).max(100),
  misconceptionScore: z.number().int().min(0).max(100),
  uncertaintyScore: z.number().int().min(0).max(100),
  sentimentLabel: z.string().default("Neutral"),
  verdict: scoringVerdictDtoSchema,
  scoringSource: scoringSourceDtoSchema,
  aiConfidence: z.number().int().min(0).max(100).nullable().optional(),
  feedbackSummary: z.string().default(""),
  semanticRationale: z.string().default(""),
  misconceptionsJson: tagsJsonSchema.default([]),
  rubricBreakdownJson: objectJsonSchema.default({}),
  needsStudentConfirmation: z.boolean(),
  lowConfidenceReason: z.string().default(""),
  createdAt: z.coerce.date(),
}).transform((scoring) => ({
  ...scoring,
  misconceptions: scoring.misconceptionsJson,
  rubricBreakdown: scoring.rubricBreakdownJson,
}));

export const submitQuizAnswerResponseDtoSchema = z.object({
  session: quizSessionDtoSchema,
  attempt: studentAttemptDtoSchema,
  scoring: scoringResultDtoSchema,
});

export type QuizItemTypeDto = z.output<typeof quizItemTypeDtoSchema>;
export type CognitiveSkillDto = z.output<typeof cognitiveSkillDtoSchema>;
export type LearningDomainDto = z.output<typeof learningDomainDtoSchema>;
export type QuizDraftValidationStatusDto = z.output<typeof quizDraftValidationStatusDtoSchema>;
export type QuizGenerationHydrationStatusDto = z.output<typeof quizGenerationHydrationStatusDtoSchema>;
export type GeneratedQuizItemDraftDto = z.output<typeof generatedQuizItemDraftDtoSchema>;
export type QuizItemDto = z.output<typeof quizItemDtoSchema>;
export type GenerateQuizItemsPreviewRequestDto = z.output<typeof generateQuizItemsPreviewRequestDtoSchema>;
export type GenerateQuizItemsPreviewResponseDto = z.output<typeof generateQuizItemsPreviewResponseDtoSchema>;
export type QuizGenerationJobDto = z.output<typeof quizGenerationJobDtoSchema>;
export type GenerateQuizItemsResponseDto = z.output<typeof generateQuizItemsResponseDtoSchema>;
export type StartQuizSessionRequestDto = z.output<typeof startQuizSessionRequestDtoSchema>;
export type QuizSessionDto = z.output<typeof quizSessionDtoSchema>;
export type QuizSessionItemDto = z.output<typeof quizSessionItemDtoSchema>;
export type QuizSessionNextItemDto = z.output<typeof quizSessionNextItemDtoSchema>;
export type SubmitQuizAnswerRequestDto = z.output<typeof submitQuizAnswerRequestDtoSchema>;
export type SubmitQuizAnswerResponseDto = z.output<typeof submitQuizAnswerResponseDtoSchema>;
export type ScoringResultDto = z.output<typeof scoringResultDtoSchema>;

export function toGeneratedQuizItemRequest(item: GeneratedQuizItemDraftDto) {
  return {
    itemType: toQuizItemTypeValue(item.itemType),
    question: item.question,
    expectedAnswer: item.expectedAnswer,
    explanation: item.explanation,
    answeringGuidance: item.answeringGuidance,
    difficulty: item.difficulty,
    cognitiveSkill: toCognitiveSkillValue(item.cognitiveSkill),
    learningDomain: toLearningDomainValue(item.learningDomain),
    technicalLanguage: item.technicalLanguage,
    tagsJson: JSON.stringify(item.tags),
    rubricJson: JSON.stringify(item.rubric),
    validationConfigJson: JSON.stringify(item.validationConfig),
  };
}

export function toQuizItemTypeValue(value: QuizItemTypeDto): number {
  return findEnumKey(quizItemTypeByValue, value);
}

export function toCognitiveSkillValue(value: CognitiveSkillDto): number {
  return findEnumKey(cognitiveSkillByValue, value);
}

export function toLearningDomainValue(value: LearningDomainDto): number {
  return findEnumKey(learningDomainByValue, value);
}

function enumValueSchema<const TValues extends Record<number, string>>(values: TValues) {
  const allowed = Object.values(values);
  return z.union([z.number().int(), z.string().trim().min(1)]).transform((value, ctx) => {
    if (typeof value === "number" && value in values) {
      return values[value as keyof typeof values];
    }

    if (typeof value === "string" && allowed.includes(value)) {
      return value as TValues[keyof TValues];
    }

    ctx.addIssue({
      code: "custom",
      message: `Unsupported enum value: ${String(value)}`,
    });

    return z.NEVER;
  });
}

export function findEnumKey(values: Record<number, string>, target: string): number {
  const match = Object.entries(values).find(([, value]) => value === target);
  return match ? Number(match[0]) : 0;
}

function parseJsonValue(value: unknown, fallback: unknown) {
  if (typeof value !== "string") {
    return value ?? fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
