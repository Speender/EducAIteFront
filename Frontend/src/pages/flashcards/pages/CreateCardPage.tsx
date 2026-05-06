import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { ArrowLeft, BrainCircuit, FileText, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import AiGenerationLoadingModal from "@/components/AiGenerationLoadingModal";
import { useToast } from "@/components/ToastProvider";
import {
  useCreateDeckFlashcardMutation,
  useFlashcardDetailQuery,
  useFlashcardWorkspaceLatestQuery,
  useGenerateDeckFlashcardsPdfPreviewMutation,
  useGenerateDeckFlashcardsPreviewMutation,
  useSaveGeneratedDeckFlashcardsMutation,
  useUpdateDeckFlashcardMutation,
  useWorkspaceSubDecksQuery,
} from "@/features/flashcards/api/hooks";
import type {
  CognitiveSkillDto,
  GeneratedFlashcardDraftDto,
  GenerateDeckFlashcardsPreviewResponseDto,
  LearningDomainDto,
} from "@/features/flashcards/api/dto";
import { getFlashcardDocumentCardsPath } from "@/features/flashcards/routes";
import { getErrorMessage } from "@/lib/api/errors";
import logo from "../../../assets/educAIte-logo.svg";

type CreateMode = "manual" | "ai";
type SourceMode = "text" | "file";

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

const acceptedSourceExtensions = ".pdf";
const sourceCharacterLimit = 20000;

export function CreateCardPage() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { majorDeckSqid, deckSqid } = useParams();
  const [searchParams] = useSearchParams();
  const editingFlashcardSqid = searchParams.get("flashcard");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<CreateMode>(editingFlashcardSqid ? "manual" : "manual");
  const [sourceMode, setSourceMode] = useState<SourceMode>("text");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [count, setCount] = useState(5);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceFileName, setSourceFileName] = useState("");
  const [drafts, setDrafts] = useState<GeneratedFlashcardDraftDto[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [previewInsights, setPreviewInsights] = useState<PreviewInsights | null>(null);
  const [previewSaveContext, setPreviewSaveContext] = useState<PreviewSaveContext | null>(null);

  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const subDecksQuery = useWorkspaceSubDecksQuery(majorDeckSqid ?? null);
  const flashcardQuery = useFlashcardDetailQuery(editingFlashcardSqid);
  const createFlashcardMutation = useCreateDeckFlashcardMutation(deckSqid ?? null);
  const updateFlashcardMutation = useUpdateDeckFlashcardMutation(editingFlashcardSqid, deckSqid ?? null);
  const generatePreviewMutation = useGenerateDeckFlashcardsPreviewMutation(deckSqid ?? null);
  const generatePdfPreviewMutation = useGenerateDeckFlashcardsPdfPreviewMutation(deckSqid ?? null);
  const saveGeneratedMutation = useSaveGeneratedDeckFlashcardsMutation(deckSqid ?? null);

  const selectedMajorDeck =
    (workspaceQuery.data?.decks ?? []).find((deck) => deck.majorDeckSqid === majorDeckSqid) ?? null;
  const selectedSubDeck =
    (subDecksQuery.data ?? []).find((subDeck) => subDeck.deckSqid === deckSqid) ?? null;
  const isManualSaving = createFlashcardMutation.isPending || updateFlashcardMutation.isPending;
  const isGenerating =
    generatePreviewMutation.isPending || generatePdfPreviewMutation.isPending;
  const currentError =
    generatePdfPreviewMutation.error ??
    generatePreviewMutation.error ??
    saveGeneratedMutation.error ??
    createFlashcardMutation.error ??
    updateFlashcardMutation.error;
  const hasValidCount = Number.isInteger(count) && count >= 1 && count <= 50;
  const canGenerate =
    hasValidCount &&
    !isGenerating &&
    (sourceMode === "text" ? Boolean(sourceText.trim()) : Boolean(sourceFile));

  useEffect(() => {
    if (!flashcardQuery.data) {
      return;
    }

    setQuestion(flashcardQuery.data.question);
    setAnswer(flashcardQuery.data.answer);
    setMode("manual");
  }, [flashcardQuery.data]);

  function goBackToDeck() {
    navigate(
      majorDeckSqid && deckSqid
        ? getFlashcardDocumentCardsPath(majorDeckSqid, deckSqid)
        : "/flashcards",
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
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

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

  function handleSourceModeChange(nextMode: SourceMode) {
    setSourceMode(nextMode);
    setFeedback(null);
    setWarnings([]);
    setDrafts([]);
    setPreviewInsights(null);
    setPreviewSaveContext(null);
  }

  function handleFileSelection(file: File | null | undefined) {
    if (!file) {
      return;
    }

    setSourceFile(file);
    setSourceFileName(file.name);
    setFeedback(null);
    setWarnings([]);
    setDrafts([]);
    setPreviewInsights(null);
    setPreviewSaveContext(null);
  }

  function applyPreview(preview: GenerateDeckFlashcardsPreviewResponseDto) {
    setDrafts(preview.items);
    setWarnings(preview.warnings);
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
  }

  async function handleGeneratePreview() {
    if (!canGenerate) {
      setFeedback(
        sourceMode === "file"
          ? "Select a PDF and keep the count between 1 and 50."
          : "Source material and a count from 1 to 50 are required.",
      );
      return;
    }

    setFeedback(null);

    if (sourceMode === "file") {
      if (!sourceFile) {
        setFeedback("Select a PDF file first.");
        return;
      }

      const preview = await generatePdfPreviewMutation.mutateAsync({
        file: sourceFile,
        count,
        itemTypes: [],
        technicalLanguage: null,
        programContext: null,
      });

      applyPreview(preview);
      return;
    }

    const preview = await generatePreviewMutation.mutateAsync({
      sourceText,
      count,
      itemTypes: [],
      learningDomain: "Unknown",
      cognitiveSkill: null,
      difficulty: 50,
      technicalLanguage: null,
      programContext: null,
    });

    applyPreview(preview);
  }

  async function handleSaveDrafts() {
    if (drafts.length === 0) {
      setFeedback("Generate at least one card before saving.");
      return;
    }

    setFeedback(null);

    try {
      await saveGeneratedMutation.mutateAsync({
        items: drafts,
        sourceNoteSqid: previewSaveContext?.sourceNoteSqid ?? null,
        sourceDocumentSqid: previewSaveContext?.sourceDocumentSqid ?? null,
      });
      showSuccess(`${drafts.length} generated flashcards saved.`);
      goBackToDeck();
    } catch (error) {
      setFeedback(getErrorMessage(error));
    }
  }

  function updateDraft(index: number, changes: Partial<GeneratedFlashcardDraftDto>) {
    const normalizedChanges = { ...changes };
    if (typeof changes.answer === "string" && changes.expectedAnswer === undefined) {
      normalizedChanges.expectedAnswer = changes.answer;
    }

    if (typeof changes.conceptExplanation === "string" && changes.explanation === undefined) {
      normalizedChanges.explanation = changes.conceptExplanation;
    }

    setDrafts((current) =>
      current.map((draft, draftIndex) =>
        draftIndex === index ? { ...draft, ...normalizedChanges } : draft,
      ),
    );
  }

  function removeDraft(index: number) {
    setDrafts((current) => current.filter((_, draftIndex) => draftIndex !== index));
  }

  return (
    <div className="min-h-screen bg-black px-6 pb-20 pt-10 font-sans text-white antialiased">
      <header className="mx-auto flex w-full max-w-[1320px] items-center gap-6">
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 transition-all hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <img src={logo} alt="educAIte" className="h-7 opacity-90" />
      </header>

      <main className="mx-auto mt-12 max-w-[1320px]">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#00CEC8]">
              {selectedSubDeck ? `${selectedSubDeck.title}${selectedMajorDeck ? ` | ${selectedMajorDeck.deckName}` : ""}` : "Current deck"}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
              {editingFlashcardSqid ? "Edit flashcard" : "Create flashcards"}
            </h1>
            {!editingFlashcardSqid ? (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                Write one card manually or let educAIte analyze source material and prepare a reviewable draft set for this deck.
              </p>
            ) : null}
          </div>

          {!editingFlashcardSqid ? (
            <div className="grid w-full max-w-[360px] grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
              <ModeButton active={mode === "manual"} onClick={() => setMode("manual")}>Manual</ModeButton>
              <ModeButton active={mode === "ai"} onClick={() => setMode("ai")}>AI Generate</ModeButton>
            </div>
          ) : null}
        </div>

        {mode === "manual" ? (
          <section className="max-w-[860px]">
            <div className="space-y-5">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Question"
                className="w-full rounded-[24px] border border-white/10 bg-white/[0.03] px-8 py-6 text-xl text-white outline-none transition-all placeholder:text-white/25 focus:border-[#00CEC8]/40 focus:bg-white/[0.05]"
              />

              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Answer"
                rows={6}
                className="w-full resize-none rounded-[24px] border border-white/10 bg-white/[0.03] px-8 py-6 text-xl text-white outline-none transition-all placeholder:text-white/25 focus:border-[#00CEC8]/40 focus:bg-white/[0.05]"
              />
            </div>

            <FormFeedback message={feedback || (currentError ? getErrorMessage(currentError) : null)} />

            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isManualSaving}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleManualSave}
                disabled={isManualSaving}
                className="rounded-full bg-[#00CEC8] px-6 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isManualSaving ? "Saving..." : "Save card"}
              </button>
            </div>
          </section>
        ) : (
          <section className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
            <div className="space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">Source setup</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Generate from text or PDF</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00CEC8]/25 bg-[#00CEC8]/10 text-[#00CEC8]">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid max-w-[420px] grid-cols-2 rounded-full border border-white/10 bg-black/40 p-1">
                  <ModeButton active={sourceMode === "text"} onClick={() => handleSourceModeChange("text")}>Plain text</ModeButton>
                  <ModeButton active={sourceMode === "file"} onClick={() => handleSourceModeChange("file")}>PDF upload</ModeButton>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <QuickStat label="Deck" value={selectedSubDeck?.title ?? "Current"} />
                  <QuickStat label="Count" value={`${count}`} />
                  <QuickStat label="Source" value={sourceMode === "file" ? "PDF analysis" : "Pasted text"} />
                </div>

                {sourceMode === "file" ? (
                  <div className="mt-5 space-y-4">
                    <FileDropZone
                      fileName={sourceFileName}
                      inputRef={fileInputRef}
                      isBusy={isGenerating}
                      onFile={handleFileSelection}
                    />
                    <p className="text-sm leading-6 text-white/45">
                      educAIte will submit the PDF directly to the AI pipeline, infer the best flashcard settings, and return a preview plus extracted text.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <label htmlFor="source-material" className="text-sm font-semibold text-white/70">
                        Source material
                      </label>
                      <span className="text-xs text-white/35">{sourceText.length}/{sourceCharacterLimit}</span>
                    </div>
                    <textarea
                      id="source-material"
                      value={sourceText}
                      onChange={(event) => setSourceText(event.target.value.slice(0, sourceCharacterLimit))}
                      placeholder="Paste notes, lesson content, code, reviewer feedback, or extracted document text."
                      rows={16}
                      className="w-full resize-none rounded-[28px] border border-white/10 bg-black/30 px-6 py-5 text-base leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-[#00CEC8]/40 focus:bg-white/[0.05]"
                    />
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#050505] p-5 sm:flex-row sm:items-end sm:justify-between">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white/70">Count</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={count}
                      onChange={(event) => setCount(Number(event.target.value))}
                      className="h-12 w-32 rounded-[18px] border border-white/10 bg-white px-4 text-black outline-none transition focus:border-[#00CEC8]"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePreview}
                    disabled={!canGenerate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00CEC8] px-7 text-sm font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Sparkles className="h-4 w-4" />
                    {sourceMode === "file" ? "Analyze PDF and preview" : "Generate preview"}
                  </button>
                </div>

                {warnings.length > 0 ? (
                  <div className="mt-5 rounded-[22px] border border-amber-300/15 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
                    {warnings.join(" ")}
                  </div>
                ) : null}

                <FormFeedback message={feedback || (currentError ? getErrorMessage(currentError) : null)} />
              </div>

              <InferencePanel insights={previewInsights} sourceMode={sourceMode} />

              {sourceMode === "file" && sourceText.trim() ? (
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">Extracted preview</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">AI-read source text</h3>
                    </div>
                    <span className="text-xs text-white/35">{sourceText.length}/{sourceCharacterLimit}</span>
                  </div>
                  <textarea
                    value={sourceText}
                    readOnly
                    rows={12}
                    className="w-full resize-none rounded-[24px] border border-white/10 bg-black/30 px-5 py-4 text-sm leading-7 text-white/78 outline-none"
                  />
                </div>
              ) : null}
            </div>

            <GeneratedDraftPanel
              drafts={drafts}
              isSaving={saveGeneratedMutation.isPending}
              onUpdate={updateDraft}
              onRemove={removeDraft}
              onSave={handleSaveDrafts}
            />
          </section>
        )}
      </main>

      <AiGenerationLoadingModal
        open={isGenerating}
        title={sourceMode === "file" ? "Analyzing PDF and generating flashcards" : "Generating flashcards"}
        subtitle={
          sourceMode === "file"
            ? "educAIte is reading your PDF, inferring the content profile, and drafting cards."
            : "educAIte is turning your source material into draft cards."
        }
        stages={
          sourceMode === "file"
            ? [
                { label: "Uploading PDF", description: "Sending the selected document to the smart quiz pipeline." },
                { label: "Analyzing source", description: "Extracting content and inferring the best flashcard settings." },
                { label: "Writing drafts", description: "Preparing reviewable flashcards for this deck." },
              ]
            : [
                { label: "Reading source", description: "Finding the most important concepts." },
                { label: "Writing questions", description: "Creating clear prompts from the material." },
                { label: "Checking answers", description: "Preparing draft cards for review." },
              ]
        }
      />

      {showDiscardModal ? (
        <DiscardDraftsModal
          onCancel={() => setShowDiscardModal(false)}
          onDiscard={goBackToDeck}
        />
      ) : null}
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-white text-black"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/35 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">{label}</p>
      <p className="mt-2 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function FileDropZone({
  fileName,
  inputRef,
  isBusy,
  onFile,
}: {
  fileName: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isBusy: boolean;
  onFile: (file: File | null | undefined) => void;
}) {
  return (
    <div
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
        className="flex w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/10 bg-black/30 px-6 py-10 text-center transition hover:border-[#00CEC8]/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <UploadCloud className="h-10 w-10 text-[#00CEC8]" />
        <p className="mt-4 text-lg font-semibold text-white">
          {fileName || "Drop a PDF file"}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
          PDF only
        </p>
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

function InferencePanel({
  insights,
  sourceMode,
}: {
  insights: PreviewInsights | null;
  sourceMode: SourceMode;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">AI inference</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Effective generation settings</h3>
        </div>
        <Sparkles className="h-5 w-5 text-[#00CEC8]" />
      </div>

      {!insights ? (
        <div className="rounded-[24px] border border-dashed border-white/10 px-5 py-8 text-sm leading-6 text-white/45">
          {sourceMode === "file"
            ? "Upload a PDF and run a preview to inspect the AI-inferred domain, cognitive skill, language, and item types."
            : "Generate a preview to inspect the AI-inferred domain, cognitive skill, language, and item types."}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <InsightCard label="Learning domain" value={insights.effectiveLearningDomain} />
            <InsightCard label="Cognitive skill" value={insights.effectiveCognitiveSkill} />
            <InsightCard
              label="Technical language"
              value={insights.effectiveTechnicalLanguage || "Not specified"}
            />
            <InsightCard
              label="Confidence"
              value={`${Math.round((insights.inferenceConfidence || 0) * 100)}%`}
            />
          </div>

          <div className="mt-4 rounded-[24px] border border-white/10 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Item types</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(insights.effectiveItemTypes.length > 0
                ? insights.effectiveItemTypes
                : ["Flashcard"]
              ).map((itemType) => (
                <span
                  key={itemType}
                  className="rounded-full border border-[#00CEC8]/25 bg-[#00CEC8]/10 px-3 py-1 text-xs font-bold text-[#00CEC8]"
                >
                  {itemType}
                </span>
              ))}
            </div>
          </div>

          {insights.inferenceReason ? (
            <div className="mt-4 rounded-[24px] border border-white/10 bg-black/30 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Reason</p>
              <p className="mt-3 text-sm leading-6 text-white/70">{insights.inferenceReason}</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function InsightCard({
  label,
  value,
}: {
  label: string;
  value: LearningDomainDto | CognitiveSkillDto | string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">{label}</p>
      <p className="mt-3 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function GeneratedDraftPanel({
  drafts,
  isSaving,
  onUpdate,
  onRemove,
  onSave,
}: {
  drafts: GeneratedFlashcardDraftDto[];
  isSaving: boolean;
  onUpdate: (index: number, changes: Partial<GeneratedFlashcardDraftDto>) => void;
  onRemove: (index: number) => void;
  onSave: () => void;
}) {
  return (
    <div className="min-h-[520px] rounded-[32px] border border-white/10 bg-[#050505] p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Generated preview</h2>
          <p className="mt-1 text-sm text-white/45">Edit or remove drafts before saving them to the deck.</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={drafts.length === 0 || isSaving}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSaving ? "Saving..." : `Save ${drafts.length || ""}`.trim()}
        </button>
      </div>

      {drafts.length === 0 ? (
        <div className="flex min-h-[390px] flex-col items-center justify-center rounded-[26px] border border-dashed border-white/10 px-8 text-center text-white/45">
          <FileText className="mb-4 h-10 w-10 text-white/25" />
          <p className="text-lg font-semibold text-white/70">No generated cards yet</p>
          <p className="mt-2 max-w-sm text-sm">Add source material, set a count, and generate a preview.</p>
        </div>
      ) : (
        <div className="max-h-[820px] space-y-4 overflow-y-auto pr-1">
          {drafts.map((draft, index) => (
            <div key={`${draft.question}-${index}`} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full border border-[#00CEC8]/25 px-3 py-1 text-xs font-bold text-[#00CEC8]">
                  {draft.itemType}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="rounded-full border border-rose-400/20 p-2 text-rose-200 transition hover:border-rose-300/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={draft.question}
                onChange={(event) => onUpdate(index, { question: event.target.value })}
                rows={2}
                className="mb-3 w-full resize-none rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-[#00CEC8]/35"
              />
              <textarea
                value={draft.answer}
                onChange={(event) => onUpdate(index, { answer: event.target.value })}
                rows={3}
                className="w-full resize-none rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#00CEC8] outline-none focus:border-[#00CEC8]/35"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
