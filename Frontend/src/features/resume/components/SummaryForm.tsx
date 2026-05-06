import { useEffect, useRef, useState, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAiRewriteSummary } from "../api/hooks";
import { resumeSummarySchema, type UpdateSummaryRequestDto } from "../api/dto";
import { useResumeStore } from "../hooks/useResumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { normalizeApiError } from "@/lib/api/errors";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

interface SummaryFormProps { resumeSqid: string; }

const SummaryForm = ({ resumeSqid }: SummaryFormProps) => {
  const initialData = useResumeStore((state) => state.data.summary);
  const updateStore = useResumeStore((state) => state.updateSummary);
  const { mutate: aiRewrite, isPending: isAiLoading } = useAiRewriteSummary(resumeSqid);

  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiTone, setAiTone] = useState<"professional" | "concise" | "impact">("professional");
  const [aiError, setAiError] = useState<string | null>(null);
  const lastPushedToStoreRef = useRef<string | null>(null);

  const { register, watch, setValue, reset } = useForm<UpdateSummaryRequestDto>({
    resolver: zodResolver(resumeSummarySchema),
    defaultValues: initialData || { summaryText: "" },
  });

  // Handle external updates to summary
  useEffect(() => {
    const currentStoreSignature = JSON.stringify(initialData || { summaryText: "" });
    if (currentStoreSignature !== lastPushedToStoreRef.current) {
      reset(initialData || { summaryText: "" });
      lastPushedToStoreRef.current = currentStoreSignature;
    }
  }, [initialData, reset]);

  const formData = watch();
  const previewSummaryText = useDebounce(formData.summaryText, 150);
  useDebounce(formData.summaryText, 900);

  useEffect(() => {
    const signature = JSON.stringify({ summaryText: previewSummaryText || "" });
    if (signature !== lastPushedToStoreRef.current) {
      lastPushedToStoreRef.current = signature;
      updateStore({ summaryText: previewSummaryText || "" });
    }
  }, [previewSummaryText, updateStore]);

  const handleAiRewrite = () => {
    const summaryText = formData.summaryText?.trim() ?? "";
    if (summaryText.length < 10) {
      setAiError("Write at least 10 characters before using AI Rewrite.");
      return;
    }

    setAiError(null);
    aiRewrite(
      { summaryText, tone: aiTone, targetLength: 800 },
      {
        onSuccess: (data) => {
          setValue("summaryText", data.rewrittenSummary);
          updateStore({ summaryText: data.rewrittenSummary });
          setIsAiDialogOpen(false);
        },
        onError: (error) => {
          setAiError(normalizeApiError(error).message);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Label htmlFor="summaryText" className="text-white/85">Professional Summary</Label>
          <p className="text-xs text-white/50 italic">Summary changes are applied instantly and included in full resume save.</p>
        </div>
        <div className="w-full sm:w-auto">
        
        <Dialog
          open={isAiDialogOpen}
          onOpenChange={(open) => {
            setIsAiDialogOpen(open);
            if (!open) {
              setAiError(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full border-[#00CEC8]/30 bg-[#00CEC8]/5 text-[#00CEC8] hover:bg-[#00CEC8]/10 hover:border-[#00CEC8]/50 sm:w-[120px]"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              AI Magic
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>AI Summary Rewrite</DialogTitle>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <p className="text-sm text-white/75">
                Let EducAIte enhance your summary. Select a tone to better match your target role.
              </p>
              {aiError ? (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {aiError}
                </p>
              ) : null}
              <div className="space-y-2">
                <Label className="text-white/85">Desired Tone</Label>
                <Select value={aiTone} onValueChange={(v: any) => setAiTone(v)}>
                  <SelectTrigger className="bg-[#161616] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161616] border-white/10 text-white">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="impact">Impact-driven</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90 font-bold w-full"
                onClick={handleAiRewrite}
                disabled={isAiLoading}
              >
                {isAiLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Rewrite Summary
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="relative">
        <Textarea
          id="summaryText"
          {...register("summaryText")}
          placeholder="Write a brief professional summary about your career goals and achievements..."
          className="min-h-50 bg-[#161616] border-white/10 text-white placeholder:text-white/45 focus:border-[#00CEC8]/60 focus:ring-[#00CEC8]/15 transition-all resize-none leading-relaxed"
        />
        <div className="absolute bottom-3 right-3">
           <span className={`text-[10px] font-mono ${formData.summaryText.length < 80 ? 'text-red-400' : 'text-white/55'}`}>
             {formData.summaryText.length}/2000
           </span>
        </div>
      </div>
    </div>
  );
};

export default memo(SummaryForm);
