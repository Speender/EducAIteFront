import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, GraduationCap, ArrowRight, X } from "lucide-react";
import {
  useStudentResumeContext,
  useUpdateStudentContext,
} from "../api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ToastProvider";

const academicFormSchema = z.object({
  schoolName: z.string().optional(),
  degreeProgram: z.string().min(1, "Degree program is required"),
  yearLevel: z.string().optional(),
  academicTerm: z.string().optional(),
  source: z.enum(["study_load", "manual", "mixed"]).default("manual"),
});

type AcademicFormValues = z.infer<typeof academicFormSchema>;
type AcademicFormInput = z.input<typeof academicFormSchema>;

interface AcademicContextReviewProps {
  resumeSqid: string;
  onComplete: () => void;
}

export default function AcademicContextReview({
  resumeSqid,
  onComplete,
}: AcademicContextReviewProps) {
  const { data: studentContext, isLoading } = useStudentResumeContext();
  const updateMutation = useUpdateStudentContext(resumeSqid);
  const { showSuccess } = useToast();

  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  
  // Experience types for students
  const EXPERIENCE_TYPES = [
    "Internships", "Part-time Jobs", "Freelance", 
    "Academic Projects", "Extracurriculars", "Volunteering"
  ];
  const [selectedExperienceTypes, setSelectedExperienceTypes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AcademicFormInput, unknown, AcademicFormValues>({
    resolver: zodResolver(academicFormSchema),
    defaultValues: {
      degreeProgram: "",
      source: "manual",
      schoolName: "",
      yearLevel: "",
      academicTerm: "",
    },
  });

  useEffect(() => {
    if (studentContext) {
      reset({
        degreeProgram: studentContext.degreeProgram || "",
        yearLevel: studentContext.yearLevel || "",
        academicTerm: studentContext.academicTerm || "",
        source: studentContext.studyLoadSource?.uploaded ? "study_load" : "manual",
        schoolName: "",
      });
      setSubjects(studentContext.subjects || []);
    }
  }, [studentContext, reset]);

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed) && subjects.length < 30) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const toggleExperienceType = (type: string, checked: boolean) => {
    if (checked) {
      if (selectedExperienceTypes.length < 20) {
        setSelectedExperienceTypes([...selectedExperienceTypes, type]);
      }
    } else {
      setSelectedExperienceTypes(selectedExperienceTypes.filter((t) => t !== type));
    }
  };

  const onSubmit = async (data: AcademicFormValues) => {
    try {
      await updateMutation.mutateAsync({
        schoolName: data.schoolName || null,
        degreeProgram: data.degreeProgram,
        yearLevel: data.yearLevel || null,
        academicTerm: data.academicTerm || null,
        source: data.source as "study_load" | "manual" | "mixed",
        subjects,
        experienceTypes: selectedExperienceTypes,
      });
      showSuccess("Academic context saved successfully.");
      onComplete();
    } catch (error: any) {
      console.error(error);
      showSuccess(error?.response?.data?.title || "Failed to save academic context");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#00CEC8]" />
        <p className="text-white/60">Loading academic context...</p>
      </div>
    );
  }

  return (
    <Card className="bg-[#0A0A0A] border-white/10 rounded-[24px] overflow-hidden max-w-4xl mx-auto w-full my-8">
      <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Academic Context Review</h2>
            <p className="text-sm text-white/60">Verify your academic profile to help AI tailor your resume.</p>
          </div>
        </div>
        {studentContext?.studyLoadSource?.uploaded && (
          <Badge variant="outline" className="border-[#00CEC8] text-[#00CEC8] font-bold uppercase tracking-wider text-[10px] px-3 py-1">
            Data Extracted from Study Load
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white/70">Degree Program <span className="text-red-500">*</span></Label>
            <Input
              {...register("degreeProgram")}
              className="bg-white/5 border-white/10 h-12 text-white"
              placeholder="e.g. Bachelor of Science in Computer Science"
            />
            {errors.degreeProgram && <p className="text-red-500 text-xs mt-1">{errors.degreeProgram.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/70">Year Level</Label>
              <Input
                {...register("yearLevel")}
                className="bg-white/5 border-white/10 h-12 text-white"
                placeholder="e.g. 3rd Year"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Academic Term</Label>
              <Input
                {...register("academicTerm")}
                className="bg-white/5 border-white/10 h-12 text-white"
                placeholder="e.g. 1st Semester, 2023-2024"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/70">School / University</Label>
            <Input
              {...register("schoolName")}
              className="bg-white/5 border-white/10 h-12 text-white"
              placeholder="e.g. Example University"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-white/70">Relevant Subjects ({subjects.length}/30)</Label>
            <div className="flex gap-2">
              <Input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                className="bg-white/5 border-white/10 h-12 text-white"
                placeholder="Type a subject and press Enter"
              />
              <Button type="button" onClick={addSubject} className="h-12 bg-[#00CEC8] text-black">
                Add
              </Button>
            </div>
            
            {subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="px-3 py-1 bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 rounded-sm"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="text-white/50 hover:text-white ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/40 italic p-4 bg-white/5 rounded-md border border-white/5 text-center">
                No subjects added. Add key subjects you've taken.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-white/70">Experience Types You Want to Include</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {EXPERIENCE_TYPES.map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedExperienceTypes.includes(type)
                      ? "bg-[#00CEC8]/10 border-[#00CEC8]"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Checkbox
                    checked={selectedExperienceTypes.includes(type)}
                    onCheckedChange={(checked) => toggleExperienceType(type, checked as boolean)}
                    className="border-white/40 data-[state=checked]:bg-[#00CEC8] data-[state=checked]:text-black"
                  />
                  <span className={`text-sm font-medium ${selectedExperienceTypes.includes(type) ? 'text-white' : 'text-white/70'}`}>
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-12 px-8 bg-white text-black font-bold rounded-md hover:bg-white/90"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <ArrowRight className="w-5 h-5 mr-2" />
            )}
            Save & Continue to Job Targets
          </Button>
        </div>
      </form>
    </Card>
  );
}
