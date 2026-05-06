import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAiTailorResume, useUpdateSummary, useUpdateEmployment } from "../api/hooks";
import { aiTailorResumeRequestDtoSchema, type AiTailorResumeRequestDto, type AiTailorResumeResponseDto } from "../api/dto";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, ArrowRight, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ToastProvider";

interface AiTailorModalProps {
  resumeSqid: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiTailorModal = ({ resumeSqid, isOpen, onOpenChange }: AiTailorModalProps) => {
  const { showSuccess } = useToast();
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [tailoredResult, setTailoredResult] = useState<AiTailorResumeResponseDto | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AiTailorResumeRequestDto>({
    resolver: zodResolver(aiTailorResumeRequestDtoSchema) as any,
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
      includeExperiences: true,
      includeEducations: true,
      includeSkills: true,
      includeProjects: true,
      includeCertifications: true,
    }
  });

  const { mutate: tailorResume, isPending } = useAiTailorResume(resumeSqid);
  const { mutateAsync: updateSummary } = useUpdateSummary(resumeSqid);
  const { mutateAsync: updateEmployment } = useUpdateEmployment(resumeSqid);

  const onSubmit: SubmitHandler<AiTailorResumeRequestDto> = (data) => {
    setStep("loading");
    tailorResume(data, {
      onSuccess: (result) => {
        setTailoredResult(result);
        setStep("result");
      },
      onError: () => {
        setStep("input");
        showSuccess("Failed to tailor resume. Please try again.");
      }
    });
  };

  const handleApply = async () => {
    if (!tailoredResult) return;
    setIsApplying(true);
    try {
      // 1. Apply Summary
      const summaryText = tailoredResult.tailoredResume.professionalSummary.map(s => s.text).join(' ');
      await updateSummary({ summaryText });

      // 2. Apply Experiences (only if they have employmentSqid)
      for (const exp of tailoredResult.tailoredResume.experiences) {
        if (exp.employmentSqid) {
           await updateEmployment({
             employmentSqid: exp.employmentSqid,
             payload: {
                employmentSqid: exp.employmentSqid,
                companyName: exp.companyName,
                positionTitle: exp.positionTitle,
                location: exp.location,
                responsibilities: exp.bullets.map(b => b.text),
                startDate: "", // We don't have this in tailored result easily, might need to preserve it
                isCurrent: false, // Defaulting as we don't have it in the tailored shape directly
                orderIndex: 0
             }
           });
        }
      }

      showSuccess("Resume tailored successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      showSuccess("Some changes could not be applied.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setTailoredResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleReset();
        onOpenChange(open);
    }}>
      <DialogContent className={`bg-[#0A0A0A] border-white/10 text-white p-0 overflow-hidden transition-all duration-500 ${step === 'result' ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <div className="flex flex-col h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8]">
                   <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <DialogTitle className="text-xl font-bold">AI Resume Tailor</DialogTitle>
                   <DialogDescription className="text-white/40">Optimize your resume for a specific job description</DialogDescription>
                </div>
             </div>
             {step === 'result' && (
                <Badge variant="outline" className="border-[#00CEC8]/30 bg-[#00CEC8]/10 text-[#00CEC8] px-3 py-1">
                   Draft Tailored Version
                </Badge>
             )}
          </div>

          <ScrollArea className="flex-1">
            {step === "input" && (
              <form id="tailor-form" onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Job Title</Label>
                    <Input 
                      {...register("jobTitle")} 
                      placeholder="e.g. Senior Backend Engineer" 
                      className="bg-white/5 border-white/10 focus:border-[#00CEC8]/50"
                    />
                    {errors.jobTitle && <p className="text-xs text-red-400">{errors.jobTitle.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input 
                      {...register("companyName")} 
                      placeholder="e.g. Google" 
                      className="bg-white/5 border-white/10 focus:border-[#00CEC8]/50"
                    />
                    {errors.companyName && <p className="text-xs text-red-400">{errors.companyName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Job Description</Label>
                  <Textarea 
                    {...register("jobDescription")} 
                    placeholder="Paste the job description here to help the AI align your experience..." 
                    className="min-h-[200px] bg-white/5 border-white/10 focus:border-[#00CEC8]/50 resize-none"
                  />
                  {errors.jobDescription && <p className="text-xs text-red-400">{errors.jobDescription.message}</p>}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <Label className="text-xs uppercase tracking-widest text-white/40">Include in tailoring</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="inc-exp" 
                        checked={watch("includeExperiences")} 
                        onCheckedChange={(checked) => setValue("includeExperiences", !!checked)}
                      />
                      <label htmlFor="inc-exp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Experiences</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="inc-edu" 
                        checked={watch("includeEducations")} 
                        onCheckedChange={(checked) => setValue("includeEducations", !!checked)}
                      />
                      <label htmlFor="inc-edu" className="text-sm font-medium leading-none">Education</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="inc-skills" 
                        checked={watch("includeSkills")} 
                        onCheckedChange={(checked) => setValue("includeSkills", !!checked)}
                      />
                      <label htmlFor="inc-skills" className="text-sm font-medium leading-none">Skills</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="inc-certs" 
                        checked={watch("includeCertifications")} 
                        onCheckedChange={(checked) => setValue("includeCertifications", !!checked)}
                      />
                      <label htmlFor="inc-certs" className="text-sm font-medium leading-none">Certifications</label>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {step === "loading" && (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-[#00CEC8]/20 border-t-[#00CEC8] animate-spin" />
                  <Sparkles className="w-10 h-10 text-[#00CEC8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Tailoring your journey...</h3>
                  <p className="text-white/40 max-w-sm mx-auto">
                    EducAIte is analyzing the job requirements and aligning your unique achievements to match the perfect candidate profile.
                  </p>
                </div>
                <div className="w-full max-w-xs bg-white/5 h-1 rounded-full overflow-hidden">
                   <div className="bg-[#00CEC8] h-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '30%' }} />
                </div>
              </div>
            )}

            {step === "result" && tailoredResult && (
              <div className="flex h-full overflow-hidden bg-black">
                {/* Analysis Sidebar */}
                <div className="w-[350px] border-r border-white/5 bg-[#050505] p-6 space-y-8 overflow-y-auto">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#00CEC8]">Alignment Score</h4>
                        <span className="text-2xl font-bold">{tailoredResult.alignment.score}%</span>
                      </div>
                      <Progress value={tailoredResult.alignment.score} className="h-2 bg-white/5 [&>div]:bg-[#00CEC8]" />
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Key Matches</h4>
                      <div className="space-y-3">
                        {tailoredResult.alignment.matched.slice(0, 3).map((match, i) => (
                           <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-1">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                                <p className="text-xs font-bold leading-tight">{match.requirement}</p>
                              </div>
                              <p className="text-[10px] text-white/40 ml-6 italic">"{match.evidence}"</p>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Identified Gaps</h4>
                      <div className="space-y-3">
                        {tailoredResult.alignment.gaps.slice(0, 2).map((gap, i) => (
                           <div key={i} className="bg-red-400/5 border border-red-400/10 rounded-lg p-3 space-y-1">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                                <p className="text-xs font-bold leading-tight">{gap.requirement}</p>
                              </div>
                              <p className="text-[10px] text-white/40 ml-6">{gap.reason}</p>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">AI Decisions</h4>
                      <div className="flex flex-wrap gap-2">
                        {tailoredResult.tailoringDecisions.highlighted.map((item, i) => (
                           <Badge key={i} variant="secondary" className="bg-[#00CEC8]/10 text-[#00CEC8] border-none text-[10px]">{item}</Badge>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
                   <div className="bg-white text-black p-10 rounded-sm shadow-2xl min-h-[800px] scale-90 origin-top transform transition-all">
                      <div className="space-y-8">
                         <div className="border-b-2 border-black pb-4">
                            <h2 className="text-3xl font-bold uppercase tracking-tighter">Tailored Resume</h2>
                            <p className="text-sm font-medium text-black/60 italic">{tailoredResult.tailoredResume.headline.text}</p>
                         </div>

                         <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b border-black/10 pb-1">Professional Summary</h3>
                            <div className="text-[12px] leading-relaxed">
                               {tailoredResult.tailoredResume.professionalSummary.map(s => s.text).join(' ')}
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b border-black/10 pb-1">Core Experience</h3>
                            {tailoredResult.tailoredResume.experiences.map((exp, i) => (
                               <div key={i} className="space-y-2 relative group">
                                  <div className="flex justify-between items-start">
                                     <div>
                                        <h4 className="text-sm font-bold">{exp.positionTitle}</h4>
                                        <p className="text-[11px] font-medium text-black/60">{exp.companyName} • {exp.location}</p>
                                     </div>
                                     <span className="text-[10px] font-mono">{exp.dateRange}</span>
                                  </div>
                                  <ul className="space-y-1.5">
                                     {exp.bullets.map((bullet, j) => {
                                        const evidence = tailoredResult.evidenceMap.find(e => e.statementId === bullet.statementId);
                                        return (
                                          <li key={j} className="text-[11px] flex gap-2 items-start group/li">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-black/30 shrink-0" />
                                            <span>{bullet.text}</span>
                                            {evidence && (
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Info className="w-3 h-3 text-[#00CEC8] mt-0.5 opacity-0 group-hover/li:opacity-100 transition-opacity cursor-help" />
                                                  </TooltipTrigger>
                                                  <TooltipContent className="bg-black text-white border-white/10 p-3 max-w-xs">
                                                    <p className="text-[10px] font-bold mb-1">Tailoring Evidence:</p>
                                                    <p className="text-[10px] italic text-white/60">"{evidence.sourceRefs[0].quote}"</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            )}
                                          </li>
                                        );
                                     })}
                                  </ul>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-[#0A0A0A]">
            <DialogFooter className="gap-3">
              {step === "input" && (
                <>
                  <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button 
                    form="tailor-form"
                    className="bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90 font-bold px-8"
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Start Tailoring
                  </Button>
                </>
              )}
              {step === "result" && (
                <>
                  <Button variant="ghost" className="text-white/40" onClick={handleReset}>Try with different details</Button>
                  <div className="flex-1" />
                  <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10" disabled={isApplying}>Close Preview</Button>
                  <Button 
                    className="bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90 font-bold px-8"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin mr-2" />
                         Applying...
                       </>
                    ) : (
                       <>
                         Apply to Resume
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </>
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiTailorModal;
