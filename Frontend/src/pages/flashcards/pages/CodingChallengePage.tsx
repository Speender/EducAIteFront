import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  useExecuteFlashcardCodeMutation,
  useFlashcardDetailQuery,
  useFlashcardsByDocumentQuery,
  useSubmitAndAnalyzeFlashcardMutation,
} from "@/features/flashcards/api/hooks";
import type {
  ExecuteFlashcardCodeResponseDto,
  FlashcardFrontendReviewResponseDto,
  FlashcardResponseDto,
} from "@/features/flashcards/api/dto";
import { getFlashcardDocumentCardsPath } from "@/features/flashcards/routes";
import { cn } from "@/lib/utils";
import {
  didExecutionPass,
  formatExecutionOutcome,
  formatTestValue,
} from "./session-page/runtime";
import logo from "../../../assets/educAIte-logo.svg";
import AImpatin from "../../../assets/robot.svg";

const technicalItemTypes = new Set(["CodeReading", "Debugging", "Sql", "Algorithm", "OutputPrediction", "FillInCode"]);

type JsonRecord = Record<string, unknown>;

export function CodeChallengePage() {
  const navigate = useNavigate();
  const { studentCourseSqid, documentSqid } = useParams();
  const [searchParams] = useSearchParams();
  const flashcardSqid = searchParams.get("flashcard");

  const cardsQuery = useFlashcardsByDocumentQuery(documentSqid ?? null);
  const detailQuery = useFlashcardDetailQuery(flashcardSqid);
  const executeCodeMutation = useExecuteFlashcardCodeMutation();
  const [code, setCode] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [executionResult, setExecutionResult] = useState<ExecuteFlashcardCodeResponseDto | null>(null);
  const [isSubmitGuardRunning, setIsSubmitGuardRunning] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  const selectedFlashcard = useMemo(() => {
    if (detailQuery.data) {
      return detailQuery.data;
    }

    const cards = cardsQuery.data ?? [];
    return cards.find((card) => technicalItemTypes.has(card.itemType)) ?? cards[0] ?? null;
  }, [cardsQuery.data, detailQuery.data]);

  const submitMutation = useSubmitAndAnalyzeFlashcardMutation(selectedFlashcard?.sqid ?? null);
  const validationConfig = useMemo(
    () => parseJsonObject(selectedFlashcard?.validationConfigJson),
    [selectedFlashcard?.validationConfigJson],
  );
  const visibleTests = useMemo(() => readRecordArray(validationConfig, ["visibleTestCases", "visibleTests", "testCases", "examples"]), [validationConfig]);
  const hiddenTests = useMemo(() => readRecordArray(validationConfig, ["hiddenTestCases", "hiddenTests"]), [validationConfig]);
  const language = useMemo(
    () => normalizeLanguage(readString(validationConfig, ["language", "runtime"]) || selectedFlashcard?.technicalLanguage),
    [selectedFlashcard?.technicalLanguage, validationConfig],
  );
  const starterCode = useMemo(
    () => readString(validationConfig, ["starterCode", "initialCode", "template", "codeTemplate", "codeSnippet", "referenceCode", "exampleCode", "buggyCode"]) || "",
    [validationConfig],
  );
  const limits = useMemo(() => readLimits(validationConfig), [validationConfig]);
  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(code.split("\n").length, 24) }, (_, index) => index + 1),
    [code],
  );

  useEffect(() => {
    if (!selectedFlashcard) {
      return;
    }

    setCode(starterCode || selectedFlashcard.answer || "");
    setExecutionResult(null);
    setIsSubmitGuardRunning(false);
    setChallengeError(null);
    setStartedAt(Date.now());
  }, [selectedFlashcard?.sqid, starterCode]);

  const handleBack = () => {
    if (studentCourseSqid && documentSqid) {
      navigate(getFlashcardDocumentCardsPath(studentCourseSqid, documentSqid));
      return;
    }

    navigate(-1);
  };

  const handleRun = () => {
    if (!selectedFlashcard || !code.trim()) {
      setChallengeError("Enter code before running the test cases.");
      return;
    }

    setChallengeError(null);
    executeCodeMutation.mutate(
      {
        language,
        prompt: selectedFlashcard.question,
        starterCode,
        studentCode: code,
        visibleTests,
        hiddenTests: [],
        limits,
      },
      {
        onSuccess: (result) => setExecutionResult(result),
        onError: (error) => {
          setChallengeError(error instanceof Error ? error.message : "Unable to run the code sandbox.");
        },
      },
    );
  };

  const handleSubmit = async () => {
    if (!selectedFlashcard || !code.trim()) {
      setChallengeError("Enter code before submitting.");
      return;
    }

    setChallengeError(null);

    try {
      setIsSubmitGuardRunning(true);
      const preSubmitExecution = await executeCodeMutation.mutateAsync({
        language,
        prompt: selectedFlashcard.question,
        starterCode,
        studentCode: code,
        visibleTests,
        hiddenTests,
        limits,
      });

      setExecutionResult(preSubmitExecution);

      const passedAllRequiredTests =
        preSubmitExecution.executionStatus === "completed"
        && preSubmitExecution.visibleTestsPassed === preSubmitExecution.visibleTestsTotal
        && preSubmitExecution.hiddenTestsPassed === preSubmitExecution.hiddenTestsTotal;

      if (!passedAllRequiredTests) {
        setChallengeError("Pass all required Judge0 test cases before submitting for answer review.");
        return;
      }

      submitMutation.mutate(
        {
          answer: code,
          responseTimeMs: Math.max(0, Date.now() - startedAt),
          itemType: selectedFlashcard.itemType,
          question: selectedFlashcard.question,
          expectedAnswer: selectedFlashcard.answer,
          conceptExplanation: selectedFlashcard.conceptExplanation,
          answeringGuidance: selectedFlashcard.answeringGuidance,
          acceptedAnswerAliases: selectedFlashcard.acceptedAnswerAliases,
          cognitiveSkill: selectedFlashcard.cognitiveSkill,
          learningDomain: selectedFlashcard.learningDomain,
          technicalLanguage: selectedFlashcard.technicalLanguage,
          rubricJson: selectedFlashcard.rubricJson,
          validationConfigJson: selectedFlashcard.validationConfigJson,
          language,
          starterCode,
          studentCode: code,
        },
        {
          onError: (error) => {
            setChallengeError(error instanceof Error ? error.message : "Unable to submit your solution.");
          },
        },
      );
    } catch (error) {
      setChallengeError(error instanceof Error ? error.message : "Unable to run Judge0 validation before submit.");
    } finally {
      setIsSubmitGuardRunning(false);
    }
  };

  const isLoading = cardsQuery.isLoading || detailQuery.isLoading;
  const review = submitMutation.data?.frontendReview ?? null;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black px-6 py-6 font-sans text-white antialiased">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 transition-all hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <img src={logo} alt="educAIte" className="h-8" />
        </div>

        <div className="hidden rounded-full border border-white/20 bg-black px-8 py-3 text-sm font-medium text-white/50 md:flex md:gap-8">
          <span>Home</span>
          <span>Courses</span>
          <span>Analytics</span>
          <span className="border-b-2 border-[#00CEC8] pb-1 text-[#00CEC8]">Flashcards</span>
          <span>Tracker</span>
          <span>Calendar</span>
          <span>Resume</span>
        </div>

        <div className="w-[120px]" />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 pb-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#18181A] shadow-lg">
          <div className="flex shrink-0 items-end justify-between border-b border-white/10 px-4 pt-3">
            <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-white/10 bg-[#242427] px-5 py-2.5 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD43B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 16 4-4-4-4" />
                <path d="m6 8-4 4 4 4" />
                <path d="m14.5 4-5 16" />
              </svg>
              Code Editor
            </div>
            <button
              type="button"
              onClick={handleRun}
              disabled={executeCodeMutation.isPending || isLoading || !selectedFlashcard}
              className="mb-2 flex items-center gap-2 rounded-full bg-white px-6 py-1.5 text-[13px] font-bold text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {executeCodeMutation.isPending ? "Running..." : "Run"}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden bg-[#18181A]">
            <div className="flex w-12 shrink-0 select-none flex-col items-center bg-[#18181A] pb-4 pt-4 font-mono text-[13px] leading-[1.6] text-[#555]">
              {lineNumbers.map((number) => (
                <div key={number}>{number}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck="false"
              disabled={isLoading || !selectedFlashcard}
              className="w-full flex-1 resize-none whitespace-pre bg-transparent p-4 font-mono text-[13px] leading-[1.6] text-[#E2E8F0] outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </section>

        <section className="flex min-h-0 flex-col gap-4">
          <div className="flex-[3] overflow-hidden rounded-[20px] border border-white/10 bg-[#18181A] shadow-lg">
            <div className="flex shrink-0 items-end gap-1 border-b border-white/10 px-4 pt-3">
              <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-white/10 bg-[#242427] px-5 py-2.5 text-sm font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Description
              </div>
            </div>

            <div className="h-full overflow-y-auto p-8">
              {isLoading ? (
                <div className="py-16 text-center text-white/50">Loading challenge...</div>
              ) : selectedFlashcard ? (
                <ChallengeDescription flashcard={selectedFlashcard} tests={visibleTests} />
              ) : (
                <div className="py-16 text-center text-white/50">No flashcard challenge is available for this document.</div>
              )}
            </div>
          </div>

          <div className="flex-[2] overflow-hidden rounded-[20px] border border-white/10 bg-[#18181A] shadow-lg">
            <div className="flex shrink-0 items-end justify-between border-b border-white/10 px-4 pt-3">
              <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-white/10 bg-[#242427] px-5 py-2.5 text-sm font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                Results
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitMutation.isPending || isSubmitGuardRunning || isLoading || !selectedFlashcard}
                className="mb-2 rounded-full bg-white px-8 py-1.5 text-[13px] font-bold text-black shadow-md transition-colors hover:bg-gray-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitGuardRunning ? "Checking..." : submitMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>

            <div className="h-full space-y-5 overflow-y-auto p-6">
              {challengeError ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">{challengeError}</div>
              ) : null}
              <ExecutionWorkspacePanel tests={visibleTests} executionResult={executionResult} />
              {review ? <ReviewPanel review={review} /> : null}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[#050505] shadow-xl transition-all hover:scale-110">
          <img src={AImpatin} alt="bot" className="h-8 w-8 object-contain" />
        </div>
      </div>
    </div>
  );
}

function ChallengeDescription({ flashcard, tests }: { flashcard: FlashcardResponseDto; tests: JsonRecord[] }) {
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#00CEC8]/30 bg-[#00CEC8]/10 px-3 py-1 text-xs font-bold text-[#00CEC8]">
          {flashcard.itemType}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/55">
          {flashcard.technicalLanguage || "Code"}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/55">
          Difficulty {flashcard.difficulty}
        </span>
      </div>
      <h2 className="mb-6 text-3xl font-bold">{flashcard.technicalLanguage || flashcard.itemType}</h2>
      <p className="mb-6 whitespace-pre-wrap text-[15px] leading-relaxed text-white/80">{flashcard.question}</p>
      {flashcard.answeringGuidance ? (
        <div className="mb-6 rounded-xl border border-white/10 bg-[#202023] p-5 text-sm leading-7 text-white/70">
          {flashcard.answeringGuidance}
        </div>
      ) : null}
      {tests.slice(0, 2).map((test, index) => (
        <div key={index} className="mb-4">
          <div className="mb-2 font-medium text-white/90">Example {index + 1}:</div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#202023] p-5 font-mono text-[13px] leading-relaxed text-white/80">
            {formatTestCase(test)}
          </pre>
        </div>
      ))}
    </>
  );
}

function ExecutionWorkspacePanel({
  tests,
  executionResult,
}: {
  tests: JsonRecord[];
  executionResult: ExecuteFlashcardCodeResponseDto | null;
}) {
  return (
    <div className="space-y-5">
      {executionResult ? (
        <ExecutionSummaryCard result={executionResult} />
      ) : (
        <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">Run status</p>
          <p className="mt-3 text-lg font-semibold text-white">Run the solution to open deterministic test results.</p>
          <p className="mt-2 text-sm leading-7 text-white/60">
            Run checks visible cases first. Submit keeps the deterministic result and may append AI feedback afterwards.
          </p>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">Visible Test Cases</p>
            <p className="mt-1 text-sm text-white/60">These are the examples used when you press Run.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            {tests.length} case{tests.length === 1 ? "" : "s"}
          </span>
        </div>
        {tests.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
            No visible test cases were provided by the AI for this flashcard.
          </div>
        ) : (
          tests.map((test, index) => (
            <div key={index} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-white/80">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="font-sans text-sm font-medium text-white">Testcase {index + 1}</div>
                {executionResult?.results[index] ? (
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                      executionResult.results[index]?.passed
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/25 bg-rose-500/10 text-rose-200",
                    )}
                  >
                    {executionResult.results[index]?.passed ? "Passed" : "Failed"}
                  </span>
                ) : null}
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                <ResultPane label="Input" value={readString(test, ["stdin", "input", "args"])} />
                <ResultPane label="Expected" value={readString(test, ["expectedOutput", "expected_output", "output"])} tone="expected" />
                <ResultPane
                  label="Actual"
                  value={executionResult?.results[index]?.actualOutput ?? ""}
                  tone={executionResult?.results[index]?.passed ? "expected" : "actual"}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function ReviewPanel({ review }: { review: FlashcardFrontendReviewResponseDto }) {
  return (
    <div className="rounded-2xl border border-[#00CEC8]/20 bg-[#00CEC8]/10 p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#00CEC8] px-3 py-1 text-xs font-bold uppercase text-black">
          {review.verdict || review.resultTone}
        </span>
        {review.qualityScore != null ? (
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70">
            Quality {review.qualityScore}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-7 text-white/85">{review.answerReview}</p>
      {review.technicalDiagnostics?.issues.length ? (
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {review.technicalDiagnostics.issues.map((issue) => (
            <li key={issue}>- {issue}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ExecutionSummaryCard({ result }: { result: ExecuteFlashcardCodeResponseDto }) {
  const didPass = didExecutionPass(result);
  const activeTab = result.executionStatus === "compileError" ? "compile" : "run";
  const primaryConsoleLabel = result.stderr ? "stderr" : "stdout";
  const primaryConsoleValue = result.stderr || result.stdout;

  return (
    <div className="border border-white/10 bg-black/15">
      <div className="border-b border-white/10 px-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <JudgeTab label="Compile Error" active={activeTab === "compile"} tone="error" />
          <JudgeTab label="Run Status" active={activeTab === "run"} />
        </div>
      </div>

      <div className="border-b border-white/10 px-5 py-6">
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="flex min-w-0 items-start gap-4">
            <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-rose-500/40 text-rose-300">
              <span className="text-xl font-semibold">!</span>
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{result.executionStatus === "compileError" ? "Compilation Error" : formatExecutionOutcome(result)}</p>
              <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Run checks visible cases first. Submit keeps the deterministic result and may append AI feedback afterwards.
              </p>
              {result.message && result.executionStatus !== "compileError" ? (
                <p className="mt-3 break-words text-sm text-white/55">{result.message}</p>
              ) : null}
            </div>
          </div>
          <div className="grid min-w-0 gap-0 overflow-hidden border border-white/10 bg-black/10 sm:grid-cols-3">
            <MetricPill label="Visible" value={`${result.visibleTestsPassed}/${result.visibleTestsTotal}`} tone={didPass ? "success" : "neutral"} />
            <MetricPill label="Compile" value={result.compileStatus} tone={result.executionStatus === "compileError" ? "failure" : "neutral"} />
            <MetricPill label="Runtime" value={result.runtimeStatus} tone={result.executionStatus === "runtimeError" ? "failure" : "neutral"} />
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 px-5 py-6">
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
                {primaryConsoleValue}
              </pre>
            </div>
          ) : (
            <div className="p-5 text-sm text-white/45">No console output was returned for this run.</div>
          )}
        </div>
      </div>

      {result.results.length > 0 ? (
        <div className="px-5 py-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">Test Results</p>
              <p className="mt-1 text-sm text-white/60">Visible cases are checked before any AI review.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
              {result.results.length} visible case{result.results.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="overflow-hidden border border-white/10">
            {result.results.map((entry, index) => (
              <div key={`${entry.name}-${index}`} className="border-b border-white/10 bg-black/10 p-4 last:border-b-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-white">{entry.name}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/40">{entry.status || "completed"}</p>
                  </div>
                  <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", entry.passed ? "border-emerald-500/25 text-emerald-300" : "border-rose-500/25 text-rose-200")}>
                    {entry.passed ? "Passed" : "Failed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.hiddenSummary.total > 0 ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
          Hidden summary: passed {result.hiddenSummary.passed} of {result.hiddenSummary.total}. Failed {result.hiddenSummary.failed}.
        </div>
      ) : null}
    </div>
  );
}

function MetricPill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "failure";
}) {
  const valueClass = tone === "success"
    ? "text-emerald-300"
    : tone === "failure"
      ? "text-rose-300"
      : "text-white";

  return (
    <div className="border-b border-white/10 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">{label}</p>
      <p className={cn("mt-4 text-xl font-semibold tracking-tight sm:mt-5 sm:text-2xl", valueClass)}>{value}</p>
      <p className="mt-2 text-sm text-white/45 sm:mt-3">
        {label === "Visible" ? "examples passed" : label === "Compile" ? "compiler state" : "execution state"}
      </p>
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

function ResultPane({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: unknown;
  tone?: "neutral" | "expected" | "actual";
}) {
  const toneClass = tone === "expected"
    ? "text-emerald-200/70"
    : tone === "actual"
      ? "text-rose-200/70"
      : "text-white/70";

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">{label}</p>
      <pre className={cn("max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-[#202023] p-3 font-mono text-xs", toneClass)}>
        {formatTestValue(value) || "(empty)"}
      </pre>
    </div>
  );
}

function parseJsonObject(value: string | undefined): JsonRecord {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function readString(source: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function readRecordArray(source: JsonRecord, keys: string[]): JsonRecord[] {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
}

function readLimits(source: JsonRecord) {
  const limits = isRecord(source.limits) ? source.limits : {};
  return {
    timeoutMs: typeof limits.timeoutMs === "number" ? limits.timeoutMs : 3000,
    memoryMb: typeof limits.memoryMb === "number" ? limits.memoryMb : 128,
    network: false as const,
  };
}

function normalizeLanguage(value: string | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  if (["c#", "csharp", "cs"].includes(normalized)) {
    return "csharp" as const;
  }
  if (["js", "javascript", "node"].includes(normalized)) {
    return "javascript" as const;
  }
  if (["py", "python"].includes(normalized)) {
    return "python" as const;
  }
  if (["java"].includes(normalized)) {
    return "java" as const;
  }
  if (["c++", "cpp"].includes(normalized)) {
    return "cpp" as const;
  }

  return "javascript" as const;
}

function formatTestCase(test: JsonRecord) {
  return Object.entries(test)
    .map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`)
    .join("\n");
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default CodeChallengePage;
