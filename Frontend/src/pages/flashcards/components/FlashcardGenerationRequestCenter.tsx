import { ArrowUpRight, Clock3, Eye, Files, Loader2, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDeckFlashcardGenerationJobsQuery, isFlashcardPdfGenerationJobActive } from "@/features/flashcards/api/hooks";
import type { FlashcardPdfGenerationJobResponseDto } from "@/features/flashcards/api/dto";
import {
  formatPdfGenerationJobStatus,
  getPdfGenerationMessage,
  getPdfGenerationProgress,
  getPdfGenerationStageMeta,
  rememberSeenTerminalFlashcardGenerationJob,
} from "@/features/flashcards/pdf-generation-status";
import { getFlashcardCreateCardPath } from "@/features/flashcards/routes";
import { cn } from "@/lib/utils";

type FlashcardGenerationRequestCenterProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  majorDeckSqid: string | null;
  deckSqid: string | null;
};

export function FlashcardGenerationRequestCenter({
  open,
  onOpenChange,
  majorDeckSqid,
  deckSqid,
}: FlashcardGenerationRequestCenterProps) {
  const navigate = useNavigate();
  const jobsQuery = useDeckFlashcardGenerationJobsQuery(majorDeckSqid, deckSqid);

  function openJob(job: FlashcardPdfGenerationJobResponseDto) {
    if (!majorDeckSqid || !deckSqid) {
      return;
    }

    const params = new URLSearchParams({
      generationJob: job.jobSqid,
    });

    if (job.status === "completed" && job.preview) {
      rememberSeenTerminalFlashcardGenerationJob(job.jobSqid);
      onOpenChange(false);
    } else {
      params.set("requestCenter", "open");
    }

    navigate(`${getFlashcardCreateCardPath(majorDeckSqid, deckSqid)}?${params.toString()}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden border-white/10 bg-[#050505] p-0 text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <DialogHeader className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2 text-xl text-white">
                <Files className="size-5 text-[#00CEC8]" />
                Flashcard request center
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Track active PDF jobs, review recent results, and jump back into the flashcard builder without restarting generation.
              </DialogDescription>
            </div>
            <Badge variant="outline" className="border-[#00CEC8]/25 text-[#9FF8F5]">
              {jobsQuery.jobs.length} {jobsQuery.jobs.length === 1 ? "request" : "requests"}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-132px)]">
          <div className="space-y-4 p-6">
            {jobsQuery.isLoading ? (
              <LoadingState />
            ) : jobsQuery.jobs.length === 0 ? (
              <Empty className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] py-14">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Clock3 />
                  </EmptyMedia>
                  <EmptyTitle className="text-white">No recent requests for this deck</EmptyTitle>
                  <EmptyDescription className="text-white/60">
                    Start a PDF generation from the create-card page and it will appear here while the request is running.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              jobsQuery.jobs.map((job, index) => (
                <div key={job.jobSqid} className="space-y-4">
                  <Card className="border-white/10 bg-white/[0.03] text-white">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={resolveStatusVariant(job.status)}>
                              {formatPdfGenerationJobStatus(job.status)}
                            </Badge>
                            {job.stage ? (
                              <Badge variant="outline" className="border-white/10 text-white/70">
                                {getPdfGenerationStageMeta(job).label}
                              </Badge>
                            ) : null}
                            {isFlashcardPdfGenerationJobActive(job.status) ? (
                              <Badge variant="secondary" className="gap-1">
                                <Loader2 className="size-3.5 animate-spin" />
                                Live
                              </Badge>
                            ) : null}
                          </div>
                          <h3 className="mt-3 truncate text-base font-semibold text-white">
                            {job.fileName || "PDF generation request"}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-white/65">
                            {getPdfGenerationMessage(job)}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                          <span className="text-lg font-semibold tabular-nums text-[#9FF8F5]">
                            {getPdfGenerationProgress(job)}%
                          </span>
                          <Button
                            type="button"
                            onClick={() => openJob(job)}
                            disabled={!majorDeckSqid || !deckSqid}
                            variant={job.status === "completed" && job.preview ? "default" : "outline"}
                            className={cn(
                              "min-w-36",
                              job.status === "completed" && job.preview
                                ? "bg-[#00CEC8] text-black hover:bg-[#4de9e4]"
                                : "border-white/10 text-white/80 hover:bg-white/10 hover:text-white",
                            )}
                          >
                            {job.status === "completed" && job.preview ? (
                              <Eye data-icon="inline-start" />
                            ) : (
                              <ArrowUpRight data-icon="inline-start" />
                            )}
                            {job.status === "completed" && job.preview
                              ? "Review preview"
                              : isFlashcardPdfGenerationJobActive(job.status)
                                ? "Track request"
                                : "View request"}
                          </Button>
                        </div>
                      </div>

                      <Progress value={getPdfGenerationProgress(job)} className="h-2 bg-white/10" />

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/45">
                        <span>
                          Updated {formatJobTimestamp(job.updatedAtUtc ?? job.updatedAt ?? job.createdAtUtc ?? job.createdAt ?? null)}
                        </span>
                        {job.status === "failed" || job.status === "canceled" ? (
                          <span className="inline-flex items-center gap-1 text-amber-200">
                            <TriangleAlert className="size-3.5" />
                            Request needs attention
                          </span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                  {index < jobsQuery.jobs.length - 1 ? <Separator className="bg-white/5" /> : null}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] text-white/60">
      <Loader2 className="size-5 animate-spin text-[#00CEC8]" />
      <p className="text-sm">Loading recent generation requests...</p>
    </div>
  );
}

function resolveStatusVariant(status: FlashcardPdfGenerationJobResponseDto["status"]) {
  switch (status) {
    case "completed":
      return "success" as const;
    case "failed":
    case "canceled":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function formatJobTimestamp(value: Date | null | undefined) {
  if (!value) {
    return "just now";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}
