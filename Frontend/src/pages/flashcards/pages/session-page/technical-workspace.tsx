import { useState, useCallback, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  XIcon,
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
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
} from "@/features/flashcards/api/dto";
import { cn } from "@/lib/utils";
import {
  type ExecutionTestCase,
  type RuntimeLanguage,
  formatExecutionOutcome,
  formatTestValue,
  getExecutionOutcomeClasses,
} from "./runtime";

export type ToneClasses = {
  border: string;
  background: string;
  badge: string;
};

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
  onRun: () => void;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  isSubmitChecking?: boolean;
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
  onRun,
  onSubmit,
  onNext,
  onRestart,
  isRunning,
  isSubmitting,
  isSubmitChecking = false,
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

  const [consoleHeight, setConsoleHeight] = useState(240);
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
      
      // Calculate height from bottom
      const newConsoleHeight = containerHeight - mouseOffsetFromTop;

      // Min 80px for console, min 120px for editor
      if (newConsoleHeight >= 80 && newConsoleHeight <= containerHeight - 120) {
        setConsoleHeight(newConsoleHeight);
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

      <div className="grid min-h-0 flex-1 w-full min-w-0 grid-cols-1 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] shadow-2xl lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="flex min-h-0 min-w-0 flex-col border-b border-white/10 bg-[#0c0c0c] lg:border-b-0 lg:border-r">
          <div className="flex gap-2 border-b border-white/10 bg-white/[0.01] p-4">
            <SectionTabButton label="Problem" active={sidebarTab === "prompt"} onClick={() => setSidebarTab("prompt")} />
            <SectionTabButton label="Guidance" active={sidebarTab === "guidance"} onClick={() => setSidebarTab("guidance")} />
            <SectionTabButton label="Tests" active={sidebarTab === "examples"} onClick={() => setSidebarTab("examples")} />
          </div>
          <ScrollArea className="min-h-0 flex-1 p-4 sm:p-6 lg:p-8">
            {sidebarTab === "prompt" && (
              <div className="space-y-8">
                <TechnicalPromptPanel currentQuestion={currentQuestion} referenceSnippet={referenceSnippet} isLoading={isLoading} technicalLanguage={flashcard?.technicalLanguage} />
                <Alert className="border-white/10 bg-white/[0.03]">
                  <AlertCircleIcon className="size-4 text-primary" />
                  <AlertTitle className="text-white">Run and submit are different</AlertTitle>
                  <AlertDescription className="text-white/65">
                    Run checks only the visible examples. Submit performs the final evaluation and may include hidden tests.
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
            {isRunnable && (
              <Select value={selectedLanguage} onValueChange={(value) => onLanguageChange(value as RuntimeLanguage)}>
                <SelectTrigger className="h-9 w-full min-w-0 max-w-full border-white/10 bg-white/5 text-xs text-white/80 sm:w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-xs text-white">
                  <SelectGroup>
                    {supportedLanguages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          <div ref={workspaceRef} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div 
              className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", isRunnable ? "bg-[#18181A]" : "bg-[#0f172a]")}
              style={{ minHeight: '120px' }}
            >
              {isRunnable ? (
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#18181A]">
                  <div className="flex shrink-0 items-end justify-between border-b border-white/10 px-4 pt-3">
                    <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-white/10 bg-[#242427] px-5 py-2.5 text-sm font-medium text-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD43B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                      </svg>
                      Code Editor
                    </div>
                    <div className="mb-2 flex items-center gap-3">
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
                        <SelectTrigger className="h-8 min-w-[144px] rounded-full border-white/10 bg-[#242427] px-4 font-mono text-[11px] uppercase tracking-widest text-white/75">
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
                      <button
                        type="button"
                        onClick={onRun}
                        disabled={isRunning || canAdvance}
                        className="flex items-center gap-2 rounded-full bg-white px-6 py-1.5 text-[13px] font-bold text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRunning ? "Running..." : "Run"}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M5 3l14 9-14 9V3z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden rounded-b-2xl">
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
                <div className="flex-1 space-y-6 overflow-auto p-8">
                  <Textarea
                    value={answerText}
                    onChange={(event) => onAnswerTextChange(event.target.value)}
                    className="h-full min-h-[400px] w-full resize-none border-none bg-transparent p-0 text-lg leading-relaxed text-white placeholder:text-white/5 focus-visible:ring-0"
                    placeholder="Enter your logical analysis here..."
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
                  style={{ height: `${consoleHeight}px`, minHeight: '80px' }}
                >
                  <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.01] px-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/50">Run Results</p>
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
                        <p className="text-xs font-medium tracking-wide text-white/50">Run code to see deterministic test results.</p>
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
                  {isSubmitting ? <Spinner data-icon="inline-start" /> : <SendHorizonalIcon data-icon="inline-start" />} {isSubmitChecking ? "Checking..." : "Submit"}
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

export function CompletionPanel({
  onBack,
  onRestart,
  isRestarting,
}: {
  onBack: () => void;
  onRestart: () => void;
  isRestarting: boolean;
}) {
  return (
    <div className="flex flex-col items-center py-32 text-center">
      <div className="mb-10 flex size-24 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_50px_rgba(var(--primary),0.1)]">
        <PlayIcon className="size-10 fill-primary/20 text-primary" />
      </div>
      <h2 className="mb-4 font-sans text-4xl font-semibold tracking-tight text-white sm:text-5xl">Session Completed</h2>
      <p className="mb-12 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">You have completed all cards in this review run.</p>
      <div className="flex gap-6">
        <Button variant="outline" size="lg" className="h-14 rounded-3xl border-white/10 bg-white/5 px-12 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10" onClick={onBack}>Back to Cards</Button>
        <Button size="lg" className="h-14 rounded-3xl bg-primary px-12 text-sm font-semibold text-black shadow-xl shadow-primary/20 transition-transform hover:scale-105" onClick={onRestart} disabled={isRestarting}>Restart Session</Button>
      </div>
    </div>
  );
}

export function SessionLoadingSkeleton() {
  return <div className="flex h-full min-h-0 flex-col gap-4 animate-pulse font-sans lg:gap-5"><Skeleton className="h-32 w-full shrink-0 rounded-[2.5rem] bg-white/5" /><Skeleton className="min-h-0 flex-1 w-full rounded-[2.5rem] bg-white/5" /></div>;
}

export function getReviewToneClasses(tone: string): ToneClasses {
  switch (tone) {
    case "correct":
      return { border: "border-emerald-500/20", background: "bg-emerald-500/[0.03]", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    case "close":
      return { border: "border-sky-500/20", background: "bg-sky-500/[0.03]", badge: "bg-sky-500/10 text-sky-300 border-sky-500/20" };
    case "partial":
      return { border: "border-amber-500/20", background: "bg-amber-500/[0.03]", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    default:
      return { border: "border-rose-500/20", background: "bg-rose-500/[0.03]", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
  }
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
}: {
  currentQuestion: string;
  referenceSnippet: string;
  isLoading: boolean;
  technicalLanguage?: string;
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
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-white/15 bg-white/5 text-xs text-white/80 hover:bg-white/10">
                  Full Screen
                </Button>
              </DialogTrigger>
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
                    <div className="h-full w-full overflow-y-auto px-5 py-6 sm:px-6 sm:py-6">
                      <pre className="min-h-full w-full whitespace-pre-wrap font-mono text-[13px] leading-7 text-[#dbe8ff] sm:text-[14px] sm:leading-7">
                        <code>{referenceSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/5">
            <CodeBlock code={referenceSnippet} language={technicalLanguage} />
          </div>
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
          <JudgeTab label="Run Status" active={activeTab === "run"} />
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
                  Run checks visible cases first. Submit may add hidden cases before AI feedback appears.
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

function CodeBlock({ code, fullHeight = false }: { code: string; language?: string; fullHeight?: boolean }) {
  return (
    <pre className={cn(
      "overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/5 bg-[#0f172a] p-6 font-mono text-[13px] leading-7",
      fullHeight && "min-h-full w-full",
    )}>
      <code>{code}</code>
    </pre>
  );
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
