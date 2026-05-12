import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  RotateCcwIcon,
  SendHorizonalIcon,
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  useAnalyzeFlashcardCodeSubmissionMutation,
  useActiveFlashcardLearnSessionQuery,
  useDeckFlashcardsQuery,
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
  FlashcardStudyCoachRecapResponseDto,
  SubmitFlashcardLearnAnswerResponseDto,
} from "@/features/flashcards/api/dto";
import { getFlashcardDocumentCardsPath } from "@/features/flashcards/routes";
import logo from "../../../assets/educAIte-logo.svg";
import {
  AImpatinSessionCoach,
  CompletionPanel,
  ReviewPanel,
  SessionLoadingSkeleton,
  TechnicalWorkspace,
} from "./session-page/technical-workspace";
import {
  type RuntimeLanguage,
  type ToneClasses,
  formatItemTypeLabel,
  getReviewToneClasses,
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

  const [session, setSession] = useState<FlashcardLearnSessionResponseDto | null>(null);
  const [pendingSession, setPendingSession] = useState<FlashcardLearnSessionResponseDto | null>(null);
  const [sessionResult, setSessionResult] = useState<SubmitFlashcardLearnAnswerResponseDto | null>(null);
  const [studyCoachRecap, setStudyCoachRecap] = useState<FlashcardStudyCoachRecapResponseDto | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [codeText, setCodeText] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<RuntimeLanguage | "">("");
  const [executionResult, setExecutionResult] = useState<ExecuteFlashcardCodeResponseDto | null>(null);
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
      if (activeSessionQuery.data.status !== "Completed") {
        setStudyCoachRecap(null);
      }
    }
  }, [activeSessionQuery.data, session]);

  const currentItem = session?.items[session.currentItemIndex] ?? null;
  const detailQuery = useFlashcardDetailQuery(currentItem?.flashcardSqid ?? null);
  const submitAnswerMutation = useSubmitFlashcardLearnAnswerMutation(session?.sessionSqid ?? null);

  const queueCards = cardsQuery.data ?? [];
  const currentFlashcard = useMemo(() => {
    return detailQuery.data || (currentItem ? queueCards.find((card) => card.sqid === currentItem.flashcardSqid) : null) || null;
  }, [detailQuery.data, currentItem, queueCards]);
  const analyzeCodeGateMutation = useAnalyzeFlashcardCodeSubmissionMutation(currentFlashcard?.sqid ?? null);

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

  useEffect(() => {
    if (!currentItem) return;
    const initialLanguage = supportedLanguages[0] ?? "";
    setAnswerText("");
    setCodeText(starterCode || "");
    setSelectedOptionIds([]);
    setSelectedLanguage(initialLanguage);
    setExecutionResult(null);
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
      toast({
        title: "Incorrect answer",
        description: feedback,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Correct answer",
      description: feedback,
      variant: "success",
    });
  }, [sessionResult]);

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

  const handleRestartSession = () => {
    const target = session?.sessionSqid ?? null;
    if (!target) return;

    setSessionError(null);
    restartSessionMutation.mutate(target, {
      onSuccess: (nextSession) => {
        setSession(nextSession);
        setSessionResult(null);
        setPendingSession(null);
        setStudyCoachRecap(null);
        setExecutionResult(null);
        setStartedAt(Date.now());
      },
      onError: (error) => {
        setSessionError(error instanceof Error ? error.message : "Unable to restart.");
      },
    });
  };

  const submitSessionAnswer = (
    submittedText: string,
    currentSessionItemSqid: string,
    fallbackQuestion: string,
  ) => {
    submitAnswerMutation.mutate({
      sessionItemSqid: currentSessionItemSqid,
      answer: submittedText,
      responseTimeMs: Math.max(0, Date.now() - startedAt),
      itemType: currentFlashcard?.itemType,
      question: currentFlashcard?.question ?? fallbackQuestion,
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
        if (result.session.status === "Completed") {
          setSession(result.session);
          setPendingSession(null);
        } else {
          setPendingSession(result.session);
        }
        setSessionResult(result);
        setStudyCoachRecap(result.studyCoachRecap ?? null);
      },
      onError: (error) => {
        if (isRunnable && axios.isAxiosError(error) && error.response?.status === 400) {
          const blockedData = toJudgeBlockedPayload(error.response.data);
          if (blockedData) {
            setSessionError(blockedData.message);
            setExecutionResult(blockedData.execution);
            return;
          }
        }
        setSessionError(error instanceof Error ? error.message : "Unable to evaluate.");
      },
    });
  };

  const handleSubmit = async () => {
    if (!currentItem) return;
    const submittedText = hasChoiceOptions
      ? (isSingleSelect ? (selectedOptionIds[0] ?? "") : selectedOptionIds.join(","))
      : (isRunnable ? codeText.trim() : answerText.trim());
    if (!submittedText || sessionResult) return setSessionError("Provide an answer.");

    setSessionError(null);
    if (isRunnable && !preferredLanguage) {
      setSessionError("Select a supported language before submitting.");
      return;
    }

    if (isRunnable) {
      if (!currentFlashcard?.sqid) {
        setSessionError("Missing flashcard identifier for submission.");
        return;
      }

      const submitPayload = {
        answer: submittedText,
        responseTimeMs: Math.max(0, Date.now() - startedAt),
        itemType: currentFlashcard.itemType,
        question: currentFlashcard.question ?? currentItem.question,
        expectedAnswer: currentFlashcard.answer,
        conceptExplanation: currentFlashcard.conceptExplanation,
        answeringGuidance: currentFlashcard.answeringGuidance,
        acceptedAnswerAliases: currentFlashcard.acceptedAnswerAliases ?? [],
        cognitiveSkill: currentFlashcard.cognitiveSkill,
        learningDomain: currentFlashcard.learningDomain,
        technicalLanguage: currentFlashcard.technicalLanguage,
        rubricJson: currentFlashcard.rubricJson,
        validationConfigJson: currentFlashcard.validationConfigJson,
        language: preferredLanguage || undefined,
        runtimeVersion: runtimeVersion || undefined,
        starterCode,
        studentCode: codeText.trim(),
      };

      try {
        const gateResult = await analyzeCodeGateMutation.mutateAsync(submitPayload);
        setExecutionResult(gateResult);
        submitSessionAnswer(submittedText, currentItem.sessionItemSqid, currentItem.question);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const blockedData = toJudgeBlockedPayload(error.response.data);
          if (blockedData) {
            setSessionError(blockedData.message);
            setExecutionResult(blockedData.execution);
            return;
          }
        }
        setSessionError(error instanceof Error ? error.message : "Unable to validate code submission.");
      }
      return;
    }

    submitSessionAnswer(submittedText, currentItem.sessionItemSqid, currentItem.question);
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
  const isSubmitting = submitAnswerMutation.isPending || analyzeCodeGateMutation.isPending;
  const hasStudentInput = hasChoiceOptions
    ? selectedOptionIds.length > 0
    : isRunnable
      ? codeText.trim().length > 0
      : answerText.trim().length > 0;

  return (
    <div className="min-h-[100dvh] overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_26%),#050505] px-4 py-4 font-sans text-white antialiased sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex min-h-0 max-w-[1440px] flex-col gap-4 lg:gap-5">
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

        {currentItem && !isPageLoading && (
          <AImpatinSessionCoach
            flashcard={currentFlashcard}
            fallbackQuestion={currentItem.question}
            review={sessionResult?.frontendReview ?? null}
            sessionReviewTone={sessionReviewTone}
            hasStudentInput={hasStudentInput}
          />
        )}

        <div className="min-h-0 flex-1 overflow-hidden">
          {isPageLoading ? (
            <SessionLoadingSkeleton />
          ) : !currentItem ? (
            <CompletionPanel
              onBack={handleBack}
              onRestart={handleRestartSession}
              isRestarting={restartSessionMutation.isPending}
              studyCoachRecap={studyCoachRecap}
            />
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
              isSubmitting={isSubmitting}
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
              onSubmit={handleSubmit}
              onNext={handleNext}
              onRestart={handleRestartSession}
              isSubmitting={isSubmitting}
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
              isSubmitting={isSubmitting}
              canAdvance={Boolean(sessionResult)}
              review={sessionResult?.frontendReview ?? null}
              reviewToneClasses={reviewToneClasses}
              sessionReviewMessage={sessionReviewMessage}
              sessionReviewTone={sessionReviewTone}
              itemLabel={itemLabel}
              onRestart={handleRestartSession}
              isRestarting={restartSessionMutation.isPending}
              progressValue={progressValue}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const executionStatusByValue: Record<string, ExecuteFlashcardCodeResponseDto["executionStatus"]> = {
  accepted: "completed",
  completed: "completed",
  compile_error: "compileError",
  compileerror: "compileError",
  runtime_error: "runtimeError",
  runtimeerror: "runtimeError",
  timeout: "timeout",
  memory_limit_exceeded: "memoryLimitExceeded",
  memorylimitexceeded: "memoryLimitExceeded",
  sandbox_unavailable: "sandboxUnavailable",
  sandboxunavailable: "sandboxUnavailable",
};

const compileStatusByValue: Record<string, ExecuteFlashcardCodeResponseDto["compileStatus"]> = {
  accepted: "success",
  success: "success",
  failed: "failed",
  error: "failed",
  not_run: "notRun",
  notrun: "notRun",
};

const runtimeStatusByValue: Record<string, ExecuteFlashcardCodeResponseDto["runtimeStatus"]> = {
  accepted: "completed",
  completed: "completed",
  success: "completed",
  failed: "failed",
  error: "failed",
  not_run: "notRun",
  notrun: "notRun",
};

function toJudgeBlockedPayload(
  data: unknown,
): { message: string; execution: ExecuteFlashcardCodeResponseDto } | null {
  if (!data || typeof data !== "object") return null;
  const payload = data as Record<string, unknown>;
  const executionRaw = payload.execution;
  if (!executionRaw || typeof executionRaw !== "object") return null;

  const execution = executionRaw as Record<string, unknown>;
  const compileStatus = normalizeCompileStatus(execution.compileStatus);
  const runtimeStatus = normalizeRuntimeStatus(execution.runtimeStatus);
  const executionStatus = normalizeExecutionStatus(execution.executionStatus, compileStatus, runtimeStatus);
  const results = Array.isArray(execution.results)
    ? execution.results
      .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
      .map((entry, index) => ({
        name: toStringValue(entry.name, `Visible Test ${index + 1}`),
        passed: Boolean(entry.passed),
        input: toStringValue(entry.input),
        expectedOutput: toStringValue(entry.expectedOutput),
        actualOutput: toStringValue(entry.actualOutput),
        stderr: toStringValue(entry.stderr),
        status: toStringValue(entry.status),
      }))
    : [];
  const hiddenSummaryRaw = execution.hiddenSummary;
  const hiddenSummary = hiddenSummaryRaw && typeof hiddenSummaryRaw === "object"
    ? (hiddenSummaryRaw as Record<string, unknown>)
    : {};

  return {
    message: toStringValue(payload.message, "Code must compile and run successfully before submission can be assessed."),
    execution: {
      executionStatus,
      compileStatus,
      runtimeStatus,
      stdout: toStringValue(execution.stdout),
      stderr: toStringValue(execution.stderr),
      visibleTestsPassed: toNumberValue(execution.visibleTestsPassed),
      visibleTestsTotal: toNumberValue(execution.visibleTestsTotal),
      hiddenTestsPassed: toNumberValue(execution.hiddenTestsPassed),
      hiddenTestsTotal: toNumberValue(execution.hiddenTestsTotal),
      message: toStringValue(payload.message),
      results,
      hiddenSummary: {
        passed: toNumberValue(hiddenSummary.passed),
        failed: toNumberValue(hiddenSummary.failed),
        total: toNumberValue(hiddenSummary.total),
      },
    },
  };
}

function normalizeExecutionStatus(
  value: unknown,
  compileStatus: ExecuteFlashcardCodeResponseDto["compileStatus"],
  runtimeStatus: ExecuteFlashcardCodeResponseDto["runtimeStatus"],
): ExecuteFlashcardCodeResponseDto["executionStatus"] {
  const normalized = normalizeLookupKey(value);
  if (normalized && executionStatusByValue[normalized]) {
    return executionStatusByValue[normalized];
  }
  if (compileStatus === "failed") return "compileError";
  if (runtimeStatus === "failed") return "runtimeError";
  return "completed";
}

function normalizeCompileStatus(value: unknown): ExecuteFlashcardCodeResponseDto["compileStatus"] {
  const normalized = normalizeLookupKey(value);
  if (normalized && compileStatusByValue[normalized]) {
    return compileStatusByValue[normalized];
  }
  return "notRun";
}

function normalizeRuntimeStatus(value: unknown): ExecuteFlashcardCodeResponseDto["runtimeStatus"] {
  const normalized = normalizeLookupKey(value);
  if (normalized && runtimeStatusByValue[normalized]) {
    return runtimeStatusByValue[normalized];
  }
  return "notRun";
}

function normalizeLookupKey(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/[\s-]/g, "_");
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toNumberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function StandardWorkspace({ question, progressCurrent, progressTotal, answer, onAnswerChange, onSubmit, onNext, isSubmitting, canAdvance, review, reviewToneClasses, sessionReviewMessage, sessionReviewTone, itemLabel, onRestart, isRestarting, progressValue }: { question: string; progressCurrent: number; progressTotal: number; answer: string; onAnswerChange: (v: string) => void; onSubmit: () => void; onNext: () => void; isSubmitting: boolean; canAdvance: boolean; review: FlashcardFrontendReviewResponseDto | null; reviewToneClasses: ToneClasses; sessionReviewMessage: string; sessionReviewTone: "correct" | "repeat"; itemLabel: string; onRestart: () => void; isRestarting: boolean; progressValue: number }) {
  return (
    <div className={cn(
      "mx-auto grid w-full gap-6",
      review ? "max-w-[1380px] lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-5" : "max-w-5xl grid-cols-1",
    )}>
      <div className="min-h-0">
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
          <CardFooter className="flex-col items-stretch justify-end gap-4 border-t border-white/5 px-10 py-8 sm:flex-row sm:items-center bg-white/[0.01]">
            {canAdvance ? (
              <Button size="lg" className="h-12 rounded-2xl bg-primary px-12 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" onClick={onNext}>Next</Button>
            ) : (
              <div className="flex flex-wrap justify-end gap-3">
                <Button size="lg" className="h-12 rounded-2xl bg-primary px-10 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" onClick={onSubmit} disabled={isSubmitting || !answer.trim()}>
                  {isSubmitting ? <Spinner className="size-4 animate-spin" /> : <SendHorizonalIcon className="mr-2 size-4" />} Submit Answer
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

      {review && (
        <aside className="lg:sticky lg:top-0">
          <div className="lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto lg:pr-1">
            <ReviewPanel
              review={review}
              reviewToneClasses={reviewToneClasses}
              sessionReviewMessage={sessionReviewMessage}
              sessionReviewTone={sessionReviewTone}
            />
          </div>
        </aside>
      )}
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
    <div className="mx-auto grid h-full min-h-0 w-full max-w-[1380px] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-5">
      <div className="flex min-h-0 flex-col gap-6">
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
      </div>

      <aside className="min-h-0 lg:sticky lg:top-0">
        <div className="min-h-0 lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto lg:pr-1">
          {review ? (
            <ReviewPanel
              review={review}
              reviewToneClasses={reviewToneClasses}
              sessionReviewMessage={sessionReviewMessage}
              sessionReviewTone={sessionReviewTone}
            />
          ) : (
            <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
              <CardHeader className="gap-3 pb-4">
                <Badge className="w-fit border border-white/10 bg-white/5 text-xs font-medium uppercase tracking-wide text-white/60">
                  Pending
                </Badge>
                <CardTitle className="text-xl font-semibold tracking-tight text-white">AI Evaluation</CardTitle>
                <p className="text-sm leading-relaxed text-white/65">
                  Submit your answer to get deterministic correctness feedback and targeted concept guidance.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pb-6 pt-1">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/45">Status</p>
                  <p className="mt-2 text-sm text-white/70">No evaluation yet for this card.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </aside>
    </div>
  );
}

export default SessionPage;
