import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircleIcon,
  BrainIcon,
  CheckIcon,
  PlayIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  SparklesIcon,
  StopCircleIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getErrorMessage } from "@/lib/api/errors";

import type {
  GeneratedQuizItemDraftDto,
  QuizItemDto,
  QuizSessionItemDto,
  ScoringResultDto,
} from "@/features/smart-quiz/api/dto";
import {
  useActiveQuizSessionQuery,
  useGenerateQuizItemsPreviewMutation,
  useNextQuizItemQuery,
  useQuizItemsByDeckQuery,
  useRestartQuizSessionMutation,
  useSaveGeneratedQuizItemsMutation,
  useStartQuizSessionMutation,
  useSubmitQuizAnswerMutation,
  useAbandonQuizSessionMutation,
} from "@/features/smart-quiz/api/hooks";

const defaultItemTypeValues = ["1", "9", "8"];

const selectableItemTypes = [
  { value: "1", label: "Concept" },
  { value: "2", label: "Read Code" },
  { value: "3", label: "Debug" },
  { value: "5", label: "Algorithm" },
  { value: "7", label: "Fill Code" },
  { value: "8", label: "Choice" },
  { value: "9", label: "Short" },
  { value: "10", label: "Flowchart" },
];

function SmartQuizPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDeckSqid = searchParams.get("deckSqid") ?? "";
  const [deckSqid, setDeckSqid] = useState(initialDeckSqid);
  const [sourceText, setSourceText] = useState("");
  const [count, setCount] = useState(5);
  const [technicalLanguage, setTechnicalLanguage] = useState("");
  const [itemTypes, setItemTypes] = useState<string[]>(defaultItemTypeValues);
  const [activeSessionSqid, setActiveSessionSqid] = useState<string | null>(searchParams.get("sessionSqid"));
  const [answer, setAnswer] = useState("");
  const [answerStartedAt, setAnswerStartedAt] = useState(() => Date.now());
  const [lastScoring, setLastScoring] = useState<ScoringResultDto | null>(null);

  const normalizedDeckSqid = deckSqid.trim();
  const deckItemsQuery = useQuizItemsByDeckQuery(normalizedDeckSqid || null);
  const activeSessionQuery = useActiveQuizSessionQuery(1, normalizedDeckSqid || null, null, Boolean(normalizedDeckSqid));
  const nextItemQuery = useNextQuizItemQuery(activeSessionSqid, Boolean(activeSessionSqid));
  const generatePreviewMutation = useGenerateQuizItemsPreviewMutation(normalizedDeckSqid || null);
  const saveGeneratedMutation = useSaveGeneratedQuizItemsMutation(normalizedDeckSqid || null);
  const startSessionMutation = useStartQuizSessionMutation();
  const restartSessionMutation = useRestartQuizSessionMutation();
  const abandonSessionMutation = useAbandonQuizSessionMutation();
  const submitAnswerMutation = useSubmitQuizAnswerMutation(activeSessionSqid);

  const preview = generatePreviewMutation.data;
  const activeSession = activeSessionQuery.data;
  const currentNextItem = nextItemQuery.data?.nextItem ?? null;
  const currentSession = nextItemQuery.data?.session ?? activeSession ?? null;
  const progressValue = currentSession ? Math.min(100, ((currentSession.currentItemIndex + 1) / Math.max(currentSession.take, 1)) * 100) : 0;

  const existingItemCount = deckItemsQuery.data?.length ?? 0;
  const canGenerate = Boolean(normalizedDeckSqid && sourceText.trim());
  const canSubmit = Boolean(activeSessionSqid && currentNextItem && answer.trim());

  function applyDeckSqid() {
    const next = new URLSearchParams(searchParams);
    if (normalizedDeckSqid) {
      next.set("deckSqid", normalizedDeckSqid);
    } else {
      next.delete("deckSqid");
    }
    setSearchParams(next);
  }

  async function handleGeneratePreview() {
    await generatePreviewMutation.mutateAsync({
      sourceText,
      count,
      learningDomain: 0,
      technicalLanguage: technicalLanguage.trim() || undefined,
      itemTypes: itemTypes.map(Number),
      difficulty: 50,
    });
  }

  async function handleSaveGenerated(items: GeneratedQuizItemDraftDto[]) {
    await saveGeneratedMutation.mutateAsync(items);
  }

  async function handleStartSession() {
    const session = await startSessionMutation.mutateAsync({
      scopeType: 1,
      deckSqid: normalizedDeckSqid,
      take: Math.max(1, Math.min(50, count)),
    });
    setActiveSessionSqid(session.sessionSqid);
    setAnswer("");
    setLastScoring(null);
    setAnswerStartedAt(Date.now());
  }

  async function handleRestartSession() {
    if (!activeSessionSqid) {
      return;
    }

    const session = await restartSessionMutation.mutateAsync(activeSessionSqid);
    setActiveSessionSqid(session.sessionSqid);
    setAnswer("");
    setLastScoring(null);
    setAnswerStartedAt(Date.now());
  }

  async function handleAbandonSession() {
    if (!activeSessionSqid) {
      return;
    }

    await abandonSessionMutation.mutateAsync(activeSessionSqid);
    setActiveSessionSqid(null);
    setAnswer("");
    setLastScoring(null);
  }

  async function handleResumeActiveSession() {
    if (!activeSession) {
      return;
    }

    setActiveSessionSqid(activeSession.sessionSqid);
    setAnswer("");
    setLastScoring(null);
    setAnswerStartedAt(Date.now());
  }

  async function handleSubmitAnswer() {
    if (!currentNextItem) {
      return;
    }

    const response = await submitAnswerMutation.mutateAsync({
      quizItemSqid: currentNextItem.quizItemSqid,
      answer,
      responseTimeMs: Date.now() - answerStartedAt,
      attemptContextJson: JSON.stringify({
        format: getAnswerFormat(currentNextItem.itemType),
        source: "smart-quiz-frontend",
      }),
    });

    setLastScoring(response.scoring);
    setAnswer("");
    setAnswerStartedAt(Date.now());
  }

  const currentError = useMemo(() => {
    const errors = [
      generatePreviewMutation.error,
      saveGeneratedMutation.error,
      startSessionMutation.error,
      restartSessionMutation.error,
      abandonSessionMutation.error,
      submitAnswerMutation.error,
      deckItemsQuery.error,
      activeSessionQuery.error,
      nextItemQuery.error,
    ].filter(Boolean);

    return errors.length > 0 ? getErrorMessage(errors[0]) : null;
  }, [
    abandonSessionMutation.error,
    activeSessionQuery.error,
    deckItemsQuery.error,
    generatePreviewMutation.error,
    nextItemQuery.error,
    restartSessionMutation.error,
    saveGeneratedMutation.error,
    startSessionMutation.error,
    submitAnswerMutation.error,
  ]);

  return (
    <section className="min-h-screen bg-background px-4 py-6 text-foreground md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit">Smart Quiz</Badge>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Adaptive quiz workspace</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Generate grounded quiz items from learning material, save them to a deck, and run an adaptive practice session.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:min-w-80">
            <label className="text-sm text-muted-foreground" htmlFor="smart-quiz-deck">
              Deck Sqid
            </label>
            <div className="flex gap-2">
              <Input
                id="smart-quiz-deck"
                value={deckSqid}
                onChange={(event) => setDeckSqid(event.target.value)}
                onBlur={applyDeckSqid}
                placeholder="Paste deck sqid"
              />
              <Button type="button" variant="outline" onClick={applyDeckSqid}>
                Apply
              </Button>
            </div>
          </div>
        </header>

        {currentError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Smart Quiz request failed</AlertTitle>
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        )}

        {!normalizedDeckSqid && (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>Deck context required</AlertTitle>
            <AlertDescription>
              Smart Quiz generation and sessions need a deck Sqid because EducAIteAPI owns quiz persistence.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="generate" className="gap-4">
          <TabsList>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="session">Session</TabsTrigger>
            <TabsTrigger value="deck">Deck Items</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <Card>
                <CardHeader>
                  <CardTitle>Generate preview</CardTitle>
                  <CardDescription>Use note, document, or course text as source material for AI-generated drafts.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted-foreground" htmlFor="smart-quiz-count">Item count</label>
                      <Input
                        id="smart-quiz-count"
                        type="number"
                        min={1}
                        max={50}
                        value={count}
                        onChange={(event) => setCount(Number(event.target.value))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted-foreground" htmlFor="smart-quiz-language">Technical language</label>
                      <Input
                        id="smart-quiz-language"
                        value={technicalLanguage}
                        onChange={(event) => setTechnicalLanguage(event.target.value)}
                        placeholder="Optional, e.g. Python"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">Item types</span>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      className="flex flex-wrap justify-start"
                      value={itemTypes}
                      onValueChange={(value) => setItemTypes(value.length > 0 ? value : defaultItemTypeValues)}
                    >
                      {selectableItemTypes.map((itemType) => (
                        <ToggleGroupItem key={itemType.value} value={itemType.value}>
                          {itemType.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground" htmlFor="smart-quiz-source">Source material</label>
                    <Textarea
                      id="smart-quiz-source"
                      value={sourceText}
                      onChange={(event) => setSourceText(event.target.value)}
                      placeholder="Paste note, document, or course material here."
                      className="min-h-56"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-3">
                  <div className="text-sm text-muted-foreground">{existingItemCount} saved item{existingItemCount === 1 ? "" : "s"} in deck</div>
                  <Button type="button" onClick={handleGeneratePreview} disabled={!canGenerate || generatePreviewMutation.isPending}>
                    {generatePreviewMutation.isPending ? <Spinner data-icon="inline-start" /> : <SparklesIcon data-icon="inline-start" />}
                    Generate
                  </Button>
                </CardFooter>
              </Card>

              <PreviewPanel
                previewItems={preview?.items ?? []}
                warnings={preview?.warnings ?? []}
                isLoading={generatePreviewMutation.isPending}
                isSaving={saveGeneratedMutation.isPending}
                onSaveAll={handleSaveGenerated}
              />
            </div>
          </TabsContent>

          <TabsContent value="session">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
              <Card>
                <CardHeader>
                  <CardTitle>Session controls</CardTitle>
                  <CardDescription>Start, resume, restart, or abandon deck-scoped adaptive practice.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {activeSession ? (
                    <SessionSummary sessionSqid={activeSession.sessionSqid} status={activeSession.status} current={activeSession.currentItemIndex + 1} total={activeSession.take} />
                  ) : (
                    <Empty className="min-h-40">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <BrainIcon />
                        </EmptyMedia>
                        <EmptyTitle>No active session found</EmptyTitle>
                        <EmptyDescription>Start a new Smart Quiz session from this deck.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                  {currentSession && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{currentSession.currentItemIndex + 1}/{currentSession.take}</span>
                      </div>
                      <Progress value={progressValue} />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap justify-end gap-2">
                  {activeSession && (
                    <Button type="button" variant="outline" onClick={handleResumeActiveSession}>
                      <RefreshCwIcon data-icon="inline-start" />
                      Resume
                    </Button>
                  )}
                  <Button type="button" onClick={handleStartSession} disabled={!normalizedDeckSqid || startSessionMutation.isPending}>
                    {startSessionMutation.isPending ? <Spinner data-icon="inline-start" /> : <PlayIcon data-icon="inline-start" />}
                    Start
                  </Button>
                  <Button type="button" variant="outline" onClick={handleRestartSession} disabled={!activeSessionSqid || restartSessionMutation.isPending}>
                    <RotateCcwIcon data-icon="inline-start" />
                    Restart
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleAbandonSession} disabled={!activeSessionSqid || abandonSessionMutation.isPending}>
                    <StopCircleIcon data-icon="inline-start" />
                    Abandon
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current item</CardTitle>
                  <CardDescription>Answer the adaptive item selected by EducAIteAPI.</CardDescription>
                  {currentNextItem && (
                    <CardAction>
                      <Badge variant="secondary">{currentNextItem.itemType}</Badge>
                    </CardAction>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {nextItemQuery.isLoading ? (
                    <QuizItemSkeleton />
                  ) : currentNextItem ? (
                    <AnswerPanel
                      item={currentNextItem}
                      answer={answer}
                      isSubmitting={submitAnswerMutation.isPending}
                      onAnswerChange={setAnswer}
                      onSubmit={handleSubmitAnswer}
                      canSubmit={canSubmit}
                    />
                  ) : (
                    <Empty className="min-h-72">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <CheckIcon />
                        </EmptyMedia>
                        <EmptyTitle>No current quiz item</EmptyTitle>
                        <EmptyDescription>Start or resume a session to load the next adaptive item.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                  {lastScoring && <FeedbackPanel scoring={lastScoring} />}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deck">
            <DeckItemsPanel isLoading={deckItemsQuery.isLoading} items={deckItemsQuery.data ?? []} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function PreviewPanel({
  previewItems,
  warnings,
  isLoading,
  isSaving,
  onSaveAll,
}: {
  previewItems: GeneratedQuizItemDraftDto[];
  warnings: string[];
  isLoading: boolean;
  isSaving: boolean;
  onSaveAll: (items: GeneratedQuizItemDraftDto[]) => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated item preview</CardTitle>
        <CardDescription>Review the AI draft before saving it to EducAIteAPI.</CardDescription>
        {previewItems.length > 0 && (
          <CardAction>
            <Button type="button" size="sm" onClick={() => onSaveAll(previewItems)} disabled={isSaving}>
              {isSaving ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
              Save all
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {warnings.length > 0 && (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>Generation warnings</AlertTitle>
            <AlertDescription>{warnings.join(" ")}</AlertDescription>
          </Alert>
        )}
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : previewItems.length === 0 ? (
          <Empty className="min-h-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SparklesIcon />
              </EmptyMedia>
              <EmptyTitle>No generated preview yet</EmptyTitle>
              <EmptyDescription>Paste source material and generate draft quiz items.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="max-h-[640px] pr-3">
            <div className="flex flex-col gap-3">
              {previewItems.map((item, index) => (
                <QuizDraftCard key={`${item.question}-${index}`} item={item} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function QuizDraftCard({ item }: { item: GeneratedQuizItemDraftDto }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{item.question}</CardTitle>
        <CardDescription>{item.answeringGuidance || "No additional guidance supplied."}</CardDescription>
        <CardAction>
          <Badge variant="secondary">{item.itemType}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Difficulty {item.difficulty}</Badge>
          <Badge variant="outline">{item.cognitiveSkill}</Badge>
          <Badge variant="outline">{item.learningDomain}</Badge>
          {item.technicalLanguage && <Badge variant="outline">{item.technicalLanguage}</Badge>}
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{item.expectedAnswer || item.explanation}</p>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SessionSummary({ sessionSqid, status, current, total }: { sessionSqid: string; status: string; current: number; total: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Session</span>
        <Badge variant="secondary">{status}</Badge>
      </div>
      <div className="truncate text-sm font-medium">{sessionSqid}</div>
      <div className="text-sm text-muted-foreground">Item {current} of {total}</div>
    </div>
  );
}

function AnswerPanel({
  item,
  answer,
  isSubmitting,
  canSubmit,
  onAnswerChange,
  onSubmit,
}: {
  item: QuizSessionItemDto;
  answer: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => Promise<void>;
}) {
  const answerFormat = getAnswerFormat(item.itemType);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Difficulty {item.difficulty}</Badge>
          <Badge variant="outline">{item.cognitiveSkill}</Badge>
          <Badge variant="outline">{item.learningDomain}</Badge>
          <Badge variant="secondary">{answerFormat}</Badge>
        </div>
        <p className="text-base leading-relaxed">{item.question}</p>
      </div>
      {item.itemType === "Flowchart" && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Mermaid answer expected</AlertTitle>
          <AlertDescription>Start with Mermaid syntax such as flowchart TD.</AlertDescription>
        </Alert>
      )}
      {["FillInCode", "Debugging", "CodeReading", "OutputPrediction"].includes(item.itemType) && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Code-focused answer</AlertTitle>
          <AlertDescription>Use the answer box for code or reasoning. Hidden test details will not be shown in feedback.</AlertDescription>
        </Alert>
      )}
      <Textarea
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        placeholder={item.itemType === "Flowchart" ? "flowchart TD\n  A[Start] --> B[Decision]" : "Type your answer here."}
        className="min-h-48"
      />
      <div className="flex justify-end">
        <Button type="button" onClick={onSubmit} disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? <Spinner data-icon="inline-start" /> : <SendIcon data-icon="inline-start" />}
          Submit answer
        </Button>
      </div>
    </div>
  );
}

function FeedbackPanel({ scoring }: { scoring: ScoringResultDto }) {
  const dimensions = [
    ["Correctness", scoring.correctnessScore],
    ["Completeness", scoring.completenessScore],
    ["Confidence", scoring.confidenceScore],
    ["Clarity", scoring.clarityScore],
    ["Misconception", scoring.misconceptionScore],
    ["Uncertainty", scoring.uncertaintyScore],
  ] as const;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
        <CardDescription>{scoring.feedbackSummary}</CardDescription>
        <CardAction>
          <Badge variant="secondary">{scoring.verdict}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {scoring.needsStudentConfirmation && (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>Provisional score</AlertTitle>
            <AlertDescription>{scoring.lowConfidenceReason || "The system was not fully confident in this score."}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Overall score</span>
            <span>{scoring.scorePercent}%</span>
          </div>
          <Progress value={scoring.scorePercent} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {dimensions.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </div>
        {scoring.semanticRationale && (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground">{scoring.semanticRationale}</p>
          </>
        )}
        {scoring.misconceptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {scoring.misconceptions.map((misconception) => (
              <Badge key={misconception} variant="outline">{misconception}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DeckItemsPanel({ items, isLoading }: { items: QuizItemDto[]; isLoading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deck quiz items</CardTitle>
        <CardDescription>Saved quiz items available for adaptive sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : items.length === 0 ? (
          <Empty className="min-h-72">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BrainIcon />
              </EmptyMedia>
              <EmptyTitle>No quiz items in this deck</EmptyTitle>
              <EmptyDescription>Generate and save items before starting adaptive practice.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <span className="text-muted-foreground">Use the Generate tab to create the first set.</span>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <QuizItemCard key={item.sqid} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuizItemCard({ item }: { item: QuizItemDto }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{item.question}</CardTitle>
        <CardDescription>{item.answeringGuidance || item.explanation || "No guidance supplied."}</CardDescription>
        <CardAction>
          <Badge variant="secondary">{item.itemType}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Difficulty {item.difficulty}</Badge>
          <Badge variant="outline">{item.cognitiveSkill}</Badge>
          <Badge variant="outline">{item.learningDomain}</Badge>
        </div>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuizItemSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-28" />
      <Skeleton className="h-48" />
      <Skeleton className="h-10" />
    </div>
  );
}

function getAnswerFormat(itemType: string) {
  if (itemType === "Flowchart") {
    return "mermaid";
  }

  if (["FillInCode", "Debugging", "CodeReading", "OutputPrediction"].includes(itemType)) {
    return "code";
  }

  if (itemType === "Sql") {
    return "sql";
  }

  return "text";
}

export default SmartQuizPage;
