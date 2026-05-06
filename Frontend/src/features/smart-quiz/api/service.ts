import axios from "axios";

import { apiClient } from "@/lib/api/client";

import {
  generateQuizItemsPreviewRequestDtoSchema,
  generateQuizItemsPreviewResponseDtoSchema,
  generateQuizItemsResponseDtoSchema,
  quizItemDtoSchema,
  quizSessionDtoSchema,
  quizSessionNextItemDtoSchema,
  startQuizSessionRequestDtoSchema,
  submitQuizAnswerRequestDtoSchema,
  submitQuizAnswerResponseDtoSchema,
  toGeneratedQuizItemRequest,
  findEnumKey,
  sourceMaterialTypeByValue,
  type GeneratedQuizItemDraftDto,
  type GenerateQuizItemsPreviewRequestDto,
  type StartQuizSessionRequestDto,
  type SubmitQuizAnswerRequestDto,
} from "./dto";

export async function getQuizItemsByDeck(deckSqid: string) {
  const { data } = await apiClient.get(`/QuizItem/deck/${encodeURIComponent(deckSqid)}`);
  return quizItemDtoSchema.array().parse(data);
}

export async function generateQuizItemsPreview(deckSqid: string, payload: GenerateQuizItemsPreviewRequestDto) {
  const parsedPayload = generateQuizItemsPreviewRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/quiz-items/generate-preview`,
    toGenerateQuizItemsRequest(parsedPayload),
  );

  return generateQuizItemsPreviewResponseDtoSchema.parse(data);
}

export async function generateAndSaveQuizItems(deckSqid: string, payload: GenerateQuizItemsPreviewRequestDto) {
  const parsedPayload = generateQuizItemsPreviewRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/decks/${encodeURIComponent(deckSqid)}/quiz-items/generate`,
    toGenerateQuizItemsRequest(parsedPayload),
  );

  return generateQuizItemsResponseDtoSchema.parse(data);
}

export async function saveGeneratedQuizItems(deckSqid: string, items: GeneratedQuizItemDraftDto[]) {
  const { data } = await apiClient.post(`/decks/${encodeURIComponent(deckSqid)}/quiz-items/generated`, {
    items: items.map(toGeneratedQuizItemRequest),
  });

  return generateQuizItemsResponseDtoSchema.parse(data);
}

export async function startQuizSession(payload: StartQuizSessionRequestDto) {
  const parsedPayload = startQuizSessionRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post("/quiz-sessions", parsedPayload);
  return quizSessionDtoSchema.parse(data);
}

export async function getActiveQuizSession(scopeType: 1 | 2, deckSqid?: string | null, courseSqid?: string | null) {
  try {
    const { data } = await apiClient.get("/quiz-sessions/active", {
      params: {
        scopeType,
        deckSqid: deckSqid ?? undefined,
        courseSqid: courseSqid ?? undefined,
      },
    });

    return quizSessionDtoSchema.nullable().parse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function resumeQuizSession(sessionSqid: string) {
  const { data } = await apiClient.post(`/quiz-sessions/${encodeURIComponent(sessionSqid)}/resume`);
  return quizSessionDtoSchema.parse(data);
}

export async function getNextQuizItem(sessionSqid: string) {
  const { data } = await apiClient.get(`/quiz-sessions/${encodeURIComponent(sessionSqid)}/next`);
  return quizSessionNextItemDtoSchema.parse(data);
}

export async function submitQuizAnswer(sessionSqid: string, payload: SubmitQuizAnswerRequestDto) {
  const parsedPayload = submitQuizAnswerRequestDtoSchema.parse(payload);
  const { data } = await apiClient.post(
    `/quiz-sessions/${encodeURIComponent(sessionSqid)}/answers`,
    {
      quizItemSqid: parsedPayload.quizItemSqid,
      answer: parsedPayload.answer,
      responseTimeMs: parsedPayload.responseTimeMs,
      attemptContextJson: parsedPayload.attemptContextJson,
    },
  );

  return submitQuizAnswerResponseDtoSchema.parse(data);
}

export async function restartQuizSession(sessionSqid: string) {
  const { data } = await apiClient.post(`/quiz-sessions/${encodeURIComponent(sessionSqid)}/restart`);
  return quizSessionDtoSchema.parse(data);
}

export async function abandonQuizSession(sessionSqid: string) {
  await apiClient.post(`/quiz-sessions/${encodeURIComponent(sessionSqid)}/abandon`);
}

function toGenerateQuizItemsRequest(payload: GenerateQuizItemsPreviewRequestDto) {
  return {
    sourceText: payload.sourceText,
    sourceMaterial: payload.sourceMaterial
      ? {
          type: findEnumKey(sourceMaterialTypeByValue, payload.sourceMaterial.type),
          content: payload.sourceMaterial.content,
          sourceNoteSqid: payload.sourceMaterial.sourceNoteSqid,
          sourceDocumentSqid: payload.sourceMaterial.sourceDocumentSqid,
        }
      : undefined,
    learningDomain: payload.learningDomain,
    technicalLanguage: payload.technicalLanguage,
    itemTypes: payload.itemTypes,
    cognitiveSkill: payload.cognitiveSkill,
    difficulty: payload.difficulty,
    count: payload.count,
    programContext: payload.programContext,
  };
}
