import { useEffect, useRef, useState, type ReactNode } from "react";
import { Sparkles, Check, AlertTriangle, Loader2, BrainCircuit, ScanSearch, ShieldCheck } from "lucide-react";
import {
  useCertificateSuggestions,
} from "@/features/resume/api/hooks";
import { useToast } from "@/components/ToastProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

interface CertificateSuggestionsSheetProps {
  resumeSqid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCertificateSqids: string[];
  onSelectionChange?: (sqids: string[]) => void;
}

export function CertificateSuggestionsSheet({
  resumeSqid,
  open,
  onOpenChange,
  currentCertificateSqids,
  onSelectionChange,
}: CertificateSuggestionsSheetProps) {
  const [selectedSqids, setSelectedSqids] = useState<string[]>(currentCertificateSqids);
  const wasOpenRef = useRef(false);
  const { showError } = useToast();
  const suggestionsMutation = useCertificateSuggestions(resumeSqid);
  const data = suggestionsMutation.data;
  const isLoading = suggestionsMutation.isPending;
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }

    setSelectedSqids(currentCertificateSqids);
    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      suggestionsMutation.mutate(
        { maxResults: 5 },
        {
          onError: (error) => {
            showError(getErrorMessage(error));
          },
        },
      );
    }
  }, [open]);

  useEffect(() => {
    if (!isLoading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 3);
    }, 900);
    return () => clearInterval(interval);
  }, [isLoading]);

  const toggleCertificate = (sqid: string) => {
    setSelectedSqids((prev) =>
      prev.includes(sqid) ? prev.filter((id) => id !== sqid) : [...prev, sqid]
    );
  };

  const handleSave = async () => {
    onSelectionChange?.(selectedSqids);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[88vh] max-h-[88vh] flex-col overflow-hidden border-white/10 bg-[#0A0A0A] p-0 text-white sm:max-w-3xl">
        <DialogHeader className="border-b border-white/10 bg-gradient-to-r from-[#00CEC8]/10 via-[#0A0A0A] to-[#0A0A0A] p-6">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-[#00CEC8]" />
            AI Certificate Suggestions
          </DialogTitle>
          <DialogDescription className="text-white/60">
            AI ranks your existing certificates based on your saved resume context.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-5 py-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <LoadingPill
                    icon={<BrainCircuit className="size-4" />}
                    label="Reading resume context"
                    active={loadingStep === 0}
                  />
                  <LoadingPill
                    icon={<ScanSearch className="size-4" />}
                    label="Matching certificates"
                    active={loadingStep === 1}
                  />
                  <LoadingPill
                    icon={<ShieldCheck className="size-4" />}
                    label="Ranking relevance"
                    active={loadingStep === 2}
                  />
                </div>
                <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
                  <Skeleton className="h-4 w-48 bg-white/10" />
                  <Skeleton className="mt-3 h-3 w-72 bg-white/10" />
                  <Skeleton className="mt-1.5 h-3 w-60 bg-white/10" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-xl border border-white/10 bg-[#111111] p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="mt-1 size-4 rounded-sm bg-white/10" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-52 bg-white/10" />
                          <Skeleton className="h-3 w-36 bg-white/10" />
                          <Skeleton className="h-3 w-24 bg-[#00CEC8]/20" />
                          <Skeleton className="h-3 w-full bg-white/10" />
                          <Skeleton className="h-3 w-5/6 bg-white/10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : data ? (
              <>
                <div className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Target Role</p>
                  <p className="font-medium">{data.targetRole || "Not specified"}</p>
                  <p className="text-xs text-white/60">
                    Reviewed {data.totalCertificatesReviewed} certificate{data.totalCertificatesReviewed === 1 ? "" : "s"}.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    Recommended
                    <Badge variant="success" className="rounded-full px-2">
                      {data.suggestions.length}
                    </Badge>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {data.suggestions.map((item) => (
                      <div
                        key={item.certificationSqid}
                        className={cn(
                          "group relative flex items-start gap-3 rounded-xl border border-white/10 bg-[#111111] p-4 transition-all hover:bg-white/5",
                          selectedSqids.includes(item.certificationSqid) && "border-primary bg-primary/5"
                        )}
                        onClick={() => toggleCertificate(item.certificationSqid)}
                      >
                        <Checkbox
                          checked={selectedSqids.includes(item.certificationSqid)}
                          onCheckedChange={() => toggleCertificate(item.certificationSqid)}
                          className="mt-1"
                        />
                          <div className="space-y-1 pr-12">
                          <p className="font-medium leading-none">{item.name?.trim() || "Unnamed certificate"}</p>
                          <p className="text-xs text-white/60">{item.issuer?.trim() || "Unknown issuer"}</p>
                          {item.issuedAt ? <p className="text-[11px] text-white/45">Issued: {item.issuedAt}</p> : null}
                          <p className="text-xs text-emerald-500 font-medium mt-1">
                            Relevance score: {item.relevanceScore}%
                          </p>
                          <p className="mt-2 line-clamp-3 text-xs text-white/65">
                            {item.matchReason}
                          </p>
                          <p className="text-xs text-cyan-400 mt-1 line-clamp-3">
                            {item.recommendedUsage}
                          </p>
                          {item.tags.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.tags.slice(0, 5).map((tag) => (
                                <Badge key={`${item.certificationSqid}-${tag}`} variant="outline" className="border-white/20 text-[10px] text-white/75">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Alert className="border-white/10 bg-white/5 text-white">
                <AlertTriangle className="size-4" />
                <AlertDescription>
                  No suggestions available. Try again after completing more resume context.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#0A0A0A] p-6">
          <Button
            className="w-full bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90"
            onClick={handleSave}
          >
            <Check className="mr-2 size-4" />
            Save Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoadingPill({ icon, label, active }: { icon: ReactNode; label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all",
        active
          ? "border-[#00CEC8]/60 bg-[#00CEC8]/15 text-[#00CEC8]"
          : "border-white/10 bg-white/5 text-white/60",
      )}
    >
      <span className={active ? "animate-pulse" : ""}>{icon}</span>
      <span>{label}</span>
      {active ? <Loader2 className="ml-auto size-3.5 animate-spin" /> : null}
    </div>
  );
}
