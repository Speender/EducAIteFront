import { useEffect, useRef, useState, memo } from "react";
import { useResumeStore } from "../hooks/useResumeStore";
import { type ResumeReviewResponseDto, createEducationRequestDtoSchema } from "../api/dto";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ToastProvider";
import { normalizeDateOnly } from "../lib/date";
import { useDebounce } from "@/hooks/use-debounce";

interface EducationFormProps {
  resumeSqid: string;
}

type EducationDraft = ResumeReviewResponseDto["education"][number];

const createEmptyEducation = (orderIndex: number): EducationDraft => ({
  educationSqid: `temp-education-${Date.now()}-${orderIndex}`,
  schoolName: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  orderIndex,
});

const hasSufficientEducationFields = (draft: EducationDraft) => {
  const hasBasics = Boolean(draft.schoolName?.trim()) && Boolean(draft.degree?.trim());
  const startDate = normalizeDateOnly(draft.startDate);
  const endDate = normalizeDateOnly(draft.endDate);
  const hasDates = Boolean(startDate) && (draft.isCurrent || Boolean(endDate));

  return hasBasics && hasDates;
};

const buildEducationPayload = (draft: EducationDraft, index: number) => ({
  schoolName: draft.schoolName,
  degree: draft.degree,
  fieldOfStudy: draft.fieldOfStudy || null,
  startDate: normalizeDateOnly(draft.startDate),
  endDate: draft.isCurrent ? null : normalizeDateOnly(draft.endDate) || null,
  isCurrent: draft.isCurrent,
  description: draft.description || null,
  orderIndex: index,
});

const EducationForm = ({ resumeSqid }: EducationFormProps) => {
  void resumeSqid;
  const education = useResumeStore((state) => state.data.education) || [];
  const updateStore = useResumeStore((state) => state.updateEducation);
  const { showSuccess } = useToast();
  
  const [drafts, setDrafts] = useState<EducationDraft[]>(education);
  
  const autoSavedSignaturesRef = useRef<Map<string, string>>(new Map());
  const lastPushedToStoreRef = useRef<string | null>(null);
  
  const previewDrafts = useDebounce(drafts, 150);
  const debouncedDrafts = useDebounce(drafts, 1000);

  // Guard external updates
  useEffect(() => {
    const currentStoreSignature = JSON.stringify(education);
    if (currentStoreSignature !== lastPushedToStoreRef.current) {
      setDrafts(education);
      lastPushedToStoreRef.current = currentStoreSignature;
    }
  }, [education]);

  useEffect(() => {
    const signature = JSON.stringify(previewDrafts);
    if (signature !== lastPushedToStoreRef.current) {
      lastPushedToStoreRef.current = signature;
      updateStore(previewDrafts as ResumeReviewResponseDto["education"]);
    }
  }, [previewDrafts, updateStore]);

  const setDraftField = <K extends keyof EducationDraft>(
    index: number,
    field: K,
    value: EducationDraft[K]
  ) => {
    setDrafts((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAdd = () => {
    setDrafts((current) => [...current, createEmptyEducation(current.length)]);
  };

  const persistDraft = async (draft: EducationDraft, index: number, silent = false) => {
    const payload = buildEducationPayload(draft, index);

    const parsed = createEducationRequestDtoSchema.safeParse(payload);
    if (!parsed.success) {
      if (!silent) {
        showSuccess("Please enter a valid education date in YYYY-MM-DD format.");
      }
      return null;
    }

    const signature = JSON.stringify(parsed.data);
    const sourceKey = draft.educationSqid || `index-${index}`;
    autoSavedSignaturesRef.current.set(sourceKey, signature);
    return { ...draft, orderIndex: index };
  };

  useEffect(() => {
    let cancelled = false;

    const runAutoSave = async () => {
      for (let index = 0; index < debouncedDrafts.length; index += 1) {
        const draft = debouncedDrafts[index];

        if (!hasSufficientEducationFields(draft)) {
          continue;
        }

        const parsed = createEducationRequestDtoSchema.safeParse(buildEducationPayload(draft, index));
        if (!parsed.success) {
          continue;
        }

        const key = draft.educationSqid || `index-${index}`;
        const signature = JSON.stringify(parsed.data);
        if (autoSavedSignaturesRef.current.get(key) === signature) {
          continue;
        }

        try {
          await persistDraft(draft, index, true);
          if (cancelled) {
            return;
          }
        } catch (error) {
          if (!cancelled) {
            console.error(error);
          }
        }
      }
    };

    void runAutoSave();

    return () => {
      cancelled = true;
    };
  }, [debouncedDrafts]);

  const handleDelete = async (index: number) => {
    setDrafts((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, orderIndex: itemIndex }))
    );
  };

  const fieldClassName = "bg-[#161616] border-white/10 text-white placeholder:text-white/45 focus:border-[#00CEC8]/60 focus:ring-[#00CEC8]/15 transition-all";

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/50 italic">Add and edit education entries for this resume</p>
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          className="w-full bg-[#00CEC8] font-bold text-black hover:bg-[#00CEC8]/90 sm:w-[120px]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="space-y-4">
        {drafts.map((edu, index) => (
          <Card key={edu.educationSqid || index} className="bg-[#0D0D0D] border-white/10 transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">School Name</Label>
                      <Input
                        value={edu.schoolName}
                        onChange={(event) => setDraftField(index, "schoolName", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(event) => setDraftField(index, "degree", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Field of Study</Label>
                      <Input
                        value={edu.fieldOfStudy || ""}
                        onChange={(event) => setDraftField(index, "fieldOfStudy", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Start Date</Label>
                      <Input
                        type="date"
                        value={normalizeDateOnly(edu.startDate)}
                        onChange={(event) => setDraftField(index, "startDate", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">End Date</Label>
                      <Input
                        type="date"
                        value={normalizeDateOnly(edu.endDate)}
                        onChange={(event) => setDraftField(index, "endDate", event.target.value)}
                        disabled={edu.isCurrent}
                        className={fieldClassName}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-white/85 mt-auto pb-1.5">
                      <input
                        type="checkbox"
                        checked={edu.isCurrent}
                        onChange={(event) => setDraftField(index, "isCurrent", event.target.checked)}
                        className="rounded border-white/20 accent-[#00CEC8]"
                      />
                      <span className="text-xs">Currently studying</span>
                    </label>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200 sm:w-[116px]"
                    onClick={() => void handleDelete(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/85">Description</Label>
                <Textarea
                  value={edu.description || ""}
                  onChange={(event) => setDraftField(index, "description", event.target.value)}
                  className={`${fieldClassName} min-h-30 resize-none`}
                  placeholder="Relevant coursework, honors, projects, or academic highlights"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {drafts.length === 0 && (
          <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/55">No education entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(EducationForm);
