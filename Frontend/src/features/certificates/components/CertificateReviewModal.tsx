import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import {
  useCertificateDetailQuery,
  useUpdateCertificateMutation,
  useConfirmCertificateMutation,
} from "../api/hooks";
import {
  updateCertificateRequestSchema,
  type UpdateCertificateRequest,
} from "../api/dto";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { cn } from "@/lib/utils";

interface CertificateReviewModalProps {
  certificationSqid: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateReviewModal({
  certificationSqid,
  open,
  onOpenChange,
}: CertificateReviewModalProps) {
  const { data: certificate } = useCertificateDetailQuery(certificationSqid);
  const updateMutation = useUpdateCertificateMutation(certificationSqid || "");
  const confirmMutation = useConfirmCertificateMutation(certificationSqid || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateCertificateRequest>({
    resolver: zodResolver(updateCertificateRequestSchema),
  });

  useEffect(() => {
    if (certificate) {
      reset({
        achievementName: certificate.achievementName,
        institution: certificate.institution,
        issuedDate: certificate.issuedDate,
        schoolYear: certificate.schoolYear,
        gradeOrScore: certificate.gradeOrScore,
        description: certificate.description,
        tags: certificate.tags,
      });
    }
  }, [certificate, reset]);

  const onSave = async (data: UpdateCertificateRequest) => {
    if (!certificationSqid) return;
    await updateMutation.mutateAsync(data);
  };

  const onConfirm = async (data: UpdateCertificateRequest) => {
    if (!certificationSqid) return;
    // Save first if dirty
    if (isDirty) {
      await updateMutation.mutateAsync(data);
    }
    await confirmMutation.mutateAsync({ confirmed: true });
    onOpenChange(false);
  };

  if (!certificationSqid) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-dvh max-w-none rounded-none md:w-[96vw] md:h-[94vh] md:rounded-[32px] lg:max-w-7xl lg:h-[92vh] flex flex-col p-0 overflow-hidden bg-[#0A0A0A] border-white/10 shadow-[0_0_80px_rgba(0,206,200,0.15)]">
        <DialogHeader className="p-4 sm:p-6 md:p-8 border-b border-white/5 bg-white/2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-white">
                Review Certificate
                {certificate && (
                  <CertificateStatusBadge status={certificate.status} />
                )}
              </DialogTitle>
              {certificate && (
                <p className="text-sm md:text-base text-white/40 font-medium">
                  File: <span className="text-white/60">{certificate.file.fileName}</span>
                </p>
              )}
            </div>
            {certificate?.overallConfidence !== null && certificate?.overallConfidence !== undefined && (
              <div className="flex items-center gap-4 bg-white/5 p-3 px-5 rounded-2xl border border-white/5">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none">AI Confidence</p>
                  <p className="text-xl font-black text-white leading-none">
                    {Math.round(certificate.overallConfidence * 100)}%
                  </p>
                </div>
                <Badge
                  variant={certificate.overallConfidence > 0.8 ? "success" : certificate.overallConfidence > 0.5 ? "warning" : "destructive"}
                  className="h-8 px-3 text-xs font-bold"
                >
                  {certificate.overallConfidence > 0.8 ? "Reliable" : certificate.overallConfidence > 0.5 ? "Review Needed" : "Low Confidence"}
                </Badge>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Preview - Larger and more prominent */}
          <div className="w-full lg:w-[58%] xl:w-[62%] bg-black flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 relative group min-h-[38vh] lg:min-h-0">
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
               <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                 Document Preview
               </div>
            </div>
            
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-2">
              {certificate?.file.fileUrl && (
                <a 
                  href={certificate.file.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#00CEC8] text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,206,200,0.4)]"
                  title="Open in new tab"
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>

            <div className="flex-1 relative bg-[#050505] flex items-center justify-center">
              {certificate?.file.fileUrl ? (
                certificate.file.fileMimeType === "application/pdf" ? (
                  <iframe
                    src={`${certificate.file.fileUrl}#view=FitV`}
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/3 to-transparent">
                    <img
                      src={certificate.file.fileUrl}
                      alt="Certificate Preview"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/10 ring-1 ring-white/5 transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-white/20">
                  <Loader2 className="size-12 animate-spin mb-6 text-[#00CEC8]" />
                  <p className="text-sm font-bold tracking-[0.3em] uppercase opacity-50">Initializing Preview...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Fields - More compact and high-tech */}
          <div className="w-full lg:w-[42%] xl:w-[38%] flex flex-col bg-[#0A0A0A] min-h-0">
            <ScrollArea className="flex-1 h-full">
              <form id="certificate-form" className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="achievementName" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00CEC8]">Achievement Name</Label>
                    <div className="h-px flex-1 bg-white/5 ml-4" />
                  </div>
                  <Input
                    id="achievementName"
                    {...register("achievementName")}
                    placeholder="e.g. Google Data Analytics Professional"
                    className={cn(
                      "bg-white/5 border-white/10 h-12 sm:h-14 rounded-2xl focus:border-[#00CEC8]/50 text-white font-bold text-base sm:text-lg px-4 sm:px-5 transition-all shadow-inner",
                      errors.achievementName && "border-rose-500/50 focus:border-rose-500"
                    )}
                  />
                  {certificate?.fieldConfidence.find(f => f.fieldName === "achievementName")?.needsReview && (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium leading-relaxed">
                      <AlertCircle className="size-4 shrink-0 mt-0.5" /> 
                      AI is unsure about this field. Please verify against the document preview.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="institution" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Institution / Issuer</Label>
                    <Input id="institution" {...register("institution")} placeholder="e.g. Coursera / Google" className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#00CEC8]/50 text-white font-medium px-5" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="issuedDate" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Issued Date</Label>
                      <Input id="issuedDate" type="date" {...register("issuedDate")} className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#00CEC8]/50 text-white font-medium px-5 scheme-dark" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="schoolYear" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">School Year</Label>
                      <Input id="schoolYear" {...register("schoolYear")} placeholder="e.g. 2023-24" className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#00CEC8]/50 text-white font-medium px-5" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gradeOrScore" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Grade / Score (Optional)</Label>
                    <Input id="gradeOrScore" {...register("gradeOrScore")} placeholder="e.g. 98%, Grade A" className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#00CEC8]/50 text-white font-medium px-5" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Description / Highlights</Label>
                  <Textarea 
                    id="description" 
                    {...register("description")} 
                    rows={4} 
                    placeholder="Briefly describe what you learned or achieved..."
                    className="bg-white/5 border-white/10 rounded-2xl focus:border-[#00CEC8]/50 text-white font-medium px-5 py-4 transition-all resize-none shadow-inner" 
                  />
                </div>

                {certificate?.tags && certificate.tags.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Skills & Keywords Detected</Label>
                    <div className="flex flex-wrap gap-2.5">
                      {certificate.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 text-white/70 px-3 py-1.5 rounded-lg hover:bg-[#00CEC8]/20 hover:text-[#00CEC8] transition-all cursor-default font-bold">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 md:p-8 border-t border-white/5 bg-white/2">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 sm:gap-6">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full md:w-auto text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] order-2 md:order-1 h-11 sm:h-12 px-4 sm:px-6"
            >
              Discard Changes
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3 sm:gap-4 w-full md:w-auto order-1 md:order-2">
              <Button
                variant="outline"
                onClick={handleSubmit(onSave)}
                disabled={!isDirty || updateMutation.isPending}
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-11 sm:h-14 rounded-2xl px-4 sm:px-8"
              >
                {updateMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin text-[#00CEC8]" />}
                Save Draft
              </Button>
              <Button
                onClick={handleSubmit(onConfirm)}
                disabled={confirmMutation.isPending}
                className="w-full bg-[#00CEC8] hover:bg-[#00CEC8]/90 text-black font-black uppercase tracking-tight h-11 sm:h-14 px-4 sm:px-10 rounded-2xl shadow-[0_0_30px_rgba(0,206,200,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                {confirmMutation.isPending ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 size-5" />
                )}
                Confirm & Verify
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
