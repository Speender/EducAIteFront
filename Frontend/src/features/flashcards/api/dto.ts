import { z } from "zod";

const finiteNumber = z.number().finite();

const majorDeckSourceTypeByValue = {
  0: "Course",
  1: "Manual",
} as const;

const deckSourceTypeByValue = {
  0: "Manual",
  1: "Note",
  2: "Document",
  3: "AiGenerated",
  4: "System",
  5: "Weakness",
} as const;

const flashcardItemTypeByValue = {
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

const majorDeckSourceTypeDtoSchema = enumValueSchema(majorDeckSourceTypeByValue);
const deckSourceTypeDtoSchema = enumValueSchema(deckSourceTypeByValue);
export const flashcardItemTypeDtoSchema = enumValueSchema(flashcardItemTypeByValue);
export const cognitiveSkillDtoSchema = enumValueSchema(cognitiveSkillByValue);
export const learningDomainDtoSchema = enumValueSchema(learningDomainByValue);

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

const nullableTextDtoSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === "string" ? value : ""));

const nullableTrimmedTextDtoSchema = nullableTextDtoSchema.transform((value) => value.trim());

const stringArrayDtoSchema = z
  .array(z.string())
  .nullable()
  .optional()
  .transform((value) => value ?? []);

const jsonFieldDtoSchema = jsonValueSchema.optional();

export const flashcardSubDeckResponseDtoSchema = z.object({
  deckSqid: z.string().trim().min(1),
  title: z.string().trim().min(1),
  sourceType: deckSourceTypeDtoSchema,
  sourceNoteSqid: z.string().trim().min(1).nullable().optional(),
  sourceDocumentSqid: z.string().trim().min(1).nullable().optional(),
  quizItemCount: z.number().int().nonnegative(),
  difficultyFloor: z.number().int().min(0).max(100),
  difficultyCeiling: z.number().int().min(0).max(100),
});

export const flashcardDeckResponseDtoSchema = z.object({
  majorDeckSqid: z.string().trim().min(1),
  deckName: z.string().trim().min(1),
  description: nullableTrimmedTextDtoSchema,
  studentCourseSqid: z.string().trim().min(1).nullable().optional(),
  edpCode: z.string().trim().min(1).nullable().optional(),
  sourceType: majorDeckSourceTypeDtoSchema,
  documentCount: z.number().int().nonnegative(),
  flashcardCount: z.number().int().nonnegative(),
  subDecks: z.array(flashcardSubDeckResponseDtoSchema).default([]),
});

export const flashcardWorkspaceLatestResponseDtoSchema = z.object({
  latestGroupLabel: z.string(),
  schoolYearStart: z.number().int(),
  schoolYearEnd: z.number().int(),
  semester: z.number().int(),
  decks: z.array(flashcardDeckResponseDtoSchema),
});

export const createWorkspaceMajorDeckRequestDtoSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000).optional().default(""),
  studentCourseSqid: z.string().trim().min(1).nullable().optional(),
});

export const updateWorkspaceMajorDeckRequestDtoSchema = createWorkspaceMajorDeckRequestDtoSchema;

export const createWorkspaceSubDeckRequestDtoSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000).optional().default(""),
  sourceType: z.number().int().min(0).max(5).default(0),
  difficultyFloor: z.number().int().min(0).max(100).default(0),
  difficultyCeiling: z.number().int().min(0).max(100).default(100),
  visibility: z.number().int().min(0).max(3).default(0),
  status: z.number().int().min(0).max(2).default(1),
});

export const flashcardDocumentResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  studentCourseSqid: z.string().trim().min(1),
  name: z.string().trim().min(1),
  flashcardCount: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const flashcardResponseDtoSchema = z.object({
  sqid: z.string().trim().min(1),
  question: z.string().trim().min(1),
  answer: nullableTextDtoSchema,
  expectedAnswer: nullableTextDtoSchema,
  expectedOutput: nullableTextDtoSchema,
  conceptExplanation: nullableTextDtoSchema,
  explanation: nullableTextDtoSchema,
  answeringGuidance: nullableTextDtoSchema,
  acceptedAnswerAliases: stringArrayDtoSchema,
  noteSqid: nullableTrimmedTextDtoSchema,
  documentSqid: nullableTrimmedTextDtoSchema,
  deckSqid: z.string().trim().min(1).nullable().optional(),
  sourceNoteSqid: z.string().trim().min(1).nullable().optional(),
  sourceDocumentSqid: z.string().trim().min(1).nullable().optional(),
  itemType: flashcardItemTypeDtoSchema.default("Flashcard"),
  difficulty: z.number().int().min(0).max(100).default(50),
  cognitiveSkill: cognitiveSkillDtoSchema.default("Recall"),
  learningDomain: learningDomainDtoSchema.default("Unknown"),
  technicalLanguage: nullableTrimmedTextDtoSchema,
  tagsJson: jsonFieldDtoSchema.transform((value) => stringifyJsonField(value, [])),
  rubricJson: jsonFieldDtoSchema.transform((value) => stringifyJsonField(value, {})),
  validationConfigJson: jsonFieldDtoSchema.transform((value) => stringifyJsonField(value, {})),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}).transform(({ expectedAnswer, expectedOutput, explanation, ...item }) => ({
  ...item,
  answer: firstNonBlank(item.answer, expectedAnswer, expectedOutput),
  conceptExplanation: firstNonBlank(item.conceptExplanation, explanation),
}));

export const createFlashcardRequestDtoSchema = z.object({
  question: z.string().trim().min(1).max(1000),
  answer: z.string().trim().min(1).max(2000),
  conceptExplanation: z.string().optional().default(""),
  answeringGuidance: z.string().optional().default(""),
  acceptedAnswerAliases: z.array(z.string().trim().min(1)).default([]),
  itemType: flashcardItemTypeDtoSchema.optional().default("Flashcard"),
  difficulty: z.number().int().min(0).max(100).optional().default(50),
  cognitiveSkill: cognitiveSkillDtoSchema.optional().default("Recall"),
  learningDomain: learningDomainDtoSchema.optional().default("Unknown"),
  technicalLanguage: z.string().trim().optional().default(""),
  tagsJson: z.string().optional().default("[]"),
  rubricJson: z.string().optional().default("{}"),
  validationConfigJson: z.string().optional().default("{}"),
});

export const updateFlashcardRequestDtoSchema = createFlashcardRequestDtoSchema;

export const generateFlashcardsFromNoteRequestDtoSchema = z.object({
  flashcardCount: z.number().int().min(1).max(10).optional().default(5),
  noteTitle: z.string().trim().nullable().optional(),
  noteContent: z.string().trim().nullable().optional(),
  itemTypes: z.array(flashcardItemTypeDtoSchema).optional().default([]),
  learningDomain: learningDomainDtoSchema.optional().default("Unknown"),
  cognitiveSkill: cognitiveSkillDtoSchema.nullable().optional(),
  technicalLanguage: z.string().trim().nullable().optional(),
  programContext: z.string().trim().nullable().optional(),
});

export const generatedFlashcardDraftDtoSchema = z.object({
  itemType: flashcardItemTypeDtoSchema,
  question: z.string().trim().min(1),
  expectedAnswer: z.string().default(""),
  explanation: z.string().default(""),
  answeringGuidance: z.string().default(""),
  difficulty: z.number().int().min(0).max(100),
  cognitiveSkill: cognitiveSkillDtoSchema,
  learningDomain: learningDomainDtoSchema,
  technicalLanguage: z.string().default(""),
  tagsJson: z.union([z.string(), z.array(z.string())]).default("[]"),
  rubricJson: z.union([z.string(), z.record(z.string(), jsonValueSchema)]).default("{}"),
  validationConfigJson: z.union([z.string(), z.record(z.string(), jsonValueSchema)]).default("{}"),
  answer: z.string().optional(),
  conceptExplanation: z.string().optional(),
  acceptedAnswerAliases: z.array(z.string()).default([]),
}).transform((draft) => ({
  ...draft,
  expectedAnswer: draft.expectedAnswer || draft.answer || "",
  explanation: draft.explanation || draft.conceptExplanation || "",
  answer: draft.expectedAnswer || draft.answer || "",
  conceptExplanation: draft.explanation || draft.conceptExplanation || "",
  tagsJson: stringifyJsonField(draft.tagsJson, []),
  rubricJson: stringifyJsonField(draft.rubricJson, {}),
  validationConfigJson: stringifyJsonField(draft.validationConfigJson, {}),
}));

export const generateFlashcardsFromNoteResponseDtoSchema = z.object({
  noteSqid: z.string().trim().min(1),
  generatedCount: z.number().int().min(1),
  flashcards: z.array(flashcardResponseDtoSchema),
  drafts: z.array(generatedFlashcardDraftDtoSchema).default([]),
});

export const flashcardReviewItemResponseDtoSchema = z.object({
  flashcardSqid: z.string().trim().min(1),
  noteSqid: z.string().trim().min(1),
  documentSqid: z.string().trim().min(1),
  studentCourseSqid: z.string().trim().min(1),
  question: z.string().trim().min(1),
  correctCount: z.number().int(),
  wrongCount: z.number().int(),
  totalAttempts: z.number().int(),
  isTracked: z.boolean(),
  lastReviewedAt: z.coerce.date().nullable(),
  nextReviewAt: z.coerce.date(),
});

export const submitAndAnalyzeFlashcardRequestDtoSchema = z.object({
  answer: z.string().trim().max(20000).optional(),
  responseTimeMs: z.number().int().nonnegative(),
  itemType: flashcardItemTypeDtoSchema.nullable().optional(),
  question: z.string().nullable().optional(),
  expectedAnswer: z.string().nullable().optional(),
  conceptExplanation: z.string().nullable().optional(),
  answeringGuidance: z.string().nullable().optional(),
  acceptedAnswerAliases: z.array(z.string()).optional().default([]),
  cognitiveSkill: cognitiveSkillDtoSchema.nullable().optional(),
  learningDomain: learningDomainDtoSchema.nullable().optional(),
  technicalLanguage: z.string().nullable().optional(),
  rubricJson: z.string().nullable().optional(),
  validationConfigJson: z.string().nullable().optional(),
  language: z.enum(["cpp", "csharp", "java", "python", "javascript", "sql"]).optional(),
  runtimeVersion: z.string().trim().min(1).optional(),
  starterCode: z.string().max(20000).optional().default(""),
  studentCode: z.string().trim().max(20000).optional(),
}).superRefine((value, context) => {
  if (!value.answer?.trim() && !value.studentCode?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either answer or studentCode is required.",
      path: ["answer"],
    });
  }
});

export const flashcardLearnSessionScopeTypeDtoSchema = z.enum(["Course", "Overall"]);

export const flashcardAttemptEvaluationResponseDtoSchema = z.object({
  verdict: z.string().trim().min(1),
  acceptedAsCorrect: z.boolean(),
  qualityScore: z.number().int(),
  feedbackSummary: z.string().trim().min(1),
  semanticRationale: z.string(),
});

const optionalSqidResponseSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

export const studentFlashcardProgressResponseDtoSchema = z.object({
  flashcardSqid: z.string().trim().min(1),
  noteSqid: optionalSqidResponseSchema,
  documentSqid: optionalSqidResponseSchema,
  studentCourseSqid: optionalSqidResponseSchema,
  correctCount: z.number().int(),
  wrongCount: z.number().int(),
  totalAttempts: z.number().int(),
  consecutiveCorrectCount: z.number().int(),
  consecutiveWrongCount: z.number().int(),
  reviewCount: z.number().int(),
  lapseCount: z.number().int(),
  lastReviewOutcome: z.string().nullable(),
  lastEvaluationVerdict: z.string().nullable(),
  lastQualityScore: z.number().int().nullable(),
  lastReviewedAt: z.coerce.date().nullable(),
  nextReviewAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const flashcardAttemptResultResponseDtoSchema = z.object({
  flashcardSqid: z.string().trim().min(1),
  submittedAnswer: z.string().trim().min(1),
  expectedAnswer: z.string().trim().min(1),
  feedback: z.string().trim().min(1),
  isCorrect: z.boolean(),
  evaluation: flashcardAttemptEvaluationResponseDtoSchema,
  showAgainInSession: z.boolean(),
  requeueAfter: z.number().int(),
  nextReviewAt: z.coerce.date(),
  progress: studentFlashcardProgressResponseDtoSchema,
});

export const studentFlashcardAnalyticsResponseDtoSchema = z.object({
  flashcardSqid: z.string().trim().min(1),
  studentCourseSqid: z.string().trim().min(1),
  lastAnsweredAt: z.coerce.date().nullable(),
  nextReviewAt: z.coerce.date(),
  easeFactor: finiteNumber,
  repetitionCount: z.number().int(),
  intervalDays: z.number().int(),
  lapseCount: z.number().int(),
  masteryLevel: z.string().trim().min(1),
  confidenceScore: finiteNumber,
  consistencyScore: finiteNumber,
  retentionScore: finiteNumber,
  riskLevel: z.string().trim().min(1),
  aiStatus: z.string().trim().min(1),
  aiInsight: z.string(),
  improvementSuggestion: z.string(),
  aiLastEvaluatedAt: z.coerce.date().nullable(),
  lastComputedAt: z.coerce.date(),
});

export const flashcardFrontendReviewResponseDtoSchema = z.object({
  resultTone: z.enum(["correct", "close", "partial", "incorrect"]),
  verdict: z.string().default(""),
  qualityScore: z.number().nullable().optional(),
  isCorrect: z.boolean().nullable().optional(),
  answerReview: z.string().trim().min(1),
  conceptExplanation: z.string(),
  missingPart: z.string(),
  misconception: z.string().default(""),
  rubricFeedback: z.array(z.object({
    criterion: z.string().default(""),
    score: z.number().nullable().optional(),
    feedback: z.string().default(""),
  })).default([]),
  technicalDiagnostics: z.object({
    language: z.string().default(""),
    expectedBehavior: z.string().default(""),
    actualBehavior: z.string().default(""),
    issues: z.array(z.string()).default([]),
  }).nullable().optional(),
});

export const flashcardStudyCoachRecapResponseDtoSchema = z.object({
  headline: z.string().trim().min(1).default("Session complete"),
  improved: z.array(z.string().trim().min(1)).default([]),
  stillWeak: z.array(z.string().trim().min(1)).default([]),
  nextStep: z.string().trim().min(1).default("Review your weakest cards next."),
  cheerLine: z.string().trim().min(1).default("Good job. AImpatin is ready for the next round."),
  quickPhrases: z.array(z.string().trim().min(1)).default(["Good job.", "Nice progress.", "Review this next."]),
  tone: z.enum(["strong", "mixed", "weak"]).default("mixed"),
  mascotEmotion: z.enum(["happy", "proud", "thinking", "sad", "encouraging"]).default("encouraging"),
});

export const submitAndAnalyzeFlashcardResponseDtoSchema = z.object({
  attempt: flashcardAttemptResultResponseDtoSchema,
  analytics: studentFlashcardAnalyticsResponseDtoSchema,
  analyticsStatus: z.enum(["Completed", "Pending", "Failed"]),
  frontendReview: flashcardFrontendReviewResponseDtoSchema,
});

export const flashcardLearnSessionItemResponseDtoSchema = z.object({
  sessionItemSqid: z.string().trim().min(1),
  flashcardSqid: z.string().trim().min(1),
  studentCourseSqid: z.string().trim().min(1).nullable().optional(),
  question: z.string().trim().min(1),
  originalOrder: z.number().int(),
  currentOrder: z.number().int(),
  status: z.string().trim().min(1),
});

export const flashcardLearnSessionResponseDtoSchema = z.object({
  sessionSqid: z.string().trim().min(1),
  studentCourseSqid: z.string().trim().min(1).nullable(),
  deckSqid: z.string().trim().min(1).nullable().optional(),
  documentSqid: z.string().trim().min(1).nullable(),
  scopeType: z.string().trim().min(1),
  status: z.string().trim().min(1),
  currentItemIndex: z.number().int(),
  startedAt: z.coerce.date(),
  lastActiveAt: z.coerce.date(),
  items: z.array(flashcardLearnSessionItemResponseDtoSchema),
});

export const startFlashcardLearnSessionRequestDtoSchema = z.object({
  scopeType: flashcardLearnSessionScopeTypeDtoSchema.default("Course"),
  studentCourseSqid: z.string().trim().min(1).optional(),
  deckSqid: z.string().trim().min(1).optional(),
  documentSqid: z.string().trim().min(1).optional(),
  take: z.number().int().min(1).max(100).default(30),
  startMode: z.enum(["auto", "new"]).default("auto"),
});

export const submitFlashcardLearnAnswerRequestDtoSchema = z.object({
  sessionItemSqid: z.string().trim().min(1),
  answer: z.string().trim().max(20000).optional(),
  responseTimeMs: z.number().int().nonnegative(),
  itemType: flashcardItemTypeDtoSchema.nullable().optional(),
  question: z.string().nullable().optional(),
  expectedAnswer: z.string().nullable().optional(),
  conceptExplanation: z.string().nullable().optional(),
  answeringGuidance: z.string().nullable().optional(),
  acceptedAnswerAliases: z.array(z.string()).optional().default([]),
  cognitiveSkill: cognitiveSkillDtoSchema.nullable().optional(),
  learningDomain: learningDomainDtoSchema.nullable().optional(),
  technicalLanguage: z.string().nullable().optional(),
  rubricJson: z.string().nullable().optional(),
  validationConfigJson: z.string().nullable().optional(),
  language: z.enum(["cpp", "csharp", "java", "python", "javascript", "sql"]).optional(),
  runtimeVersion: z.string().trim().min(1).optional(),
  starterCode: z.string().max(20000).optional().default(""),
  studentCode: z.string().trim().max(20000).optional(),
}).superRefine((value, context) => {
  if (!value.answer?.trim() && !value.studentCode?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either answer or studentCode is required.",
      path: ["answer"],
    });
  }
});

export const flashcardLearnSessionStartFlowResponseDtoSchema = z.object({
  action: z.enum(["continueAvailable", "created"]),
  session: flashcardLearnSessionResponseDtoSchema.nullable(),
  activeSession: flashcardLearnSessionResponseDtoSchema.nullable(),
});

export const flashcardLearnAnswerResultResponseDtoSchema = z.object({
  sessionItemSqid: z.string().trim().min(1),
  flashcardSqid: z.string().trim().min(1),
  qualityScore: z.number().int(),
  showAgainInSession: z.boolean(),
  requeuedToOrder: z.number().int().nullable(),
  nextReviewAt: z.coerce.date(),
  progress: studentFlashcardProgressResponseDtoSchema,
  evaluation: flashcardAttemptEvaluationResponseDtoSchema,
  analytics: studentFlashcardAnalyticsResponseDtoSchema,
});

export const submitFlashcardLearnAnswerResponseDtoSchema = z.object({
  session: flashcardLearnSessionResponseDtoSchema,
  answer: flashcardLearnAnswerResultResponseDtoSchema,
  frontendReview: flashcardFrontendReviewResponseDtoSchema,
  studyCoachRecap: flashcardStudyCoachRecapResponseDtoSchema.nullable().optional(),
});

export const generateDeckFlashcardsPreviewRequestDtoSchema = z.object({
  sourceText: z.string().trim().min(1).max(20000),
  learningDomain: learningDomainDtoSchema.default("Unknown"),
  technicalLanguage: z.string().trim().nullable().optional(),
  itemTypes: z.array(flashcardItemTypeDtoSchema).default([]),
  cognitiveSkill: cognitiveSkillDtoSchema.nullable().optional(),
  difficulty: z.number().int().min(0).max(100).default(50),
  count: z.number().int().min(1).max(50).default(5),
  programContext: z.string().trim().nullable().optional(),
});

export const generateDeckFlashcardsPdfPreviewRequestDtoSchema = z.object({
  file: z.instanceof(File),
  count: z.number().int().min(1).max(50).default(5),
  itemTypes: z.array(flashcardItemTypeDtoSchema).default([]),
  technicalLanguage: z.string().trim().nullable().optional(),
  programContext: z.string().trim().nullable().optional(),
});

export const flashcardPdfGenerationJobStatusDtoSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.toLowerCase() : value),
  z.enum(["queued", "running", "processing", "completed", "failed", "canceled"]),
);

export const generateDeckFlashcardsPreviewResponseDtoSchema = z.object({
  extractedText: z.string().default(""),
  deckSqid: z.string().trim().min(1),
  sourceNoteSqid: z.string().trim().min(1).nullable().optional(),
  sourceDocumentSqid: z.string().trim().min(1).nullable().optional(),
  learningDomain: learningDomainDtoSchema,
  effectiveItemTypes: z.array(flashcardItemTypeDtoSchema).default([]),
  effectiveLearningDomain: learningDomainDtoSchema.default("Unknown"),
  effectiveCognitiveSkill: cognitiveSkillDtoSchema.default("Recall"),
  inferenceConfidence: z.number().default(0),
  inferenceReason: z.string().default(""),
  technicalLanguage: z.string().default(""),
  effectiveTechnicalLanguage: z.string().default(""),
  items: z.array(generatedFlashcardDraftDtoSchema).default([]),
  warnings: z.array(z.string()).default([]),
});

export const flashcardPdfGenerationJobResponseDtoSchema = z.object({
  jobSqid: z.string().trim().min(1),
  deckSqid: z.string().trim().min(1).nullable().optional(),
  majorDeckSqid: z.string().trim().min(1).nullable().optional(),
  fileName: z.string().default(""),
  status: flashcardPdfGenerationJobStatusDtoSchema,
  progressPercent: z.number().min(0).max(100).catch(0),
  stage: z.string().default(""),
  message: z.string().default(""),
  errorMessage: z.string().nullable().optional(),
  createdAt: z.coerce.date().nullable().optional(),
  updatedAt: z.coerce.date().nullable().optional(),
  startedAt: z.coerce.date().nullable().optional(),
  canceledAt: z.coerce.date().nullable().optional(),
  completedAt: z.coerce.date().nullable().optional(),
  archivedAt: z.coerce.date().nullable().optional(),
  isArchived: z.boolean().catch(false),
  createdAtUtc: z.coerce.date().nullable().optional(),
  updatedAtUtc: z.coerce.date().nullable().optional(),
  startedAtUtc: z.coerce.date().nullable().optional(),
  canceledAtUtc: z.coerce.date().nullable().optional(),
  completedAtUtc: z.coerce.date().nullable().optional(),
  archivedAtUtc: z.coerce.date().nullable().optional(),
  preview: generateDeckFlashcardsPreviewResponseDtoSchema.nullable().optional(),
  result: generateDeckFlashcardsPreviewResponseDtoSchema.nullable().optional(),
  generatedPreview: generateDeckFlashcardsPreviewResponseDtoSchema.nullable().optional(),
}).transform((job) => ({
  ...job,
  preview: job.preview ?? job.result ?? job.generatedPreview ?? null,
  createdAtUtc: job.createdAtUtc ?? job.createdAt ?? null,
  updatedAtUtc: job.updatedAtUtc ?? job.updatedAt ?? null,
  startedAtUtc: job.startedAtUtc ?? job.startedAt ?? null,
  canceledAtUtc: job.canceledAtUtc ?? job.canceledAt ?? null,
  completedAtUtc: job.completedAtUtc ?? job.completedAt ?? null,
  archivedAtUtc: job.archivedAtUtc ?? job.archivedAt ?? null,
}));

const saveFeedbackCountDtoSchema = z.coerce.number().int().nonnegative().nullable().optional();

export const generatedFlashcardsSaveFeedbackDtoSchema = z.object({
  message: z.string().trim().nullable().optional(),
  Message: z.string().trim().nullable().optional(),
  operationMessage: z.string().trim().nullable().optional(),
  OperationMessage: z.string().trim().nullable().optional(),
  operationStatus: z.string().trim().nullable().optional(),
  OperationStatus: z.string().trim().nullable().optional(),
  requestedCount: saveFeedbackCountDtoSchema,
  RequestedCount: saveFeedbackCountDtoSchema,
  savedCount: saveFeedbackCountDtoSchema,
  SavedCount: saveFeedbackCountDtoSchema,
  maxLimitEnforced: z.boolean().nullable().optional(),
  MaxLimitEnforced: z.boolean().nullable().optional(),
  previewSource: z.string().trim().nullable().optional(),
  PreviewSource: z.string().trim().nullable().optional(),
  targetDeckSqid: z.string().trim().nullable().optional(),
  TargetDeckSqid: z.string().trim().nullable().optional(),
  firstSavedItemSqid: z.string().trim().nullable().optional(),
  FirstSavedItemSqid: z.string().trim().nullable().optional(),
  firstSavedSqid: z.string().trim().nullable().optional(),
  FirstSavedSqid: z.string().trim().nullable().optional(),
  lastSavedItemSqid: z.string().trim().nullable().optional(),
  LastSavedItemSqid: z.string().trim().nullable().optional(),
  lastSavedSqid: z.string().trim().nullable().optional(),
  LastSavedSqid: z.string().trim().nullable().optional(),
  createdCount: saveFeedbackCountDtoSchema,
  CreatedCount: saveFeedbackCountDtoSchema,
  skippedCount: saveFeedbackCountDtoSchema,
  SkippedCount: saveFeedbackCountDtoSchema,
  duplicateCount: saveFeedbackCountDtoSchema,
  DuplicateCount: saveFeedbackCountDtoSchema,
  failedCount: saveFeedbackCountDtoSchema,
  FailedCount: saveFeedbackCountDtoSchema,
  warningCount: saveFeedbackCountDtoSchema,
  WarningCount: saveFeedbackCountDtoSchema,
}).transform((feedback) => ({
  message: feedback.operationMessage ?? feedback.OperationMessage ?? feedback.message ?? feedback.Message ?? null,
  operationMessage: feedback.operationMessage ?? feedback.OperationMessage ?? feedback.message ?? feedback.Message ?? null,
  operationStatus: feedback.operationStatus ?? feedback.OperationStatus ?? null,
  requestedCount: feedback.requestedCount ?? feedback.RequestedCount ?? null,
  savedCount: feedback.savedCount ?? feedback.SavedCount ?? null,
  maxLimitEnforced: feedback.maxLimitEnforced ?? feedback.MaxLimitEnforced ?? null,
  previewSource: feedback.previewSource ?? feedback.PreviewSource ?? null,
  targetDeckSqid: feedback.targetDeckSqid ?? feedback.TargetDeckSqid ?? null,
  firstSavedItemSqid: feedback.firstSavedItemSqid
    ?? feedback.FirstSavedItemSqid
    ?? feedback.firstSavedSqid
    ?? feedback.FirstSavedSqid
    ?? null,
  lastSavedItemSqid: feedback.lastSavedItemSqid
    ?? feedback.LastSavedItemSqid
    ?? feedback.lastSavedSqid
    ?? feedback.LastSavedSqid
    ?? null,
  createdCount: feedback.createdCount ?? feedback.CreatedCount ?? null,
  skippedCount: feedback.skippedCount ?? feedback.SkippedCount ?? null,
  duplicateCount: feedback.duplicateCount ?? feedback.DuplicateCount ?? null,
  failedCount: feedback.failedCount ?? feedback.FailedCount ?? null,
  warningCount: feedback.warningCount ?? feedback.WarningCount ?? null,
}));

export const generateDeckFlashcardsResponseDtoSchema = z.object({
  items: z.array(flashcardResponseDtoSchema).default([]),
  warnings: z.array(z.string()).default([]),
  saveFeedback: generatedFlashcardsSaveFeedbackDtoSchema.nullable().optional(),
  SaveFeedback: generatedFlashcardsSaveFeedbackDtoSchema.nullable().optional(),
}).transform(({ SaveFeedback, ...response }) => ({
  ...response,
  saveFeedback: response.saveFeedback ?? SaveFeedback ?? null,
}));

export const flashcardSourceExtractionResponseDtoSchema = z.object({
  fileName: z.string().default(""),
  contentType: z.string().default(""),
  sourceText: z.string().default(""),
  characterCount: z.number().int().nonnegative(),
  warnings: z.array(z.string()).default([]),
});

export const executeFlashcardCodeLimitsRequestDtoSchema = z.object({
  timeoutMs: z.number().int().min(100).max(10000).default(3000),
  memoryMb: z.number().int().min(16).max(512).default(128),
  network: z.literal(false).default(false),
});

export const executeFlashcardCodeRequestDtoSchema = z.object({
  language: z.enum(["cpp", "csharp", "java", "python", "javascript", "sql"]),
  runtimeVersion: z.string().trim().min(1).optional(),
  prompt: z.string().trim().min(1).optional(),
  starterCode: z.string().default(""),
  studentCode: z.string().trim().min(1).max(20000),
  visibleTests: z.array(z.record(z.string(), jsonValueSchema)).default([]),
  hiddenTests: z.array(z.record(z.string(), jsonValueSchema)).default([]),
  limits: executeFlashcardCodeLimitsRequestDtoSchema.default({
    timeoutMs: 3000,
    memoryMb: 128,
    network: false,
  }),
});

export const executeFlashcardCodeResponseDtoSchema = z.object({
  executionStatus: z.enum(["completed", "compileError", "runtimeError", "timeout", "memoryLimitExceeded", "sandboxUnavailable"]),
  compileStatus: z.enum(["success", "failed", "notRun"]),
  runtimeStatus: z.enum(["completed", "failed", "notRun"]),
  stdout: z.string().default(""),
  stderr: z.string().default(""),
  visibleTestsPassed: z.number().int().min(0),
  visibleTestsTotal: z.number().int().min(0),
  hiddenTestsPassed: z.number().int().min(0),
  hiddenTestsTotal: z.number().int().min(0),
  message: z.string().default(""),
  results: z.array(z.object({
    name: z.string().default("Test"),
    passed: z.boolean().default(false),
    input: z.string().default(""),
    expectedOutput: z.string().default(""),
    actualOutput: z.string().default(""),
    stderr: z.string().default(""),
    status: z.string().default(""),
  })).default([]),
  hiddenSummary: z.object({
    passed: z.number().int().min(0),
    failed: z.number().int().min(0),
    total: z.number().int().min(0),
  }).default({
    passed: 0,
    failed: 0,
    total: 0,
  }),
});

export type FlashcardDeckResponseDto = z.output<typeof flashcardDeckResponseDtoSchema>;
export type FlashcardSubDeckResponseDto = z.output<typeof flashcardSubDeckResponseDtoSchema>;
export type FlashcardWorkspaceLatestResponseDto = z.output<typeof flashcardWorkspaceLatestResponseDtoSchema>;
export type CreateWorkspaceMajorDeckRequestDto = z.output<typeof createWorkspaceMajorDeckRequestDtoSchema>;
export type UpdateWorkspaceMajorDeckRequestDto = z.output<typeof updateWorkspaceMajorDeckRequestDtoSchema>;
export type CreateWorkspaceSubDeckRequestDto = z.output<typeof createWorkspaceSubDeckRequestDtoSchema>;
export type FlashcardDocumentResponseDto = z.output<typeof flashcardDocumentResponseDtoSchema>;
export type FlashcardResponseDto = z.output<typeof flashcardResponseDtoSchema>;
export type FlashcardItemTypeDto = z.output<typeof flashcardItemTypeDtoSchema>;
export type CognitiveSkillDto = z.output<typeof cognitiveSkillDtoSchema>;
export type LearningDomainDto = z.output<typeof learningDomainDtoSchema>;
export type CreateFlashcardRequestDto = z.input<typeof createFlashcardRequestDtoSchema>;
export type UpdateFlashcardRequestDto = z.input<typeof updateFlashcardRequestDtoSchema>;
export type GeneratedFlashcardDraftDto = z.output<typeof generatedFlashcardDraftDtoSchema>;
export type GenerateFlashcardsFromNoteRequestDto = z.input<typeof generateFlashcardsFromNoteRequestDtoSchema>;
export type GenerateFlashcardsFromNoteResponseDto = z.output<typeof generateFlashcardsFromNoteResponseDtoSchema>;
export type FlashcardReviewItemResponseDto = z.output<typeof flashcardReviewItemResponseDtoSchema>;
export type SubmitAndAnalyzeFlashcardRequestDto = z.input<typeof submitAndAnalyzeFlashcardRequestDtoSchema>;
export type SubmitAndAnalyzeFlashcardResponseDto = z.output<typeof submitAndAnalyzeFlashcardResponseDtoSchema>;
export type FlashcardLearnSessionScopeTypeDto = z.output<typeof flashcardLearnSessionScopeTypeDtoSchema>;
export type FlashcardLearnSessionItemResponseDto = z.output<typeof flashcardLearnSessionItemResponseDtoSchema>;
export type FlashcardLearnSessionResponseDto = z.output<typeof flashcardLearnSessionResponseDtoSchema>;
export type StartFlashcardLearnSessionRequestDto = z.output<typeof startFlashcardLearnSessionRequestDtoSchema>;
export type FlashcardLearnSessionStartFlowResponseDto = z.output<typeof flashcardLearnSessionStartFlowResponseDtoSchema>;
export type SubmitFlashcardLearnAnswerRequestDto = z.input<typeof submitFlashcardLearnAnswerRequestDtoSchema>;
export type FlashcardLearnAnswerResultResponseDto = z.output<typeof flashcardLearnAnswerResultResponseDtoSchema>;
export type SubmitFlashcardLearnAnswerResponseDto = z.output<typeof submitFlashcardLearnAnswerResponseDtoSchema>;
export type FlashcardFrontendReviewResponseDto = z.output<typeof flashcardFrontendReviewResponseDtoSchema>;
export type FlashcardStudyCoachRecapResponseDto = z.output<typeof flashcardStudyCoachRecapResponseDtoSchema>;
export type GenerateDeckFlashcardsPreviewRequestDto = z.input<typeof generateDeckFlashcardsPreviewRequestDtoSchema>;
export type GenerateDeckFlashcardsPdfPreviewRequestDto = z.input<typeof generateDeckFlashcardsPdfPreviewRequestDtoSchema>;
export type GenerateDeckFlashcardsPreviewResponseDto = z.output<typeof generateDeckFlashcardsPreviewResponseDtoSchema>;
export type FlashcardPdfGenerationJobStatusDto = z.output<typeof flashcardPdfGenerationJobStatusDtoSchema>;
export type FlashcardPdfGenerationJobResponseDto = z.output<typeof flashcardPdfGenerationJobResponseDtoSchema>;
export type GeneratedFlashcardsSaveFeedbackDto = z.output<typeof generatedFlashcardsSaveFeedbackDtoSchema>;
export type GenerateDeckFlashcardsResponseDto = z.output<typeof generateDeckFlashcardsResponseDtoSchema>;
export type FlashcardSourceExtractionResponseDto = z.output<typeof flashcardSourceExtractionResponseDtoSchema>;
export type ExecuteFlashcardCodeRequestDto = z.input<typeof executeFlashcardCodeRequestDtoSchema>;
export type ExecuteFlashcardCodeResponseDto = z.output<typeof executeFlashcardCodeResponseDtoSchema>;

export function toFlashcardItemTypeValue(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  return findEnumKey(flashcardItemTypeByValue, flashcardItemTypeDtoSchema.parse(value));
}

export function toCognitiveSkillValue(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  return findEnumKey(cognitiveSkillByValue, cognitiveSkillDtoSchema.parse(value));
}

export function toLearningDomainValue(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  return findEnumKey(learningDomainByValue, learningDomainDtoSchema.parse(value));
}

export function toGeneratedFlashcardRequest(item: GeneratedFlashcardDraftDto) {
  const itemType = toFlashcardItemTypeValue(item.itemType);
  if (itemType === 4 || itemType === 7 || itemType === 10) {
    throw new Error(`Unsupported item type in V1 save path: ${String(item.itemType)}`);
  }

  return {
    itemType,
    question: item.question.trim(),
    expectedAnswer: (item.expectedAnswer || item.answer || "").trim(),
    explanation: item.explanation ?? item.conceptExplanation,
    answeringGuidance: item.answeringGuidance,
    difficulty: item.difficulty,
    cognitiveSkill: toCognitiveSkillValue(item.cognitiveSkill),
    learningDomain: toLearningDomainValue(item.learningDomain),
    technicalLanguage: item.technicalLanguage,
    tagsJson: stringifyJsonField(item.tagsJson, []),
    rubricJson: stringifyJsonField(item.rubricJson, {}),
    validationConfigJson: stringifyJsonField(item.validationConfigJson, {}),
  };
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

function findEnumKey(values: Record<number, string>, target: string): number {
  const match = Object.entries(values).find(([, value]) => value === target);
  return match ? Number(match[0]) : 0;
}

function stringifyJsonField(value: unknown, fallback: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value ?? fallback);
}

function firstNonBlank(...values: string[]) {
  const match = values.find((value) => value.trim().length > 0);
  return match?.trim() ?? "";
}
