import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  CheckIcon,
  CodeIcon,
  FileTextIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  SparklesIcon,
  StopCircleIcon,
} from "lucide-react";

import { useCreateWorkspaceSubDeckMutation, useWorkspaceSubDecksQuery } from "@/features/flashcards/api/hooks";
import type { FlashcardDeckResponseDto, FlashcardSubDeckResponseDto } from "@/features/flashcards/api/dto";
import type {
  GeneratedQuizItemDraftDto,
  QuizGenerationJobDto,
  QuizItemDto,
  QuizSessionItemDto,
  ScoringResultDto,
} from "@/features/smart-quiz/api/dto";
import {
  useAbandonQuizSessionMutation,
  useActiveQuizSessionQuery,
  useGenerateQuizItemsPreviewMutation,
  useNextQuizItemQuery,
  useQuizGenerationJobQuery,
  useQuizItemsByDeckQuery,
  useRestartQuizSessionMutation,
  useRetryQuizGenerationHydrationMutation,
  useSaveGeneratedQuizItemsMutation,
  useStartQuizSessionMutation,
  useSubmitQuizAnswerMutation,
} from "@/features/smart-quiz/api/hooks";
import {
  clampSmartQuizPreviewCount,
  getQuizDraftValidationMeta,
  getQuizGenerationHydrationMeta,
  getSavableQuizDrafts,
  getSmartQuizPreviewCountError,
  isJavaExecutableItemType,
  isJavaTechnicalLanguage,
  smartQuizPreviewCountMax,
  smartQuizPreviewCountMin,
  toJavaSafeItemTypes,
} from "@/features/smart-quiz/preview-generation";
import { getErrorMessage } from "@/lib/api/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ToastProvider";

const defaultItemTypeValues = ["1", "9", "8"];
const codeLikeItemTypes = new Set(["CodeReading", "Debugging", "OutputPrediction", "FillInCode", "Sql", "Algorithm"]);
const sourceTypeOptions = [
  { label: "Manual", value: "0" },
  { label: "Note", value: "1" },
  { label: "Document", value: "2" },
];
const selectableItemTypes = [
  { value: "1", label: "Concept" },
  { value: "2", label: "Read Code" },
  { value: "3", label: "Debug" },
  { value: "4", label: "SQL" },
  { value: "5", label: "Algorithm" },
  { value: "7", label: "Fill Code" },
  { value: "8", label: "Choice" },
  { value: "9", label: "Short" },
];

type WorkspaceMajorDeckDialogProps = {
  majorDeck: FlashcardDeckResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenDocuments?: (studentCourseSqid: string) => void;
  initialSubDeckSqid?: string | null;
};

export function WorkspaceMajorDeckDialog({
  majorDeck,
  open,
  onOpenChange,
  onOpenDocuments,
  initialSubDeckSqid = null,
}: WorkspaceMajorDeckDialogProps) {
  const isMobile = useIsMobileViewport();
  const { showSuccess } = useToast();
  const subDecksQuery = useWorkspaceSubDecksQuery(open && majorDeck ? majorDeck.majorDeckSqid : null);
  const createSubDeckMutation = useCreateWorkspaceSubDeckMutation(majorDeck?.majorDeckSqid ?? null);
  const [selectedSubDeckSqid, setSelectedSubDeckSqid] = useState<string | null>(null);
  const [subDeckTitle, setSubDeckTitle] = useState("");
  const [subDeckDescription, setSubDeckDescription] = useState("");
  const [subDeckSourceType, setSubDeckSourceType] = useState("0");

  const subDecks = subDecksQuery.data ?? majorDeck?.subDecks ?? [];
  const selectedSubDeck = subDecks.find((subDeck) => subDeck.deckSqid === selectedSubDeckSqid) ?? subDecks[0] ?? null;
  const summary = useMemo(() => {
    return subDecks.reduce(
      (acc, subDeck) => ({
        subDecks: acc.subDecks + 1,
        quizItems: acc.quizItems + subDeck.quizItemCount,
      }),
      { subDecks: 0, quizItems: 0 },
    );
  }, [subDecks]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (
      initialSubDeckSqid &&
      subDecks.some((subDeck) => subDeck.deckSqid === initialSubDeckSqid) &&
      selectedSubDeckSqid !== initialSubDeckSqid
    ) {
      setSelectedSubDeckSqid(initialSubDeckSqid);
      return;
    }

    if (selectedSubDeckSqid && subDecks.some((subDeck) => subDeck.deckSqid === selectedSubDeckSqid)) {
      return;
    }

    setSelectedSubDeckSqid(subDecks[0]?.deckSqid ?? null);
  }, [initialSubDeckSqid, open, selectedSubDeckSqid, subDecks]);

  if (!majorDeck) {
    return null;
  }

  async function handleCreateSubDeck() {
    const created = await createSubDeckMutation.mutateAsync({
      title: subDeckTitle,
      description: subDeckDescription,
      sourceType: Number(subDeckSourceType),
      difficultyFloor: 0,
      difficultyCeiling: 100,
      visibility: 0,
      status: 1,
    });

    setSubDeckTitle("");
    setSubDeckDescription("");
    setSubDeckSourceType("0");
    setSelectedSubDeckSqid(created.deckSqid);
    showSuccess("Subdeck created.");
  }

  const content = (
    <div className="dark flex max-h-[85vh] flex-col gap-4 bg-background text-foreground">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>{majorDeck.deckName}</CardTitle>
            <CardDescription>
              {majorDeck.sourceType === "Course"
                ? "Course-backed major deck for structured study and document-linked practice."
                : "Manual major deck for flexible self-organized study collections."}
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{majorDeck.sourceType}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {majorDeck.edpCode ? (
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <span className="text-sm text-muted-foreground">Course code</span>
                <span className="text-sm font-medium">{majorDeck.edpCode}</span>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Documents" value={majorDeck.documentCount} icon={<FileTextIcon />} />
              <MetricCard label="Flashcards" value={majorDeck.flashcardCount} icon={<BookOpenIcon />} />
              <MetricCard label="Subdecks" value={summary.subDecks} icon={<BrainIcon />} />
              <MetricCard label="Practice Items" value={summary.quizItems} icon={<SparklesIcon />} />
            </div>
            {majorDeck.studentCourseSqid && onOpenDocuments ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenDocuments(majorDeck.studentCourseSqid!)}
              >
                <ArrowRightIcon data-icon="inline-start" />
                Open course documents
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex min-h-0 flex-col gap-4">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Subdecks</CardTitle>
              <CardDescription>Each subdeck is the quiz item container used by adaptive sessions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="flex min-h-0 flex-col gap-3">
                  {subDecksQuery.isLoading ? (
                    <div className="grid gap-3">
                      <Skeleton className="h-24" />
                      <Skeleton className="h-24" />
                      <Skeleton className="h-24" />
                    </div>
                  ) : subDecks.length === 0 ? (
                    <Empty className="min-h-52 border border-dashed">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <BrainIcon />
                        </EmptyMedia>
                        <EmptyTitle>No subdecks yet</EmptyTitle>
                        <EmptyDescription>Create the first subdeck to start generating practice items.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <ScrollArea className="max-h-[320px] pr-3">
                      <div className="flex flex-col gap-3">
                        {subDecks.map((subDeck) => (
                          <button
                            key={subDeck.deckSqid}
                            type="button"
                            onClick={() => setSelectedSubDeckSqid(subDeck.deckSqid)}
                            className={`flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors ${
                              selectedSubDeck?.deckSqid === subDeck.deckSqid
                                ? "border-primary bg-accent/50"
                                : "border-border bg-muted/20 hover:bg-muted/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">{subDeck.title}</div>
                                <div className="text-xs text-muted-foreground">{subDeck.quizItemCount} practice items</div>
                              </div>
                              <Badge variant="outline">{subDeck.sourceType}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Difficulty</span>
                              <span>{subDeck.difficultyFloor}-{subDeck.difficultyCeiling}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                <Card size="sm" className="bg-background/60">
                  <CardHeader>
                    <CardTitle>Create subdeck</CardTitle>
                    <CardDescription>Use subdecks to split one major deck into focused quiz practice sets.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="subdeck-title" className="text-sm text-muted-foreground">Title</label>
                      <Input
                        id="subdeck-title"
                        value={subDeckTitle}
                        onChange={(event) => setSubDeckTitle(event.target.value)}
                        placeholder="Example: SQL joins and grouping"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="subdeck-source-type" className="text-sm text-muted-foreground">Source type</label>
                      <Select value={subDeckSourceType} onValueChange={setSubDeckSourceType}>
                        <SelectTrigger id="subdeck-source-type" className="w-full">
                          <SelectValue placeholder="Select source type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {sourceTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="subdeck-description" className="text-sm text-muted-foreground">Description</label>
                      <Textarea
                        id="subdeck-description"
                        value={subDeckDescription}
                        onChange={(event) => setSubDeckDescription(event.target.value)}
                        placeholder="What concepts should this subdeck cover?"
                        className="min-h-28"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      type="button"
                      onClick={handleCreateSubDeck}
                      disabled={!subDeckTitle.trim() || createSubDeckMutation.isPending}
                    >
                      {createSubDeckMutation.isPending ? <Spinner data-icon="inline-start" /> : <PlusIcon data-icon="inline-start" />}
                      Add subdeck
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          {selectedSubDeck ? (
            <SmartQuizDeckWorkspace subDeck={selectedSubDeck} />
          ) : null}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{majorDeck.deckName}</DrawerTitle>
            <DrawerDescription>Manage subdecks and run Smart Quiz from the current workspace.</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>{majorDeck.deckName}</DialogTitle>
          <DialogDescription>Manage subdecks and run Smart Quiz from the current workspace.</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6 pb-6">{content}</div>
      </DialogContent>
    </Dialog>
  );
}

function SmartQuizDeckWorkspace({ subDeck }: { subDeck: FlashcardSubDeckResponseDto }) {
  const { showSuccess } = useToast();
  const [sourceText, setSourceText] = useState("");
  const [count, setCount] = useState(5);
  const [technicalLanguage, setTechnicalLanguage] = useState("");
  const [itemTypes, setItemTypes] = useState<string[]>(defaultItemTypeValues);
  const [generationJobSqid, setGenerationJobSqid] = useState<string | null>(null);
  const [activeSessionSqid, setActiveSessionSqid] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [answerStartedAt, setAnswerStartedAt] = useState(() => Date.now());
  const [lastScoring, setLastScoring] = useState<ScoringResultDto | null>(null);

  const deckItemsQuery = useQuizItemsByDeckQuery(subDeck.deckSqid);
  const activeSessionQuery = useActiveQuizSessionQuery(1, subDeck.deckSqid, null, true);
  const nextItemQuery = useNextQuizItemQuery(activeSessionSqid, Boolean(activeSessionSqid));
  const generatePreviewMutation = useGenerateQuizItemsPreviewMutation(subDeck.deckSqid);
  const generationJobQuery = useQuizGenerationJobQuery(generationJobSqid, Boolean(generationJobSqid));
  const retryHydrationMutation = useRetryQuizGenerationHydrationMutation(generationJobSqid);
  const saveGeneratedMutation = useSaveGeneratedQuizItemsMutation(subDeck.deckSqid);
  const startSessionMutation = useStartQuizSessionMutation();
  const restartSessionMutation = useRestartQuizSessionMutation();
  const abandonSessionMutation = useAbandonQuizSessionMutation();
  const submitAnswerMutation = useSubmitQuizAnswerMutation(activeSessionSqid);

  const preview = generationJobQuery.data ?? generatePreviewMutation.data;
  const activeSession = activeSessionQuery.data;
  const currentNextItem = nextItemQuery.data?.nextItem ?? null;
  const currentSession = nextItemQuery.data?.session ?? activeSession ?? null;
  const progressValue = currentSession
    ? Math.min(100, ((currentSession.currentItemIndex + 1) / Math.max(currentSession.take, 1)) * 100)
    : 0;
  const previewCountError = getSmartQuizPreviewCountError(count);
  const isJavaContent = isJavaTechnicalLanguage(technicalLanguage);
  const currentError = useMemo(() => {
    const errors = [
      generatePreviewMutation.error,
      generationJobQuery.error,
      retryHydrationMutation.error,
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
    generationJobQuery.error,
    nextItemQuery.error,
    retryHydrationMutation.error,
    restartSessionMutation.error,
    saveGeneratedMutation.error,
    startSessionMutation.error,
    submitAnswerMutation.error,
  ]);

  useEffect(() => {
    setActiveSessionSqid(activeSession?.sessionSqid ?? null);
  }, [activeSession?.sessionSqid]);

  useEffect(() => {
    if (!isJavaContent) {
      return;
    }

    setItemTypes((current) => toJavaSafeItemTypes(current, defaultItemTypeValues));
  }, [isJavaContent]);

  async function handleGeneratePreview() {
    const requestedCount = clampSmartQuizPreviewCount(count);
    const requestedItemTypes = isJavaContent
      ? toJavaSafeItemTypes(itemTypes, defaultItemTypeValues)
      : itemTypes;

    setCount(requestedCount);

    const response = await generatePreviewMutation.mutateAsync({
      sourceText,
      count: requestedCount,
      learningDomain: 0,
      technicalLanguage: technicalLanguage.trim() || undefined,
      itemTypes: requestedItemTypes.map(Number),
      difficulty: 50,
    });
    setGenerationJobSqid(response.generationJobSqid);
  }

  async function handleSaveGenerated(items: GeneratedQuizItemDraftDto[]) {
    await saveGeneratedMutation.mutateAsync(items);
    showSuccess("Generated practice items saved.");
  }

  async function handleStartSession() {
    const session = await startSessionMutation.mutateAsync({
      scopeType: 1,
      deckSqid: subDeck.deckSqid,
      take: clampSmartQuizPreviewCount(count),
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
        source: "flashcards-workspace",
      }),
    });

    setLastScoring(response.scoring);
    setAnswer("");
    setAnswerStartedAt(Date.now());
  }

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>{subDeck.title}</CardTitle>
        <CardDescription>Generate practice items, save them into this subdeck, and run adaptive practice.</CardDescription>
        <CardAction>
          <div className="flex gap-2">
            <Badge variant="outline">{subDeck.sourceType}</Badge>
            <Badge variant="secondary">{subDeck.quizItemCount} items</Badge>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {currentError ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Smart Quiz request failed</AlertTitle>
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        ) : null}

        <Tabs defaultValue="generate">
          <TabsList>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="session">Session</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <Card size="sm" className="bg-background/60">
                <CardHeader>
                  <CardTitle>Generate preview</CardTitle>
                  <CardDescription>Paste notes, code explanations, or course material to generate quiz drafts.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`count-${subDeck.deckSqid}`} className="text-sm text-muted-foreground">Item count</label>
                      <Input
                        id={`count-${subDeck.deckSqid}`}
                        type="number"
                        min={smartQuizPreviewCountMin}
                        max={smartQuizPreviewCountMax}
                        value={count}
                        onChange={(event) => setCount(Number(event.target.value))}
                        onBlur={() => setCount((current) => clampSmartQuizPreviewCount(current))}
                        aria-invalid={Boolean(previewCountError)}
                      />
                      {previewCountError ? (
                        <p className="text-xs text-destructive">{previewCountError}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Generate 3 to 10 drafts.</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`lang-${subDeck.deckSqid}`} className="text-sm text-muted-foreground">Technical language</label>
                      <Input
                        id={`lang-${subDeck.deckSqid}`}
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
                      onValueChange={(values) => {
                        const nextValues = values.length > 0 ? values : defaultItemTypeValues;
                        setItemTypes(isJavaContent ? toJavaSafeItemTypes(nextValues, defaultItemTypeValues) : nextValues);
                      }}
                    >
                      {selectableItemTypes.map((itemType) => (
                        <ToggleGroupItem
                          key={itemType.value}
                          value={itemType.value}
                          disabled={isJavaContent && isJavaExecutableItemType(itemType.value)}
                        >
                          {itemType.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    {isJavaContent ? (
                      <Alert>
                        <AlertCircleIcon />
                        <AlertTitle>Java study mode</AlertTitle>
                        <AlertDescription>
                          Java source can generate conceptual, short-answer, or choice items. Executable Java prompts are excluded.
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`source-${subDeck.deckSqid}`} className="text-sm text-muted-foreground">Source material</label>
                    <Textarea
                      id={`source-${subDeck.deckSqid}`}
                      value={sourceText}
                      onChange={(event) => setSourceText(event.target.value)}
                      placeholder="Paste lecture notes, code examples, or concept explanations here."
                      className="min-h-56"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    type="button"
                    onClick={handleGeneratePreview}
                    disabled={!sourceText.trim() || Boolean(previewCountError) || generatePreviewMutation.isPending}
                  >
                    {generatePreviewMutation.isPending ? <Spinner data-icon="inline-start" /> : <SparklesIcon data-icon="inline-start" />}
                    Generate
                  </Button>
                </CardFooter>
              </Card>

              <PreviewPanel
                generationJob={preview ?? null}
                previewItems={preview?.drafts ?? []}
                warnings={preview?.warnings ?? []}
                errors={preview?.errors ?? []}
                learningDomain={preview?.learningDomain}
                technicalLanguage={preview?.technicalLanguage}
                isPolling={generationJobQuery.isFetching && Boolean(generationJobSqid)}
                isLoading={generatePreviewMutation.isPending}
                isRetrying={retryHydrationMutation.isPending}
                isSaving={saveGeneratedMutation.isPending}
                onRetryHydration={generationJobSqid ? () => retryHydrationMutation.mutateAsync() : undefined}
                onSaveAll={handleSaveGenerated}
              />
            </div>
          </TabsContent>

          <TabsContent value="session">
            <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
              <Card size="sm" className="bg-background/60">
                <CardHeader>
                  <CardTitle>Session controls</CardTitle>
                  <CardDescription>Run deck-scoped adaptive practice for this subdeck.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {activeSession ? (
                    <SessionSummary
                      sessionSqid={activeSession.sessionSqid}
                      status={activeSession.status}
                      current={activeSession.currentItemIndex + 1}
                      total={activeSession.take}
                    />
                  ) : (
                    <Empty className="min-h-40 border border-dashed">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <BrainIcon />
                        </EmptyMedia>
                        <EmptyTitle>No active session</EmptyTitle>
                        <EmptyDescription>Start a new adaptive run for this subdeck.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                  {currentSession ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{currentSession.currentItemIndex + 1}/{currentSession.take}</span>
                      </div>
                      <Progress value={progressValue} />
                    </div>
                  ) : null}
                </CardContent>
                <CardFooter className="flex flex-wrap justify-end gap-2">
                  <Button type="button" onClick={handleStartSession} disabled={startSessionMutation.isPending}>
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

              <Card size="sm" className="bg-background/60">
                <CardHeader>
                  <CardTitle>Current item</CardTitle>
                  <CardDescription>Answer the adaptive prompt selected by EducAIteAPI.</CardDescription>
                  {currentNextItem ? (
                    <CardAction>
                      <Badge variant="secondary">{currentNextItem.itemType}</Badge>
                    </CardAction>
                  ) : null}
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
                    />
                  ) : (
                    <Empty className="min-h-72 border border-dashed">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <CheckIcon />
                        </EmptyMedia>
                        <EmptyTitle>No current quiz item</EmptyTitle>
                        <EmptyDescription>Start or resume a session to load the next adaptive item.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                  {lastScoring ? <FeedbackPanel scoring={lastScoring} /> : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items">
            <DeckItemsPanel items={deckItemsQuery.data ?? []} isLoading={deckItemsQuery.isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PreviewPanel({
  generationJob,
  previewItems,
  warnings,
  errors,
  learningDomain,
  technicalLanguage,
  isPolling,
  isLoading,
  isRetrying,
  isSaving,
  onRetryHydration,
  onSaveAll,
}: {
  generationJob: QuizGenerationJobDto | null;
  previewItems: GeneratedQuizItemDraftDto[];
  warnings: string[];
  errors: string[];
  learningDomain?: string;
  technicalLanguage?: string;
  isPolling: boolean;
  isLoading: boolean;
  isRetrying: boolean;
  isSaving: boolean;
  onRetryHydration?: () => Promise<unknown>;
  onSaveAll: (items: GeneratedQuizItemDraftDto[]) => Promise<void>;
}) {
  const savableItems = getSavableQuizDrafts(previewItems);
  const hydrationMeta = generationJob ? getQuizGenerationHydrationMeta(generationJob.hydrationStatus) : null;
  const canRetryHydration = Boolean(
    generationJob && onRetryHydration && generationJob.hydrationStatus !== "Ready",
  );

  return (
    <Card size="sm" className="bg-background/60">
      <CardHeader>
        <CardTitle>Generated item preview</CardTitle>
        <CardDescription>Review the AI draft before saving it into the selected subdeck.</CardDescription>
        {previewItems.length > 0 ? (
          <CardAction>
            <div className="flex flex-wrap justify-end gap-2">
              {canRetryHydration ? (
                <Button type="button" size="sm" variant="outline" onClick={onRetryHydration} disabled={isRetrying}>
                  {isRetrying ? <Spinner data-icon="inline-start" /> : <RefreshCwIcon data-icon="inline-start" />}
                  Retry hydration
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                onClick={() => onSaveAll(savableItems)}
                disabled={isSaving || savableItems.length === 0}
              >
                {isSaving ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
                Save usable
              </Button>
            </div>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {generationJob && hydrationMeta ? (
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={hydrationMeta.variant}>{hydrationMeta.label}</Badge>
                {isPolling ? <Spinner className="size-4" /> : null}
              </div>
              <span className="text-xs text-muted-foreground">
                {previewItems.length}/{generationJob.requestedCount} drafts
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{hydrationMeta.description}</p>
            <p className="truncate text-xs text-muted-foreground">Job {generationJob.generationJobSqid}</p>
          </div>
        ) : null}
        {errors.length > 0 ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Hydration errors</AlertTitle>
            <AlertDescription>{errors.join(" ")}</AlertDescription>
          </Alert>
        ) : null}
        {warnings.length > 0 ? (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>Generation warnings</AlertTitle>
            <AlertDescription>{warnings.join(" ")}</AlertDescription>
          </Alert>
        ) : null}
        {learningDomain || technicalLanguage ? (
          <div className="flex flex-wrap gap-2">
            {learningDomain ? <Badge variant="outline">{learningDomain}</Badge> : null}
            {technicalLanguage ? <Badge variant="outline">{technicalLanguage}</Badge> : null}
          </div>
        ) : null}
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : previewItems.length === 0 ? (
          <Empty className="min-h-72 border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SparklesIcon />
              </EmptyMedia>
              <EmptyTitle>No generated preview yet</EmptyTitle>
              <EmptyDescription>Paste study material and generate a draft set first.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="max-h-[540px] pr-3">
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
  const validationMeta = getQuizDraftValidationMeta(item.validationStatus);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{item.question}</CardTitle>
        <CardDescription>{item.answeringGuidance || validationMeta.description}</CardDescription>
        <CardAction>
          <div className="flex flex-wrap justify-end gap-2">
            <Badge variant={validationMeta.variant}>{validationMeta.label}</Badge>
            <Badge variant="secondary">{item.itemType}</Badge>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{validationMeta.description}</p>
        {item.errors.length > 0 ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Draft unavailable</AlertTitle>
            <AlertDescription>{item.errors.join(" ")}</AlertDescription>
          </Alert>
        ) : null}
        {item.warnings.length > 0 ? (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>Draft warning</AlertTitle>
            <AlertDescription>{item.warnings.join(" ")}</AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Difficulty {item.difficulty}</Badge>
          <Badge variant="outline">{item.cognitiveSkill}</Badge>
          <Badge variant="outline">{item.learningDomain}</Badge>
          {item.technicalLanguage ? <Badge variant="outline">{item.technicalLanguage}</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">{item.expectedAnswer || item.explanation}</p>
        {item.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function AnswerPanel({
  item,
  answer,
  isSubmitting,
  onAnswerChange,
  onSubmit,
}: {
  item: QuizSessionItemDto;
  answer: string;
  isSubmitting: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => Promise<void>;
}) {
  const answerFormat = getAnswerFormat(item.itemType);
  const isCodeLike = codeLikeItemTypes.has(item.itemType);
  const isFlowchart = item.itemType === "Flowchart";

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

      <Tabs defaultValue="answer">
        <TabsList>
          <TabsTrigger value="answer">Answer</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>
        <TabsContent value="answer">
          <div className="flex flex-col gap-3">
            <Textarea
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder={isFlowchart ? "flowchart TD\n  A[Start] --> B[Decision]" : "Type your answer here."}
              className={`min-h-56 ${isCodeLike ? "font-mono text-sm" : ""}`}
            />
            <div className="flex justify-end">
              <Button type="button" onClick={onSubmit} disabled={!answer.trim() || isSubmitting}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : <SendIcon data-icon="inline-start" />}
                Submit answer
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="validation">
          <ValidationPanel itemType={item.itemType} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ValidationPanel({ itemType }: { itemType: string }) {
  if (itemType === "Flowchart") {
    return (
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>Mermaid flowchart answer</AlertTitle>
        <AlertDescription>
          Start with `flowchart` or `graph`. Invalid Mermaid syntax should be corrected before relying on the result.
        </AlertDescription>
      </Alert>
    );
  }

  if (codeLikeItemTypes.has(itemType)) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle>Code sandbox status</CardTitle>
          <CardDescription>The current frontend supports code-answer UX, but live execution is not exposed by the API route set yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert>
            <CodeIcon />
            <AlertTitle>Sandbox unavailable</AlertTitle>
            <AlertDescription>
              Students can still submit code or SQL answers for scoring. Runtime execution feedback is intentionally marked unavailable instead of being faked.
            </AlertDescription>
          </Alert>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Compile" value="Not run" icon={<CodeIcon />} />
            <MetricCard label="Runtime" value="Not run" icon={<PlayIcon />} />
          </div>
          <Button type="button" variant="outline" disabled>
            <PlayIcon data-icon="inline-start" />
            Run sandbox
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Alert>
      <BrainIcon />
      <AlertTitle>Text evaluation mode</AlertTitle>
      <AlertDescription>This item will be evaluated as a structured text response with rubric-aware scoring.</AlertDescription>
    </Alert>
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
          <div className="flex gap-2">
            <Badge variant="secondary">{scoring.verdict}</Badge>
            <Badge variant="outline">{scoring.scoringSource}</Badge>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {scoring.needsStudentConfirmation ? (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>Provisional score</AlertTitle>
            <AlertDescription>{scoring.lowConfidenceReason || "The system was not fully confident in this score."}</AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Overall score</span>
            <span>{scoring.scorePercent}%</span>
          </div>
          <Progress value={scoring.scorePercent} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
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
        {scoring.semanticRationale ? (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground">{scoring.semanticRationale}</p>
          </>
        ) : null}
        {scoring.misconceptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {scoring.misconceptions.map((misconception) => (
              <Badge key={misconception} variant="outline">{misconception}</Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DeckItemsPanel({ items, isLoading }: { items: QuizItemDto[]; isLoading: boolean }) {
  return (
    <Card size="sm" className="bg-background/60">
      <CardHeader>
        <CardTitle>Saved practice items</CardTitle>
        <CardDescription>Review what already lives in the current subdeck.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : items.length === 0 ? (
          <Empty className="min-h-72 border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BrainIcon />
              </EmptyMedia>
              <EmptyTitle>No practice items in this subdeck</EmptyTitle>
              <EmptyDescription>Generate and save practice items before starting adaptive practice.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Difficulty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.sqid}>
                  <TableCell className="whitespace-normal">
                    <div className="font-medium">{item.question}</div>
                  </TableCell>
                  <TableCell>{item.itemType}</TableCell>
                  <TableCell>{item.cognitiveSkill}</TableCell>
                  <TableCell>{item.difficulty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function SessionSummary({
  sessionSqid,
  status,
  current,
  total,
}: {
  sessionSqid: string;
  status: string;
  current: number;
  total: number;
}) {
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

function MetricCard({ label, value, icon }: { label: string; value: number | string; icon: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background/70 p-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{icon}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
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

  if (codeLikeItemTypes.has(itemType)) {
    return itemType === "Sql" ? "sql" : "code";
  }

  return "text";
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}
