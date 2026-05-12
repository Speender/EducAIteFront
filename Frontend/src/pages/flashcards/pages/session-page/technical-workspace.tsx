import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CopyIcon,
  XIcon,
  Maximize2Icon,
  PlayIcon,
  RotateCcwIcon,
  SendHorizonalIcon,
  TerminalSquareIcon,
  GripHorizontalIcon,
  XCircleIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type {
  ExecuteFlashcardCodeResponseDto,
  FlashcardFrontendReviewResponseDto,
  FlashcardResponseDto,
  FlashcardStudyCoachRecapResponseDto,
} from "@/features/flashcards/api/dto";
import { cn } from "@/lib/utils";
import aimpatinEncouraging from "../../../../assets/aimpatin-encouraging.svg";
import aimpatinHappy from "../../../../assets/aimpatin-happy.svg";
import aimpatinProud from "../../../../assets/aimpatin-proud.svg";
import aimpatinSad from "../../../../assets/aimpatin-sad.svg";
import aimpatinThinking from "../../../../assets/aimpatin-thinking.svg";
import {
  type ExecutionTestCase,
  type RuntimeLanguage,
  type ToneClasses,
  formatExecutionOutcome,
  formatTestValue,
  getExecutionOutcomeClasses,
  normalizeItemType,
} from "./runtime";

const AIMPATIN_COACH_HIDDEN_STORAGE_KEY = "educaite:flashcards:aimpatin-coach-hidden";

type TechnicalWorkspaceProps = {
  flashcard: FlashcardResponseDto | null;
  currentQuestion: string;
  progressCurrent: number;
  progressTotal: number;
  itemLabel: string;
  isLoading: boolean;
  isRunnable: boolean;
  isCodeReading: boolean;
  code: string;
  onCodeChange: (value: string) => void;
  answerText: string;
  onAnswerTextChange: (value: string) => void;
  selectedLanguage: RuntimeLanguage | "";
  onLanguageChange: (value: RuntimeLanguage) => void;
  supportedLanguages: RuntimeLanguage[];
  referenceSnippet: string;
  visibleTests: ExecutionTestCase[];
  hiddenTestsCount: number;
  executionResult: ExecuteFlashcardCodeResponseDto | null;
  review: FlashcardFrontendReviewResponseDto | null;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
  isSubmitting: boolean;
  isRestarting: boolean;
  canAdvance: boolean;
  reviewToneClasses: ToneClasses;
  sessionReviewMessage?: string;
  sessionReviewTone?: "correct" | "repeat";
};

export function TechnicalWorkspace({
  flashcard,
  currentQuestion,
  progressCurrent,
  progressTotal,
  itemLabel,
  isLoading,
  isRunnable,
  isCodeReading,
  code,
  onCodeChange,
  answerText,
  onAnswerTextChange,
  selectedLanguage,
  onLanguageChange,
  supportedLanguages,
  referenceSnippet,
  visibleTests,
  hiddenTestsCount,
  executionResult,
  review,
  onSubmit,
  onNext,
  onRestart,
  isSubmitting,
  isRestarting,
  canAdvance,
  reviewToneClasses,
  sessionReviewMessage,
  sessionReviewTone,
}: TechnicalWorkspaceProps) {
  const [sidebarTab, setSidebarTab] = useState<"prompt" | "guidance" | "examples">("prompt");
  const [isEditorFullscreenOpen, setIsEditorFullscreenOpen] = useState(false);
  const hasHiddenTests = hiddenTestsCount > 0;
  const monacoLanguage = mapRuntimeLanguageToMonaco(selectedLanguage || flashcard?.technicalLanguage);
  const showConsole = !isCodeReading;
  const isOutputPrediction = normalizeItemType(flashcard?.itemType ?? itemLabel) === "OutputPrediction";

  const [consoleHeight, setConsoleHeight] = useState(180);
  const [isResizing, setIsResizing] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !workspaceRef.current) return;

      const containerRect = workspaceRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const mouseOffsetFromTop = e.clientY - containerRect.top;
      
      // Calculate height from bottom while preserving a usable editor area.
      const newConsoleHeight = containerHeight - mouseOffsetFromTop;
      const minConsoleHeight = 96;
      const minEditorHeight = 340;
      const maxConsoleHeight = Math.max(minConsoleHeight, containerHeight - minEditorHeight);
      const nextConsoleHeight = Math.min(Math.max(newConsoleHeight, minConsoleHeight), maxConsoleHeight);

      if (Number.isFinite(nextConsoleHeight)) {
        setConsoleHeight(nextConsoleHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isResizing]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 lg:gap-5">
      <div className="shrink-0 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] p-4 shadow-2xl backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge className="border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{itemLabel}</Badge>
              {flashcard?.technicalLanguage && <Badge variant="outline" className="border-white/10 text-xs text-white/60">{flashcard.technicalLanguage}</Badge>}
            </div>
            <div className="text-2xl font-semibold tracking-tight text-white">Technical Session</div>
            <div className="text-sm text-white/45">Card {progressCurrent} of {progressTotal}</div>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
            <div className="w-full min-w-0 sm:min-w-64">
              <div className="mb-2 flex justify-between text-xs font-medium text-white/45"><span>Progress</span><span>{Math.round((progressCurrent / progressTotal) * 100)}%</span></div>
              <Progress value={(progressCurrent / progressTotal) * 100} className="h-1.5 bg-white/5" />
            </div>
            <Button variant="outline" className="w-full rounded-full border-white/10 bg-white/5 px-6 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white sm:w-auto" onClick={onRestart} disabled={isRestarting}>
              <RotateCcwIcon data-icon="inline-start" /> Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="grid min-h-[680px] flex-1 w-full min-w-0 grid-cols-1 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] shadow-2xl lg:min-h-[calc(100dvh-10.5rem)] lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
        <aside className="flex min-h-0 min-w-0 flex-col border-b border-white/10 bg-[#0c0c0c] lg:border-b-0 lg:border-r">
          <div className="flex gap-2 border-b border-white/10 bg-white/[0.01] p-4">
            <SectionTabButton label="Problem" active={sidebarTab === "prompt"} onClick={() => setSidebarTab("prompt")} />
            <SectionTabButton label="Guidance" active={sidebarTab === "guidance"} onClick={() => setSidebarTab("guidance")} />
            <SectionTabButton label="Tests" active={sidebarTab === "examples"} onClick={() => setSidebarTab("examples")} />
          </div>
          <ScrollArea className="min-h-0 flex-1 p-4 sm:p-6 lg:p-8">
            {sidebarTab === "prompt" && (
              <div className="space-y-8">
                <TechnicalPromptPanel
                  currentQuestion={currentQuestion}
                  referenceSnippet={referenceSnippet}
                  isLoading={isLoading}
                  technicalLanguage={flashcard?.technicalLanguage}
                  isOutputPrediction={isOutputPrediction}
                />
                <Alert className="border-white/10 bg-white/[0.03]">
                  <AlertCircleIcon className="size-4 text-primary" />
                  <AlertTitle className="text-white">Submit runs Judge0 validation</AlertTitle>
                  <AlertDescription className="text-white/65">
                    Submit executes compilation/runtime checks and final AI evaluation in one step. Hidden tests, if present, are evaluated server-side.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {sidebarTab === "guidance" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary/80">Key Insight</p>
                  <p className="text-sm leading-relaxed text-white/70">{flashcard?.conceptExplanation || "No system documentation available for this card."}</p>
                </div>
                <Separator className="bg-white/5" />
                <div className="space-y-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Guidance</p>
                  <p className="text-sm leading-relaxed text-white/60">{flashcard?.answeringGuidance || "Analyze the logic flow and provide a clear, deterministic explanation."}</p>
                </div>
                {hasHiddenTests && (
                  <>
                    <Separator className="bg-white/5" />
                    <div className="space-y-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-white/50">Submission Policy</p>
                      <p className="text-sm leading-relaxed text-white/60">
                        This item has {hiddenTestsCount} hidden test{hiddenTestsCount === 1 ? "" : "s"}. Their details stay private and only their aggregate result is shown after submission.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            {sidebarTab === "examples" && <VisibleTestsPanel tests={visibleTests} hiddenTestsCount={hiddenTestsCount} />}
          </ScrollArea>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-[#0a0a0a]">
          <div className="flex min-h-14 min-w-0 flex-wrap items-center justify-between gap-3 overflow-hidden border-b border-white/10 bg-white/[0.02] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 text-xs font-medium text-white/55">
              <div className="size-2 animate-pulse rounded-full bg-primary" />
              {isRunnable ? "Execution Environment" : "Logic Analysis"}
            </div>
          </div>

          <div ref={workspaceRef} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div 
              className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", isRunnable ? "bg-[#18181A]" : "bg-[#0f172a]")}
              style={{ minHeight: isRunnable ? "340px" : "120px" }}
            >
              {isRunnable ? (
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#18181A]">
                  <div className="flex shrink-0 flex-col gap-3 border-b border-white/10 px-4 pt-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-white/10 bg-[#242427] px-5 py-2.5 text-sm font-medium text-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD43B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                      </svg>
                      Code Editor
                    </div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 sm:justify-end">
                      {executionResult && (
                        <Badge
                          className={cn(
                            "h-8 rounded-full border px-3 font-semibold uppercase tracking-[0.18em]",
                            getExecutionOutcomeClasses(executionResult).badge,
                          )}
                        >
                          {formatExecutionOutcome(executionResult)}
                        </Badge>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-full border-white/10 bg-[#242427] px-4 text-[11px] text-white/80 hover:bg-white/10"
                        onClick={() => setIsEditorFullscreenOpen(true)}
                      >
                        Full Screen
                      </Button>
                      <Select value={selectedLanguage} onValueChange={(value) => onLanguageChange(value as RuntimeLanguage)}>
                        <SelectTrigger className="h-8 min-w-[132px] rounded-full border-white/10 bg-[#242427] px-4 font-mono text-[11px] uppercase tracking-widest text-white/75">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#18181A] font-mono text-[11px] text-white">
                          <SelectGroup>
                            {supportedLanguages.map((language) => (
                              <SelectItem key={language} value={language} className="uppercase tracking-widest">
                                {language}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="min-h-[340px] flex-1 overflow-hidden rounded-b-2xl">
                    <Editor
                      height="100%"
                      language={monacoLanguage}
                      value={code}
                      onChange={(value) => onCodeChange(value ?? "")}
                      options={{
                        readOnly: canAdvance,
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineHeight: 22,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        wordWrapColumn: 100,
                        wrappingIndent: "same",
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                        parameterHints: { enabled: true },
                        tabCompletion: "on",
                        formatOnType: false,
                        formatOnPaste: false,
                        automaticLayout: true,
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                          alwaysConsumeMouseWheel: false,
                        },
                        padding: { top: 14, bottom: 14 },
                      }}
                      theme="vs-dark"
                    />
                  </div>
                </div>
              ) : (
                <div className={cn("flex-1 overflow-auto", isOutputPrediction ? "bg-[#050505] p-5 sm:p-8" : "p-8")}>
                  <Textarea
                    value={answerText}
                    onChange={(event) => onAnswerTextChange(event.target.value)}
                    className={cn(
                      "h-full min-h-[400px] w-full resize-none text-lg leading-relaxed text-white transition-colors",
                      isOutputPrediction
                        ? "rounded-2xl border-primary/20 bg-primary/[0.045] p-5 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] placeholder:text-primary/30 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                        : "border-none bg-transparent p-0 placeholder:text-white/5 focus-visible:ring-0",
                    )}
                    placeholder={isOutputPrediction ? "Predict the exact output and explain the trace..." : "Enter your logical analysis here..."}
                    disabled={canAdvance}
                  />
                </div>
              )}
            </div>

            {showConsole && (
              <>
                <div 
                  className={cn(
                    "group relative z-20 flex h-2 w-full shrink-0 cursor-ns-resize items-center justify-center transition-colors hover:bg-primary/30",
                    isResizing && "bg-primary/40"
                  )}
                  onMouseDown={startResizing}
                >
                  <div className="flex h-1 w-12 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-primary/50">
                    <GripHorizontalIcon className="size-3 text-white/20 group-hover:text-primary/50" />
                  </div>
                </div>
                <div 
                   className="flex shrink-0 flex-col border-t border-white/10 bg-[#0c0c0c] shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
                  style={{ height: `${consoleHeight}px`, minHeight: "96px" }}
                >
                  <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.01] px-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/50">Judge0 Results</p>
                    <div className="flex gap-2">
                      <div className="size-2 rounded-full bg-rose-500/40" />
                      <div className="size-2 rounded-full bg-amber-500/40" />
                      <div className="size-2 rounded-full bg-emerald-500/40" />
                    </div>
                  </div>
                  <ScrollArea className="min-h-0 flex-1 p-4 font-mono text-[13px] md:p-5">
                    {executionResult || review ? (
                      <div className="space-y-6">
                        {executionResult && <SandboxResultPanel result={executionResult} />}
                        <ReviewPanel
                          review={review}
                          reviewToneClasses={reviewToneClasses}
                          sessionReviewMessage={sessionReviewMessage}
                          sessionReviewTone={sessionReviewTone}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 py-10 opacity-20">
                        <TerminalSquareIcon className="size-8" />
                        <p className="text-xs font-medium tracking-wide text-white/50">Submit code to see Judge0 execution feedback.</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[0.02] p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-end">
            <div className="text-xs font-medium text-white/45 lg:mr-auto">
              <span className="animate-pulse text-emerald-400/70">Secure engine connected</span>
            </div>
            {canAdvance ? (
              <Button size="lg" className="h-12 w-full rounded-2xl bg-primary px-10 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] sm:w-auto" onClick={onNext}>Next</Button>
            ) : (
              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button size="lg" className="h-12 w-full rounded-2xl bg-primary px-10 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] sm:w-auto" onClick={onSubmit} disabled={isSubmitting || (isRunnable ? !code.trim() : !answerText.trim())}>
                  {isSubmitting ? <Spinner data-icon="inline-start" /> : <SendHorizonalIcon data-icon="inline-start" />} {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Dialog open={isEditorFullscreenOpen} onOpenChange={setIsEditorFullscreenOpen}>
        <DialogContent showCloseButton={false} className="z-50 h-[86vh] w-[96vw] max-w-[96vw] overflow-hidden border-white/20 bg-[#090b11]/95 p-0 text-white shadow-[0_30px_120px_rgba(0,0,0,0.75)] backdrop-blur-xl md:h-[76vh] md:w-[82vw] md:max-w-[1400px] md:min-w-[960px]">
          <div className="flex h-full w-full min-h-0 flex-col">
            <DialogHeader className="flex h-14 shrink-0 flex-row items-center justify-between border-b border-white/10 px-5 sm:px-6">
              <DialogTitle className="text-xl font-semibold tracking-tight text-white">Code Editor Full Screen</DialogTitle>
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                  <XIcon className="size-4" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <div className="flex min-h-0 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-2.5 sm:px-6">
              <div className="text-sm font-medium text-white/75">Language</div>
              <Select value={selectedLanguage} onValueChange={(value) => onLanguageChange(value as RuntimeLanguage)}>
                <SelectTrigger className="h-10 w-[180px] rounded-xl border-white/15 bg-white/5 text-sm text-white/85">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="border-white/15 bg-[#0a0a0a] text-sm text-white">
                  <SelectGroup>
                    {supportedLanguages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(30,110,255,0.16),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(8,58,160,0.18),transparent_45%),#0b1222] p-3 sm:p-4">
              <div className="h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
                <Editor
                  height="100%"
                  language={monacoLanguage}
                  value={code}
                  onChange={(value) => onCodeChange(value ?? "")}
                  options={{
                    readOnly: canAdvance,
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineHeight: 28,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
                    scrollBeyondLastLine: false,
                    wordWrap: "off",
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                    parameterHints: { enabled: true },
                    tabCompletion: "on",
                    formatOnType: false,
                    formatOnPaste: false,
                    automaticLayout: true,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                      alwaysConsumeMouseWheel: false,
                    },
                    padding: { top: 14, bottom: 14 },
                  }}
                  theme="vs-dark"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ReviewPanel({
  review,
  reviewToneClasses,
  sessionReviewMessage,
  sessionReviewTone,
}: {
  review: FlashcardFrontendReviewResponseDto | null;
  reviewToneClasses: ToneClasses;
  sessionReviewMessage?: string;
  sessionReviewTone?: "correct" | "repeat";
}) {
  if (!review) return null;

  return (
    <Card className={cn("overflow-hidden rounded-3xl border bg-[#0a0a0a] shadow-2xl", reviewToneClasses.border, reviewToneClasses.background)}>
      <CardHeader className="gap-3 pb-4">
        {sessionReviewMessage && (
          <div
            className={cn(
              "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
              sessionReviewTone === "correct"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
                : "border-amber-500/20 bg-amber-500/10 text-amber-100",
            )}
          >
            {sessionReviewTone === "correct" ? (
              <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-300" />
            ) : (
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-amber-300" />
            )}
            <p className="leading-relaxed">{sessionReviewMessage}</p>
          </div>
        )}
        <Badge className={cn("w-fit text-xs font-medium uppercase tracking-wide", reviewToneClasses.badge)}>
          {review.verdict}
        </Badge>
        <CardTitle className="text-xl font-semibold tracking-tight text-white">AI Evaluation</CardTitle>
        <CardDescription className="font-medium leading-relaxed text-white/80">{review.answerReview}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pb-8 pt-2">
        {review.conceptExplanation && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">Concept Insight</p>
            <p className="border-l-2 border-primary/20 pl-4 text-sm leading-relaxed text-white/70">{review.conceptExplanation}</p>
          </div>
        )}
        {review.missingPart && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-rose-300/80">Missing Parts</p>
            <p className="border-l-2 border-rose-500/20 pl-4 text-sm leading-relaxed text-rose-200/60">{review.missingPart}</p>
          </div>
        )}
        {review.misconception && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-300/80">Likely Misconception</p>
            <p className="border-l-2 border-amber-500/20 pl-4 text-sm leading-relaxed text-amber-100/60">{review.misconception}</p>
          </div>
        )}
        {review.technicalDiagnostics && (
          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex flex-wrap gap-2">
              {review.technicalDiagnostics.language && (
                <Badge variant="outline" className="border-white/10 text-white/60">
                  {review.technicalDiagnostics.language}
                </Badge>
              )}
              <Badge variant="outline" className="border-white/10 text-white/60">Deterministic diagnostics</Badge>
            </div>
            {review.technicalDiagnostics.expectedBehavior && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-white/50">Expected Behavior</p>
                <p className="text-sm leading-relaxed text-white/70">{review.technicalDiagnostics.expectedBehavior}</p>
              </div>
            )}
            {review.technicalDiagnostics.actualBehavior && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-white/50">Actual Behavior</p>
                <p className="text-sm leading-relaxed text-white/70">{review.technicalDiagnostics.actualBehavior}</p>
              </div>
            )}
            {review.technicalDiagnostics.issues?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Issues</p>
                <div className="flex flex-wrap gap-2">
                  {review.technicalDiagnostics.issues.map((issue) => (
                    <Badge key={issue} variant="outline" className="border-rose-500/20 bg-rose-500/10 text-rose-200/80">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {review.rubricFeedback?.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">Rubric Breakdown</p>
            <div className="space-y-3">
              {review.rubricFeedback.map((entry, index) => (
                <div key={`${entry.criterion}-${index}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{entry.criterion || `Criterion ${index + 1}`}</p>
                    {typeof entry.score === "number" && (
                      <Badge variant="outline" className="border-white/10 text-white/60">
                        {entry.score}
                      </Badge>
                    )}
                  </div>
                  {entry.feedback && <p className="mt-2 text-sm leading-relaxed text-white/65">{entry.feedback}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AImpatinSessionCoach({
  flashcard,
  fallbackQuestion,
  review,
  sessionReviewTone,
  hasStudentInput,
}: {
  flashcard?: FlashcardResponseDto | null;
  fallbackQuestion?: string;
  review: FlashcardFrontendReviewResponseDto | null;
  sessionReviewTone?: "correct" | "repeat";
  hasStudentInput?: boolean;
}) {
  const profile = getAImpatinAnswerProfile(review?.resultTone, sessionReviewTone);
  const phrases = useMemo(
    () => buildAImpatinAnswerPhrases({ flashcard, fallbackQuestion, review, sessionReviewTone, hasStudentInput }),
    [fallbackQuestion, flashcard, hasStudentInput, review, sessionReviewTone],
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(readAImpatinCoachHiddenPreference);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setPhraseIndex(0);
    setIsExpanded(false);
  }, [fallbackQuestion, flashcard?.sqid, review?.answerReview, review?.resultTone, sessionReviewTone]);

  const currentPhrase = phrases[phraseIndex % phrases.length] ?? profile.fallbackPhrase;
  const dotCount = Math.min(phrases.length, 4);
  const activeDotIndex = (phraseIndex % phrases.length) % dotCount;
  const setCoachHidden = (nextValue: boolean) => {
    setIsHidden(nextValue);
    writeAImpatinCoachHiddenPreference(nextValue);
  };

  if (isHidden) {
    return (
      <button
        type="button"
        onClick={() => setCoachHidden(false)}
        className="group flex w-full max-w-[18rem] items-center gap-2 rounded-full border border-cyan-200/40 bg-[#ecfbff] px-3 py-2 text-left text-sm font-bold text-[#102f36] shadow-[0_16px_34px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] motion-reduce:transition-none lg:fixed lg:left-6 lg:top-24 lg:z-40"
        aria-label="Show AImpatin coach"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-950">
          <img
            src={aimpatinThinking}
            alt=""
            className="size-8 transition group-hover:rotate-[-4deg] group-hover:scale-105 motion-reduce:transition-none"
          />
        </span>
        Show AImpatin
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-end justify-start gap-0 overflow-visible py-1 transition-[width] duration-300 motion-reduce:transition-none lg:fixed lg:left-6 lg:top-24 lg:z-40 lg:max-w-[calc(100vw-3rem)] lg:py-0",
        isExpanded ? "lg:w-[560px]" : "lg:w-[390px]",
      )}
    >
      <button
        type="button"
        onClick={() => setPhraseIndex((current) => (current + 1) % phrases.length)}
        className="group relative z-10 -mr-3 flex size-20 shrink-0 items-center justify-center self-end rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:size-24"
        aria-label={review ? "Hear another AImpatin encouragement" : "Ask AImpatin for a hint"}
      >
        <span
          className={cn(
            "absolute inset-1 rounded-full blur-xl opacity-45 transition duration-300 group-hover:opacity-80 motion-reduce:transition-none",
            profile.glowClassName,
          )}
        />
        <span className={cn("absolute inset-3 rounded-full border", profile.ringClassName)} />
        <img
          src={profile.asset}
          alt="AImpatin study coach"
          className="relative size-16 drop-shadow-2xl transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-4deg] group-hover:scale-105 motion-safe:animate-[aimpatin-float_4s_ease-in-out_infinite] motion-reduce:transition-none sm:size-20"
        />
      </button>
      <div
        className={cn(
          "relative min-w-0 flex-1 rounded-[1.35rem] border px-5 py-4 pl-7 text-left shadow-[0_18px_38px_rgba(0,0,0,0.22)]",
          profile.bubbleClassName,
        )}
        aria-live="polite"
      >
        <span
          className={cn(
            "absolute -left-2 bottom-6 size-4 rotate-45 border-b border-l",
            profile.tailClassName,
          )}
        />
        <div className="flex items-start justify-between gap-3">
          <p className={cn("pt-1 text-[11px] font-black uppercase", profile.labelClassName)}>AImpatin coach</p>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-bold transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none",
                profile.controlClassName,
              )}
            >
              {isExpanded ? "Compact" : "Expand"}
            </button>
            <button
              type="button"
              onClick={() => setCoachHidden(true)}
              className={cn(
                "flex size-7 items-center justify-center rounded-full border transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none",
                profile.controlClassName,
              )}
              aria-label="Hide AImpatin coach"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        </div>
        <p className={cn("mt-1 break-words font-bold", isExpanded ? "text-lg leading-8" : "text-base leading-7 sm:text-lg")}>
          {currentPhrase}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className={cn("text-xs font-medium leading-5", profile.hintClassName)}>
            {review ? "Tap the mascot for another quick nudge." : "Tap the mascot for a hint or a challenge check."}
          </p>
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: dotCount }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  index === activeDotIndex ? profile.activeDotClassName : profile.inactiveDotClassName,
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getAImpatinAnswerProfile(
  resultTone?: FlashcardFrontendReviewResponseDto["resultTone"],
  sessionReviewTone?: "correct" | "repeat",
) {
  if (sessionReviewTone === "correct" || resultTone === "correct") {
    return {
      asset: aimpatinHappy,
      glowClassName: "bg-emerald-400",
      ringClassName: "border-emerald-200/70 bg-emerald-950/80",
      bubbleClassName: "border-emerald-200 bg-[#f0fff7] text-[#123829]",
      tailClassName: "border-emerald-200 bg-[#f0fff7]",
      labelClassName: "text-emerald-800/60",
      hintClassName: "text-emerald-950/55",
      controlClassName: "border-emerald-700/15 text-emerald-950/70",
      activeDotClassName: "bg-emerald-700",
      inactiveDotClassName: "bg-emerald-700/20",
      fallbackPhrase: "Good job. You cleared this card.",
    };
  }

  if (resultTone === "close" || resultTone === "partial") {
    return {
      asset: aimpatinEncouraging,
      glowClassName: "bg-amber-300",
      ringClassName: "border-amber-200/70 bg-amber-950/80",
      bubbleClassName: "border-amber-200 bg-[#fff8e7] text-[#382709]",
      tailClassName: "border-amber-200 bg-[#fff8e7]",
      labelClassName: "text-amber-800/60",
      hintClassName: "text-amber-950/55",
      controlClassName: "border-amber-700/15 text-amber-950/70",
      activeDotClassName: "bg-amber-700",
      inactiveDotClassName: "bg-amber-700/20",
      fallbackPhrase: "Good job. You are close, but one part still needs practice.",
    };
  }

  if (resultTone) {
    return {
      asset: aimpatinSad,
      glowClassName: "bg-sky-300",
      ringClassName: "border-sky-200/70 bg-sky-950/80",
      bubbleClassName: "border-sky-200 bg-[#eff9ff] text-[#102c3d]",
      tailClassName: "border-sky-200 bg-[#eff9ff]",
      labelClassName: "text-sky-800/60",
      hintClassName: "text-sky-950/55",
      controlClassName: "border-sky-700/15 text-sky-950/70",
      activeDotClassName: "bg-sky-700",
      inactiveDotClassName: "bg-sky-700/20",
      fallbackPhrase: "Good job trying. I will help you review this again.",
    };
  }

  return {
    asset: aimpatinThinking,
    glowClassName: "bg-cyan-300",
    ringClassName: "border-cyan-200/70 bg-cyan-950/80",
    bubbleClassName: "border-cyan-200 bg-[#ecfbff] text-[#102f36]",
    tailClassName: "border-cyan-200 bg-[#ecfbff]",
    labelClassName: "text-cyan-800/60",
    hintClassName: "text-cyan-950/55",
    controlClassName: "border-cyan-700/15 text-cyan-950/70",
    activeDotClassName: "bg-cyan-700",
    inactiveDotClassName: "bg-cyan-700/20",
    fallbackPhrase: "Need a hint, or are you really sure?",
  };
}

function buildAImpatinAnswerPhrases({
  flashcard,
  fallbackQuestion,
  review,
  sessionReviewTone,
  hasStudentInput,
}: {
  flashcard?: FlashcardResponseDto | null;
  fallbackQuestion?: string;
  review: FlashcardFrontendReviewResponseDto | null;
  sessionReviewTone?: "correct" | "repeat";
  hasStudentInput?: boolean;
}) {
  if (!review) {
    const guidance = firstNonBlankText(flashcard?.answeringGuidance);
    const topic = firstNonBlankText(flashcard?.technicalLanguage, flashcard?.learningDomain, flashcard?.itemType);
    const phrases = [
      "Need a hint, or are you really sure?",
      hasStudentInput
        ? "Are you really sure? Read the question one more time before submitting."
        : "I am watching this card with you. Tap me if you want a hint.",
      guidance
        ? `Hint: ${normalizeAImpatinPhrase(guidance)}`
        : `Hint: focus on what the question is asking, not just the first keyword you notice.`,
      topic
        ? `Tiny clue: this card is about ${normalizeAImpatinPhrase(topic)}.`
        : `Tiny clue: answer the main idea first, then add the detail.`,
    ];

    if (fallbackQuestion) {
      phrases.push(`Challenge check: can your answer directly satisfy "${normalizeAImpatinPhrase(fallbackQuestion)}"?`);
    }

    return phrases;
  }

  const phrases =
    sessionReviewTone === "correct" || review.resultTone === "correct"
      ? ["Good job. You cleared this card.", "Nice progress. Keep that recall active."]
      : review.resultTone === "close" || review.resultTone === "partial"
        ? [
            "Good job. You are close, but one detail still needs practice.",
            "Almost there. Fix the missing piece and you will get it next time.",
          ]
        : [
            "Good job trying. I will help you review this again.",
            "No worries. Read the weak part once, then try the card again.",
          ];

  if (review.missingPart) {
    phrases.push(`Review this: ${normalizeAImpatinPhrase(review.missingPart)}`);
  }

  if (review.conceptExplanation) {
    phrases.push(`Remember: ${normalizeAImpatinPhrase(review.conceptExplanation)}`);
  }

  return phrases;
}

function firstNonBlankText(...values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim() ?? "";
}

function normalizeAImpatinPhrase(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function readAImpatinCoachHiddenPreference() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(AIMPATIN_COACH_HIDDEN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeAImpatinCoachHiddenPreference(isHidden: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(AIMPATIN_COACH_HIDDEN_STORAGE_KEY, String(isHidden));
  } catch {
    // Local storage is only a convenience; the coach should still work without it.
  }
}

export function CompletionPanel({
  onBack,
  onRestart,
  isRestarting,
  studyCoachRecap,
}: {
  onBack: () => void;
  onRestart: () => void;
  isRestarting: boolean;
  studyCoachRecap?: FlashcardStudyCoachRecapResponseDto | null;
}) {
  return (
    <div className="relative flex min-h-[calc(100dvh-9rem)] flex-col items-center justify-center gap-8 py-10 text-center sm:py-14 lg:py-16">
      <AImpatinCoachRecap recap={studyCoachRecap} />
      <div className="flex flex-col items-center">
        <div className="mb-8 flex size-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_50px_rgba(0,206,200,0.12)] sm:size-24">
          <PlayIcon className="size-10 fill-primary/20 text-primary" />
        </div>
        <h2 className="mb-4 font-sans text-4xl font-semibold tracking-tight text-white sm:text-5xl">Session Completed</h2>
        <p className="mb-12 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">You have completed all cards in this review run.</p>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Button variant="outline" size="lg" className="h-14 rounded-3xl border-white/10 bg-white/5 px-8 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 sm:px-12" onClick={onBack}>Back to Cards</Button>
          <Button size="lg" className="h-14 rounded-3xl bg-primary px-8 text-sm font-semibold text-black shadow-xl shadow-primary/20 transition-transform hover:scale-105 sm:px-12" onClick={onRestart} disabled={isRestarting}>Restart Session</Button>
        </div>
      </div>
    </div>
  );
}

function AImpatinCoachRecap({ recap }: { recap?: FlashcardStudyCoachRecapResponseDto | null }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const coachRecap = recap ?? defaultStudyCoachRecap;
  const quickPhrases = useMemo(() => {
    const phrases = coachRecap.quickPhrases.filter((phrase) => phrase.trim().length > 0);
    return phrases.length > 0 ? phrases : defaultStudyCoachRecap.quickPhrases;
  }, [coachRecap.quickPhrases]);

  useEffect(() => {
    setPhraseIndex(0);
  }, [coachRecap.cheerLine]);

  const currentPhrase = phraseIndex === 0
    ? coachRecap.cheerLine
    : quickPhrases[(phraseIndex - 1) % quickPhrases.length];
  const mascotSrc = getAImpatinMascotAsset(coachRecap.mascotEmotion, coachRecap.tone);
  const toneClasses = getStudyCoachToneClasses(coachRecap.tone);

  const handleMascotClick = () => {
    setPhraseIndex((current) => (current + 1) % (quickPhrases.length + 1));
  };

  return (
    <div className="w-full max-w-5xl">
      <div className={cn("relative overflow-hidden rounded-[2rem] border p-4 text-left shadow-2xl backdrop-blur-xl sm:p-6", toneClasses.panel)}>
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
          <button
            type="button"
            onClick={handleMascotClick}
            className="group relative mx-auto grid size-32 shrink-0 place-items-center rounded-full border border-white/10 bg-black/30 outline-none transition duration-300 hover:scale-[1.03] hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/50 sm:size-40"
            aria-label="Hear AImpatin's next encouragement"
          >
            <span className={cn("absolute inset-0 rounded-full opacity-60 blur-2xl transition group-hover:opacity-90", toneClasses.glow)} />
            <img
              src={mascotSrc}
              alt="AImpatin study coach"
              className="relative z-10 size-28 object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.4)] motion-safe:animate-[aimpatin-float_3.8s_ease-in-out_infinite] group-hover:motion-safe:animate-[aimpatin-wave_0.7s_ease-in-out] sm:size-36"
            />
          </button>
          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-primary/80">AImpatin says</p>
              <p className="mt-1 text-base font-semibold leading-relaxed text-white sm:text-lg">{currentPhrase}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white sm:text-2xl">{coachRecap.headline}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{coachRecap.nextStep}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <RecapList title="You improved" items={coachRecap.improved} tone="strong" />
          <RecapList title="Still weak" items={coachRecap.stillWeak} tone="weak" />
        </div>
      </div>
    </div>
  );
}

function RecapList({ title, items, tone }: { title: string; items: string[]; tone: "strong" | "weak" }) {
  const safeItems = items.length > 0 ? items : ["No clear signal yet."];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className={cn("text-xs font-semibold uppercase", tone === "strong" ? "text-emerald-200" : "text-amber-200")}>{title}</p>
      <ul className="mt-3 space-y-2">
        {safeItems.slice(0, 3).map((item) => (
          <li key={item} className="text-sm leading-relaxed text-white/70">{item}</li>
        ))}
      </ul>
    </div>
  );
}

const defaultStudyCoachRecap: FlashcardStudyCoachRecapResponseDto = {
  headline: "Session complete",
  improved: ["You completed this flashcard run."],
  stillWeak: ["AImpatin needs one more run to spot the weakest cards."],
  nextStep: "Restart the session if you want AImpatin to guide the next review.",
  cheerLine: "Good job. AImpatin is ready for the next round.",
  quickPhrases: ["Good job.", "Nice progress.", "Review this next."],
  tone: "mixed",
  mascotEmotion: "encouraging",
};

function getAImpatinMascotAsset(
  emotion: FlashcardStudyCoachRecapResponseDto["mascotEmotion"],
  tone: FlashcardStudyCoachRecapResponseDto["tone"],
) {
  if (emotion === "happy") return aimpatinHappy;
  if (emotion === "proud") return aimpatinProud;
  if (emotion === "thinking") return aimpatinThinking;
  if (emotion === "sad") return aimpatinSad;
  if (tone === "strong") return aimpatinProud;
  if (tone === "weak") return aimpatinSad;
  return aimpatinEncouraging;
}

function getStudyCoachToneClasses(tone: FlashcardStudyCoachRecapResponseDto["tone"]) {
  if (tone === "strong") {
    return {
      panel: "border-emerald-400/20 bg-emerald-950/35 shadow-emerald-950/40",
      glow: "bg-emerald-400/30",
    };
  }

  if (tone === "weak") {
    return {
      panel: "border-amber-400/20 bg-amber-950/30 shadow-amber-950/35",
      glow: "bg-amber-300/25",
    };
  }

  return {
    panel: "border-primary/20 bg-[#061716]/80 shadow-cyan-950/35",
    glow: "bg-primary/25",
  };
}

export function SessionLoadingSkeleton() {
  return <div className="flex h-full min-h-0 flex-col gap-4 animate-pulse font-sans lg:gap-5"><Skeleton className="h-32 w-full shrink-0 rounded-[2.5rem] bg-white/5" /><Skeleton className="min-h-0 flex-1 w-full rounded-[2.5rem] bg-white/5" /></div>;
}

function SectionTabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 border-b-2 px-6 py-4 text-xs font-medium uppercase tracking-wide transition-all",
        active
          ? "border-primary bg-white/[0.04] text-white"
          : "border-transparent text-white/20 hover:bg-white/[0.01] hover:text-white/40",
      )}
    >
      {label}
    </button>
  );
}

function TechnicalPromptPanel({
  currentQuestion,
  referenceSnippet,
  isLoading,
  technicalLanguage,
  isOutputPrediction,
}: {
  currentQuestion: string;
  referenceSnippet: string;
  isLoading: boolean;
  technicalLanguage?: string;
  isOutputPrediction: boolean;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (isLoading) {
    return <div className="space-y-4 font-sans"><Skeleton className="h-6 w-32 bg-white/5" /><Skeleton className="h-24 w-full bg-white/5" /></div>;
  }

  return (
    <div className="space-y-10 font-sans">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-primary/80">Question</p>
        <p className="text-base font-medium leading-relaxed text-white/80">{currentQuestion}</p>
      </div>
      {referenceSnippet && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">Reference Snippet</p>
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              {!isOutputPrediction ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 border-white/15 bg-white/5 text-xs text-white/80 hover:bg-white/10"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  Full Screen
                </Button>
              ) : null}
              <DialogContent
                showCloseButton={false}
                className="!z-50 !h-[76dvh] !w-[76vw] !max-w-[980px] !gap-0 !border-0 !bg-transparent !p-1.5 !ring-0 text-white sm:!p-2.5"
              >
                <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#04070f] shadow-2xl">
                  <DialogHeader className="flex h-20 shrink-0 flex-row items-center justify-between border-b border-white/10 bg-black/70 px-5 sm:px-7">
                    <DialogTitle className="text-lg font-semibold tracking-tight text-white sm:text-xl">Reference Snippet Preview</DialogTitle>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label="Close preview"
                      >
                        <XIcon className="size-6" />
                      </Button>
                    </DialogClose>
                  </DialogHeader>
                  <div className="min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(30,110,255,0.22),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(8,58,160,0.28),transparent_40%),#071226]">
                    <div className="h-full w-full overflow-hidden p-4 sm:p-5">
                      <CodeBlock
                        code={referenceSnippet}
                        language={technicalLanguage}
                        fullHeight
                        highlighted={isOutputPrediction}
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {isOutputPrediction ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start rounded-2xl border-primary/20 bg-primary/[0.06] px-4 font-semibold text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:ring-primary/25"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Maximize2Icon data-icon="inline-start" />
              Code
            </Button>
          ) : (
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/5">
              <CodeBlock
                code={referenceSnippet}
                language={technicalLanguage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VisibleTestsPanel({ tests, hiddenTestsCount }: { tests: ExecutionTestCase[]; hiddenTestsCount: number }) {
  if (tests.length === 0 && hiddenTestsCount === 0) {
    return <p className="font-sans text-sm italic text-white/20">No logic tests defined for this instance.</p>;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">Validation Tests</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-white/10 text-white/60">
            Visible tests: {tests.length}
          </Badge>
          {hiddenTestsCount > 0 && (
            <Badge variant="outline" className="border-white/10 text-white/60">
              Hidden tests on submit: {hiddenTestsCount}
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {tests.map((test, index) => (
          <div key={`${test.name}-${index}`} className="space-y-4 rounded-2xl border border-white/5 bg-black/40 p-5 shadow-inner">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-white/45">{test.name}</p>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-white/45">Input</p>
              <pre className="overflow-auto rounded-xl border border-white/5 bg-[#0f172a] p-4 font-mono text-xs text-white/65">
                <code>{formatTestValue(test.stdin)}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-white/45">Expected Output</p>
              <pre className="overflow-auto rounded-xl border border-white/5 bg-[#0f172a] p-4 font-mono text-xs text-emerald-200/70">
                <code>{formatTestValue(test.expectedOutput)}</code>
              </pre>
            </div>
          </div>
        ))}
        {hiddenTestsCount > 0 && (
          <Alert className="border-white/10 bg-white/[0.03]">
            <AlertCircleIcon className="size-4 text-primary" />
            <AlertTitle className="text-white">Hidden tests stay private</AlertTitle>
            <AlertDescription className="text-white/65">
              Submit will evaluate {hiddenTestsCount} hidden test{hiddenTestsCount === 1 ? "" : "s"}, but their inputs and expected outputs are never shown here.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

function SandboxResultPanel({
  result,
}: {
  result: ExecuteFlashcardCodeResponseDto;
}) {
  const hasVisibleResults = result.results.length > 0;
  const statusLabel = formatExecutionOutcome(result);
  const activeTab = result.executionStatus === "compileError" ? "compile" : "run";
  const primaryConsoleLabel = result.stderr ? "stderr" : "stdout";
  const primaryConsoleValue = result.stderr || result.stdout;

  return (
    <div className="space-y-0 font-sans">
      <div className="border-b border-white/10 px-1">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <JudgeTab label="Compile Error" active={activeTab === "compile"} tone="error" />
          <JudgeTab label="Execution Status" active={activeTab === "run"} />
        </div>
      </div>

      <section className="border-b border-white/10 px-4 py-6 sm:px-6">
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <div className="flex min-w-0 items-start gap-4">
            <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-rose-500/40 text-rose-300">
              <AlertCircleIcon className="size-5" />
            </div>
            <div className="min-w-0 space-y-3">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{result.executionStatus === "compileError" ? "Compilation Error" : statusLabel}</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Submission executes Judge0 checks before AI review. Hidden tests, if present, stay private and only summary totals are shown.
                </p>
              </div>
              {result.message && result.executionStatus !== "compileError" ? (
                <p className="break-words text-sm text-white/55">{result.message}</p>
              ) : null}
            </div>
          </div>
          <div className="grid min-w-0 gap-0 overflow-hidden border border-white/10 bg-black/15 sm:grid-cols-3">
            <InlineStatusMetric label="Visible" value={`${result.visibleTestsPassed}/${result.visibleTestsTotal}`} hint="examples passed" />
            <InlineStatusMetric label="Compile" value={result.compileStatus} hint="compiler state" valueTone={result.executionStatus === "compileError" ? "error" : "neutral"} />
            <InlineStatusMetric label="Runtime" value={result.runtimeStatus} hint="execution state" valueTone={result.executionStatus === "runtimeError" ? "error" : "neutral"} />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-6 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">Console</p>
          <p className="text-sm text-white/55">Normalized runtime output from the latest deterministic run.</p>
        </div>
        <div className="mt-5 min-w-0 overflow-hidden border border-white/10 bg-black/20">
          {primaryConsoleValue ? (
            <div className="min-h-[180px] p-4 font-mono sm:min-h-[220px] sm:p-5">
              <p className={cn("mb-4 text-sm font-semibold uppercase tracking-[0.18em]", primaryConsoleLabel === "stderr" ? "text-rose-300" : "text-white/55")}>
                {primaryConsoleLabel}
              </p>
              <pre className={cn("max-h-[44vh] overflow-auto whitespace-pre-wrap break-words text-[12px] leading-6 sm:text-[13px] sm:leading-7", primaryConsoleLabel === "stderr" ? "text-rose-200/90" : "text-white/70")}>
                <code>{primaryConsoleValue}</code>
              </pre>
            </div>
          ) : (
            <div className="p-5 text-sm text-white/45">No console output was returned for this run.</div>
          )}
        </div>
      </section>

      {hasVisibleResults && (
        <section className="border-b border-white/10 px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">Test Results</p>
              <p className="mt-1 text-sm text-white/60">Visible cases are checked before any AI review.</p>
            </div>
            <Badge variant="outline" className="border-white/10 bg-white/5 text-white/65">
              {result.results.length} visible case{result.results.length === 1 ? "" : "s"}
            </Badge>
          </div>
          <div className="space-y-0 overflow-hidden border border-white/10">
          {result.results.map((entry, index) => (
            <div key={`${entry.name}-${index}`} className="border-b border-white/10 bg-black/15 p-4 last:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={cn("flex size-8 items-center justify-center rounded-full border", entry.passed ? "border-emerald-500/25 text-emerald-300" : "border-rose-500/25 text-rose-200")}>
                    {entry.passed ? <CheckCircle2Icon className="size-4" /> : <XCircleIcon className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-white">{entry.name}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">{entry.status || "completed"}</p>
                  </div>
                </div>
                <Badge className={entry.passed ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-300" : "border border-rose-500/25 bg-rose-500/10 text-rose-200"}>
                  {entry.passed ? "Passed" : "Failed"}
                </Badge>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                <ResultField label="Input" value={entry.input} />
                <ResultField label="Expected" value={entry.expectedOutput} tone="expected" />
                <ResultField label="Actual" value={entry.actualOutput} tone={entry.passed ? "expected" : "actual"} />
              </div>
              {(entry.stderr || entry.status) && (
                <div className="mt-3 rounded-xl border border-white/5 bg-[#0f172a] p-3">
                  {entry.status && <p className="text-xs font-medium uppercase tracking-wide text-white/45">{entry.status}</p>}
                  {entry.stderr && <pre className="mt-2 whitespace-pre-wrap text-xs text-rose-200/55"><code>{entry.stderr}</code></pre>}
                </div>
              )}
            </div>
          ))}
          </div>
        </section>
      )}
      {result.hiddenSummary.total > 0 && (
        <Alert className="mx-4 mt-6 border-white/10 bg-white/[0.03] sm:mx-6">
          <AlertCircleIcon className="size-4 text-primary" />
          <AlertTitle className="text-white">Hidden test summary</AlertTitle>
          <AlertDescription className="text-white/65">
            Passed {result.hiddenSummary.passed} of {result.hiddenSummary.total} hidden tests. Failed {result.hiddenSummary.failed}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function InlineStatusMetric({
  label,
  value,
  hint,
  valueTone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  valueTone?: "neutral" | "success" | "error";
}) {
  const valueClass = valueTone === "success"
    ? "text-emerald-300"
    : valueTone === "error"
      ? "text-rose-300"
      : "text-white";

  return (
    <div className="border-b border-white/10 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">{label}</p>
      <p className={cn("mt-4 text-xl font-semibold tracking-tight sm:mt-5 sm:text-2xl", valueClass)}>{value}</p>
      <p className="mt-2 text-sm text-white/45 sm:mt-3">{hint}</p>
    </div>
  );
}

function JudgeTab({
  label,
  active,
  tone = "neutral",
}: {
  label: string;
  active: boolean;
  tone?: "neutral" | "error";
}) {
  return (
    <div className="relative py-4 text-sm font-medium uppercase tracking-[0.18em]">
      <span className={cn(active ? (tone === "error" ? "text-rose-300" : "text-white") : "text-white/45")}>{label}</span>
      <div className={cn("absolute inset-x-0 bottom-0 h-0.5", active ? (tone === "error" ? "bg-rose-400" : "bg-white/80") : "bg-transparent")} />
    </div>
  );
}

function ResultField({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "expected" | "actual";
}) {
  const toneClass = tone === "expected"
    ? "text-emerald-200/70"
    : tone === "actual"
      ? "text-rose-200/70"
      : "text-white/65";

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-white/45">{label}</p>
      <pre className={cn("max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/5 bg-[#0f172a] p-3 text-xs", toneClass)}>
        <code>{value || "(empty)"}</code>
      </pre>
    </div>
  );
}

function CodeBlock({
  code,
  language,
  fullHeight = false,
  highlighted = false,
}: {
  code: string;
  language?: string;
  fullHeight?: boolean;
  highlighted?: boolean;
}) {
  const normalizedCode = code.replace(/\r\n/g, "\n");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copyResetTimeoutRef = useRef<number | null>(null);

  const handleCopy = async () => {
    const didCopy = await copyTextToClipboard(normalizedCode);
    setCopyStatus(didCopy ? "copied" : "failed");

    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }

    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 1600);
  };

  if (highlighted) {
    const lines = normalizedCode.split("\n");

    return (
      <div
        className={cn(
          "flex min-h-0 w-full max-w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-primary/20 bg-[#07111f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
          fullHeight ? "h-full w-full" : "max-h-[540px]",
        )}
      >
        <div className="flex w-full min-w-0 shrink-0 items-center justify-between gap-3 border-b border-primary/15 bg-primary/[0.055] px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="size-2 rounded-full bg-primary" />
            <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/85">
              {formatCodeLanguageLabel(language)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "hidden border-primary/20 bg-black/20 text-[10px] uppercase tracking-[0.18em] text-primary/75 sm:inline-flex",
                copyStatus === "copied" && "border-primary/35 bg-primary/10 text-primary",
                copyStatus === "failed" && "border-rose-400/30 bg-rose-500/10 text-rose-200",
              )}
            >
              {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Read only"}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="border border-primary/15 bg-black/25 text-primary/80 hover:bg-primary/10 hover:text-primary focus-visible:ring-primary/25"
              onClick={handleCopy}
              aria-label="Copy reference snippet"
            >
              <CopyIcon />
            </Button>
          </div>
        </div>
        <pre className="min-h-0 w-full min-w-0 flex-1 overflow-auto py-4 font-mono text-[12px] leading-6 sm:text-[13px]">
          <code className="inline-block min-w-max">
            {lines.map((line, index) => (
              <span
                key={`${index}-${line}`}
                className="grid min-w-max grid-cols-[3.25rem_minmax(0,1fr)] px-2 transition-colors hover:bg-primary/[0.045]"
              >
                <span className="select-none pr-4 text-right text-white/25">{index + 1}</span>
                <span className="whitespace-pre pr-4 text-[#d8e7ff]">{renderHighlightedCodeLine(line, language)}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <pre className={cn(
      "overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/5 bg-[#0f172a] p-6 font-mono text-[13px] leading-7",
      fullHeight && "min-h-full w-full",
    )}>
      <code>{normalizedCode}</code>
    </pre>
  );
}

async function copyTextToClipboard(text: string) {
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea fallback for browsers that block Clipboard API writes.
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}

const codeTokenPattern = /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b[A-Za-z_]\w*\b|\b\d+(?:\.\d+)?\b|[{}()[\];,.=+\-*/<>!?:]+)/g;

const codeKeywords = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "def",
  "do",
  "else",
  "extends",
  "finally",
  "for",
  "foreach",
  "from",
  "function",
  "if",
  "import",
  "in",
  "interface",
  "namespace",
  "new",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "switch",
  "this",
  "throw",
  "try",
  "using",
  "var",
  "void",
  "while",
]);

const codeTypes = new Set([
  "bool",
  "boolean",
  "char",
  "decimal",
  "double",
  "float",
  "int",
  "integer",
  "long",
  "number",
  "object",
  "short",
  "string",
  "String",
]);

function renderHighlightedCodeLine(line: string, language?: string) {
  const tokens = line.split(codeTokenPattern).filter((token) => token.length > 0);

  return tokens.map((token, index) => (
    <span
      key={`${token}-${index}`}
      className={getHighlightedCodeTokenClass(token, tokens[index + 1], tokens[index - 1], language)}
    >
      {token}
    </span>
  ));
}

function getHighlightedCodeTokenClass(token: string, nextToken?: string, previousToken?: string, language?: string) {
  const trimmed = token.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(\/\/|\/\*)/.test(trimmed)) {
    return "text-white/35 italic";
  }

  if (/^(['"`]).*\1$/.test(trimmed)) {
    return "text-emerald-300";
  }

  if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
    return "text-rose-300";
  }

  if (/^[{}()[\];,.]+$/.test(trimmed)) {
    return "text-white/45";
  }

  if (/^[=+\-*/<>!?:]+$/.test(trimmed)) {
    return "text-primary/75";
  }

  if (codeKeywords.has(trimmed)) {
    return "text-sky-300";
  }

  if (codeTypes.has(trimmed) || isLanguageTypeToken(trimmed, language)) {
    return "text-violet-300";
  }

  if (/^[A-Z]\w*$/.test(trimmed)) {
    return "text-cyan-200";
  }

  if (nextToken === "(" && previousToken !== "if" && previousToken !== "for" && previousToken !== "while" && previousToken !== "switch") {
    return "text-amber-200";
  }

  if (/^[A-Za-z_]\w*$/.test(trimmed)) {
    return "text-[#dbeafe]";
  }

  return "text-[#d8e7ff]";
}

function isLanguageTypeToken(token: string, language?: string) {
  const normalizedLanguage = mapRuntimeLanguageToMonaco(language);

  if (normalizedLanguage === "csharp") {
    return token === "Console" || token === "Array" || token === "Exception";
  }

  if (normalizedLanguage === "java") {
    return token === "System" || token === "Integer" || token === "Exception";
  }

  if (normalizedLanguage === "cpp") {
    return token === "std" || token === "vector" || token === "size_t";
  }

  return false;
}

function formatCodeLanguageLabel(language?: string) {
  return mapRuntimeLanguageToMonaco(language).replace("plaintext", "code");
}

function mapRuntimeLanguageToMonaco(language?: string) {
  const lowered = (language ?? "").toLowerCase().trim();

  switch (lowered) {
    case "javascript":
    case "js":
    case "node":
    case "nodejs":
      return "javascript";
    case "python":
    case "py":
    case "python3":
      return "python";
    case "java":
      return "java";
    case "csharp":
    case "c#":
    case "cs":
      return "csharp";
    case "cpp":
    case "c++":
    case "cplusplus":
      return "cpp";
    case "sql":
      return "sql";
    default:
      return "plaintext";
  }
}
