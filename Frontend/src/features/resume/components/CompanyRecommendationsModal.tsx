import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import {
  AlertCircle,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  FileSearch,
  Flag,
  Lightbulb,
  MapPin,
  Route,
  Search,
  SlidersHorizontal,
  Target,
} from "lucide-react";

import {
  useJobSuggestions,
  useSaveCompanyRecommendation,
  useSearchJobSuggestions,
  useUpdateCompanyRecommendationStatus,
} from "../api/hooks";
import type {
  CompanyRecommendationMatchIntelligence,
  JobSuggestionItemResponse,
  SaveCompanyRecommendationRequest,
} from "../api/studentDto";
import { useResumeStore } from "../hooks/useResumeStore";
import { normalizeApiError } from "@/lib/api/errors";
import { useToast } from "@/components/ToastProvider";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompanyRecommendationsModalProps {
  resumeSqid: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const WORK_SETUP_OPTIONS = ["Remote", "Hybrid", "Onsite"];
const EMPLOYMENT_TYPE_OPTIONS = ["Internship", "Entry-level", "Part-time", "Contract"];
const TRACKING_ACTIONS: Array<{ label: string; status: SaveCompanyRecommendationRequest["status"] }> = [
  { label: "Save", status: "Saved" },
  { label: "Mark Applied", status: "Applied" },
  { label: "Mark Interviewing", status: "Interviewing" },
  { label: "Mark Rejected", status: "Rejected" },
  { label: "Mark Offer", status: "Offer" },
  { label: "Not Interested", status: "NotInterested" },
];
const JOB_SEARCH_LOADING_STEPS = [
  "Building request packet...",
  "Planning Gemini search...",
  "Searching verified postings...",
  "Reading job pages...",
  "Analyzing resume fit...",
  "Ranking strongest matches...",
  "Saving final matches...",
];
const JOB_SEARCH_LOADING_STEP_MS = 2600;

export default function CompanyRecommendationsModal({
  resumeSqid,
  isOpen,
  onOpenChange,
}: CompanyRecommendationsModalProps) {
  const storedTargetRole = useResumeStore((state) => state.data.targetRole);
  const { data: savedSuggestions, isLoading } = useJobSuggestions(resumeSqid);
  const searchMutation = useSearchJobSuggestions(resumeSqid);
  const { showSuccess } = useToast();

  const [targetRole, setTargetRole] = useState(storedTargetRole ?? "");
  const [location, setLocation] = useState("");
  const [workSetup, setWorkSetup] = useState<string[]>(["Remote", "Hybrid"]);
  const [employmentType, setEmploymentType] = useState<string[]>(["Internship", "Entry-level"]);
  const [maxResults, setMaxResults] = useState("10");
  const [searchError, setSearchError] = useState<{ title: string; message: string } | null>(null);
  const [latestResults, setLatestResults] = useState<JobSuggestionItemResponse[] | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<JobSuggestionItemResponse | null>(null);

  const suggestions = useMemo(
    () => dedupeJobSuggestions(latestResults ?? savedSuggestions?.items ?? []),
    [latestResults, savedSuggestions?.items],
  );
  const hasSuggestions = suggestions.length > 0;

  const handleSearch = async () => {
    setSearchError(null);

    try {
      const response = await searchMutation.mutateAsync({
        targetRole: targetRole.trim() || null,
        location: location.trim() || null,
        workSetup,
        employmentType,
        maxResults: Number.parseInt(maxResults, 10) || 10,
      });

      setLatestResults(response.results);
      showSuccess(response.results.length > 0
        ? `Found ${response.results.length} job suggestion${response.results.length === 1 ? "" : "s"}.`
        : "No strong public job matches found.");
    } catch (error) {
      setSearchError(formatJobSuggestionError(error));
    }
  };

  const selectedSuggestionDetails = selectedSuggestion
    ? suggestions.find((suggestion) => isSameSuggestion(suggestion, selectedSuggestion)) ?? selectedSuggestion
    : null;

  const handleSuggestionChange = (updatedSuggestion: JobSuggestionItemResponse) => {
    setSelectedSuggestion(updatedSuggestion);
    setLatestResults((current) => {
      const source = current ?? savedSuggestions?.items ?? [];
      if (source.length === 0) {
        return current;
      }

      return source.map((item) => isSameSuggestion(item, updatedSuggestion) ? updatedSuggestion : item);
    });
  };

  const toggleArrayItem = (
    setter: Dispatch<SetStateAction<string[]>>,
    values: string[],
    item: string,
  ) => {
    setter(values.includes(item)
      ? values.filter((value) => value !== item)
      : [...values, item]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dark flex h-[92dvh] max-w-[calc(100%-1rem)] grid-rows-none flex-col gap-0 overflow-hidden border-white/10 bg-[#0A0A0A] p-0 text-white shadow-[0_0_80px_rgba(0,206,200,0.12)] sm:max-w-6xl">
        <DialogHeader className="border-b border-white/10 bg-[#0A0A0A] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-white">AI Job Suggestions</DialogTitle>
              <DialogDescription className="text-white/60">
                Specific public postings matched to this resume.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[20rem_1fr]">
          <aside className="border-b border-white/10 bg-[#0A0A0A] lg:border-r lg:border-b-0">
            <ScrollArea className="h-full max-h-[42dvh] lg:max-h-none">
              <div className="flex flex-col gap-5 p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <SlidersHorizontal />
                  Search filters
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="job-target-role">Target role</Label>
                  <Input
                    id="job-target-role"
                    value={targetRole}
                    disabled={searchMutation.isPending}
                    onChange={(event) => setTargetRole(event.target.value)}
                    placeholder="Optional, e.g. Frontend Intern"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="job-location">Location</Label>
                  <Input
                    id="job-location"
                    value={location}
                    disabled={searchMutation.isPending}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Optional, e.g. Remote, Manila"
                  />
                </div>

                <FilterGroup
                  label="Work setup"
                  options={WORK_SETUP_OPTIONS}
                  selected={workSetup}
                  disabled={searchMutation.isPending}
                  onToggle={(value) => toggleArrayItem(setWorkSetup, workSetup, value)}
                />

                <FilterGroup
                  label="Employment type"
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  selected={employmentType}
                  disabled={searchMutation.isPending}
                  onToggle={(value) => toggleArrayItem(setEmploymentType, employmentType, value)}
                />

                <div className="flex flex-col gap-2">
                  <Label htmlFor="job-max-results">Max results</Label>
                  <Input
                    id="job-max-results"
                    type="number"
                    min="1"
                    max="20"
                    value={maxResults}
                    disabled={searchMutation.isPending}
                    onChange={(event) => setMaxResults(event.target.value)}
                  />
                </div>

                <Button onClick={handleSearch} disabled={searchMutation.isPending}>
                  {searchMutation.isPending ? <Spinner data-icon="inline-start" /> : <Search data-icon="inline-start" />}
                  {searchMutation.isPending ? "Searching" : "Search job suggestions"}
                </Button>
              </div>
            </ScrollArea>
          </aside>

          <section className="min-h-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-4 p-5">
                {searchError ? (
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>{searchError.title}</AlertTitle>
                    <AlertDescription>{searchError.message}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-medium">Job matches</h3>
                  {hasSuggestions ? <p className="text-sm text-white/45">{suggestions.length} specific posting{suggestions.length === 1 ? "" : "s"}</p> : null}
                </div>

                {searchMutation.isPending ? (
                  <JobSearchLoadingState />
                ) : isLoading ? (
                  <SuggestionSkeletons />
                ) : !hasSuggestions ? (
                  <Empty className="border border-dashed">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Search />
                      </EmptyMedia>
                      <EmptyTitle>No job suggestions yet</EmptyTitle>
                      <EmptyDescription>
                        Run a search to find public job links that match this resume.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="flex flex-col gap-4">
                    {suggestions.map((suggestion, index) => (
                      <JobSuggestionRow
                        key={suggestion.recommendationSqid ?? suggestion.sourceUrl ?? `${suggestion.companyName}-${index}`}
                        suggestion={suggestion}
                        onView={() => setSelectedSuggestion(suggestion)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </section>
        </div>
      </DialogContent>

      <JobSuggestionDetailsModal
        resumeSqid={resumeSqid}
        suggestion={selectedSuggestionDetails}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSuggestion(null);
          }
        }}
        onSuggestionChange={handleSuggestionChange}
      />
    </Dialog>
  );
}

function formatJobSuggestionError(error: unknown) {
  const normalized = normalizeApiError(error);
  const missingMatch = normalized.message.match(/Missing:\s*(.+)$/i);

  if (normalized.status === 409 && missingMatch) {
    const missingSections = missingMatch[1]
      .split(",")
      .map((section) => humanizeMissingSection(section))
      .filter(Boolean);

    return {
      title: "Complete your resume before searching",
      message: `Job suggestions need ${missingSections.join(" and ")} first.`,
    };
  }

  return {
    title: normalized.status >= 500 ? "Search service unavailable" : "Search failed",
    message: normalized.message,
  };
}

function humanizeMissingSection(value: string) {
  const normalized = value.trim();
  const labels: Record<string, string> = {
    personalDetails: "personal details",
    education: "education history",
    employmentHistory: "experience",
    summary: "professional summary",
    certificates: "certificates",
  };

  return labels[normalized] ?? normalized.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

function FilterGroup({
  label,
  options,
  selected,
  disabled = false,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  disabled?: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            <Checkbox
              checked={selected.includes(option)}
              disabled={disabled}
              onCheckedChange={() => onToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function JobSearchLoadingState() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const activeStepIndex = Math.min(
    JOB_SEARCH_LOADING_STEPS.length - 1,
    Math.floor((elapsedSeconds * 1000) / JOB_SEARCH_LOADING_STEP_MS),
  );
  const progressValue = Math.min(
    96,
    Math.max(10, Math.round(((activeStepIndex + 1) / JOB_SEARCH_LOADING_STEPS.length) * 100)),
  );
  const activeStep = JOB_SEARCH_LOADING_STEPS[activeStepIndex] ?? JOB_SEARCH_LOADING_STEPS[0];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(circle_at_12%_0%,rgba(0,206,200,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] px-5 py-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.34)]">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:linear-gradient(90deg,transparent,rgba(0,206,200,0.055),transparent)]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#00CEC8]/20 bg-[#00CEC8]/[0.08] shadow-[0_0_34px_rgba(0,206,200,0.13)]">
          <span className="absolute inset-0 rounded-2xl border border-[#00CEC8]/20 animate-pulse" />
          <span className="absolute size-9 rounded-full bg-[#00CEC8]/10 blur-md" />
          <FileSearch className="relative size-6 text-[#00CEC8] drop-shadow-[0_0_14px_rgba(0,206,200,0.6)]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-white/36">
            AI job search
          </p>
          <h4 className="text-base font-semibold text-white sm:text-lg">Finding stronger job matches</h4>
          <div key={activeStep} className="mt-2 animate-in fade-in slide-in-from-bottom-1 duration-500">
            <p className="text-sm font-medium text-[#43F3EE] drop-shadow-[0_0_14px_rgba(0,206,200,0.35)]">
              {activeStep}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/42 sm:self-start">
          <span className="size-1.5 rounded-full bg-[#00CEC8] shadow-[0_0_12px_rgba(0,206,200,0.8)] animate-pulse" />
          Searching
        </div>
      </div>

      <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-[#00CEC8] shadow-[0_0_18px_rgba(0,206,200,0.65)] transition-all duration-700 ease-out"
          style={{ width: `${progressValue}%` }}
        />
      </div>
    </div>
  );
}

function JobSuggestionRow({
  suggestion,
  onView,
}: {
  suggestion: JobSuggestionItemResponse;
  onView: () => void;
}) {
  const sourceDomain = suggestion.sourceDomain || getDomain(suggestion.sourceUrl);
  const currentStatus = suggestion.status ?? "Suggested";
  const previewSkills = suggestion.missingSkills.slice(0, 3);
  const insight = buildMatchInsightModel(suggestion);

  return (
    <Card className="border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] text-white shadow-[0_16px_44px_rgba(0,0,0,0.24)] transition-colors hover:border-[#00CEC8]/35 hover:bg-white/[0.055]">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-base font-semibold text-white md:text-lg">{suggestion.roleTitle}</h4>
              <Badge variant={getMatchVariant(suggestion.matchScore)} className={getScoreBadgeClassName(suggestion.matchScore)}>
                {suggestion.matchScore}%
              </Badge>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs leading-relaxed text-white/55">
              <span className="font-medium text-white/78">{suggestion.companyName}</span>
              {suggestion.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  {suggestion.location}
                </span>
              ) : null}
              {sourceDomain ? <span>{sourceDomain}</span> : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={getStatusBadgeClassName(currentStatus)}>
                {formatStatus(currentStatus)}
              </Badge>
              <Badge variant="outline" className={insight.hasIntelligence ? getConfidenceBadgeClassName(insight.confidence) : "border-white/15 bg-white/10 text-white/65"}>
                {insight.hasIntelligence ? `${insight.confidence}% AI confidence` : "Basic match"}
              </Badge>
              {suggestion.workSetup ? <Badge variant="secondary">{suggestion.workSetup}</Badge> : null}
              {suggestion.employmentType ? <Badge variant="secondary">{suggestion.employmentType}</Badge> : null}
              {previewSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="hidden rounded-full border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-amber-100 sm:inline-flex">
                  Missing: {skill}
                </Badge>
              ))}
            </div>
            <p className="mt-2 line-clamp-1 text-sm leading-relaxed text-white/62">{insight.summary}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <a href={suggestion.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${suggestion.roleTitle}`}>
                <ExternalLink data-icon="inline-start" />
                Open
              </a>
            </Button>
            <Button type="button" size="sm" onClick={onView}>
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JobSuggestionDetailsModal({
  resumeSqid,
  suggestion,
  onOpenChange,
  onSuggestionChange,
}: {
  resumeSqid: string;
  suggestion: JobSuggestionItemResponse | null;
  onOpenChange: (open: boolean) => void;
  onSuggestionChange: (suggestion: JobSuggestionItemResponse) => void;
}) {
  const saveMutation = useSaveCompanyRecommendation(resumeSqid);
  const statusMutation = useUpdateCompanyRecommendationStatus(resumeSqid, suggestion?.recommendationSqid ?? "");
  const { showSuccess, showError } = useToast();
  const currentStatus = suggestion?.status ?? "Suggested";
  const isUpdating = saveMutation.isPending || statusMutation.isPending;
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (suggestion) {
      setActiveTab("overview");
    }
  }, [suggestion]);

  const handleTrack = async (status: SaveCompanyRecommendationRequest["status"]) => {
    if (!suggestion) {
      return;
    }

    try {
      if (suggestion.recommendationSqid) {
        const updated = await statusMutation.mutateAsync({ status });
        onSuggestionChange(updated);
        showSuccess(`Job marked as ${formatStatus(status).toLowerCase()}.`);
        return;
      }

      const saved = await saveMutation.mutateAsync(toSaveRecommendationRequest(suggestion, status));
      onSuggestionChange(saved);
      showSuccess(`Job marked as ${formatStatus(status).toLowerCase()}.`);
    } catch (error) {
      const normalized = normalizeApiError(error);
      showError(normalized.message);
    }
  };

  const handleSave = async () => {
    if (!suggestion) {
      return;
    }

    try {
      if (suggestion.recommendationSqid) {
        const updated = await statusMutation.mutateAsync({ status: "Saved" });
        onSuggestionChange(updated);
        showSuccess("Job saved.");
        return;
      }

      const updated = await saveMutation.mutateAsync(toSaveRecommendationRequest(suggestion, "Saved"));
      onSuggestionChange(updated);
      showSuccess("Job saved.");
    } catch (error) {
      const normalized = normalizeApiError(error);
      showError(normalized.message);
    }
  };

  if (!suggestion) {
    return null;
  }

  const displayIntelligence = buildDisplayMatchIntelligence(suggestion);
  const isDerivedIntelligence = !suggestion.matchIntelligence;
  const roadmap = buildDisplayRoadmap(suggestion);
  const emphasisTerms = getRoadmapEmphasisTerms(roadmap, suggestion);

  return (
    <Dialog open={Boolean(suggestion)} onOpenChange={onOpenChange}>
      <DialogContent className="dark flex h-[90dvh] max-h-[90dvh] max-w-[calc(100%-1rem)] flex-col overflow-hidden border-white/10 bg-[#080909] p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.58)] sm:max-w-5xl">
        <DialogHeader className="shrink-0 border-b border-white/[0.08] bg-[linear-gradient(180deg,rgba(0,206,200,0.08),rgba(255,255,255,0.015))] px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-white sm:text-xl">{suggestion.roleTitle}</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-relaxed text-white/62">
                {suggestion.companyName}
                {suggestion.location ? ` - ${suggestion.location}` : ""}
              </DialogDescription>
            </div>
            <Badge variant={getMatchVariant(suggestion.matchScore)} className={getScoreBadgeClassName(suggestion.matchScore)}>
              {suggestion.matchScore}% {suggestion.matchLevel}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-0 flex-1 gap-0 overflow-hidden">
          <div className="shrink-0 border-b border-white/[0.08] px-5 py-3">
            <TabsList className="w-full justify-start bg-white/[0.045] ring-1 ring-white/[0.06] sm:w-fit">
              <TabsTrigger value="overview" className="text-white/65 data-active:bg-[#00CEC8] data-active:text-black">
                Overview
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="text-white/65 data-active:bg-[#00CEC8] data-active:text-black">
                <Route data-icon="inline-start" />
                Roadmap
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={getStatusBadgeClassName(currentStatus)}>
                {formatStatus(currentStatus)}
              </Badge>
              {suggestion.workSetup ? <Badge variant="secondary">{suggestion.workSetup}</Badge> : null}
              {suggestion.employmentType ? <Badge variant="secondary">{suggestion.employmentType}</Badge> : null}
              {suggestion.sourceDomain || getDomain(suggestion.sourceUrl) ? (
                <Badge variant="outline">{suggestion.sourceDomain || getDomain(suggestion.sourceUrl)}</Badge>
              ) : null}
              {suggestion.searchedAt ? <span className="text-xs text-white/45">Searched {formatDate(suggestion.searchedAt)}</span> : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href={suggestion.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Open Job Link
                  <ExternalLink data-icon="inline-end" />
                </a>
              </Button>
            </div>

            <section className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.07] p-4 shadow-[0_14px_38px_rgba(0,0,0,0.22)]">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-50">
                <Target className="size-4 text-emerald-300" />
                Why this matches
              </p>
              <p className="mt-2 text-sm leading-7 text-white/82">
                <EmphasizedText text={formatDisplaySentence(suggestion.whyItMatches)} terms={emphasisTerms} />
              </p>
            </section>

            <JobMatchIntelligencePanel
              intelligence={displayIntelligence}
              isDerived={isDerivedIntelligence}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <SkillList title="Matching skills" values={suggestion.studentMatchingSkills} tone="success" />
              <SkillList title="Missing skills" values={suggestion.missingSkills} tone="danger" />
            </div>

            <Separator className="bg-white/10" />

            <section className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/42">Recommended action</p>
              <p className="text-sm leading-7 text-white/74">
                <EmphasizedText text={formatDisplaySentence(suggestion.recommendedAction)} terms={emphasisTerms} />
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase text-white/45">Track this opportunity</p>
              <div className="flex flex-wrap gap-2">
                {TRACKING_ACTIONS.map((action) => (
                  <Button
                    key={action.status}
                    type="button"
                    size="sm"
                    variant="outline"
                    className={getStatusButtonClassName(action.status, currentStatus === action.status)}
                    disabled={isUpdating}
                    onClick={() => void (action.status === "Saved" ? handleSave() : handleTrack(action.status))}
                  >
                    {isUpdating && currentStatus === action.status ? <Spinner data-icon="inline-start" /> : null}
                    {action.label}
                  </Button>
                ))}
              </div>
            </section>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="roadmap" className="min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-5">
                <JobRoadmapPanel
                  suggestion={suggestion}
                  roadmap={roadmap}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function JobMatchIntelligencePanel({
  intelligence,
  isDerived = false,
}: {
  intelligence: CompanyRecommendationMatchIntelligence;
  isDerived?: boolean;
}) {
  const fitBreakdown = [
    { label: "Skills", value: intelligence.fitBreakdown.skillMatch },
    { label: "Role", value: intelligence.fitBreakdown.roleMatch },
    { label: "Location", value: intelligence.fitBreakdown.locationCompatibility },
    { label: "Education", value: intelligence.fitBreakdown.educationMatch },
    { label: "Career goal", value: intelligence.fitBreakdown.careerGoalMatch },
    { label: "Freshness", value: intelligence.fitBreakdown.freshnessConfidence },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(0,206,200,0.065),rgba(255,255,255,0.02))] p-4 text-white shadow-[0_18px_52px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-500/10">
            <BrainCircuit className="size-4 text-[#7EF7F3]" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">{isDerived ? "Basic match intelligence" : "AI fit intelligence"}</p>
            <p className="text-xs text-white/48">Signals from the posting, resume evidence, and AI fit analysis.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isDerived ? <Badge variant="outline" className="border-amber-400/25 bg-amber-500/10 text-amber-100">Derived fallback</Badge> : null}
          <Badge variant="outline" className={getConfidenceBadgeClassName(Math.round(intelligence.aiConfidence * 100))}>
            {Math.round(intelligence.aiConfidence * 100)}% AI confidence
          </Badge>
          <Badge variant="outline" className={getConfidenceBadgeClassName(Math.round(intelligence.jobUnderstanding.confidence * 100))}>
            {Math.round(intelligence.jobUnderstanding.confidence * 100)}% job extraction
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InsightCard
          icon={<Target className="size-4 text-emerald-300" />}
          title="Why this fits"
          values={intelligence.matchReasons}
          tone="success"
        />
        <InsightCard
          icon={<AlertCircle className="size-4 text-amber-300" />}
          title="Gap signals"
          values={intelligence.gapReasons}
          tone="warning"
        />
        <InsightCard
          icon={<Lightbulb className="size-4 text-cyan-200" />}
          title="Improvement suggestions"
          values={intelligence.recommendedActions.slice(0, 3).map((action) => action.label)}
          tone="info"
        />
        <ConfidenceInsightCard
          value={Math.round(intelligence.aiConfidence * 100)}
          extractionValue={Math.round(intelligence.jobUnderstanding.confidence * 100)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SkillList title="Required by posting" values={intelligence.jobUnderstanding.requiredSkills} tone="info" />
        <SkillList title="Nice to have" values={intelligence.jobUnderstanding.niceToHaveSkills} tone="neutral" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fitBreakdown.map((item) => (
          <div key={item.label} className={cn("flex flex-col gap-2.5 rounded-xl border p-3.5", getMetricCardClassName(item.value))}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-white/72">{item.label}</span>
              <span className={cn("font-semibold", getMetricTextClassName(item.value))}>{clampPercent(item.value)}%</span>
            </div>
            <Progress value={clampPercent(item.value)} className={cn("h-2 bg-white/10", getMetricProgressClassName(item.value))} />
          </div>
        ))}
      </div>

      <Accordion type="single" collapsible className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3">
        <AccordionItem value="improve-fit" className="border-0">
          <AccordionTrigger className="py-3 text-white hover:no-underline">
            <span className="inline-flex items-center gap-2">
              <Lightbulb className="size-4 text-[#FFB800]" />
              Improve My Fit
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            {intelligence.recommendedActions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {intelligence.recommendedActions.map((action, index) => (
                  <div key={`${action.type}-${index}`} className="flex items-start gap-2 rounded-md bg-black/30 p-2">
                    <Badge variant="outline" className="shrink-0">
                      {formatActionType(action.type)}
                    </Badge>
                    <p className="text-sm leading-relaxed text-white/80">{action.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/60">No improvement actions were generated.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function JobRoadmapPanel({
  suggestion,
  roadmap,
}: {
  suggestion: JobSuggestionItemResponse;
  roadmap: Roadmap;
}) {
  const [selectedTimeline, setSelectedTimeline] = useState<RoadmapItem["timeline"]>("today");

  useEffect(() => {
    const firstTimeline = groupRoadmapItems(roadmap.items)[0]?.timeline ?? "today";
    setSelectedTimeline(firstTimeline);
  }, [roadmap]);

  const groupedItems = groupRoadmapItems(roadmap.items);
  const activeGroup = groupedItems.find((group) => group.timeline === selectedTimeline) ?? groupedItems[0] ?? null;
  const nextBestMove = roadmap.items.find((item) => item.priority === "high") ?? roadmap.items[0] ?? null;
  const emphasisTerms = getRoadmapEmphasisTerms(roadmap, suggestion);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="flex flex-col gap-3 lg:sticky lg:top-5 lg:self-start">
              <section className="rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={roadmap.generatedFrom === "gemini" ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-100" : "border-amber-400/30 bg-amber-500/10 text-amber-100"}>
                    {roadmap.generatedFrom === "gemini" ? "Gemini roadmap" : "Fallback roadmap"}
                  </Badge>
                  {roadmap.targetFitScore ? (
                    <Badge variant="secondary">Target {roadmap.targetFitScore}% fit</Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-xs font-medium uppercase text-white/45">Guide summary</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  <EmphasizedText text={formatDisplaySentence(roadmap.summary)} terms={emphasisTerms} />
                </p>
              </section>

              {nextBestMove ? (
                <NextBestMoveCard
                  item={nextBestMove}
                  terms={emphasisTerms}
                  onSelect={() => setSelectedTimeline(nextBestMove.timeline)}
                />
              ) : null}

              {roadmap.betterFitRoles.length > 0 ? (
                <section className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-4">
                  <div className="flex items-center gap-2">
                    <Flag className="size-4 text-violet-100" />
                    <p className="text-sm font-semibold text-violet-50">Better-fit role signals</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roadmap.betterFitRoles.map((role) => (
                      <Badge key={role} variant="outline" className="border-violet-300/25 bg-black/20 text-violet-50">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>

            <section className="flex min-w-0 flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.025] p-1.5">
                {groupedItems.map((group) => (
                  <button
                    key={group.timeline}
                    type="button"
                    onClick={() => setSelectedTimeline(group.timeline)}
                    className={cn(
                      "flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-200",
                      selectedTimeline === group.timeline
                        ? "bg-[#00CEC8] text-black shadow-[0_0_22px_rgba(0,206,200,0.22)]"
                        : "text-white/55 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    <CalendarDays className="size-3.5" />
                    {formatRoadmapTimeline(group.timeline)}
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px]",
                      selectedTimeline === group.timeline ? "bg-black/15 text-black" : "bg-white/10 text-white/55",
                    )}>
                      {group.items.length}
                    </span>
                  </button>
                ))}
              </div>

              {activeGroup ? (
                <div key={activeGroup.timeline} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">Focus window</p>
                      <h4 className="mt-1 text-base font-semibold text-white">{formatRoadmapTimeline(activeGroup.timeline)}</h4>
                    </div>
                    <Badge variant="outline" className="border-white/15 bg-white/[0.04] text-white/60">
                      {activeGroup.items.length} action{activeGroup.items.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-3">
                    {activeGroup.items.map((item) => (
                      <RoadmapItemCard key={`${item.timeline}-${item.title}`} item={item} terms={emphasisTerms} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
                  No roadmap actions were generated for this job.
                </div>
              )}
            </section>
      </div>
    </div>
  );
}

type Roadmap = NonNullable<CompanyRecommendationMatchIntelligence["roadmap"]>;
type RoadmapItem = Roadmap["items"][number];

function NextBestMoveCard({
  item,
  terms,
  onSelect,
}: {
  item: RoadmapItem;
  terms: string[];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group rounded-xl border border-[#00CEC8]/25 bg-[#00CEC8]/10 p-4 text-left shadow-[0_0_34px_rgba(0,206,200,0.08)] transition-colors hover:border-[#00CEC8]/45 hover:bg-[#00CEC8]/15"
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#8FF8F4]">
        <Target className="size-4" />
        Next best move
      </div>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-white">
        <EmphasizedText text={formatDisplaySentence(item.title)} terms={terms} />
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/68">
        <EmphasizedText text={formatDisplaySentence(item.reason)} terms={terms} />
      </p>
      <p className="mt-3 text-xs font-medium text-[#8FF8F4] transition-transform group-hover:translate-x-1">
        Open {formatRoadmapTimeline(item.timeline)}
      </p>
    </button>
  );
}

function RoadmapItemCard({ item, terms }: { item: RoadmapItem; terms: string[] }) {
  const [showResources, setShowResources] = useState(false);

  return (
    <article className="rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-4 transition-colors hover:border-white/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={getRoadmapPriorityClassName(item.priority)}>
              {formatPriorityLabel(item.priority)} priority
            </Badge>
            {item.skill ? (
              <Badge variant="outline" className="border-white/15 text-white/65">
                {item.skill}
              </Badge>
            ) : null}
          </div>
          <h5 className="mt-3 text-sm font-semibold text-white">
            <EmphasizedText text={formatDisplaySentence(item.title)} terms={terms} />
          </h5>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            <EmphasizedText text={formatDisplaySentence(item.reason)} terms={terms} />
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg bg-black/25 p-3">
          <p className="text-xs font-medium uppercase text-white/40">Actions</p>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-white/78">
            {item.actions.map((action) => (
              <li key={action} className="flex gap-2 leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#00CEC8]" />
                <span><EmphasizedText text={formatDisplaySentence(action)} terms={terms} /></span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-black/25 p-3">
          <p className="text-xs font-medium uppercase text-white/40">Expected outcome</p>
          <p className="mt-2 text-sm leading-relaxed text-white/78">
            <EmphasizedText text={formatDisplaySentence(item.outcome)} terms={terms} />
          </p>
        </div>
      </div>

      {item.resources.length > 0 ? (
        <div className="mt-4">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowResources((current) => !current)}
            className="border-white/15 bg-white/[0.03] text-white/75 hover:text-white"
          >
            {showResources ? "Hide resources" : `Show resources (${item.resources.length})`}
          </Button>

          {showResources ? (
            <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              {item.resources.map((resource) => (
                resource.url ? (
                  <Button key={`${resource.title}-${resource.url}`} asChild size="sm" variant="outline">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                      <ExternalLink data-icon="inline-end" />
                    </a>
                  </Button>
                ) : (
                  <Badge key={resource.title} variant="outline" className="border-white/15 text-white/65">
                    {resource.title}
                  </Badge>
                )
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function EmphasizedText({ text, terms }: { text: string; terms: string[] }) {
  const normalizedTerms = terms
    .map((term) => term.trim())
    .filter((term) => term.length >= 3)
    .sort((left, right) => right.length - left.length)
    .slice(0, 16);

  if (normalizedTerms.length === 0) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${normalizedTerms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const shouldEmphasize = normalizedTerms.some((term) => term.toLowerCase() === part.toLowerCase());

        return shouldEmphasize ? (
          <strong key={`${part}-${index}`} className="font-semibold text-[#9FF8F5]">
            {part}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </>
  );
}

function InsightCard({
  icon,
  title,
  values,
  tone,
}: {
  icon: ReactNode;
  title: string;
  values: string[];
  tone: "success" | "warning" | "danger" | "info";
}) {
  const toneClassName = getInsightToneClassName(tone);

  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border p-4", toneClassName.card)}>
      <div className={cn("flex items-center gap-2 text-sm font-semibold", toneClassName.title)}>
        {icon}
        {title}
      </div>
      {values.length > 0 ? (
        <ul className="flex flex-col gap-2 text-sm leading-7">
          {values.map((value, index) => (
            <li key={`${value}-${index}`} className="flex gap-2 text-white/78">
              <span className={cn("mt-3 size-1.5 shrink-0 rounded-full", toneClassName.dot)} />
              <span>{value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-white/50">None highlighted.</p>
      )}
    </div>
  );
}

function ConfidenceInsightCard({ value, extractionValue }: { value: number; extractionValue: number }) {
  return (
    <div className={cn("rounded-xl border p-4", getMetricCardClassName(value))}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className={cn("size-4", getMetricTextClassName(value))} />
          <p className="text-sm font-semibold text-white">Hiring confidence</p>
        </div>
        <span className={cn("text-lg font-semibold", getMetricTextClassName(value))}>{value}%</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-white/62">
        AI confidence reflects how strongly the resume evidence aligns with this posting.
      </p>
      <div className="mt-3 space-y-2">
        <Progress value={clampPercent(value)} className={cn("h-2 bg-white/10", getMetricProgressClassName(value))} />
        <div className="flex justify-between text-xs text-white/45">
          <span>Job extraction</span>
          <span>{extractionValue}%</span>
        </div>
      </div>
    </div>
  );
}

function SkillList({
  title,
  values,
  tone = "neutral",
}: {
  title: string;
  values: string[];
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const toneClassName = getSkillToneClassName(tone);

  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border p-4", toneClassName.card)}>
      <p className={cn("text-sm font-semibold", toneClassName.title)}>{title}</p>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <Badge key={value} variant="outline" className={cn("rounded-full px-3 py-1 text-xs font-medium", toneClassName.pill)}>
              {value}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">None highlighted.</p>
      )}
    </div>
  );
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getConfidenceBadgeClassName(value: number) {
  if (value >= 80) {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-100";
  }

  if (value >= 50) {
    return "border-amber-400/30 bg-amber-500/10 text-amber-100";
  }

  return "border-rose-400/30 bg-rose-500/10 text-rose-100";
}

function getScoreBadgeClassName(value: number) {
  if (value >= 80) {
    return "bg-emerald-400 text-black shadow-[0_0_22px_rgba(74,222,128,0.22)]";
  }

  if (value >= 50) {
    return "bg-amber-300 text-black";
  }

  return "bg-rose-300 text-black";
}

function getMetricCardClassName(value: number) {
  if (value >= 80) {
    return "border-emerald-400/[0.18] bg-emerald-500/[0.075] shadow-[0_0_28px_rgba(74,222,128,0.08)]";
  }

  if (value >= 50) {
    return "border-amber-400/[0.18] bg-amber-500/[0.07]";
  }

  return "border-rose-400/[0.18] bg-rose-500/[0.07]";
}

function getMetricTextClassName(value: number) {
  if (value >= 80) {
    return "text-emerald-200";
  }

  if (value >= 50) {
    return "text-amber-200";
  }

  return "text-rose-200";
}

function getMetricProgressClassName(value: number) {
  if (value >= 80) {
    return "[&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-teal-300 [&>div]:shadow-[0_0_16px_rgba(74,222,128,0.42)]";
  }

  if (value >= 50) {
    return "[&>div]:bg-gradient-to-r [&>div]:from-amber-300 [&>div]:to-yellow-200";
  }

  return "[&>div]:bg-gradient-to-r [&>div]:from-rose-400 [&>div]:to-red-300";
}

function getInsightToneClassName(tone: "success" | "warning" | "danger" | "info") {
  switch (tone) {
    case "success":
      return {
        card: "border-emerald-400/[0.16] bg-emerald-500/[0.07]",
        title: "text-emerald-100",
        dot: "bg-emerald-300",
      };
    case "warning":
      return {
        card: "border-amber-400/[0.18] bg-amber-500/[0.075]",
        title: "text-amber-100",
        dot: "bg-amber-300",
      };
    case "danger":
      return {
        card: "border-rose-400/[0.18] bg-rose-500/[0.075]",
        title: "text-rose-100",
        dot: "bg-rose-300",
      };
    case "info":
    default:
      return {
        card: "border-cyan-400/[0.16] bg-cyan-500/[0.07]",
        title: "text-cyan-100",
        dot: "bg-cyan-300",
      };
  }
}

function getSkillToneClassName(tone: "success" | "warning" | "danger" | "info" | "neutral") {
  switch (tone) {
    case "success":
      return {
        card: "border-emerald-400/[0.16] bg-emerald-500/[0.06]",
        title: "text-emerald-100",
        pill: "border-emerald-400/[0.24] bg-emerald-500/10 text-emerald-100",
      };
    case "warning":
      return {
        card: "border-amber-400/[0.16] bg-amber-500/[0.06]",
        title: "text-amber-100",
        pill: "border-amber-400/[0.24] bg-amber-500/10 text-amber-100",
      };
    case "danger":
      return {
        card: "border-rose-400/[0.16] bg-rose-500/[0.06]",
        title: "text-rose-100",
        pill: "border-rose-400/[0.24] bg-rose-500/10 text-rose-100",
      };
    case "info":
      return {
        card: "border-cyan-400/[0.16] bg-cyan-500/[0.06]",
        title: "text-cyan-100",
        pill: "border-cyan-400/[0.24] bg-cyan-500/10 text-cyan-100",
      };
    case "neutral":
    default:
      return {
        card: "border-white/[0.08] bg-white/[0.035]",
        title: "text-white/78",
        pill: "border-white/14 bg-white/[0.055] text-white/70",
      };
  }
}

function formatActionType(value: CompanyRecommendationMatchIntelligence["recommendedActions"][number]["type"]): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function SuggestionSkeletons() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((item) => (
        <Card key={item}>
          <CardHeader>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid gap-3 md:grid-cols-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function buildMatchInsightModel(suggestion: JobSuggestionItemResponse) {
  const intelligence = suggestion.matchIntelligence;
  const topGap = intelligence?.gapReasons[0] ?? suggestion.missingSkills[0];

  return {
    hasIntelligence: Boolean(intelligence),
    confidence: Math.round((intelligence?.aiConfidence ?? 0.45) * 100),
    summary: intelligence?.matchReasons[0]
      ?? (topGap ? `Next focus: strengthen ${topGap}.` : suggestion.whyItMatches),
  };
}

function buildDisplayMatchIntelligence(suggestion: JobSuggestionItemResponse): CompanyRecommendationMatchIntelligence {
  if (suggestion.matchIntelligence) {
    return suggestion.matchIntelligence;
  }

  const requiredSkills = mergeUniqueStrings([...suggestion.requiredSkills, ...suggestion.missingSkills]).slice(0, 30);
  const matchedSkills = mergeUniqueStrings(suggestion.studentMatchingSkills);
  const missingSkills = mergeUniqueStrings(
    suggestion.missingSkills.length > 0
      ? suggestion.missingSkills
      : requiredSkills.filter((skill) => !matchedSkills.some((matched) => sameSkill(matched, skill))),
  );
  const skillMatch = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : suggestion.matchScore;

  return {
    jobUnderstanding: {
      requiredSkills,
      niceToHaveSkills: [],
      experienceLevel: suggestion.employmentType ?? "Not specified",
      confidence: 0.45,
    },
    fitBreakdown: {
      skillMatch: clampPercent(skillMatch),
      roleMatch: clampPercent(suggestion.matchScore),
      locationCompatibility: suggestion.location ? 75 : 55,
      educationMatch: 65,
      careerGoalMatch: clampPercent(suggestion.matchScore - 5),
      freshnessConfidence: 55,
    },
    matchReasons: [suggestion.whyItMatches],
    gapReasons: missingSkills.length > 0
      ? missingSkills.slice(0, 5).map((skill) => `No clear resume evidence for ${skill}.`)
      : ["No critical gaps were detected from the available saved data."],
    recommendedActions: buildFallbackRoadmapActions(suggestion, missingSkills),
    roadmap: buildFallbackRoadmap(suggestion, missingSkills, matchedSkills),
    aiConfidence: 0.45,
  };
}

function buildDisplayRoadmap(suggestion: JobSuggestionItemResponse): Roadmap {
  const intelligence = buildDisplayMatchIntelligence(suggestion);
  return intelligence.roadmap ?? buildFallbackRoadmap(
    suggestion,
    suggestion.missingSkills,
    suggestion.studentMatchingSkills,
  );
}

function buildFallbackRoadmapActions(
  suggestion: JobSuggestionItemResponse,
  missingSkills: string[],
): CompanyRecommendationMatchIntelligence["recommendedActions"] {
  const actions: CompanyRecommendationMatchIntelligence["recommendedActions"] = [
    {
      type: "resume_update",
      label: `Today: tailor the resume summary toward ${suggestion.roleTitle}.`,
    },
  ];
  const primaryGap = missingSkills[0];

  if (primaryGap) {
    actions.push(
      {
        type: "learning_action",
        label: `This week: study ${primaryGap} basics and collect examples from real postings.`,
      },
      {
        type: "project_recommendation",
        label: `This month: create a small proof-of-skill item that demonstrates ${primaryGap}.`,
      },
    );
  }

  return actions;
}

function buildFallbackRoadmap(
  suggestion: JobSuggestionItemResponse,
  missingSkills: string[],
  matchedSkills: string[],
): Roadmap {
  const primaryGap = missingSkills[0];
  const strongestSkill = matchedSkills[0];
  const items: Roadmap["items"] = [
    {
      timeline: "today",
      priority: "high",
      skill: primaryGap ?? null,
      title: `Tailor your resume for ${suggestion.roleTitle}`,
      reason: primaryGap
        ? `${primaryGap} is not clearly proven in the resume yet.`
        : "A targeted application should still surface the strongest role evidence first.",
      actions: primaryGap
        ? [`Add one resume bullet that shows exposure to ${primaryGap}.`, "Make the summary specific to this job."]
        : ["Move the strongest matching evidence near the top.", "Make the summary specific to this job."],
      outcome: "The recruiter can understand the fit quickly.",
      resources: [],
    },
  ];

  if (primaryGap) {
    items.push(
      {
        timeline: "this_week",
        priority: "high",
        skill: primaryGap,
        title: `Build working knowledge of ${primaryGap}`,
        reason: `${primaryGap} appears as a gap for this posting.`,
        actions: [
          `Study the fundamentals of ${primaryGap}.`,
          "Create notes or flashcards for interview terms.",
          "Collect examples from three similar postings.",
        ],
        outcome: `You can explain ${primaryGap} in screening or interview conversations.`,
        resources: [
          {
            title: `Search ${primaryGap} resources`,
            url: `https://www.google.com/search?q=${encodeURIComponent(`${primaryGap} basics tutorial`)}`,
            type: "practice",
          },
        ],
      },
      {
        timeline: "this_month",
        priority: "medium",
        skill: primaryGap,
        title: `Create proof for ${primaryGap}`,
        reason: "A concrete artifact is stronger than only listing a skill.",
        actions: [
          `Build a small project, campaign, case study, or portfolio item that demonstrates ${primaryGap}.`,
          "Add the artifact to the resume or portfolio.",
        ],
        outcome: "The missing skill becomes visible evidence.",
        resources: [],
      },
    );
  }

  if (strongestSkill) {
    items.push({
      timeline: "next_60_days",
      priority: "low",
      skill: strongestSkill,
      title: `Use ${strongestSkill} to guide better-fit searches`,
      reason: "This is already visible in the resume and may point to adjacent opportunities.",
      actions: [
        `Search for ${strongestSkill} internships related to ${suggestion.roleTitle}.`,
        "Compare those postings with this job before applying broadly.",
      ],
      outcome: "You can pursue roles that better use existing strengths while closing this job's gaps.",
      resources: [],
    });
  }

  return {
    summary: primaryGap
      ? `Prioritize ${primaryGap}, then turn it into resume evidence for ${suggestion.roleTitle}.`
      : `Use this guide to make the application more specific for ${suggestion.roleTitle}.`,
    targetFitScore: Math.min(100, Math.max(suggestion.matchScore + 10, 75)),
    generatedFrom: "fallback",
    items: items.slice(0, 8),
    betterFitRoles: strongestSkill
      ? [`${strongestSkill} Intern`, `Junior ${strongestSkill} Assistant`, `${suggestion.roleTitle} with ${strongestSkill}`]
      : [],
  };
}

function groupRoadmapItems(items: Roadmap["items"]) {
  const order: RoadmapItem["timeline"][] = ["today", "this_week", "this_month", "next_60_days"];
  return order
    .map((timeline) => ({
      timeline,
      items: items.filter((item) => item.timeline === timeline),
    }))
    .filter((group) => group.items.length > 0);
}

function getRoadmapEmphasisTerms(roadmap: Roadmap, suggestion: JobSuggestionItemResponse) {
  return mergeUniqueStrings([
    suggestion.roleTitle,
    suggestion.companyName,
    ...suggestion.missingSkills,
    ...suggestion.studentMatchingSkills,
    ...suggestion.requiredSkills,
    ...roadmap.items.flatMap((item) => [
      item.skill ?? "",
      item.priority === "high" ? "high priority" : "",
      ...item.actions.flatMap((action) => action.match(/[A-Za-z][A-Za-z0-9+#.-]{2,}/g) ?? []),
    ]),
  ])
    .filter((term) => !ROADMAP_EMPHASIS_STOP_WORDS.has(term.toLowerCase()))
    .slice(0, 24);
}

function formatRoadmapTimeline(value: RoadmapItem["timeline"]) {
  const labels: Record<RoadmapItem["timeline"], string> = {
    today: "Today",
    this_week: "This week",
    this_month: "This month",
    next_60_days: "Next 60 days",
  };

  return labels[value];
}

function formatPriorityLabel(value: RoadmapItem["priority"]) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDisplaySentence(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function getRoadmapPriorityClassName(priority: RoadmapItem["priority"]) {
  switch (priority) {
    case "high":
      return "border-amber-400/35 bg-amber-500/15 text-amber-100";
    case "medium":
      return "border-cyan-400/30 bg-cyan-500/15 text-cyan-100";
    case "low":
      return "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";
    default:
      return "border-white/15 text-white/70";
  }
}

function mergeUniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(normalized);
  }

  return merged;
}

function sameSkill(left: string, right: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9+#.]+/g, "");
  return normalize(left) === normalize(right);
}

const ROADMAP_EMPHASIS_STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "your",
  "this",
  "that",
  "from",
  "into",
  "build",
  "create",
  "review",
  "learn",
  "study",
  "skill",
  "skills",
  "resume",
  "project",
  "projects",
]);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getMatchVariant(score: number): "default" | "secondary" | "outline" {
  if (score >= 85) return "default";
  if (score >= 70) return "secondary";
  return "outline";
}

function getDomain(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toSaveRecommendationRequest(
  suggestion: JobSuggestionItemResponse,
  status: SaveCompanyRecommendationRequest["status"],
): SaveCompanyRecommendationRequest {
  return {
    companyName: suggestion.companyName,
    roleTitle: suggestion.roleTitle,
    matchScore: suggestion.matchScore,
    whyItMatches: suggestion.whyItMatches,
    requiredSkills: suggestion.requiredSkills,
    studentMatchingSkills: suggestion.studentMatchingSkills,
    missingSkills: suggestion.missingSkills,
    location: suggestion.location ?? null,
    workSetup: suggestion.workSetup,
    employmentType: suggestion.employmentType ?? null,
    sourceUrl: suggestion.sourceUrl,
    recommendedAction: suggestion.recommendedAction,
    matchIntelligence: suggestion.matchIntelligence ?? null,
    status,
  };
}

function dedupeJobSuggestions(suggestions: JobSuggestionItemResponse[]) {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const sourceUrl = normalizeSourceUrl(suggestion.sourceUrl);
    if (!sourceUrl || seen.has(sourceUrl)) {
      return false;
    }

    seen.add(sourceUrl);
    return true;
  });
}

function isSameSuggestion(left: JobSuggestionItemResponse, right: JobSuggestionItemResponse) {
  const sameRecommendation = left.recommendationSqid && left.recommendationSqid === right.recommendationSqid;
  const sameSource = normalizeSourceUrl(left.sourceUrl) === normalizeSourceUrl(right.sourceUrl);
  return Boolean(sameRecommendation || sameSource);
}

function normalizeSourceUrl(value: string) {
  return value.trim().replace(/\/+$/, "").toLowerCase();
}

function getStatusBadgeClassName(status: string) {
  return cn(
    "border font-semibold",
    getStatusTone(status).badge,
  );
}

function getStatusButtonClassName(status: SaveCompanyRecommendationRequest["status"], isActive: boolean) {
  const tone = getStatusTone(status);
  return cn(
    "transition-colors",
    isActive ? tone.activeButton : tone.button,
  );
}

function getStatusTone(status: string) {
  switch (status) {
    case "Suggested":
      return {
        badge: "border-emerald-400/30 bg-emerald-500/15 text-emerald-100",
        button: "border-emerald-400/25 text-emerald-100 hover:bg-emerald-500/10",
        activeButton: "border-emerald-300/60 bg-emerald-500/20 text-emerald-50 hover:bg-emerald-500/25",
      };
    case "Saved":
      return {
        badge: "border-cyan-400/30 bg-cyan-500/15 text-cyan-100",
        button: "border-cyan-400/25 text-cyan-100 hover:bg-cyan-500/10",
        activeButton: "border-cyan-300/60 bg-cyan-500/20 text-cyan-50 hover:bg-cyan-500/25",
      };
    case "Applied":
      return {
        badge: "border-sky-400/30 bg-sky-500/15 text-sky-100",
        button: "border-sky-400/25 text-sky-100 hover:bg-sky-500/10",
        activeButton: "border-sky-300/60 bg-sky-500/20 text-sky-50 hover:bg-sky-500/25",
      };
    case "Interviewing":
      return {
        badge: "border-amber-400/35 bg-amber-500/15 text-amber-100",
        button: "border-amber-400/25 text-amber-100 hover:bg-amber-500/10",
        activeButton: "border-amber-300/60 bg-amber-500/20 text-amber-50 hover:bg-amber-500/25",
      };
    case "Offer":
      return {
        badge: "border-violet-400/35 bg-violet-500/15 text-violet-100",
        button: "border-violet-400/25 text-violet-100 hover:bg-violet-500/10",
        activeButton: "border-violet-300/60 bg-violet-500/20 text-violet-50 hover:bg-violet-500/25",
      };
    case "Rejected":
      return {
        badge: "border-rose-400/35 bg-rose-500/15 text-rose-100",
        button: "border-rose-400/25 text-rose-100 hover:bg-rose-500/10",
        activeButton: "border-rose-300/60 bg-rose-500/20 text-rose-50 hover:bg-rose-500/25",
      };
    case "NotInterested":
      return {
        badge: "border-zinc-500/40 bg-zinc-500/15 text-zinc-200",
        button: "border-zinc-500/30 text-zinc-200 hover:bg-zinc-500/10",
        activeButton: "border-zinc-400/60 bg-zinc-500/25 text-zinc-50 hover:bg-zinc-500/30",
      };
    default:
      return {
        badge: "border-white/15 bg-white/10 text-white/75",
        button: "border-white/15 text-white/70 hover:bg-white/10",
        activeButton: "border-white/30 bg-white/15 text-white hover:bg-white/20",
      };
  }
}

function formatStatus(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}
