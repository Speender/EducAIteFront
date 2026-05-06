import { useState, type Dispatch, type SetStateAction } from "react";
import {
  AlertCircle,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  useJobSuggestions,
  useSearchJobSuggestions,
} from "../api/hooks";
import type { JobSuggestionItemResponse } from "../api/studentDto";
import { useResumeStore } from "../hooks/useResumeStore";
import { normalizeApiError } from "@/lib/api/errors";
import { useToast } from "@/components/ToastProvider";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface CompanyRecommendationsModalProps {
  resumeSqid: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const WORK_SETUP_OPTIONS = ["Remote", "Hybrid", "Onsite"];
const EMPLOYMENT_TYPE_OPTIONS = ["Internship", "Entry-level", "Part-time", "Contract"];

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

  const suggestions = latestResults ?? savedSuggestions?.items ?? [];
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
      <DialogContent className="flex h-[92dvh] max-w-[calc(100%-1rem)] grid-rows-none flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader className="border-b px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle>AI Job Suggestions</DialogTitle>
              <DialogDescription>
                Search public job pages from your resume evidence and keep the persisted matches in EducAIteAPI.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[20rem_1fr]">
          <aside className="border-b bg-muted/30 lg:border-r lg:border-b-0">
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
                    onChange={(event) => setTargetRole(event.target.value)}
                    placeholder="Optional, e.g. Frontend Intern"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="job-location">Location</Label>
                  <Input
                    id="job-location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Optional, e.g. Remote, Manila"
                  />
                </div>

                <FilterGroup
                  label="Work setup"
                  options={WORK_SETUP_OPTIONS}
                  selected={workSetup}
                  onToggle={(value) => toggleArrayItem(setWorkSetup, workSetup, value)}
                />

                <FilterGroup
                  label="Employment type"
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  selected={employmentType}
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
                  <h3 className="text-base font-medium">Persisted suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Search results are persisted by EducAIteAPI and can be listed again later.
                  </p>
                </div>

                {isLoading ? (
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
                      <JobSuggestionCard
                        key={suggestion.recommendationSqid ?? suggestion.sourceUrl ?? `${suggestion.companyName}-${index}`}
                        suggestion={suggestion}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </section>
        </div>
      </DialogContent>
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
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <Checkbox
              checked={selected.includes(option)}
              onCheckedChange={() => onToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function JobSuggestionCard({ suggestion }: { suggestion: JobSuggestionItemResponse }) {
  const sourceDomain = suggestion.sourceDomain || getDomain(suggestion.sourceUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{suggestion.roleTitle}</CardTitle>
        <CardDescription>{suggestion.companyName}</CardDescription>
        <CardAction>
          <Badge variant={getMatchVariant(suggestion.matchScore)}>
            {suggestion.matchScore}% {suggestion.matchLevel}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {suggestion.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin />
              {suggestion.location}
            </span>
          ) : null}
          <Badge variant="secondary">{suggestion.workSetup}</Badge>
          {suggestion.employmentType ? <Badge variant="secondary">{suggestion.employmentType}</Badge> : null}
          {sourceDomain ? <Badge variant="outline">{sourceDomain}</Badge> : null}
        </div>

        <p className="text-sm leading-relaxed">{suggestion.whyItMatches}</p>

        <div className="grid gap-3 md:grid-cols-2">
          <SkillList title="Matching skills" values={suggestion.studentMatchingSkills} />
          <SkillList title="Missing skills" values={suggestion.missingSkills} muted />
        </div>

        <Separator />

        <p className="text-sm text-muted-foreground">{suggestion.recommendedAction}</p>
      </CardContent>

      <CardFooter className="justify-between gap-3">
        <span className="truncate text-xs text-muted-foreground">
          {suggestion.searchedAt ? `Searched ${formatDate(suggestion.searchedAt)}` : "Public job source"}
        </span>
        <Button asChild size="sm" variant="outline">
          <a href={suggestion.sourceUrl} target="_blank" rel="noopener noreferrer">
            View job
            <ExternalLink data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function SkillList({
  title,
  values,
  muted = false,
}: {
  title: string;
  values: string[];
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <Badge key={value} variant={muted ? "outline" : "secondary"}>
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
