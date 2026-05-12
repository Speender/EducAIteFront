import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  Presentation,
  Sparkles,
  Trash2,
  UploadCloud,
  WandSparkles,
  X,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import AiGenerationLoadingModal from "@/components/AiGenerationLoadingModal";
import { useToast } from "@/components/ToastProvider";
import {
  isFlashcardPdfGenerationJobActive,
  useCreateDeckFlashcardMutation,
  useDeckFlashcardsPdfGenerationJobQuery,
  useExtractDeckFlashcardSourceMutation,
  useFlashcardDetailQuery,
  useFlashcardWorkspaceLatestQuery,
  useGenerateDeckFlashcardsPreviewMutation,
  useSaveGeneratedDeckFlashcardsMutation,
  useStartDeckFlashcardsPdfGenerationJobMutation,
  useUpdateDeckFlashcardMutation,
  useWorkspaceSubDecksQuery,
} from "@/features/flashcards/api/hooks";
import {
  formatPdfGenerationJobStatus,
  getPdfGenerationMessage,
  getPdfGenerationProgress,
  getPdfGenerationStageMeta,
} from "@/features/flashcards/pdf-generation-status";
import type {
  FlashcardPdfGenerationJobResponseDto,
  GeneratedFlashcardsSaveFeedbackDto,
  GeneratedFlashcardDraftDto,
  GenerateDeckFlashcardsResponseDto,
  GenerateDeckFlashcardsPreviewResponseDto,
} from "@/features/flashcards/api/dto";
import { getFlashcardDocumentCardsPath } from "@/features/flashcards/routes";
import { getErrorMessage } from "@/lib/api/errors";
import logo from "../../../assets/educAIte-logo.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CreateMode = "manual" | "ai";

type PreviewInsights = Pick<
  GenerateDeckFlashcardsPreviewResponseDto,
  | "extractedText"
  | "effectiveItemTypes"
  | "effectiveLearningDomain"
  | "effectiveCognitiveSkill"
  | "inferenceConfidence"
  | "inferenceReason"
  | "effectiveTechnicalLanguage"
>;

type PreviewSaveContext = Pick<
  GenerateDeckFlashcardsPreviewResponseDto,
  "sourceNoteSqid" | "sourceDocumentSqid"
>;

const acceptedSourceExtensions = ".pdf,.doc,.docx,.rtf,.ppt,.pptx,.jpg,.jpeg,.png,.jfif,.xls,.xlsx,.txt";
const supportedSourceExtensions = new Set([
  "pdf",
  "doc",
  "docx",
  "rtf",
  "ppt",
  "pptx",
  "jpg",
  "jpeg",
  "png",
  "jfif",
  "xls",
  "xlsx",
  "txt",
]);
const sourceCharacterLimit = 20000;
const defaultGeneratedCount = 5;
const maxPdfSourceSize = 100 * 1024 * 1024;
const maxStandardSourceSize = 25 * 1024 * 1024;

function pluralizeGeneratedFlashcards(count: number) {
  return count === 1 ? "generated flashcard" : "generated flashcards";
}

function punctuateSentence(value: string) {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function formatCountSummary(saveFeedback: GeneratedFlashcardsSaveFeedbackDto | null | undefined) {
  if (!saveFeedback) {
    return "";
  }

  const savedCount = saveFeedback.savedCount ?? saveFeedback.createdCount;
  const skippedCount = saveFeedback.skippedCount ?? saveFeedback.duplicateCount;
  const details = [
    typeof savedCount === "number" ? `${savedCount} saved` : null,
    typeof skippedCount === "number" && skippedCount > 0 ? `${skippedCount} skipped` : null,
    typeof saveFeedback.failedCount === "number" && saveFeedback.failedCount > 0
      ? `${saveFeedback.failedCount} failed`
      : null,
  ].filter((detail): detail is string => Boolean(detail));

  return details.join(", ");
}

function getGeneratedFlashcardsSavedMessage(
  result: GenerateDeckFlashcardsResponseDto,
  fallbackCount: number,
) {
  const backendMessage = result.saveFeedback?.message?.trim();
  const countSummary = formatCountSummary(result.saveFeedback);

  if (backendMessage) {
    return countSummary
      ? `${punctuateSentence(backendMessage)} ${punctuateSentence(countSummary)}`
      : punctuateSentence(backendMessage);
  }

  const responseSavedCount = result.saveFeedback?.savedCount ?? result.saveFeedback?.createdCount ?? result.items.length;
  const effectiveCount = typeof responseSavedCount === "number" && responseSavedCount > 0
    ? responseSavedCount
    : fallbackCount;
  return `${effectiveCount} ${pluralizeGeneratedFlashcards(effectiveCount)} saved to this deck.`;
}
const supportedFormatGroups = [
  { label: "PDF", detail: "Up to 100 MB", icon: FileText, tone: "rose" },
  { label: "DOC, DOCX", detail: "Up to 25 MB", icon: FileType, tone: "blue" },
  { label: "PPT, PPTX", detail: "Up to 25 MB", icon: Presentation, tone: "orange" },
  { label: "XLS, XLSX", detail: "Up to 25 MB", icon: FileSpreadsheet, tone: "green" },
  { label: "Images", detail: "JPG, PNG, JFIF", icon: FileImage, tone: "violet" },
  { label: "Text Files", detail: "TXT, RTF", icon: FileText, tone: "slate" },
];

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function isPdfSourceFile(file: File) {
  return getFileExtension(file.name) === "pdf" || file.type === "application/pdf";
}

function getSourceFileLimit(file: File) {
  return isPdfSourceFile(file) ? maxPdfSourceSize : maxStandardSourceSize;
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatItemTypeLabel(itemType: string) {
  return itemType.replace(/([a-z])([A-Z])/g, "$1 $2");
}

type DraftContentBlock = {
  kind: "text" | "code";
  value: string;
  language?: string;
};

function splitDraftContent(content: string): DraftContentBlock[] {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [{ kind: "text", value: "" }];
  }

  const fencedBlocks = parseFencedCodeBlocks(normalized);
  if (fencedBlocks.length > 0) {
    return fencedBlocks;
  }

  const lines = normalized.split("\n");
  const codeLineIndexes = lines
    .map((line, index) => (looksLikeCodeLine(line) ? index : -1))
    .filter((index) => index >= 0);

  if (codeLineIndexes.length < 2) {
    return [{ kind: "text", value: normalized }];
  }

  const firstCodeLine = codeLineIndexes[0];
  const lastCodeLine = codeLineIndexes[codeLineIndexes.length - 1];
  const blocks: DraftContentBlock[] = [];
  const before = lines.slice(0, firstCodeLine).join("\n").trim();
  const code = lines.slice(firstCodeLine, lastCodeLine + 1).join("\n").trim();
  const after = lines.slice(lastCodeLine + 1).join("\n").trim();

  if (before) {
    blocks.push({ kind: "text", value: before });
  }
  if (code) {
    blocks.push({ kind: "code", value: code, language: inferCodeLanguage(code) });
  }
  if (after) {
    blocks.push({ kind: "text", value: after });
  }

  return blocks;
}

function parseFencedCodeBlocks(content: string): DraftContentBlock[] {
  const blocks: DraftContentBlock[] = [];
  const fencePattern = /```(\w+)?\n([\s\S]*?)```/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = fencePattern.exec(content)) !== null) {
    const text = content.slice(cursor, match.index).trim();
    if (text) {
      blocks.push({ kind: "text", value: text });
    }

    blocks.push({
      kind: "code",
      language: match[1] || inferCodeLanguage(match[2]),
      value: match[2].trim(),
    });
    cursor = match.index + match[0].length;
  }

  const remaining = content.slice(cursor).trim();
  if (remaining) {
    blocks.push({ kind: "text", value: remaining });
  }

  return blocks;
}

function looksLikeCodeLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  return /^(\/\/|#|import\s|from\s|public\s|private\s|protected\s|static\s|class\s|function\s|def\s|const\s|let\s|var\s|if\s*\(|else\b|for\s*\(|while\s*\(|return\b|int\s+|string\s+|double\s+|float\s+|boolean\s+|bool\s+|System\.|Console\.|print\(|printf\(|SELECT\b|UPDATE\b|INSERT\b|DELETE\b|CREATE\b|[\w.]+\s*=|[{};])/.test(trimmed);
}

function inferCodeLanguage(code: string) {
  if (/\bConsole\.WriteLine\b|\bint\[\]|\bstring\b/.test(code)) {
    return "csharp";
  }
  if (/\bSystem\.out\.println\b|\bpublic\s+class\b/.test(code)) {
    return "java";
  }
  if (/\bdef\s+\w+\(|\bprint\(/.test(code)) {
    return "python";
  }
  if (/\bSELECT\b|\bFROM\b|\bWHERE\b/i.test(code)) {
    return "sql";
  }

  return "code";
}

export function CreateCardPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { majorDeckSqid, deckSqid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const editingFlashcardSqid = searchParams.get("flashcard");
  const requestedGenerationJobSqid = searchParams.get("generationJob");
  const requestedGenerationPreviewToken = searchParams.get("previewRequest");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handledPdfGenerationJobSqidsRef = useRef<Set<string>>(new Set());

  const [mode, setMode] = useState<CreateMode>("manual");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [manualDraftSourceSqid, setManualDraftSourceSqid] = useState<string | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceFileName, setSourceFileName] = useState("");
  const [drafts, setDrafts] = useState<GeneratedFlashcardDraftDto[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  const [previewInsights, setPreviewInsights] = useState<PreviewInsights | null>(null);
  const [previewSaveContext, setPreviewSaveContext] = useState<PreviewSaveContext | null>(null);

  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const subDecksQuery = useWorkspaceSubDecksQuery(majorDeckSqid ?? null);
  const flashcardQuery = useFlashcardDetailQuery(editingFlashcardSqid);
  const createFlashcardMutation = useCreateDeckFlashcardMutation(deckSqid ?? null);
  const updateFlashcardMutation = useUpdateDeckFlashcardMutation(editingFlashcardSqid, deckSqid ?? null);
  const generatePreviewMutation = useGenerateDeckFlashcardsPreviewMutation(deckSqid ?? null);
  const startPdfGenerationJobMutation = useStartDeckFlashcardsPdfGenerationJobMutation(deckSqid ?? null);
  const [pdfGenerationJobSqid, setPdfGenerationJobSqid] = useState<string | null>(null);
  const effectivePdfGenerationJobSqid =
    pdfGenerationJobSqid ?? requestedGenerationJobSqid ?? null;
  const pdfGenerationJobQuery = useDeckFlashcardsPdfGenerationJobQuery(deckSqid ?? null, effectivePdfGenerationJobSqid);
  const extractSourceMutation = useExtractDeckFlashcardSourceMutation(deckSqid ?? null);
  const saveGeneratedMutation = useSaveGeneratedDeckFlashcardsMutation(deckSqid ?? null);

  const selectedMajorDeck =
    (workspaceQuery.data?.decks ?? []).find((deck) => deck.majorDeckSqid === majorDeckSqid) ?? null;
  const selectedSubDeck =
    (subDecksQuery.data ?? []).find((subDeck) => subDeck.deckSqid === deckSqid) ?? null;
  const isManualSaving = createFlashcardMutation.isPending || updateFlashcardMutation.isPending;
  const currentPdfGenerationJob =
    pdfGenerationJobQuery.data ??
    (startPdfGenerationJobMutation.data?.jobSqid === effectivePdfGenerationJobSqid
      ? startPdfGenerationJobMutation.data
      : null);
  const isPdfGenerationActive =
    startPdfGenerationJobMutation.isPending ||
    Boolean(currentPdfGenerationJob && isFlashcardPdfGenerationJobActive(currentPdfGenerationJob.status));
  const isBlockingGeneration = extractSourceMutation.isPending || generatePreviewMutation.isPending;
  const isGenerating =
    isBlockingGeneration ||
    isPdfGenerationActive;
  const currentError =
    extractSourceMutation.error ??
    startPdfGenerationJobMutation.error ??
    pdfGenerationJobQuery.error ??
    generatePreviewMutation.error ??
    saveGeneratedMutation.error ??
    createFlashcardMutation.error ??
    updateFlashcardMutation.error;
  const canGenerate = !isGenerating && Boolean(sourceFile);
  const loadedEditingFlashcard =
    editingFlashcardSqid && flashcardQuery.data?.sqid === editingFlashcardSqid ? flashcardQuery.data : null;
  const shouldUseLoadedManualDraft = Boolean(
    loadedEditingFlashcard && manualDraftSourceSqid !== loadedEditingFlashcard.sqid,
  );
  const manualQuestion = shouldUseLoadedManualDraft ? loadedEditingFlashcard?.question ?? "" : question;
  const manualAnswer = shouldUseLoadedManualDraft ? loadedEditingFlashcard?.answer ?? "" : answer;
  const effectiveMode = editingFlashcardSqid ? "manual" : mode;

  function setManualQuestion(value: string) {
    setManualDraftSourceSqid(loadedEditingFlashcard?.sqid ?? null);
    setQuestion(value);
    setAnswer(manualAnswer);
  }

  function setManualAnswer(value: string) {
    setManualDraftSourceSqid(loadedEditingFlashcard?.sqid ?? null);
    setQuestion(manualQuestion);
    setAnswer(value);
  }

  function goBackToDeck(state?: { generatedFlashcardsSavedMessage?: string }) {
    navigate(
      majorDeckSqid && deckSqid
        ? getFlashcardDocumentCardsPath(majorDeckSqid, deckSqid)
        : "/flashcards",
      state ? { state } : undefined,
    );
  }

  function handleCancel() {
    if (drafts.length > 0) {
      setShowDiscardModal(true);
      return;
    }

    goBackToDeck();
  }

  function handleManualSave() {
    const trimmedQuestion = manualQuestion.trim();
    const trimmedAnswer = manualAnswer.trim();

    if (!trimmedQuestion || !trimmedAnswer || !deckSqid) {
      setFeedback("Question and answer are required.");
      return;
    }

    setFeedback(null);
    const payload = {
      question: trimmedQuestion,
      answer: trimmedAnswer,
    };

    const onSuccess = () => {
      showSuccess(editingFlashcardSqid ? "Flashcard updated successfully." : "Flashcard created successfully.");
      goBackToDeck();
    };

    const onError = (error: unknown) => {
      setFeedback(getErrorMessage(error));
    };

    if (editingFlashcardSqid) {
      updateFlashcardMutation.mutate(payload, { onSuccess, onError });
      return;
    }

    createFlashcardMutation.mutate(payload, { onSuccess, onError });
  }

  function handleFileSelection(file: File | null | undefined) {
    if (!file) {
      return;
    }

    const extension = getFileExtension(file.name);

    if (!supportedSourceExtensions.has(extension)) {
      setFeedback("Upload a PDF, DOC, PPT, spreadsheet, image, TXT, or RTF file.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const maxSourceSize = getSourceFileLimit(file);
    if (file.size > maxSourceSize) {
      setFeedback(`${extension.toUpperCase()} files must be under ${formatFileSize(maxSourceSize)}.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (effectivePdfGenerationJobSqid) {
      handledPdfGenerationJobSqidsRef.current.add(effectivePdfGenerationJobSqid);
    }
    setPdfGenerationJobSqid(null);
    if (searchParams.has("generationJob")) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("generationJob");
      nextSearchParams.delete("previewRequest");
      setSearchParams(nextSearchParams, { replace: true });
    }

    setSourceFile(file);
    setSourceFileName(file.name);
    setSourceText("");
    setFeedback(null);
    setWarnings([]);
    setDrafts([]);
    setShowDraftPreview(false);
    setPreviewInsights(null);
    setPreviewSaveContext(null);
  }

  function applyPreview(preview: GenerateDeckFlashcardsPreviewResponseDto, extraWarnings: string[] = []) {
    setDrafts(preview.items);
    setWarnings([...extraWarnings, ...preview.warnings]);
    setPreviewInsights({
      extractedText: preview.extractedText,
      effectiveItemTypes: preview.effectiveItemTypes,
      effectiveLearningDomain: preview.effectiveLearningDomain,
      effectiveCognitiveSkill: preview.effectiveCognitiveSkill,
      inferenceConfidence: preview.inferenceConfidence,
      inferenceReason: preview.inferenceReason,
      effectiveTechnicalLanguage: preview.effectiveTechnicalLanguage,
    });
    setPreviewSaveContext({
      sourceNoteSqid: preview.sourceNoteSqid ?? null,
      sourceDocumentSqid: preview.sourceDocumentSqid ?? null,
    });

    if (preview.extractedText.trim()) {
      setSourceText(preview.extractedText);
    }

    if (preview.items.length > 0) {
      setShowDraftPreview(true);
    }
  }

  async function handleGeneratePreview() {
    if (!canGenerate) {
      setFeedback("Select a supported document before generating flashcards.");
      return;
    }

    setFeedback(null);

    if (!sourceFile) {
      setFeedback("Select a supported document before generating flashcards.");
      return;
    }

    if (isPdfSourceFile(sourceFile)) {
      try {
        const job = await startPdfGenerationJobMutation.mutateAsync({
          file: sourceFile,
          count: defaultGeneratedCount,
          itemTypes: [],
          technicalLanguage: null,
          programContext: null,
        });

        setPdfGenerationJobSqid(job.jobSqid);
        handlePdfGenerationJobUpdate(job);
      } catch (error) {
        setFeedback(getErrorMessage(error));
      }
      return;
    }

    const extraction = await extractSourceMutation.mutateAsync(sourceFile);
    const extractedText = extraction.sourceText.trim();
    if (!extractedText) {
      setWarnings(extraction.warnings);
      setFeedback("EducAIte could not find readable study content in that file.");
      return;
    }

    const boundedSourceText = extractedText.slice(0, sourceCharacterLimit);
    const extractionWarnings = [...extraction.warnings];

    if (extractedText.length > sourceCharacterLimit) {
      extractionWarnings.push("Only the first 20,000 characters were used for this flashcard preview.");
    }

    setSourceText(boundedSourceText);
    const preview = await generatePreviewMutation.mutateAsync({
      sourceText: boundedSourceText,
      count: defaultGeneratedCount,
      itemTypes: [],
      learningDomain: "Unknown",
      cognitiveSkill: null,
      difficulty: 50,
      technicalLanguage: null,
      programContext: null,
    });

    applyPreview(preview, extractionWarnings);
  }

  const handlePdfGenerationJobUpdate = useCallback((
    job: FlashcardPdfGenerationJobResponseDto,
    options: { forcePreview?: boolean } = {},
  ) => {
    if (isFlashcardPdfGenerationJobActive(job.status)) {
      return;
    }

    if (!options.forcePreview && handledPdfGenerationJobSqidsRef.current.has(job.jobSqid)) {
      return;
    }

    handledPdfGenerationJobSqidsRef.current.add(job.jobSqid);
    setPdfGenerationJobSqid(null);

    if (job.status === "completed") {
      if (job.preview) {
        applyPreview(job.preview);
        setFeedback(null);
        return;
      }

      setFeedback("The PDF job finished but did not return a generated preview.");
      return;
    }

    setFeedback(job.errorMessage || job.message || "The PDF flashcard generation job did not complete.");
  }, []);

  useEffect(() => {
    if (!pdfGenerationJobQuery.data) {
      return;
    }

    handlePdfGenerationJobUpdate(pdfGenerationJobQuery.data, {
      forcePreview: Boolean(requestedGenerationJobSqid && requestedGenerationPreviewToken),
    });
  }, [
    handlePdfGenerationJobUpdate,
    pdfGenerationJobQuery.data,
    requestedGenerationJobSqid,
    requestedGenerationPreviewToken,
  ]);

  async function handleSaveDrafts() {
    if (drafts.length === 0) {
      setFeedback("Generate at least one card before saving.");
      return;
    }

    setFeedback(null);

    try {
      const savedDraftCount = drafts.length;
      const saveResult = await saveGeneratedMutation.mutateAsync({
        items: drafts,
        sourceNoteSqid: previewSaveContext?.sourceNoteSqid ?? null,
        sourceDocumentSqid: previewSaveContext?.sourceDocumentSqid ?? null,
      });
      showSuccess(getGeneratedFlashcardsSavedMessage(saveResult, savedDraftCount));
      goBackToDeck();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      setFeedback(errorMessage);
    }
  }

  function removeDraft(index: number) {
    setDrafts((current) => current.filter((_, draftIndex) => draftIndex !== index));
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(0,206,200,0.10),transparent_32%),#050505] px-4 pb-20 pt-6 font-sans text-white antialiased sm:px-6 sm:pt-10">
      <header className="mx-auto flex w-full max-w-[1320px] items-center gap-4">
        <Button
          type="button"
          onClick={handleCancel}
          variant="outline"
          size="icon"
          aria-label="Back to deck"
          className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
        >
          <ArrowLeft />
        </Button>
        <img src={logo} alt="educAIte" className="h-7 opacity-90" />
      </header>

      <main className="mx-auto mt-10 max-w-[1320px]">
        <div className="mb-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Badge variant="outline" className="border-[#00CEC8]/30 bg-[#00CEC8]/10 text-[#9FF8F5]">
              {selectedSubDeck ? `${selectedSubDeck.title}${selectedMajorDeck ? ` | ${selectedMajorDeck.deckName}` : ""}` : "Current deck"}
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {editingFlashcardSqid ? "Edit flashcard" : "Create flashcards"}
            </h1>
            {!editingFlashcardSqid ? (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                Create one precise card manually or generate a reviewable AI draft set from study material.
              </p>
            ) : null}
          </div>

          {!editingFlashcardSqid ? (
            <Tabs value={effectiveMode} onValueChange={(value) => setMode(value as CreateMode)} className="w-full max-w-[420px]">
              <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.045] p-1 text-white shadow-[0_14px_45px_rgba(0,0,0,0.22)]">
                <TabsTrigger
                  value="manual"
                  className="rounded-xl text-sm font-semibold text-white/72 hover:text-white data-active:bg-[#00CEC8] data-active:text-black data-[state=active]:bg-[#00CEC8] data-[state=active]:text-black"
                >
                  Manual
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="rounded-xl text-sm font-semibold text-white/72 hover:text-white data-active:bg-[#00CEC8] data-active:text-black data-[state=active]:bg-[#00CEC8] data-[state=active]:text-black"
                >
                  <Sparkles data-icon="inline-start" />
                  AI Generate
                </TabsTrigger>
              </TabsList>
            </Tabs>
          ) : null}
        </div>

        {effectiveMode === "manual" ? (
          <section className="mx-auto max-w-[860px]">
            <Card className="border-white/10 bg-white/[0.035] text-white shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <CardHeader>
                <CardTitle>Manual card</CardTitle>
                <CardDescription className="text-white/60">Add a focused question and answer directly to this subdeck.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="manual-question">Question</Label>
                  <Input
                    id="manual-question"
                    value={manualQuestion}
                    onChange={(event) => setManualQuestion(event.target.value)}
                    placeholder="What is the core concept?"
                    className="h-12 border-white/10 bg-black/30 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="manual-answer">Answer</Label>
                  <Textarea
                    id="manual-answer"
                    value={manualAnswer}
                    onChange={(event) => setManualAnswer(event.target.value)}
                    placeholder="Write the ideal answer in clear study language."
                    rows={7}
                    className="min-h-44 resize-none border-white/10 bg-black/30 text-white placeholder:text-white/30"
                  />
                </div>
              </CardContent>
            </Card>

            <FormFeedback message={feedback || (currentError ? getErrorMessage(currentError) : null)} />

            <div className="mt-8 flex items-center justify-end gap-3">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isManualSaving}
                variant="outline"
                className="border-white/10 bg-transparent text-white/75 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleManualSave}
                disabled={isManualSaving}
                className="bg-[#00CEC8] font-semibold text-black hover:bg-[#4de9e4]"
              >
                {isManualSaving ? "Saving..." : "Save card"}
              </Button>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-[1200px] space-y-8">
            <div className="flex flex-col gap-5">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9FF8F5]">AI Generate</p>
                <h2 className="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  Upload PDFs
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/58">
                  Upload your documents to generate flashcards from readable study material.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <FileDropZone
                file={sourceFile}
                fileName={sourceFileName}
                inputRef={fileInputRef}
                isBusy={isGenerating}
                onFile={handleFileSelection}
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm leading-6 text-white/55">
                  {sourceFile
                    ? "EducAIte will upload the document, extract readable content, and build a reviewable flashcard preview."
                    : "Select a document to start. Progress appears automatically while the file is analyzed."}
                </p>

                {sourceFile ? (
                  <Button
                    type="button"
                    onClick={handleGeneratePreview}
                    disabled={!canGenerate || isGenerating}
                    className="h-12 rounded-xl bg-[#00CEC8] px-6 font-semibold text-black shadow-[0_16px_50px_rgba(0,206,200,0.16)] transition hover:bg-[#4de9e4] hover:shadow-[0_20px_60px_rgba(0,206,200,0.22)]"
                  >
                    <Sparkles data-icon="inline-start" />
                    {isGenerating ? "Generating..." : "Generate flashcards"}
                  </Button>
                ) : null}
              </div>

              {warnings.length > 0 ? (
                <div className="rounded-xl border border-amber-300/15 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
                  {warnings.join(" ")}
                </div>
              ) : null}

              <FormFeedback message={feedback || (currentError ? getErrorMessage(currentError) : null)} />

              {isPdfGenerationActive || currentPdfGenerationJob ? (
                <PdfGenerationStatusPanel
                  job={currentPdfGenerationJob}
                  isStarting={startPdfGenerationJobMutation.isPending}
                />
              ) : null}
            </div>

            <UploadSteps />
            <SupportedFormats />

            {drafts.length > 0 || sourceText.trim() ? (
              <section className="space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white">Generated Preview</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Review the draft set and the extracted source before saving anything to the deck.
                  </p>
                </div>

                {drafts.length > 0 ? (
                  <DraftPreviewSummary
                    count={drafts.length}
                    isSaving={saveGeneratedMutation.isPending}
                    insights={previewInsights}
                    onOpen={() => setShowDraftPreview(true)}
                    onSave={handleSaveDrafts}
                  />
                ) : null}

                {sourceText.trim() ? <ExtractedSourcePreview sourceText={sourceText} /> : null}
              </section>
            ) : null}
          </section>
        )}
      </main>

      <AiGenerationLoadingModal
        open={isBlockingGeneration}
        title="Generating flashcards from your document"
        subtitle="educAIte is uploading the file, reading the source material, and preparing a draft set."
        stages={[
          { label: "Uploading document", description: "Sending the selected file to the flashcard pipeline." },
          { label: "Extracting source text", description: "Reading the document and cleaning the study content." },
          { label: "Detecting key concepts", description: "Finding terms, relationships, and review signals." },
          { label: "Generating flashcards", description: "Writing reviewable questions and answers." },
          { label: "Preparing preview", description: "Building the final draft set for editing." },
        ]}
      />

      {showDiscardModal ? (
        <DiscardDraftsModal
          onCancel={() => setShowDiscardModal(false)}
          onDiscard={goBackToDeck}
        />
      ) : null}

      <GeneratedDraftPreviewModal
        open={showDraftPreview}
        drafts={drafts}
        isSaving={saveGeneratedMutation.isPending}
        onOpenChange={setShowDraftPreview}
        onRemove={removeDraft}
        onSave={handleSaveDrafts}
      />
    </div>
  );
}

function PdfGenerationStatusPanel({
  job,
  isStarting,
}: {
  job: FlashcardPdfGenerationJobResponseDto | null;
  isStarting: boolean;
}) {
  const progressPercent = job ? getPdfGenerationProgress(job) : 8;
  const stageMeta = job ? getPdfGenerationStageMeta(job) : {
    label: "Uploading PDF",
    description: "Sending the selected PDF to the background generator.",
  };
  const message = job ? getPdfGenerationMessage(job) : stageMeta.description;
  const statusLabel = job ? formatPdfGenerationJobStatus(job.status) : "Starting";

  return (
    <Card className="border-[#00CEC8]/20 bg-[#00CEC8]/[0.08] text-white shadow-[0_18px_60px_rgba(0,206,200,0.10)]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{statusLabel}</Badge>
              <Badge variant="outline">{stageMeta.label}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">{message}</p>
          </div>
          <span className="shrink-0 text-lg font-semibold tabular-nums text-[#9FF8F5]">
            {progressPercent}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-white/10" />
        <p className="text-xs leading-5 text-white/50">
          {isStarting
            ? "You can stay on this page while the upload starts."
            : "This runs in the background. Progress will continue from the flashcards toast if you leave this page."}
        </p>
      </CardContent>
    </Card>
  );
}

function FileDropZone({
  file,
  fileName,
  inputRef,
  isBusy,
  onFile,
}: {
  file: File | null;
  fileName: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isBusy: boolean;
  onFile: (file: File | null | undefined) => void;
}) {
  return (
    <div
      className="rounded-[20px] border border-white/10 bg-white/[0.025] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onFile(event.dataTransfer.files?.[0]);
      }}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isBusy}
        className="group relative flex min-h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-white/15 bg-[#080808] bg-[radial-gradient(circle_at_50%_0%,rgba(0,206,200,0.08),transparent_42%)] px-6 py-10 text-center text-white transition duration-300 hover:border-[#00CEC8]/55 hover:bg-[#071211] hover:shadow-[0_0_70px_rgba(0,206,200,0.09)] focus-visible:border-[#00CEC8]/70 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#00CEC8]/20 disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-[#00CEC8] transition duration-300 group-hover:border-[#00CEC8]/30 group-hover:bg-[#00CEC8]/10">
          <UploadCloud className="size-8" />
        </span>
        <span className="mt-7 text-2xl font-semibold tracking-tight text-white">
          {fileName || "Drop document here to upload"}
        </span>
        <span className="mt-3 max-w-2xl text-sm leading-6 text-white/52">
          {file
            ? `${formatFileSize(file.size)} selected. You can replace it before generating.`
            : "Upload readable class material and EducAIte will prepare a generated preview."}
        </span>
        <span className="mt-7 rounded-xl bg-[#00CEC8] px-7 py-3 text-sm font-bold text-black shadow-[0_12px_40px_rgba(0,206,200,0.14)] transition group-hover:bg-[#45ebe6]">
          {file ? "Choose a different file" : "Select from device"}
        </span>
        <span className="mt-7 text-sm leading-6 text-white/45">
          Up to 100 MB for PDF and up to 25 MB for other supported files
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedSourceExtensions}
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
    </div>
  );
}

function UploadSteps() {
  const steps = [
    {
      number: "1",
      title: "Select document",
      description: "Choose a supported file from your device or drop it into the upload area.",
      icon: FileText,
    },
    {
      number: "2",
      title: "Upload",
      description: "EducAIte extracts the readable content and shows progress automatically.",
      icon: UploadCloud,
    },
    {
      number: "3",
      title: "Generate flashcards",
      description: "Review the generated preview, then save the cards into this deck.",
      icon: WandSparkles,
    },
  ];

  return (
    <section className="space-y-5">
      <h3 className="text-2xl font-semibold tracking-tight text-white">How to upload your documents</h3>
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="rounded-[18px] border border-white/10 bg-white/[0.035] p-5 text-white">
              <div className="flex items-start gap-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00CEC8] text-sm font-bold text-black">
                  {step.number}
                </span>
                <div className="min-w-0">
                  <Icon className="mb-4 size-11 text-[#00CEC8]" />
                  <h4 className="text-lg font-semibold">{step.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-white/58">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SupportedFormats() {
  return (
    <section className="space-y-5">
      <h3 className="text-2xl font-semibold tracking-tight text-white">Supported file formats</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {supportedFormatGroups.map((format) => {
          const Icon = format.icon;

          return (
            <div key={format.label} className="rounded-[16px] border border-white/10 bg-white/[0.035] p-4 text-white">
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                    format.tone === "rose" && "border-rose-300/20 bg-rose-400/15 text-rose-100",
                    format.tone === "blue" && "border-blue-300/20 bg-blue-400/15 text-blue-100",
                    format.tone === "orange" && "border-orange-300/20 bg-orange-400/15 text-orange-100",
                    format.tone === "green" && "border-emerald-300/20 bg-emerald-400/15 text-emerald-100",
                    format.tone === "violet" && "border-violet-300/20 bg-violet-400/15 text-violet-100",
                    format.tone === "slate" && "border-white/10 bg-white/[0.06] text-white/70",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{format.label}</p>
                  <p className="mt-1 truncate text-sm text-white/52">{format.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ExtractedSourcePreview({ sourceText }: { sourceText: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.035] text-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <CardDescription className="text-white/55">Extracted source</CardDescription>
          <CardTitle className="mt-2 text-xl">AI-read document text</CardTitle>
        </div>
        <span className="text-xs text-white/40">{sourceText.length}/{sourceCharacterLimit}</span>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-56 rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="whitespace-pre-wrap text-sm leading-7 text-white/72">{sourceText}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function DraftPreviewSummary({
  count,
  insights,
  isSaving,
  onOpen,
  onSave,
}: {
  count: number;
  insights: PreviewInsights | null;
  isSaving: boolean;
  onOpen: () => void;
  onSave: () => void;
}) {
  const confidence = Math.round((insights?.inferenceConfidence || 0) * 100);

  return (
    <Card className="overflow-hidden border-[#00CEC8]/20 bg-[linear-gradient(135deg,rgba(0,206,200,0.10),rgba(255,255,255,0.035)_45%,rgba(255,255,255,0.02))] text-white shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border border-[#00CEC8]/20 bg-[#00CEC8]/15 text-[#9FF8F5] hover:bg-[#00CEC8]/15">
              Preview ready
            </Badge>
            <Badge variant="outline" className="border-[#00CEC8]/25 text-[#9FF8F5]">
              {count} {count === 1 ? "card" : "cards"}
            </Badge>
            {confidence > 0 ? (
              <Badge variant="outline" className="border-white/10 text-white/70">
                {confidence}% confidence
              </Badge>
            ) : null}
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Review the generated cards before saving
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            The draft set is ready in a focused preview modal where you can edit prompts, refine answers, remove weak cards, and save the final deck.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:min-w-48">
          <Button
            type="button"
            onClick={onOpen}
            className="bg-[#00CEC8] font-semibold text-black hover:bg-[#4de9e4]"
          >
            Open preview
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={count === 0 || isSaving}
            variant="outline"
            className="border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
          >
            {isSaving ? "Saving..." : "Save all"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GeneratedDraftPreviewModal({
  open,
  drafts,
  isSaving,
  onOpenChange,
  onRemove,
  onSave,
}: {
  open: boolean;
  drafts: GeneratedFlashcardDraftDto[];
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (index: number) => void;
  onSave: () => void;
}) {
  const [selectedItemType, setSelectedItemType] = useState<GeneratedFlashcardDraftDto["itemType"] | "all">("all");
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(0);
  const availableItemTypes = Array.from(new Set(drafts.map((draft) => draft.itemType))).sort((a, b) =>
    formatItemTypeLabel(a).localeCompare(formatItemTypeLabel(b)),
  );
  const effectiveItemType =
    selectedItemType !== "all" && availableItemTypes.includes(selectedItemType) ? selectedItemType : "all";
  const visibleDrafts = drafts
    .map((draft, index) => ({ draft, index }))
    .filter(({ draft }) => effectiveItemType === "all" || draft.itemType === effectiveItemType);
  const selectedDraftEntry =
    visibleDrafts.find(({ index }) => index === selectedDraftIndex) ?? visibleDrafts[0] ?? null;
  const selectedVisibleIndex = selectedDraftEntry
    ? visibleDrafts.findIndex(({ index }) => index === selectedDraftEntry.index)
    : -1;
  const typeCounts = availableItemTypes.reduce<Record<string, number>>((counts, itemType) => {
    counts[itemType] = drafts.filter((draft) => draft.itemType === itemType).length;
    return counts;
  }, {});

  function goToDraft(offset: number) {
    if (visibleDrafts.length === 0 || selectedVisibleIndex < 0) {
      return;
    }

    const nextIndex = (selectedVisibleIndex + offset + visibleDrafts.length) % visibleDrafts.length;
    setSelectedDraftIndex(visibleDrafts[nextIndex].index);
  }

  function handleRemoveSelectedDraft() {
    if (!selectedDraftEntry) {
      return;
    }

    const fallbackEntry = visibleDrafts[selectedVisibleIndex + 1] ?? visibleDrafts[selectedVisibleIndex - 1] ?? null;
    onRemove(selectedDraftEntry.index);
    if (fallbackEntry) {
      setSelectedDraftIndex(fallbackEntry.index);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="grid h-[min(720px,calc(100dvh-1rem))] max-h-[calc(100dvh-1rem)] w-[min(1280px,calc(100vw-1rem))] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-[20px] border border-white/10 bg-[#050505] p-0 text-white shadow-[0_28px_110px_rgba(0,0,0,0.72)] sm:h-[min(720px,calc(100dvh-2rem))] sm:max-h-[calc(100dvh-2rem)] sm:w-[min(1280px,calc(100vw-2rem))] sm:max-w-none lg:aspect-[16/9] lg:h-auto"
      >
        <DialogHeader className="border-b border-white/10 bg-[#070707] px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="text-xl font-semibold text-white sm:text-2xl">
                Generated preview
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Check each card in a compact review workspace before saving.
              </DialogDescription>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge className="rounded-full border border-[#00CEC8]/20 bg-[#00CEC8]/15 px-4 py-2 text-sm font-semibold text-[#9FF8F5] hover:bg-[#00CEC8]/15">
                {drafts.length} {drafts.length === 1 ? "draft" : "drafts"}
              </Badge>
              <DialogClose asChild>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#00CEC8]/20"
                  aria-label="Close generated preview"
                >
                  <X className="size-5" />
                </button>
              </DialogClose>
            </div>
          </div>

          {availableItemTypes.length > 0 ? (
            <div className="hide-scrollbar mt-4 flex max-w-full gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedItemType("all")}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                  effectiveItemType === "all"
                    ? "border-[#00CEC8] bg-[#00CEC8] text-black"
                    : "border-white/10 bg-white/[0.04] text-white/70 hover:border-[#00CEC8]/30 hover:bg-[#00CEC8]/10 hover:text-white",
                )}
              >
                All
                <span className="ml-2 text-xs opacity-65">{drafts.length}</span>
              </button>
              {availableItemTypes.map((itemType) => (
                <button
                  key={itemType}
                  type="button"
                  onClick={() => setSelectedItemType(itemType)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                    effectiveItemType === itemType
                      ? "border-[#00CEC8] bg-[#00CEC8] text-black"
                      : "border-white/10 bg-white/[0.04] text-white/70 hover:border-[#00CEC8]/30 hover:bg-[#00CEC8]/10 hover:text-white",
                  )}
                >
                  {formatItemTypeLabel(itemType)}
                  <span className="ml-2 text-xs opacity-65">{typeCounts[itemType]}</span>
                </button>
              ))}
            </div>
          ) : null}
        </DialogHeader>

        <div className="min-h-0 bg-[#050505] p-2 sm:p-3">
          {drafts.length === 0 ? (
            <Empty className="h-full rounded-[18px] border border-dashed border-white/10 bg-white/[0.025]">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle className="text-white">No generated cards yet</EmptyTitle>
                <EmptyDescription className="text-white/60">
                  Upload a source file and generate a preview.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid h-full min-h-0 grid-rows-[126px_minmax(0,1fr)] gap-3 md:grid-cols-[240px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] xl:grid-cols-[292px_minmax(0,1fr)]">
              <aside className="min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
                <ScrollArea className="h-full">
                  <div className="flex gap-2 p-2 md:flex-col">
                    {visibleDrafts.map(({ draft, index }, visibleIndex) => (
                      <button
                        key={`${draft.question}-${index}`}
                        type="button"
                        onClick={() => setSelectedDraftIndex(index)}
                        className={cn(
                          "min-w-[220px] rounded-xl border p-3 text-left transition md:min-w-0",
                          selectedDraftEntry?.index === index
                            ? "border-[#00CEC8]/[0.55] bg-[#00CEC8]/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                            : "border-transparent bg-black/25 hover:border-[#00CEC8]/25 hover:bg-white/[0.06]",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-white/40">
                            {String(visibleIndex + 1).padStart(2, "0")}
                          </span>
                          <Badge variant="outline" className="border-white/10 px-2 py-0.5 text-[11px] text-white/60">
                            {formatItemTypeLabel(draft.itemType)}
                          </Badge>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/90">
                          {draft.question}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </aside>

              {selectedDraftEntry ? (
                <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <div className="min-w-0">
                      <Badge className="border border-[#00CEC8]/20 bg-[#00CEC8]/15 text-[#9FF8F5] hover:bg-[#00CEC8]/15">
                        {formatItemTypeLabel(selectedDraftEntry.draft.itemType)}
                      </Badge>
                      <p className="mt-2 text-sm text-white/55">
                        Card {selectedVisibleIndex + 1} of {visibleDrafts.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => goToDraft(-1)}
                        className="rounded-lg border-white/10 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                        aria-label="Previous draft"
                      >
                        <ChevronLeft />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => goToDraft(1)}
                        className="rounded-lg border-white/10 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                        aria-label="Next draft"
                      >
                        <ChevronRight />
                      </Button>
                      <Button
                        type="button"
                        onClick={handleRemoveSelectedDraft}
                        variant="outline"
                        size="icon"
                        className="rounded-lg border-rose-300/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15 hover:text-rose-50"
                        aria-label="Remove selected draft"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>

                  <div className="grid min-h-0 grid-rows-2 gap-3 p-3 lg:grid-cols-2 lg:grid-rows-1">
                    <DraftReviewPane
                      label="Question"
                      content={selectedDraftEntry.draft.question}
                    />
                    <DraftReviewPane
                      label="Answer"
                      content={selectedDraftEntry.draft.answer}
                    />
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 border-t border-white/10 bg-[#070707] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-white/60">
            Showing {visibleDrafts.length} of {drafts.length} {drafts.length === 1 ? "card" : "cards"}
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-white/10 bg-transparent px-7 text-white/80 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={onSave}
              disabled={drafts.length === 0 || isSaving}
              className="h-11 rounded-xl bg-[#00CEC8] px-8 font-semibold text-black hover:bg-[#4de9e4]"
            >
              {isSaving ? "Saving..." : `Save ${drafts.length} ${drafts.length === 1 ? "card" : "cards"}`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DraftContentContainer({ content }: { content: string }) {
  const blocks = splitDraftContent(content);

  return (
    <ScrollArea className="h-full rounded-2xl border border-white/10 bg-black/35">
      <div className="space-y-3 p-4">
        {blocks.map((block, index) =>
          block.kind === "code" ? (
            <DraftCodeBlock key={`${block.kind}-${index}`} code={block.value} language={block.language} />
          ) : (
            <p key={`${block.kind}-${index}`} className="whitespace-pre-wrap text-base leading-7 text-white/85">
              {block.value}
            </p>
          ),
        )}
      </div>
    </ScrollArea>
  );
}

function DraftReviewPane({ label, content }: { label: string; content: string }) {
  const hasCode = splitDraftContent(content).some((block) => block.kind === "code");

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-semibold uppercase text-white/50">
          {label}
        </Label>
        {hasCode ? (
          <Badge variant="outline" className="border-sky-300/25 bg-sky-400/10 text-sky-100">
            Code
          </Badge>
        ) : null}
      </div>
      <DraftContentContainer content={content} />
    </div>
  );
}

function DraftCodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-sky-300/15 bg-[#0a1016] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between border-b border-sky-300/15 bg-sky-400/[0.06] px-4 py-2">
        <span className="text-xs font-semibold uppercase text-sky-100/70">{language || "code"}</span>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(code)}
          className="flex size-8 items-center justify-center rounded-md text-sky-100/60 transition hover:bg-sky-300/10 hover:text-sky-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sky-300/20"
          aria-label="Copy code"
        >
          <Copy className="size-4" />
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-sm leading-6">
        <code>{renderHighlightedCode(code)}</code>
      </pre>
    </div>
  );
}

function renderHighlightedCode(code: string) {
  return code.split("\n").map((line, lineIndex) => (
    <span key={`${line}-${lineIndex}`} className="block min-w-max">
      <span className="mr-4 inline-block w-6 select-none text-right text-sky-100/25">
        {lineIndex + 1}
      </span>
      {highlightCodeLine(line)}
    </span>
  ));
}

function highlightCodeLine(line: string) {
  const tokenPattern = /(\/\/.*|#.*|'[^']*'|"[^"]*"|`[^`]*`|\b(?:SELECT|FROM|WHERE|JOIN|INSERT|UPDATE|DELETE|CREATE|TABLE|public|private|protected|static|class|function|def|const|let|var|if|else|for|while|return|new|int|string|double|float|boolean|bool|void|async|await)\b|\b\d+(?:\.\d+)?\b|[{}()[\];,.=+\-*/<>!?:]+)/gi;
  const parts = line.split(tokenPattern).filter(Boolean);

  return parts.map((part, index) => {
    const className = getCodeTokenClass(part);
    return (
      <span key={`${part}-${index}`} className={className}>
        {part}
      </span>
    );
  });
}

function getCodeTokenClass(token: string) {
  if (/^(\/\/|#)/.test(token)) {
    return "text-emerald-300/65";
  }
  if (/^(['"`]).*\1$/.test(token)) {
    return "text-amber-200";
  }
  if (/^\d+(?:\.\d+)?$/.test(token)) {
    return "text-violet-200";
  }
  if (/^(SELECT|FROM|WHERE|JOIN|INSERT|UPDATE|DELETE|CREATE|TABLE|public|private|protected|static|class|function|def|const|let|var|if|else|for|while|return|new|int|string|double|float|boolean|bool|void|async|await)$/i.test(token)) {
    return "text-sky-200";
  }
  if (/^[{}()[\];,.=+\-*/<>!?:]+$/.test(token)) {
    return "text-white/50";
  }

  return "text-white/90";
}

function FormFeedback({ message }: { message: string | null }) {
  return <div className="mt-5 min-h-[1.25rem] text-sm text-rose-200">{message}</div>;
}

function DiscardDraftsModal({
  onCancel,
  onDiscard,
}: {
  onCancel: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[330] flex items-center justify-center bg-black/75 px-6 backdrop-blur-md">
      <div className="w-full max-w-[420px] rounded-[28px] border border-white/10 bg-[#050505] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-semibold text-white">Discard generated drafts?</h2>
        <p className="mt-2 text-sm leading-6 text-white/50">Generated cards that have not been saved to the deck will be lost.</p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:border-white/25"
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02]"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCardPage;
