import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BookOpenTextIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  useActiveFlashcardLearnSessionQuery,
  useDeckFlashcardsQuery,
  useFlashcardWorkspaceLatestQuery,
  useRestartFlashcardLearnSessionMutation,
  useResumeFlashcardLearnSessionMutation,
  useStartFlashcardLearnSessionMutation,
  useWorkspaceSubDecksQuery,
} from "@/features/flashcards/api/hooks";
import type {
  FlashcardLearnSessionResponseDto,
} from "@/features/flashcards/api/dto";
import { getFlashcardDocumentCardsPath, getFlashcardSessionPath } from "@/features/flashcards/routes";
import logo from "../../../assets/educAIte-logo.svg";

export function LearnPage() {
  const navigate = useNavigate();
  const { studentCourseSqid: majorDeckSqid, documentSqid: deckSqid } = useParams();

  const [resumeCandidate, setResumeCandidate] = useState<FlashcardLearnSessionResponseDto | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const subDecksQuery = useWorkspaceSubDecksQuery(majorDeckSqid ?? null);
  const cardsQuery = useDeckFlashcardsQuery(deckSqid ?? null);
  const startSessionMutation = useStartFlashcardLearnSessionMutation();
  const resumeSessionMutation = useResumeFlashcardLearnSessionMutation();
  const restartSessionMutation = useRestartFlashcardLearnSessionMutation();

  const selectedMajorDeck =
    (workspaceQuery.data?.decks ?? []).find((deck) => deck.majorDeckSqid === majorDeckSqid) ?? null;
  const selectedSubDeck =
    (subDecksQuery.data ?? []).find((subDeck) => subDeck.deckSqid === deckSqid) ?? null;
  const sessionStudentCourseSqid = selectedMajorDeck?.studentCourseSqid ?? null;
  const sessionScopeType = sessionStudentCourseSqid ? "Course" : "Overall";

  const activeSessionQuery = useActiveFlashcardLearnSessionQuery(
    sessionScopeType,
    sessionStudentCourseSqid,
    deckSqid ?? null,
    null,
    true,
  );

  useEffect(() => {
    if (!activeSessionQuery.isSuccess) return;
    setResumeCandidate(activeSessionQuery.data);
  }, [activeSessionQuery.data, activeSessionQuery.isSuccess]);

  const queueCards = cardsQuery.data ?? [];

  const handleBack = () => {
    if (majorDeckSqid && deckSqid) {
      navigate(getFlashcardDocumentCardsPath(majorDeckSqid, deckSqid));
      return;
    }
    navigate(-1);
  };

  const handleStartSession = () => {
    if (!deckSqid) {
      setSessionError("A deck review session requires a valid deck.");
      return;
    }

    setSessionError(null);
    startSessionMutation.mutate(
      {
        scopeType: sessionScopeType,
        studentCourseSqid: sessionStudentCourseSqid ?? undefined,
        deckSqid,
        take: Math.max(queueCards.length, 1),
        startMode: "auto",
      },
      {
        onSuccess: () => {
          if (majorDeckSqid && deckSqid) {
            navigate(getFlashcardSessionPath(majorDeckSqid, deckSqid));
          }
        },
        onError: (error) => {
          setSessionError(error instanceof Error ? error.message : "Unable to start the learn session.");
        },
      },
    );
  };

  const handleResumeSession = () => {
    if (!resumeCandidate?.sessionSqid) return;

    setSessionError(null);
    resumeSessionMutation.mutate(resumeCandidate.sessionSqid, {
      onSuccess: () => {
        if (majorDeckSqid && deckSqid) {
          navigate(getFlashcardSessionPath(majorDeckSqid, deckSqid));
        }
      },
      onError: (error) => {
        setSessionError(error instanceof Error ? error.message : "Unable to resume the learn session.");
      },
    });
  };

  const handleRestartSession = () => {
    const target = resumeCandidate?.sessionSqid ?? null;
    if (!target) return;

    setSessionError(null);
    restartSessionMutation.mutate(target, {
      onSuccess: () => {
        if (majorDeckSqid && deckSqid) {
          navigate(getFlashcardSessionPath(majorDeckSqid, deckSqid));
        }
      },
      onError: (error) => {
        setSessionError(error instanceof Error ? error.message : "Unable to restart the learn session.");
      },
    });
  };

  const showResumePanel = Boolean(resumeCandidate);
  const showStartPanel = !showResumePanel && !activeSessionQuery.isLoading;
  const isPageLoading = workspaceQuery.isLoading || subDecksQuery.isLoading || cardsQuery.isLoading || activeSessionQuery.isLoading;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_26%),oklch(0.145_0_0)] px-4 py-6 text-[oklch(0.985_0_0)] antialiased sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 lg:gap-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-md sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full border-white/20 bg-black/40 text-white hover:bg-white/10 hover:text-white"
              onClick={handleBack}
            >
              <ArrowLeftIcon />
            </Button>
            <img src={logo} alt="educAIte" className="h-7 opacity-95" />
          </div>
        </header>

        <div className="grid gap-6">
          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader className="gap-3 border-b border-white/8">
                <CardTitle className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {selectedSubDeck?.title ?? "Study deck"}
                </CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                  Choose how you want to proceed with your study session.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 py-4 md:grid-cols-3">
                <StepTile step="1" title="Read" text="Take in the prompt first." />
                <StepTile step="2" title="Answer" text="Write your solution clearly." />
                <StepTile step="3" title="Check" text="Review the AI feedback." />
              </CardContent>
            </Card>

            {sessionError ? (
              <Alert variant="destructive" className="border-rose-500/20 bg-rose-500/10">
                <AlertCircleIcon />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>{sessionError}</AlertDescription>
              </Alert>
            ) : null}

            {isPageLoading ? (
              <SessionLoadingSkeleton />
            ) : showResumePanel ? (
              <ResumeSessionPanel
                resumeCandidate={resumeCandidate}
                onContinue={handleResumeSession}
                onRestart={handleRestartSession}
                isResuming={resumeSessionMutation.isPending}
                isRestarting={restartSessionMutation.isPending}
              />
            ) : showStartPanel ? (
              <StartSessionPanel
                documentName={selectedSubDeck?.title ?? "Current deck"}
                cardCount={queueCards.length}
                onStart={handleStartSession}
                isStarting={startSessionMutation.isPending}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTile({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {step}
        </div>
        <div className="text-base font-semibold text-white">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/62">{text}</p>
    </div>
  );
}

function StartSessionPanel({ documentName, cardCount, onStart, isStarting }: { documentName: string; cardCount: number; onStart: () => void; isStarting: boolean }) {
  return (
    <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold text-white">Ready to start?</CardTitle>
        <CardDescription className="max-w-2xl text-base leading-7 text-white/60">
          Start a fresh study run for this deck. You will answer one card at a time and get feedback after each one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/35">Deck</div>
          <div className="mt-2 text-lg font-semibold text-white">{documentName}</div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 border-white/10 bg-transparent sm:flex-row sm:justify-end">
        <Button
          type="button"
          size="lg"
          className="h-12 w-full justify-center rounded-full px-8 text-center text-base text-primary-foreground hover:bg-primary/90 sm:w-auto"
          onClick={onStart}
          disabled={isStarting || cardCount === 0}
        >
          {isStarting ? <Spinner data-icon="inline-start" /> : <SparklesIcon data-icon="inline-start" />}
          Start review
        </Button>
      </CardFooter>
    </Card>
  );
}

function ResumeSessionPanel({ resumeCandidate, onContinue, onRestart, isResuming, isRestarting }: { resumeCandidate: FlashcardLearnSessionResponseDto | null; onContinue: () => void; onRestart: () => void; isResuming: boolean; isRestarting: boolean }) {
  if (!resumeCandidate) return null;
  const position = Math.min(resumeCandidate.currentItemIndex + 1, Math.max(resumeCandidate.items.length, 1));
  return (
    <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold text-white">Pick up where you left off</CardTitle>
        <CardDescription className="max-w-2xl text-base leading-7 text-white/60">
          We found a saved review for this deck.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/35">Current progress</div>
          <div className="mt-2 text-3xl font-semibold text-white">{position}/{resumeCandidate.items.length}</div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 border-white/10 bg-transparent sm:flex-row sm:justify-end">
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-12 w-full justify-center rounded-full border-white/20 bg-black/40 px-8 text-center text-base text-white hover:bg-white/10 hover:text-white sm:min-w-[180px]"
          onClick={onRestart}
          disabled={isRestarting || isResuming}
        >
          {isRestarting ? <Spinner data-icon="inline-start" /> : <RotateCcwIcon data-icon="inline-start" />}
          Start again
        </Button>
        <Button
          type="button"
          size="lg"
          className="h-12 w-full justify-center rounded-full px-8 text-center text-base text-primary-foreground hover:bg-primary/90 sm:min-w-[180px]"
          onClick={onContinue}
          disabled={isRestarting || isResuming}
        >
          {isResuming ? <Spinner data-icon="inline-start" /> : <BookOpenTextIcon data-icon="inline-start" />}
          Keep going
        </Button>
      </CardFooter>
    </Card>
  );
}

function SessionLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
        <CardHeader className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48 bg-white/10" />
          <Skeleton className="h-4 w-2/3 bg-white/8" />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-28 rounded-3xl bg-white/8" />
          <Skeleton className="h-28 rounded-3xl bg-white/8" />
        </CardContent>
      </Card>
    </div>
  );
}

export default LearnPage;
