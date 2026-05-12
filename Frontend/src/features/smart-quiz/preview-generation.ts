import type {
  GeneratedQuizItemDraftDto,
  QuizDraftValidationStatusDto,
  QuizGenerationHydrationStatusDto,
} from "./api/dto";

export const smartQuizPreviewCountMin = 3;
export const smartQuizPreviewCountMax = 10;

const javaSafeItemTypeValues = new Set(["1", "8", "9"]);

export function clampSmartQuizPreviewCount(value: number) {
  if (!Number.isFinite(value)) {
    return smartQuizPreviewCountMin;
  }

  return Math.min(smartQuizPreviewCountMax, Math.max(smartQuizPreviewCountMin, Math.trunc(value)));
}

export function getSmartQuizPreviewCountError(value: number) {
  if (!Number.isFinite(value)) {
    return "Enter a number from 3 to 10.";
  }

  if (value < smartQuizPreviewCountMin || value > smartQuizPreviewCountMax) {
    return "Choose between 3 and 10 preview items.";
  }

  return null;
}

export function isJavaTechnicalLanguage(value: string) {
  return value.trim().toLowerCase() === "java";
}

export function toJavaSafeItemTypes(values: string[], fallbackValues: string[]) {
  const safeValues = values.filter((value) => javaSafeItemTypeValues.has(value));
  return safeValues.length > 0 ? safeValues : fallbackValues.filter((value) => javaSafeItemTypeValues.has(value));
}

export function isJavaExecutableItemType(value: string) {
  return !javaSafeItemTypeValues.has(value);
}

export function getSavableQuizDrafts(drafts: GeneratedQuizItemDraftDto[]) {
  return drafts.filter((draft) => draft.validationStatus === "Ready" || draft.validationStatus === "Downgraded");
}

export function getQuizDraftValidationMeta(status: QuizDraftValidationStatusDto) {
  switch (status) {
    case "Ready":
      return {
        variant: "success" as const,
        label: "Ready",
        description: "Ready for practice.",
      };
    case "Pending":
      return {
        variant: "info" as const,
        label: "Preparing",
        description: "Hydration is still preparing this item.",
      };
    case "Downgraded":
      return {
        variant: "warning" as const,
        label: "Study only",
        description: "Usable as non-executable study content.",
      };
    case "Failed":
      return {
        variant: "destructive" as const,
        label: "Needs retry",
        description: "Not practiceable unless edited or retried.",
      };
  }
}

export function getQuizGenerationHydrationMeta(status: QuizGenerationHydrationStatusDto) {
  switch (status) {
    case "PreviewReady":
      return {
        variant: "info" as const,
        label: "Preview ready",
        description: "Drafts are visible while source-material hydration starts.",
      };
    case "Hydrating":
      return {
        variant: "info" as const,
        label: "Hydrating",
        description: "Preparing validation data in the background.",
      };
    case "Ready":
      return {
        variant: "success" as const,
        label: "Ready",
        description: "All generated drafts are ready to save and practice.",
      };
    case "PartiallyReady":
      return {
        variant: "warning" as const,
        label: "Partially ready",
        description: "Some drafts are usable; failed drafts need retry or edits.",
      };
    case "Failed":
      return {
        variant: "destructive" as const,
        label: "Failed",
        description: "Hydration failed. Retry before saving practice items.",
      };
  }
}
