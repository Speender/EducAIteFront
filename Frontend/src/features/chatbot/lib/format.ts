import type { ChatbotActionResponse, StudyFocusChatAiResponse } from "../api/service";

export type FormattedChatbotAction = ChatbotActionResponse & {
  label: string;
  href: string;
  type: string;
};

export type FormattedChatbotMessage = {
  message?: string;
  recommendedTopic?: string;
  reason?: string;
  studySequence: string[];
  reviewChecklist: string[];
  practiceTask?: string;
  fallbackText?: string;
  primaryAction?: FormattedChatbotAction;
  actions: FormattedChatbotAction[];
  context?: StudyFocusChatAiResponse["context"];
};

function normalizedText(value: string | null | undefined) {
  const text = value?.trim();
  return text ? text : undefined;
}

function normalizeAction(action: ChatbotActionResponse | null | undefined): FormattedChatbotAction | null {
  const label = normalizedText(action?.label);
  const href = normalizedText(action?.href);

  if (!label || !href) {
    return null;
  }

  return {
    ...action,
    label,
    href,
    type: normalizedText(action?.type) ?? "link",
  };
}

function dedupeActions(actions: FormattedChatbotAction[]) {
  return actions.filter((action, index, array) =>
    array.findIndex((candidate) => candidate.href === action.href && candidate.label === action.label) === index);
}

export function parseAssistantMessage(
  content: string,
  payload?: StudyFocusChatAiResponse | null,
): FormattedChatbotMessage | null {
  if (payload) {
    const normalizedActions = dedupeActions([
      ...(payload.actions ?? []),
      ...(payload.actionLinks ?? []),
    ].map(normalizeAction).filter((action): action is FormattedChatbotAction => Boolean(action)));
    const primaryAction =
      normalizeAction(payload.primaryAction) ??
      normalizedActions.find((action) => action.isPrimary || action.type?.toLowerCase() === "primary");

    return {
      message: normalizedText(payload.message) ?? normalizedText(content),
      recommendedTopic: normalizedText(payload.recommendedTopic),
      reason: normalizedText(payload.reason),
      studySequence: (payload.studySequence ?? []).filter((item) => Boolean(normalizedText(item))),
      reviewChecklist: (payload.reviewChecklist ?? []).filter((item) => Boolean(normalizedText(item))),
      practiceTask: normalizedText(payload.practiceTask),
      fallbackText: normalizedText(payload.fallbackText),
      primaryAction,
      actions: normalizedActions,
      context: payload.context ?? undefined,
    };
  }

  const text = content.trim();
  if (!text) {
    return null;
  }

  return {
    message: text,
    studySequence: [],
    reviewChecklist: [],
    fallbackText: text,
    actions: [],
  };
}
