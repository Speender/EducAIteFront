import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  FileText,
  ListChecks,
  Loader2,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  isFlashcardPdfGenerationJobActive,
  useActiveRecentFlashcardGenerationJobsQuery,
  useDeleteFlashcardGenerationJobMutation,
  useFlashcardGenerationJobsQuery,
} from "@/features/flashcards/api/hooks";
import type { FlashcardPdfGenerationJobResponseDto } from "@/features/flashcards/api/dto";
import {
  formatPdfGenerationJobStatus,
  getPdfGenerationMessage,
  getPdfGenerationProgress,
  getPdfGenerationStageMeta,
  rememberSeenTerminalFlashcardGenerationJob,
} from "@/features/flashcards/pdf-generation-status";
import { getFlashcardCreateCardPath } from "@/features/flashcards/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

export function FlashcardGenerationToastController() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const activeRecentJobsQuery = useActiveRecentFlashcardGenerationJobsQuery();
  const [isRequestCenterOpen, setIsRequestCenterOpen] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [selectedJobSqid, setSelectedJobSqid] = useState<string | null>(null);
  const allJobsQuery = useFlashcardGenerationJobsQuery("all", isRequestCenterOpen);
  const deleteJobMutation = useDeleteFlashcardGenerationJobMutation();

  const jobs = useMemo(() => {
    const sourceJobs = isRequestCenterOpen
      ? allJobsQuery.data ?? activeRecentJobsQuery.data ?? []
      : activeRecentJobsQuery.data ?? [];

    return [...sourceJobs].sort(compareGenerationJobs);
  }, [activeRecentJobsQuery.data, allJobsQuery.data, isRequestCenterOpen]);

  const activeJobs = jobs.filter((job) => isFlashcardPdfGenerationJobActive(job.status));
  const latestJob = activeJobs[0] ?? jobs[0] ?? null;

  useEffect(() => {
    for (const job of activeRecentJobsQuery.data ?? []) {
      if (!isFlashcardPdfGenerationJobActive(job.status)) {
        rememberSeenTerminalFlashcardGenerationJob(job.jobSqid);
      }
    }
  }, [activeRecentJobsQuery.data]);

  function openCreateCardPreview(job: FlashcardPdfGenerationJobResponseDto) {
    if (!canOpenCreateCardPreview(job)) {
      toast({
        title: "Could not open PDF preview",
        description: "This request is missing its deck information.",
        variant: "destructive",
        duration: 8000,
      });
      return;
    }

    setSelectedJobSqid(job.jobSqid);
    setIsRequestCenterOpen(false);
    if (!isFlashcardPdfGenerationJobActive(job.status)) {
      rememberSeenTerminalFlashcardGenerationJob(job.jobSqid);
    }

    const params = new URLSearchParams({
      generationJob: job.jobSqid,
      previewRequest: Date.now().toString(),
    });
    navigate(`${getFlashcardCreateCardPath(job.majorDeckSqid!, job.deckSqid!)}?${params.toString()}`);
  }

  async function handleDeleteJob(jobSqid: string) {
    try {
      await deleteJobMutation.mutateAsync(jobSqid);
      if (selectedJobSqid === jobSqid) {
        setSelectedJobSqid(null);
      }
      toast({
        title: "PDF request deleted",
        description: "The request was removed from your queue.",
        variant: "success",
        duration: 6000,
      });
    } catch (error) {
      toast({
        title: "Could not delete PDF request",
        description: getErrorMessage(error),
        variant: "destructive",
        duration: 8000,
      });
    }
  }

  return (
    <>
      <RequestDock
        activeCount={activeJobs.length}
        job={latestJob}
        expanded={isDockExpanded}
        onToggleExpanded={() => setIsDockExpanded((current) => !current)}
        onOpen={() => {
          setIsDockExpanded(true);
          setIsRequestCenterOpen(true);
          if (latestJob) {
            setSelectedJobSqid(latestJob.jobSqid);
          }
        }}
      />

      <Dialog open={isRequestCenterOpen} onOpenChange={setIsRequestCenterOpen}>
        <DialogContent className="left-2 max-h-[calc(100dvh-1rem)] w-[min(560px,calc(100vw-1rem))] max-w-none translate-x-0 overflow-hidden border-white/10 bg-[#15191d] p-0 text-white shadow-2xl sm:left-6 sm:max-w-none">
          <div className="p-4 sm:p-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <ListChecks className="h-5 w-5 text-[#9FF8F5]" />
                PDF requests
              </DialogTitle>
              <DialogDescription className="text-white/68">
                Select a request to view its status and generated preview.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Badge variant={activeJobs.length > 0 ? "info" : "secondary"}>
                {activeJobs.length > 0 ? `${activeJobs.length} active` : "No active jobs"}
              </Badge>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void allJobsQuery.refetch()}
                disabled={allJobsQuery.isFetching}
                className="h-8 border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.10] hover:text-white"
              >
                {allJobsQuery.isFetching ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                Refresh
              </Button>
            </div>

            <ScrollArea className="mt-4 h-[min(62dvh,560px)] pr-3">
              <div className="flex flex-col gap-2" role="list" aria-label="PDF flashcard generation requests">
                {jobs.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-white/55">
                    No PDF generation requests yet.
                  </div>
                ) : jobs.map((job) => (
                  <GenerationJobListItem
                    key={job.jobSqid}
                    job={job}
                    selected={job.jobSqid === selectedJobSqid}
                    deleting={deleteJobMutation.isPending && deleteJobMutation.variables === job.jobSqid}
                    onDelete={() => void handleDeleteJob(job.jobSqid)}
                    onSelect={() => openCreateCardPreview(job)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function RequestDock({
  activeCount,
  job,
  expanded,
  onToggleExpanded,
  onOpen,
}: {
  activeCount: number;
  job: FlashcardPdfGenerationJobResponseDto | null;
  expanded: boolean;
  onToggleExpanded: () => void;
  onOpen: () => void;
}) {
  const progressPercent = job ? getPdfGenerationProgress(job) : 0;
  const isActive = job ? isFlashcardPdfGenerationJobActive(job.status) : false;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed bottom-5 left-5 z-40 flex flex-col gap-2 transition-[width] duration-200 ease-out",
          expanded ? "w-[min(360px,calc(100vw-2.5rem))]" : "w-14",
        )}
      >
        {expanded ? (
          <div className="rounded-lg border border-white/10 bg-[#101418] p-2 shadow-2xl">
            <div className="mb-2 flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-semibold text-white/70">PDF queue</span>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={onToggleExpanded}
                aria-label="Collapse PDF request dock"
                className="text-white/70 hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft />
              </Button>
            </div>

            {job && isActive ? (
              <button
                type="button"
                onClick={onOpen}
                className="mb-2 w-full rounded-lg border border-[#00CEC8]/20 bg-[#15191d] p-3 text-left text-white outline-none transition hover:border-[#00CEC8]/35 hover:bg-[#1d2429] focus-visible:ring-2 focus-visible:ring-[#00CEC8]/45"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#00CEC8]/12 text-[#9FF8F5]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-white">PDF generation status</span>
                      <span className="mt-1 block truncate text-xs text-white/70">{getPdfGenerationStageMeta(job).label}</span>
                    </span>
                  </span>
                  <span className="shrink-0 rounded-md bg-[#00CEC8]/12 px-2 py-1 text-xs font-semibold tabular-nums text-[#9FF8F5]">
                    {progressPercent}%
                  </span>
                </span>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/72">{getPdfGenerationMessage(job)}</p>
                <Progress value={progressPercent} className="mt-3 h-1.5 bg-white/10" />
              </button>
            ) : null}

            <Button
              type="button"
              onClick={onOpen}
              className="h-auto w-full justify-start gap-3 rounded-lg border border-white/10 bg-[#15191d] px-3 py-3 text-left text-white hover:bg-[#1d2429] hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-300/45"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300">
                <FileText className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 text-xs font-semibold text-white">
                  <span>PDF requests</span>
                  {activeCount > 0 ? (
                    <span className="rounded-md bg-blue-400/15 px-2 py-0.5 text-[11px] text-blue-100">
                      {activeCount} active
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block truncate text-xs text-white/68">View generated flashcard previews</span>
              </span>
            </Button>
          </div>
        ) : (
          <>
            {job && isActive ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onToggleExpanded}
                    className="flex h-14 w-14 flex-col items-center justify-center rounded-lg border border-[#00CEC8]/20 bg-[#101418] text-[#9FF8F5] shadow-2xl outline-none transition hover:border-[#00CEC8]/35 hover:bg-[#15191d] focus-visible:ring-2 focus-visible:ring-[#00CEC8]/45"
                    aria-label={`Expand PDF generation status, ${progressPercent} percent`}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="mt-1 text-[10px] font-semibold tabular-nums">{progressPercent}%</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{getPdfGenerationStageMeta(job).label}</TooltipContent>
              </Tooltip>
            ) : null}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onOpen}
                  className="relative flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-[#15191d] text-emerald-200 shadow-2xl outline-none transition hover:bg-[#1d2429] focus-visible:ring-2 focus-visible:ring-emerald-300/45"
                  aria-label="Open PDF requests"
                >
                  <FileText className="h-4 w-4" />
                  {activeCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
                      {activeCount}
                    </span>
                  ) : null}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Open PDF requests</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleExpanded}
                  className="flex h-10 w-14 items-center justify-center rounded-lg border border-white/10 bg-[#15191d] text-white/70 shadow-2xl outline-none transition hover:bg-[#1d2429] hover:text-white focus-visible:ring-2 focus-visible:ring-white/30"
                  aria-label="Expand PDF request dock"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand PDF dock</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

function GenerationJobListItem({
  job,
  selected,
  deleting,
  onDelete,
  onSelect,
}: {
  job: FlashcardPdfGenerationJobResponseDto;
  selected: boolean;
  deleting: boolean;
  onDelete: () => void;
  onSelect: () => void;
}) {
  const progressPercent = getPdfGenerationProgress(job);
  const stageMeta = getPdfGenerationStageMeta(job);
  const isActive = isFlashcardPdfGenerationJobActive(job.status);

  return (
    <article
      role="listitem"
      className={cn(
        "group rounded-lg border transition",
        selected
          ? "border-[#00CEC8]/45 bg-[#00CEC8]/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        aria-label={`${job.fileName || "Uploaded PDF"}, ${formatPdfGenerationJobStatus(job.status)}, ${stageMeta.label}, ${progressPercent} percent`}
        className="block w-full rounded-t-lg p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#00CEC8]/45"
      >
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">{job.fileName || "Uploaded PDF"}</span>
            <span className="mt-1 block text-xs text-white/50">{formatRelativeDate(job.createdAtUtc)}</span>
          </span>
          <StatusIcon status={job.status} />
        </span>

        <span className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant={getStatusVariant(job.status)}>{formatPdfGenerationJobStatus(job.status)}</Badge>
          <Badge variant="outline" className="border-white/20 text-white/70">{stageMeta.label}</Badge>
        </span>

        <span className="mt-3 flex items-center gap-3">
          <Progress value={progressPercent} className="h-1.5 bg-white/10" />
          <span className="shrink-0 text-xs tabular-nums text-white/55">{progressPercent}%</span>
        </span>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
        <span className="text-xs text-white/60">Click request to preview</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={deleting}
          onClick={onDelete}
          className="text-red-100 hover:bg-red-500/15 hover:text-white focus-visible:ring-2 focus-visible:ring-red-300/35"
          aria-label={isActive ? "Cancel request" : "Delete request"}
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {isActive ? "Cancel" : "Delete"}
        </Button>
      </div>
    </article>
  );
}

function StatusIcon({ status }: { status: FlashcardPdfGenerationJobResponseDto["status"] }) {
  if (status === "completed") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-300" />;
  }

  if (status === "failed" || status === "canceled") {
    return <XCircle className="h-4 w-4 text-red-300" />;
  }

  return status === "queued"
    ? <Clock3 className="h-4 w-4 text-amber-300" />
    : <Loader2 className="h-4 w-4 animate-spin text-blue-300" />;
}

function getStatusVariant(status: FlashcardPdfGenerationJobResponseDto["status"]) {
  switch (status) {
    case "completed":
      return "success";
    case "failed":
    case "canceled":
      return "destructive";
    case "queued":
      return "warning";
    default:
      return "info";
  }
}

function canOpenCreateCardPreview(job: FlashcardPdfGenerationJobResponseDto) {
  return Boolean(job.majorDeckSqid && job.deckSqid);
}

function compareGenerationJobs(left: FlashcardPdfGenerationJobResponseDto, right: FlashcardPdfGenerationJobResponseDto) {
  const leftActive = isFlashcardPdfGenerationJobActive(left.status) ? 0 : 1;
  const rightActive = isFlashcardPdfGenerationJobActive(right.status) ? 0 : 1;
  if (leftActive !== rightActive) {
    return leftActive - rightActive;
  }

  return getJobSortTime(right) - getJobSortTime(left);
}

function getJobSortTime(job: FlashcardPdfGenerationJobResponseDto) {
  return job.updatedAtUtc?.getTime() ?? job.updatedAt?.getTime() ?? job.createdAtUtc?.getTime() ?? 0;
}

function formatDate(value?: Date | null) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatRelativeDate(value?: Date | null) {
  if (!value) {
    return "Unknown time";
  }

  const minutes = Math.max(0, Math.round((Date.now() - value.getTime()) / 60000));
  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  return formatDate(value);
}
