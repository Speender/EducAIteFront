import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  RotateCcwIcon,
  SendHorizonalIcon,
  PlayIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ToastProvider";
import { cn } from "@/lib/utils";
import {
  useActiveFlashcardLearnSessionQuery,
  useDeckFlashcardsQuery,
  useExecuteFlashcardCodeMutation,
  useFlashcardDetailQuery,
  useFlashcardWorkspaceLatestQuery,
  useRestartFlashcardLearnSessionMutation,
  useSubmitFlashcardLearnAnswerMutation,
  useWorkspaceSubDecksQuery,
} from "@/features/flashcards/api/hooks";
import type {
  ExecuteFlashcardCodeResponseDto,
  FlashcardFrontendReviewResponseDto,
  FlashcardLearnSessionResponseDto,
  SubmitFlashcardLearnAnswerResponseDto,
} from "@/features/flashcards/api/dto";
import { getFlashcardChallengePath, getFlashcardDocumentCardsPath } from "@/features/flashcards/routes";
import logo from "../../../assets/educAIte-logo.svg";
import {
  CompletionPanel,
  ReviewPanel,
  SessionLoadingSkeleton,
  TechnicalWorkspace,
  getReviewToneClasses,
  type ToneClasses,
} from "./session-page/technical-workspace";
import {
  type RuntimeLanguage,
  formatItemTypeLabel,
  normalizeItemType,
  parseJsonObject,
  readChoiceOptions,
  readExecutionTests,
  readPrefilledCode,
  readSingleSelect,
  readString,
  readSupportedLanguages,
  runnableItemTypes,
  technicalItemTypes,
} from "./session-page/runtime";

export function SessionPage() {
  const navigate = useNavigate();
  const { studentCourseSqid: majorDeckSqid, documentSqid: deckSqid } = useParams();
  const { showSuccess, showError } = useToast();

  const [session, setSession] = useState<FlashcardLearnSessionResponseDto | null>(null);
  const [pendingSession, setPendingSession] = useState<FlashcardLearnSessionResponseDto | null>(null);
  const [sessionResult, setSessionResult] = useState<SubmitFlashcardLearnAnswerResponseDto | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [codeText, setCodeText] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<RuntimeLanguage | "">("");
  const [executionResult, setExecutionResult] = useState<ExecuteFlashcardCodeResponseDto | null>(null);
  const [isSubmitGuardRunning, setIsSubmitGuardRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const subDecksQuery = useWorkspaceSubDecksQuery(majorDeckSqid ?? null);
  const cardsQuery = useDeckFlashcardsQuery(deckSqid ?? null);
  const restartSessionMutation = useRestartFlashcardLearnSessionMutation();

  const selectedMajorDeck =
    (workspaceQuery.data?.decks ?? []).find((deck) => deck.majorDeckSqid === majorDeckSqid) ?? null;
  const sessionStudentCourseSqid = selectedMajorDeck?.studentCourseSqid ?? null;
  const sessionScopeType = sessionStudentCourseSqid ? "Course" : "Overall";

  const activeSessionQuery = useActiveFlashcardLearnSessionQuery(
    sessionScopeType,
    sessionStudentCourseSqid,
    deckSqid ?? null,
    null,
    !session,
  );

  useEffect(() => {
    if (activeSessionQuery.data && !session) {
      setSession(activeSessionQuery.data);
    }
  }, [activeSessionQuery.data, session]);

  const currentItem = session?.items[session.currentItemIndex] ?? null;
  const detailQuery = useFlashcardDetailQuery(currentItem?.flashcardSqid ?? null);
  const executeCodeMutation = useExecuteFlashcardCodeMutation();
  const submitAnswerMutation = useSubmitFlashcardLearnAnswerMutation(session?.sessionSqid ?? null);

  const queueCards = cardsQuery.data ?? [];
  const currentFlashcard = useMemo(() => {
    return detailQuery.data || (currentItem ? queueCards.find((card) => card.sqid === currentItem.flashcardSqid) : null) || null;
  }, [detailQuery.data, currentItem, queueCards]);
  const firstTechnicalCard = useMemo(
    () => queueCards.find((card) => technicalItemTypes.has(normalizeItemType(card.itemType ?? ""))) ?? null,
    [queueCards],
  );

  const currentItemType = normalizeItemType(currentFlashcard?.itemType ?? "Flashcard");
  const isTechnical = technicalItemTypes.has(currentItemType);
  const isRunnable = runnableItemTypes.has(currentItemType);
  const isCodeReading = currentItemType === "CodeReading";

  const validationConfig = useMemo(() => parseJsonObject(currentFlashcard?.validationConfigJson), [currentFlashcard?.validationConfigJson]);
  const choiceOptions = useMemo(() => readChoiceOptions(validationConfig), [validationConfig]);
  const isSingleSelect = useMemo(() => readSingleSelect(validationConfig), [validationConfig]);
  const hasChoiceOptions = choiceOptions.length > 0;
  const supportedLanguages = useMemo(
    () => readSupportedLanguages(validationConfig, currentFlashcard?.technicalLanguage, isRunnable),
    [validationConfig, currentFlashcard?.technicalLanguage, isRunnable],
  );
  const preferredLanguage = (selectedLanguage || supportedLanguages[0] || "") as RuntimeLanguage | "";
  const starterCode = useMemo(
    () => readPrefilledCode(validationConfig, preferredLanguage, [currentFlashcard?.answer, currentFlashcard?.question]),
    [currentFlashcard?.answer, currentFlashcard?.question, preferredLanguage, validationConfig],
  );
  const referenceSnippet = useMemo(() => readString(validationConfig, ["codeSnippet", "referenceCode", "exampleCode"]), [validationConfig]);
  const visibleTests = useMemo(() => readExecutionTests(validationConfig, ["visibleTestCases", "visibleTests", "testCases", "examples"]), [validationConfig]);
  const hiddenTests = useMemo(() => readExecutionTests(validationConfig, ["hiddenTestCases", "hiddenTests"]), [validationConfig]);
  const runtimeVersion = useMemo(() => readString(validationConfig, ["runtimeVersion", "version"]), [validationConfig]);
  const executionLimits = useMemo(() => ({ timeoutMs: 3000, memoryMb: 128, network: false as const }), []);

  useEffect(() => {
    if (!currentItem) return;
    const initialLanguage = supportedLanguages[0] ?? "";
    setAnswerText("");
    setCodeText(starterCode || "");
    setSelectedOptionIds([]);
    setSelectedLanguage(initialLanguage);
    setExecutionResult(null);
    setIsSubmitGuardRunning(false);
    setSessionError(null);
    setStartedAt(Date.now());
  }, [currentItem?.sessionItemSqid, starterCode, supportedLanguages]);

  useEffect(() => {
    if (!sessionResult) {
      return;
    }

    const feedback = sessionResult.frontendReview.answerReview.trim();
    if (!feedback) {
      return;
    }

    if (sessionResult.answer.showAgainInSession) {
      showError(feedback);
      return;
    }

    showSuccess(feedback);
  }, [sessionResult, showError, showSuccess]);

  const progressCurrent = session ? Math.min(session.currentItemIndex + 1, Math.max(session.items.length, 1)) : 1;
  const itemLabel = formatItemTypeLabel(currentFlashcard?.itemType ?? "Flashcard");
  const progressTotal = Math.max(session?.items.length ?? 1, 1);
  const progressValue = (progressCurrent / progressTotal) * 100;

  const handleBack = () => {
    if (majorDeckSqid && deckSqid) {
      navigate(getFlashcardDocumentCardsPath(majorDeckSqid, deckSqid));
      return;
    }
    navigate(-1);
  };

  const handleOpenChallenge = (flashcardSqid?: string | null) => {
    if (!majorDeckSqid || !deckSqid) {
      return;
    }

    navigate(getFlashcardChallengePath(majorDeckSqid, deckSqid, flashcardSqid ?? undefined));
  };

  const handleRestartSession = () => {
    const target = session?.sessionSqid ?? null;
    if (!target) return;

    setSessionError(null);
    restartSessionMutation.mutate(target, {
      onSuccess: (nextSession) => {
        setSession(nextSession);
        setSessionResult(null);
        setExecutionResult(null);
        setStartedAt(Date.now());
      },
      onError: (error) => {
        setSessionError(error instanceof Error ? error.message : "Unable to restart.");
      },
    });
  };

  const handleRunCode = () => {
    if (!currentFlashcard || !isRunnable || !preferredLanguage) return;
    if (!codeText.trim()) return setSessionError("Add code before running.");

    setSessionError(null);
    executeCodeMutation.mutate({
      language: preferredLanguage,
      runtimeVersion: runtimeVersion || undefined,
      studentCode: codeText.trim(),
      visibleTests,
      hiddenTests: [],
      limits: executionLimits,
    }, {
      onSuccess: (result) => setExecutionResult(result),
      onError: (error) => setSessionError(error instanceof Error ? error.message : "Unable to run code."),
    });
  };

  const handleSubmit = async () => {
    if (!currentItem) return;
    const submittedText = hasChoiceOptions
      ? (isSingleSelect ? (selectedOptionIds[0] ?? "") : selectedOptionIds.join(","))
      : (isRunnable ? codeText.trim() : answerText.trim());
    if (!submittedText || sessionResult) return setSessionError("Provide an answer.");

    setSessionError(null);

    try {
      if (isRunnable) {
        if (!preferredLanguage) {
          setSessionError("Select a supported language before submitting.");
          return;
        }

        setIsSubmitGuardRunning(true);
        const preSubmitExecution = await executeCodeMutation.mutateAsync({
          language: preferredLanguage,
          runtimeVersion: runtimeVersion || undefined,
          studentCode: codeText.trim(),
          visibleTests,
          hiddenTests,
          limits: executionLimits,
        });

        setExecutionResult(preSubmitExecution);

        const passedAllRequiredTests =
          preSubmitExecution.executionStatus === "completed"
          && preSubmitExecution.visibleTestsPassed === preSubmitExecution.visibleTestsTotal
          && preSubmitExecution.hiddenTestsPassed === preSubmitExecution.hiddenTestsTotal;

        if (!passedAllRequiredTests) {
          setSessionError("Pass all required Judge0 test cases before submitting for answer review.");
          return;
        }
      }

      submitAnswerMutation.mutate({
        sessionItemSqid: currentItem.sessionItemSqid,
        answer: submittedText,
        responseTimeMs: Math.max(0, Date.now() - startedAt),
        itemType: currentFlashcard?.itemType,
        question: currentFlashcard?.question ?? currentItem.question,
        expectedAnswer: currentFlashcard?.answer,
        conceptExplanation: currentFlashcard?.conceptExplanation,
        answeringGuidance: currentFlashcard?.answeringGuidance,
        acceptedAnswerAliases: currentFlashcard?.acceptedAnswerAliases ?? [],
        cognitiveSkill: currentFlashcard?.cognitiveSkill,
        learningDomain: currentFlashcard?.learningDomain,
        technicalLanguage: currentFlashcard?.technicalLanguage,
        rubricJson: currentFlashcard?.rubricJson,
        validationConfigJson: currentFlashcard?.validationConfigJson,
        language: isRunnable ? preferredLanguage || undefined : undefined,
        runtimeVersion: isRunnable ? runtimeVersion || undefined : undefined,
        starterCode: isRunnable ? starterCode : "",
        studentCode: isRunnable ? codeText.trim() : undefined,
      }, {
        onSuccess: (result) => {
          setPendingSession(result.session);
          setSessionResult(result);
        },
        onError: (error) => setSessionError(error instanceof Error ? error.message : "Unable to evaluate."),
      });
    } catch (error) {
      setSessionError(error instanceof Error ? error.message : "Unable to run Judge0 validation before submit.");
    } finally {
      setIsSubmitGuardRunning(false);
    }
  };

  const handleNext = () => {
    if (!pendingSession) return;
    setSession(pendingSession);
    setPendingSession(null);
    setSessionResult(null);
    setExecutionResult(null);
    setStartedAt(Date.now());
  };

  const handleOptionToggle = (optionId: string) => {
    if (sessionResult) return;
    setSelectedOptionIds((prev) => {
      if (isSingleSelect) {
        return prev[0] === optionId ? [] : [optionId];
      }
      return prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId];
    });
  };

  const reviewTone = sessionResult?.frontendReview.resultTone ?? "incorrect";
  const reviewToneClasses = getReviewToneClasses(reviewTone);
  const sessionReviewMessage = sessionResult
    ? sessionResult.answer.showAgainInSession
      ? "Will appear again later until you answer it correctly."
      : "Correct. This question is cleared from the active session."
    : "";
  const sessionReviewTone: "correct" | "repeat" = sessionResult?.answer.showAgainInSession ? "repeat" : "correct";
  const isPageLoading = activeSessionQuery.isLoading || workspaceQuery.isLoading || subDecksQuery.isLoading;
  const isTechnicalLoading = Boolean(currentItem && detailQuery.isLoading && !currentFlashcard);

  return (
    <div className="h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_26%),#050505] px-4 py-4 font-sans text-white antialiased sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex h-full min-h-0 max-w-[1440px] flex-col gap-4 lg:gap-5">
        <header className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-black/40 text-white hover:bg-white/10" onClick={handleBack}>
              <ArrowLeftIcon className="size-4" />
            </Button>
            <img src={logo} alt="educAIte" className="h-7 opacity-95" />
          </div>
          <div className="flex items-center gap-2">
            {session && (
              <Badge className="border border-white/10 bg-white/[0.05] text-white/80 font-bold">
                Card {progressCurrent}/{progressTotal}
              </Badge>
            )}
          </div>
        </header>

        {sessionError && (
          <Alert variant="destructive" className="border-rose-500/20 bg-rose-500/10">
            <AlertCircleIcon className="size-4" />
            <AlertTitle>Engine Error</AlertTitle>
            <AlertDescription>{sessionError}</AlertDescription>
          </Alert>
        )}

        <div className="min-h-0 flex-1 overflow-hidden">
          {isPageLoading ? (
            <SessionLoadingSkeleton />
          ) : !currentItem ? (
            <CompletionPanel onBack={handleBack} onRestart={handleRestartSession} isRestarting={restartSessionMutation.isPending} />
          ) : hasChoiceOptions ? (
            <ChoiceWorkspace
              question={currentItem.question}
              progressCurrent={progressCurrent}
              progressTotal={progressTotal}
              itemLabel={itemLabel}
              options={choiceOptions}
              selectedOptionIds={selectedOptionIds}
              isSingleSelect={isSingleSelect}
              onToggleOption={handleOptionToggle}
              onSubmit={handleSubmit}
              onNext={handleNext}
              canAdvance={Boolean(sessionResult)}
              isSubmitting={submitAnswerMutation.isPending || isSubmitGuardRunning}
              review={sessionResult?.frontendReview ?? null}
              reviewToneClasses={reviewToneClasses}
              sessionReviewMessage={sessionReviewMessage}
              sessionReviewTone={sessionReviewTone}
              onRestart={handleRestartSession}
              isRestarting={restartSessionMutation.isPending}
            />
          ) : isTechnical ? (
            <TechnicalWorkspace
              flashcard={currentFlashcard}
              currentQuestion={currentItem.question}
              progressCurrent={progressCurrent}
              progressTotal={progressTotal}
              itemLabel={itemLabel}
              isLoading={isTechnicalLoading}
              isRunnable={isRunnable}
              isCodeReading={isCodeReading}
              code={codeText}
              onCodeChange={setCodeText}
              answerText={answerText}
              onAnswerTextChange={setAnswerText}
              selectedLanguage={preferredLanguage}
              onLanguageChange={(value) => setSelectedLanguage(value)}
              supportedLanguages={supportedLanguages}
              referenceSnippet={referenceSnippet}
              visibleTests={visibleTests}
              hiddenTestsCount={hiddenTests.length}
              executionResult={executionResult}
              review={sessionResult?.frontendReview ?? null}
              onRun={handleRunCode}
              onSubmit={handleSubmit}
              onNext={handleNext}
              onRestart={handleRestartSession}
              isRunning={executeCodeMutation.isPending}
              isSubmitting={submitAnswerMutation.isPending || isSubmitGuardRunning}
              isSubmitChecking={isSubmitGuardRunning}
              isRestarting={restartSessionMutation.isPending}
              canAdvance={Boolean(sessionResult)}
              reviewToneClasses={reviewToneClasses}
              sessionReviewMessage={sessionReviewMessage}
              sessionReviewTone={sessionReviewTone}
            />
          ) : (
            <StandardWorkspace
              question={currentItem.question}
              progressCurrent={progressCurrent}
              progressTotal={progressTotal}
              answer={answerText}
              onAnswerChange={setAnswerText}
              onSubmit={handleSubmit}
              onNext={handleNext}
              isSubmitting={submitAnswerMutation.isPending || isSubmitGuardRunning}
              canAdvance={Boolean(sessionResult)}
              review={sessionResult?.frontendReview ?? null}
              reviewToneClasses={reviewToneClasses}
              sessionReviewMessage={sessionReviewMessage}
              sessionReviewTone={sessionReviewTone}
              itemLabel={itemLabel}
              onRestart={handleRestartSession}
              isRestarting={restartSessionMutation.isPending}
              progressValue={progressValue}
              onOpenChallenge={
                firstTechnicalCard
                  ? () => handleOpenChallenge(firstTechnicalCard.sqid)
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StandardWorkspace({ question, progressCurrent, progressTotal, answer, onAnswerChange, onSubmit, onNext, isSubmitting, canAdvance, review, reviewToneClasses, sessionReviewMessage, sessionReviewTone, itemLabel, onRestart, isRestarting, progressValue, onOpenChallenge }: { question: string; progressCurrent: number; progressTotal: number; answer: string; onAnswerChange: (v: string) => void; onSubmit: () => void; onNext: () => void; isSubmitting: boolean; canAdvance: boolean; review: FlashcardFrontendReviewResponseDto | null; reviewToneClasses: ToneClasses; sessionReviewMessage: string; sessionReviewTone: "correct" | "repeat"; itemLabel: string; onRestart: () => void; isRestarting: boolean; progressValue: number; onOpenChallenge?: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
      <div className="w-full">
        <Card className="mb-6 rounded-[2rem] border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-md">
          <CardHeader className="gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-base font-semibold tracking-tight text-white/85">Review Session</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="border-primary/20 bg-primary/10 text-xs font-medium text-primary">{itemLabel}</Badge>
                  <span className="text-xs text-white/45">Card {progressCurrent} of {progressTotal}</span>
                </div>
              </div>
              <Button variant="outline" className="h-10 rounded-full border-white/20 bg-black/40 px-6 text-sm font-medium text-white hover:bg-white/10" onClick={onRestart} disabled={isRestarting}>
                <RotateCcwIcon className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-white/45"><span>Progress</span><span>{Math.round(progressValue)}%</span></div>
              <Progress value={progressValue} className="h-1.5 bg-white/5" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="w-full border-white/10 bg-[#0a0a0a] shadow-2xl backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <CardHeader className="gap-5 border-b border-white/5 bg-white/[0.01] px-10 pb-6 pt-10">
          <div className="text-xs font-medium uppercase tracking-wide text-primary/80">Question</div>
          <CardTitle className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{question}</CardTitle>
        </CardHeader>
        <CardContent className="px-10 py-8 bg-black/20">
          <Textarea 
            value={answer} 
            onChange={(e) => onAnswerChange(e.target.value)} 
            placeholder="Synthesize your explanation here..." 
            className="min-h-[320px] rounded-[1.5rem] border-white/5 bg-[#0c0c0c] p-8 text-base leading-relaxed text-white shadow-inner transition-all placeholder:text-white/25 focus-visible:border-primary/20 focus-visible:ring-primary/10" 
            disabled={canAdvance} 
          />
        </CardContent>
        <CardFooter className="flex-col items-stretch justify-between gap-4 border-t border-white/5 px-10 py-8 sm:flex-row sm:items-center bg-white/[0.01]">
          <div className="flex items-center gap-3 text-xs font-medium text-white/45">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500/40" />
            Input ready
          </div>
          {canAdvance ? (
            <Button size="lg" className="h-12 rounded-2xl bg-primary px-12 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" onClick={onNext}>Next</Button>
          ) : (
            <div className="flex flex-wrap justify-end gap-3">
              {onOpenChallenge && (
                <Button size="lg" variant="secondary" className="h-12 rounded-2xl border border-white/10 bg-white/5 px-8 text-sm font-medium text-white transition-all hover:bg-white/10" onClick={onOpenChallenge}>
                  <PlayIcon className="mr-2 size-4 fill-current" /> Run Logic
                </Button>
              )}
              <Button size="lg" className="h-12 rounded-2xl bg-primary px-10 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" onClick={onSubmit} disabled={isSubmitting || !answer.trim()}>
                {isSubmitting ? <Spinner className="size-4 animate-spin" /> : <SendHorizonalIcon className="mr-2 size-4" />} Submit Answer
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      <div className="w-full">
        <ReviewPanel
          review={review}
          reviewToneClasses={reviewToneClasses}
          sessionReviewMessage={sessionReviewMessage}
          sessionReviewTone={sessionReviewTone}
        />
      </div>
    </div>
  );
}

function ChoiceWorkspace({
  question,
  progressCurrent,
  progressTotal,
  itemLabel,
  options,
  selectedOptionIds,
  isSingleSelect,
  onToggleOption,
  onSubmit,
  onNext,
  canAdvance,
  isSubmitting,
  review,
  reviewToneClasses,
  sessionReviewMessage,
  sessionReviewTone,
  onRestart,
  isRestarting,
}: {
  question: string;
  progressCurrent: number;
  progressTotal: number;
  itemLabel: string;
  options: Array<{ id: string; text: string }>;
  selectedOptionIds: string[];
  isSingleSelect: boolean;
  onToggleOption: (id: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isSubmitting: boolean;
  review: FlashcardFrontendReviewResponseDto | null;
  reviewToneClasses: ToneClasses;
  sessionReviewMessage: string;
  sessionReviewTone: "correct" | "repeat";
  onRestart: () => void;
  isRestarting: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-col gap-6">
      <Card className="w-full rounded-[2rem] border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-md">
        <CardHeader className="gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-base font-semibold tracking-tight text-white/85">Multiple Choice</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="border-primary/20 bg-primary/10 text-xs font-medium text-primary">{itemLabel}</Badge>
                <span className="text-xs text-white/45">Card {progressCurrent} of {progressTotal}</span>
                <Badge variant="outline" className="border-white/10 text-[10px] text-white/60">
                  {isSingleSelect ? "Single Select" : "Multiple Select"}
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="h-10 rounded-full border-white/20 bg-black/40 px-6 text-sm font-medium text-white hover:bg-white/10" onClick={onRestart} disabled={isRestarting}>
              <RotateCcwIcon className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="min-h-0 w-full overflow-hidden rounded-[2.5rem] border-white/10 bg-[#0a0a0a] shadow-2xl backdrop-blur-md">
        <CardHeader className="gap-5 border-b border-white/5 bg-white/[0.01] px-8 pb-6 pt-8">
          <div className="text-xs font-medium uppercase tracking-wide text-primary/80">Question</div>
          <CardTitle className="text-xl font-semibold leading-relaxed tracking-tight text-white sm:text-2xl">{question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-8 py-6">
          {options.map((option) => {
            const checked = selectedOptionIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onToggleOption(option.id)}
                disabled={canAdvance}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                  "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                  checked && "border-primary/40 bg-primary/10",
                  canAdvance && "cursor-not-allowed opacity-80",
                )}
              >
                <span className={cn(
                  "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold",
                  checked ? "border-primary bg-primary text-black" : "border-white/20 text-white/60",
                )}>
                  {option.id}
                </span>
                <span className="text-sm leading-relaxed text-white/90">{option.text}</span>
              </button>
            );
          })}
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-4 border-t border-white/5 bg-white/[0.01] px-8 py-6">
          <p className="text-xs text-white/50">
            {isSingleSelect ? "Select one option." : "You can select multiple options."}
          </p>
          {canAdvance ? (
            <Button size="lg" className="h-11 rounded-2xl bg-primary px-8 text-sm font-semibold text-black" onClick={onNext}>
              Next
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-11 rounded-2xl bg-primary px-8 text-sm font-semibold text-black"
              onClick={onSubmit}
              disabled={isSubmitting || selectedOptionIds.length === 0}
            >
              {isSubmitting ? <Spinner className="size-4 animate-spin" /> : <SendHorizonalIcon className="mr-2 size-4" />}
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="w-full">
        <ReviewPanel review={review} reviewToneClasses={reviewToneClasses} sessionReviewMessage={sessionReviewMessage} sessionReviewTone={sessionReviewTone} />
      </div>
    </div>
  );
}

export default SessionPage;
