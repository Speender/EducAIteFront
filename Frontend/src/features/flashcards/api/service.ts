import axios from "axios";

import { apiClient } from "@/lib/api/client";

import {
  createFlashcardRequestDtoSchema,
  createWorkspaceMajorDeckRequestDtoSchema,
  createWorkspaceSubDeckRequestDtoSchema,
  executeFlashcardCodeRequestDtoSchema,
  executeFlashcardCodeResponseDtoSchema,
  flashcardDocumentResponseDtoSchema,
  flashcardLearnSessionStartFlowResponseDtoSchema,
  flashcardLearnSessionResponseDtoSchema,
  flashcardPdfGenerationJobResponseDtoSchema,
  flashcardResponseDtoSchema,
  flashcardReviewItemResponseDtoSchema,
  flashcardSourceExtractionResponseDtoSchema,
  flashcardSubDeckResponseDtoSchema,
  flashcardWorkspaceLatestResponseDtoSchema,
  generateDeckFlashcardsPreviewRequestDtoSchema,
  generateDeckFlashcardsPdfPreviewRequestDtoSchema,
  generateDeckFlashcardsPreviewResponseDtoSchema,
  generateDeckFlashcardsResponseDtoSchema,
  generateFlashcardsFromNoteRequestDtoSchema,
  generateFlashcardsFromNoteResponseDtoSchema,
  startFlashcardLearnSessionRequestDtoSchema,
  submitFlashcardLearnAnswerRequestDtoSchema,
  submitFlashcardLearnAnswerResponseDtoSchema,
  submitAndAnalyzeFlashcardRequestDtoSchema,
  submitAndAnalyzeFlashcardResponseDtoSchema,
  updateWorkspaceMajorDeckRequestDtoSchema,
  updateFlashcardRequestDtoSchema,
  toCognitiveSkillValue,
  toFlashcardItemTypeValue,
  toGeneratedFlashcardRequest,
  toLearningDomainValue,
  type CreateFlashcardRequestDto,
  type CreateWorkspaceMajorDeckRequestDto,
  type CreateWorkspaceSubDeckRequestDto,
  type ExecuteFlashcardCodeRequestDto,
  type FlashcardLearnSessionScopeTypeDto,
  type FlashcardLearnSessionStartFlowResponseDto,
  type FlashcardWorkspaceLatestResponseDto,
  type FlashcardPdfGenerationJobResponseDto,
  type GeneratedFlashcardDraftDto,
  type GenerateDeckFlashcardsPdfPreviewRequestDto,
  type GenerateDeckFlashcardsPreviewRequestDto,
  type GenerateFlashcardsFromNoteRequestDto,
  type StartFlashcardLearnSessionRequestDto,
  type SubmitFlashcardLearnAnswerRequestDto,
  type SubmitAndAnalyzeFlashcardRequestDto,
  type UpdateWorkspaceMajorDeckRequestDto,
  type UpdateFlashcardRequestDto,
} from "./dto";

function toFlashcardSessionScopeTypeValue(scopeType: FlashcardLearnSessionScopeTypeDto) {
  return scopeType === "Overall" ? 2 : 1;
}

export async function getLatestFlashcardWorkspace(): Promise<FlashcardWorkspaceLatestResponseDto> {
  const { data } = await apiClient.get("/FlashcardWorkspace/workspace/latest");
  return flashcardWorkspaceLatestResponseDtoSchema.parse(data);
}

export async function createWorkspaceMajorDeck(payload: CreateWorkspaceMajorDeckRequestDto) {
  const parsedPayload = createWorkspaceMajorDeckRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post("/FlashcardWorkspace/major-decks", parsedPayload);
  return flashcardWorkspaceLatestResponseDtoSchema.shape.decks.element.parse(data);
}

export async function updateWorkspaceMajorDeck(
  majorDeckSqid: string,
  payload: UpdateWorkspaceMajorDeckRequestDto,
) {
  const parsedPayload = updateWorkspaceMajorDeckRequestDtoSchema.parse(payload);
  await apiClient.put(
    `/FlashcardWorkspace/major-decks/${encodeURIComponent(majorDeckSqid)}`,
    parsedPayload,
  );
}

export async function deleteWorkspaceMajorDeck(majorDeckSqid: string) {
  await apiClient.delete(`/FlashcardWorkspace/major-decks/${encodeURIComponent(majorDeckSqid)}`);
}

export async function getWorkspaceSubDecks(majorDeckSqid: string) {
  const { data } = await apiClient.get(
    `/FlashcardWorkspace/major-decks/${encodeURIComponent(majorDeckSqid)}/subdecks`,
  );

  return flashcardSubDeckResponseDtoSchema.array().parse(data);
}

export async function createWorkspaceSubDeck(
  majorDeckSqid: string,
  payload: CreateWorkspaceSubDeckRequestDto,
) {
  const parsedPayload = createWorkspaceSubDeckRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/FlashcardWorkspace/major-decks/${encodeURIComponent(majorDeckSqid)}/subdecks`,
    parsedPayload,
  );

  return flashcardSubDeckResponseDtoSchema.parse(data);
}

export async function getFlashcardDocuments(studentCourseSqid: string) {
  const { data } = await apiClient.get(
    `/FlashcardWorkspace/student-courses/${encodeURIComponent(studentCourseSqid)}/documents`,
  );

  return flashcardDocumentResponseDtoSchema.array().parse(data);
}

export async function getFlashcardBySqid(flashcardSqid: string) {
  const { data } = await apiClient.get(`/Flashcard/${encodeURIComponent(flashcardSqid)}`);
  return flashcardResponseDtoSchema.parse(data);
}

export async function getDeckFlashcards(deckSqid: string) {
  const { data } = await apiClient.get(`/decks/${encodeURIComponent(deckSqid)}/flashcards`);
  return flashcardResponseDtoSchema.array().parse(data);
}

export async function createDeckFlashcard(deckSqid: string, payload: CreateFlashcardRequestDto) {
  const parsedPayload = createFlashcardRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards`,
    toFlashcardRequest(parsedPayload),
  );

  return flashcardResponseDtoSchema.parse(data);
}

export async function updateDeckFlashcard(
  deckSqid: string,
  flashcardSqid: string,
  payload: UpdateFlashcardRequestDto,
) {
  const parsedPayload = updateFlashcardRequestDtoSchema.parse(payload);
  await apiClient.put(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/${encodeURIComponent(flashcardSqid)}`,
    toFlashcardRequest(parsedPayload),
  );
}

export async function deleteDeckFlashcard(deckSqid: string, flashcardSqid: string) {
  await apiClient.delete(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/${encodeURIComponent(flashcardSqid)}`,
  );
}

export async function getFlashcardsByDocument(documentSqid: string) {
  const { data } = await apiClient.get(
    `/FlashcardWorkspace/documents/${encodeURIComponent(documentSqid)}/flashcards`,
  );

  return flashcardResponseDtoSchema.array().parse(data);
}

export async function createWorkspaceFlashcard(documentSqid: string, payload: CreateFlashcardRequestDto) {
  const parsedPayload = createFlashcardRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/FlashcardWorkspace/documents/${encodeURIComponent(documentSqid)}/flashcards`,
    toFlashcardRequest(parsedPayload),
  );

  return flashcardResponseDtoSchema.parse(data);
}

export async function updateWorkspaceFlashcard(
  documentSqid: string,
  flashcardSqid: string,
  payload: UpdateFlashcardRequestDto,
) {
  const parsedPayload = updateFlashcardRequestDtoSchema.parse(payload);
  await apiClient.put(
    `/FlashcardWorkspace/documents/${encodeURIComponent(documentSqid)}/flashcards/${encodeURIComponent(flashcardSqid)}`,
    toFlashcardRequest(parsedPayload),
  );
}

export async function deleteWorkspaceFlashcard(documentSqid: string, flashcardSqid: string) {
  await apiClient.delete(
    `/FlashcardWorkspace/documents/${encodeURIComponent(documentSqid)}/flashcards/${encodeURIComponent(flashcardSqid)}`,
  );
}

export async function generateFlashcardsFromNote(noteSqid: string, payload?: GenerateFlashcardsFromNoteRequestDto) {
  const parsedPayload = generateFlashcardsFromNoteRequestDtoSchema.parse(payload ?? {});
  const { data } = await apiClient.post(
    `/Flashcard/note/${encodeURIComponent(noteSqid)}/ai/generate`,
    toGenerateFlashcardsFromNoteRequest(parsedPayload),
  );

  return generateFlashcardsFromNoteResponseDtoSchema.parse(data);
}

export async function generateDeckFlashcardsPreview(deckSqid: string, payload: GenerateDeckFlashcardsPreviewRequestDto) {
  const parsedPayload = generateDeckFlashcardsPreviewRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/generate-preview`,
    toGenerateDeckFlashcardsRequest(parsedPayload),
  );

  return generateDeckFlashcardsPreviewResponseDtoSchema.parse(data);
}

export async function generateDeckFlashcardsPdfPreview(
  deckSqid: string,
  payload: GenerateDeckFlashcardsPdfPreviewRequestDto,
) {
  const formData = toDeckFlashcardsPdfGenerationFormData(payload);
  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/pdf/generate-preview`,
    formData,
  );

  return generateDeckFlashcardsPreviewResponseDtoSchema.parse(data);
}

export async function startDeckFlashcardsPdfGenerationJob(
  deckSqid: string,
  payload: GenerateDeckFlashcardsPdfPreviewRequestDto,
) {
  const formData = toDeckFlashcardsPdfGenerationFormData(payload);
  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/pdf/generation-jobs`,
    formData,
  );

  return flashcardPdfGenerationJobResponseDtoSchema.parse(data);
}

export async function getDeckFlashcardsPdfGenerationJob(deckSqid: string, jobSqid: string) {
  const { data } = await apiClient.get(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/pdf/generation-jobs/${encodeURIComponent(jobSqid)}`,
  );

  return flashcardPdfGenerationJobResponseDtoSchema.parse(data);
}

export type FlashcardGenerationJobScope = "active-recent" | "all";

export async function getFlashcardGenerationJobs(
  scope: FlashcardGenerationJobScope = "active-recent",
): Promise<FlashcardPdfGenerationJobResponseDto[]> {
  const { data } = await apiClient.get("/flashcards/generation-jobs", {
    params: { scope },
  });

  return flashcardPdfGenerationJobResponseDtoSchema.array().parse(data);
}

export async function getActiveRecentFlashcardGenerationJobs(): Promise<FlashcardPdfGenerationJobResponseDto[]> {
  return getFlashcardGenerationJobs("active-recent");
}

export async function getFlashcardGenerationJob(jobSqid: string): Promise<FlashcardPdfGenerationJobResponseDto> {
  const { data } = await apiClient.get(`/flashcards/generation-jobs/${encodeURIComponent(jobSqid)}`);

  return flashcardPdfGenerationJobResponseDtoSchema.parse(data);
}

export async function deleteFlashcardGenerationJob(jobSqid: string): Promise<void> {
  await apiClient.delete(`/flashcards/generation-jobs/${encodeURIComponent(jobSqid)}`);
}

export async function extractDeckFlashcardSource(deckSqid: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/source/extract`,
    formData,
  );

  return flashcardSourceExtractionResponseDtoSchema.parse(data);
}

export async function generateAndSaveDeckFlashcards(deckSqid: string, payload: GenerateDeckFlashcardsPreviewRequestDto) {
  const parsedPayload = generateDeckFlashcardsPreviewRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/flashcards/generate`,
    toGenerateDeckFlashcardsRequest(parsedPayload),
  );

  return generateDeckFlashcardsResponseDtoSchema.parse(data);
}

export async function saveGeneratedDeckFlashcards(
  deckSqid: string,
  payload: {
    items: GeneratedFlashcardDraftDto[];
    sourceNoteSqid?: string | null;
    sourceDocumentSqid?: string | null;
  },
) {
  const mappedItems = payload.items.map((item, index) => {
    try {
      return toGeneratedFlashcardRequest(item);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid generated flashcard.";
      throw new Error(`Draft ${index + 1} (${String(item.itemType)}): ${message}`);
    }
  });

  const { data } = await apiClient.post(`/decks/${encodeURIComponent(deckSqid)}/flashcards/generated`, {
    sourceNoteSqid: payload.sourceNoteSqid ?? undefined,
    sourceDocumentSqid: payload.sourceDocumentSqid ?? undefined,
    items: mappedItems,
  });

  return generateDeckFlashcardsResponseDtoSchema.parse(data);
}

export async function getFlashcardReviewQueue() {
  const { data } = await apiClient.get("/Flashcard/me/review-queue");
  return flashcardReviewItemResponseDtoSchema.array().parse(data);
}

export async function submitAndAnalyzeFlashcard(
  flashcardSqid: string,
  payload: SubmitAndAnalyzeFlashcardRequestDto,
) {
  const parsedPayload = submitAndAnalyzeFlashcardRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/Flashcard/${encodeURIComponent(flashcardSqid)}/ai/evaluate-attempt`,
    toSubmitFlashcardAnswerRequest(parsedPayload),
  );
  return submitAndAnalyzeFlashcardResponseDtoSchema.parse(data);
}

export async function analyzeFlashcardCodeSubmission(
  flashcardSqid: string,
  payload: SubmitAndAnalyzeFlashcardRequestDto,
) {
  const parsedPayload = submitAndAnalyzeFlashcardRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/Flashcard/${encodeURIComponent(flashcardSqid)}/ai/analyze-attempt`,
    toSubmitFlashcardAnswerRequest(parsedPayload),
  );
  return executeFlashcardCodeResponseDtoSchema.parse(data);
}

export async function executeFlashcardCode(payload: ExecuteFlashcardCodeRequestDto) {
  const parsedPayload = executeFlashcardCodeRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post("/flashcards/code/run", parsedPayload);
  return executeFlashcardCodeResponseDtoSchema.parse(data);
}

export async function getActiveFlashcardLearnSession(
  scopeType: FlashcardLearnSessionScopeTypeDto,
  studentCourseSqid?: string | null,
  deckSqid?: string | null,
  documentSqid?: string | null,
) {
  try {
    const { data } = await apiClient.get("/FlashcardSession/active", {
      params: {
        scopeType,
        studentCourseSqid: studentCourseSqid ?? undefined,
        deckSqid: deckSqid ?? undefined,
        documentSqid: documentSqid ?? undefined,
      },
    });

    return flashcardLearnSessionResponseDtoSchema.nullable().parse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function startFlashcardLearnSession(payload: StartFlashcardLearnSessionRequestDto) {
  const parsedPayload = startFlashcardLearnSessionRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post("/FlashcardSession", {
    ...parsedPayload,
    scopeType: toFlashcardSessionScopeTypeValue(parsedPayload.scopeType),
  });
  return flashcardLearnSessionResponseDtoSchema.parse(data);
}

export async function startFlashcardLearnSessionFlow(payload: StartFlashcardLearnSessionRequestDto): Promise<FlashcardLearnSessionStartFlowResponseDto> {
  const parsedPayload = startFlashcardLearnSessionRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post("/FlashcardSession/start-flow", {
    ...parsedPayload,
    scopeType: toFlashcardSessionScopeTypeValue(parsedPayload.scopeType),
  });
  return flashcardLearnSessionStartFlowResponseDtoSchema.parse(data);
}

export async function resumeFlashcardLearnSession(sessionSqid: string) {
  const { data } = await apiClient.post(`/FlashcardSession/${encodeURIComponent(sessionSqid)}/resume`);
  return flashcardLearnSessionResponseDtoSchema.parse(data);
}

export async function restartFlashcardLearnSession(sessionSqid: string) {
  const { data } = await apiClient.post(`/FlashcardSession/${encodeURIComponent(sessionSqid)}/restart`);
  return flashcardLearnSessionResponseDtoSchema.parse(data);
}

export async function abandonFlashcardLearnSession(sessionSqid: string) {
  await apiClient.post(`/FlashcardSession/${encodeURIComponent(sessionSqid)}/abandon`);
}

export async function submitFlashcardLearnAnswer(
  sessionSqid: string,
  payload: SubmitFlashcardLearnAnswerRequestDto,
) {
  const parsedPayload = submitFlashcardLearnAnswerRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/FlashcardSession/${encodeURIComponent(sessionSqid)}/ai/answers`,
    toSubmitFlashcardAnswerRequest(parsedPayload),
  );

  return submitFlashcardLearnAnswerResponseDtoSchema.parse(data);
}

function toFlashcardRequest(payload: CreateFlashcardRequestDto | UpdateFlashcardRequestDto) {
  return {
    ...payload,
    itemType: toFlashcardItemTypeValue(payload.itemType ?? "Flashcard"),
    difficulty: payload.difficulty ?? 50,
    cognitiveSkill: toCognitiveSkillValue(payload.cognitiveSkill ?? "Recall"),
    learningDomain: toLearningDomainValue(payload.learningDomain ?? "Unknown"),
    technicalLanguage: payload.technicalLanguage ?? "",
    tagsJson: payload.tagsJson ?? "[]",
    rubricJson: payload.rubricJson ?? "{}",
    validationConfigJson: payload.validationConfigJson ?? "{}",
  };
}

function toGenerateFlashcardsFromNoteRequest(payload: GenerateFlashcardsFromNoteRequestDto) {
  return {
    flashcardCount: payload.flashcardCount ?? 5,
    noteTitle: payload.noteTitle,
    noteContent: payload.noteContent,
    itemTypes: (payload.itemTypes ?? []).map(toFlashcardItemTypeValue),
    learningDomain: toLearningDomainValue(payload.learningDomain ?? "Unknown"),
    cognitiveSkill: payload.cognitiveSkill ? toCognitiveSkillValue(payload.cognitiveSkill) : null,
    technicalLanguage: payload.technicalLanguage,
    programContext: payload.programContext,
  };
}

function toGenerateDeckFlashcardsRequest(payload: GenerateDeckFlashcardsPreviewRequestDto) {
  return {
    sourceText: payload.sourceText,
    learningDomain: toLearningDomainValue(payload.learningDomain ?? "Unknown"),
    technicalLanguage: payload.technicalLanguage,
    itemTypes: (payload.itemTypes ?? []).map(toFlashcardItemTypeValue),
    cognitiveSkill: payload.cognitiveSkill ? toCognitiveSkillValue(payload.cognitiveSkill) : null,
    difficulty: payload.difficulty ?? 50,
    count: payload.count ?? 5,
    programContext: payload.programContext,
  };
}

function toDeckFlashcardsPdfGenerationFormData(payload: GenerateDeckFlashcardsPdfPreviewRequestDto) {
  const parsedPayload = generateDeckFlashcardsPdfPreviewRequestDtoSchema.parse(payload);
  const formData = new FormData();
  formData.append("file", parsedPayload.file);
  formData.append("count", String(parsedPayload.count ?? 5));

  for (const itemType of parsedPayload.itemTypes ?? []) {
    formData.append("itemTypes", String(toFlashcardItemTypeValue(itemType)));
  }

  if (parsedPayload.technicalLanguage?.trim()) {
    formData.append("technicalLanguage", parsedPayload.technicalLanguage.trim());
  }

  if (parsedPayload.programContext?.trim()) {
    formData.append("programContext", parsedPayload.programContext.trim());
  }

  return formData;
}

function toSubmitFlashcardAnswerRequest(payload: SubmitAndAnalyzeFlashcardRequestDto | SubmitFlashcardLearnAnswerRequestDto) {
  return {
    ...payload,
    itemType: payload.itemType ? toFlashcardItemTypeValue(payload.itemType) : null,
    cognitiveSkill: payload.cognitiveSkill ? toCognitiveSkillValue(payload.cognitiveSkill) : null,
    learningDomain: payload.learningDomain ? toLearningDomainValue(payload.learningDomain) : null,
  };
}
