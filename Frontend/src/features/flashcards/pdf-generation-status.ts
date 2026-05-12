import type { FlashcardPdfGenerationJobResponseDto } from "./api/dto";

export const seenTerminalFlashcardGenerationJobsStorageKey = "educaite.flashcards.pdfGeneration.seenTerminalJobs";

type PdfGenerationStageMeta = {
  label: string;
  description: string;
  fallbackProgress: number;
};

const stageMetaByKey: Record<string, PdfGenerationStageMeta> = {
  queued: {
    label: "Queued",
    description: "Waiting for the background generator to pick up the PDF.",
    fallbackProgress: 5,
  },
  retrieving_file: {
    label: "Retrieving file",
    description: "Loading the uploaded PDF for analysis.",
    fallbackProgress: 15,
  },
  extracting_pdf: {
    label: "Parsing PDF",
    description: "AI is reading the document and extracting readable study text.",
    fallbackProgress: 25,
  },
  pdf_parsed: {
    label: "Document parsed",
    description: "Readable text is ready. EducAIte is preparing the flashcard prompt.",
    fallbackProgress: 45,
  },
  generating_flashcards: {
    label: "Generating flashcards",
    description: "AI is analyzing the parsed source and writing reviewable flashcard drafts.",
    fallbackProgress: 70,
  },
  preparing_preview: {
    label: "Preparing preview",
    description: "Formatting the generated drafts for review.",
    fallbackProgress: 90,
  },
  ready: {
    label: "Preview ready",
    description: "The generated flashcard preview is ready to review.",
    fallbackProgress: 100,
  },
  failed: {
    label: "Failed",
    description: "The PDF generation job failed.",
    fallbackProgress: 100,
  },
  canceled: {
    label: "Canceled",
    description: "The PDF generation request was canceled.",
    fallbackProgress: 100,
  },
};

export function getPdfGenerationStageMeta(job: FlashcardPdfGenerationJobResponseDto): PdfGenerationStageMeta {
  return stageMetaByKey[job.stage] ?? {
    label: formatPdfGenerationStage(job.stage || job.status),
    description: job.message || "EducAIte is processing the PDF flashcard job.",
    fallbackProgress: job.status === "completed" ? 100 : 50,
  };
}

export function getPdfGenerationProgress(job: FlashcardPdfGenerationJobResponseDto) {
  const stageMeta = getPdfGenerationStageMeta(job);
  const progress = Number.isFinite(job.progressPercent)
    ? job.progressPercent
    : stageMeta.fallbackProgress;

  return Math.max(0, Math.min(100, Math.round(progress)));
}

export function getPdfGenerationMessage(job: FlashcardPdfGenerationJobResponseDto) {
  if (job.errorMessage) {
    return job.errorMessage;
  }

  if (job.message) {
    return job.message;
  }

  return getPdfGenerationStageMeta(job).description;
}

export function formatPdfGenerationJobStatus(status: FlashcardPdfGenerationJobResponseDto["status"]) {
  switch (status) {
    case "queued":
      return "Queued";
    case "running":
      return "Running";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    case "canceled":
      return "Canceled";
  }
}

export function readSeenTerminalFlashcardGenerationJobs() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const rawValue = window.localStorage.getItem(seenTerminalFlashcardGenerationJobsStorageKey);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

export function hasSeenTerminalFlashcardGenerationJob(jobSqid: string) {
  return readSeenTerminalFlashcardGenerationJobs().has(jobSqid);
}

export function rememberSeenTerminalFlashcardGenerationJob(jobSqid: string) {
  if (typeof window === "undefined") {
    return;
  }

  const seen = readSeenTerminalFlashcardGenerationJobs();
  seen.add(jobSqid);
  window.localStorage.setItem(
    seenTerminalFlashcardGenerationJobsStorageKey,
    JSON.stringify(Array.from(seen).slice(-50)),
  );
}

function formatPdfGenerationStage(stage: string) {
  return stage
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
