import { useEffect, useRef, useState, memo } from "react";
import { useResumeStore } from "../hooks/useResumeStore";
import { type ResumeReviewResponseDto, createEmploymentHistoryRequestDtoSchema } from "../api/dto";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ToastProvider";
import { normalizeDateOnly } from "../lib/date";
import { useDebounce } from "@/hooks/use-debounce";

interface EmploymentFormProps {
  resumeSqid: string;
}

type EmploymentDraft = ResumeReviewResponseDto["employmentHistory"][number];

const createEmptyEmployment = (orderIndex: number): EmploymentDraft => ({
  employmentSqid: `temp-employment-${Date.now()}-${orderIndex}`,
  companyName: "",
  positionTitle: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  responsibilities: [""],
  orderIndex,
});

const hasSufficientEmploymentFields = (draft: EmploymentDraft) => {
  const hasBasics = Boolean(draft.companyName?.trim()) && Boolean(draft.positionTitle?.trim());
  const startDate = normalizeDateOnly(draft.startDate);
  const endDate = normalizeDateOnly(draft.endDate);
  const hasDates = Boolean(startDate) && (draft.isCurrent || Boolean(endDate));

  return hasBasics && hasDates;
};

const buildEmploymentPayload = (draft: EmploymentDraft, index: number) => ({
  companyName: draft.companyName,
  positionTitle: draft.positionTitle,
  location: draft.location || null,
  startDate: normalizeDateOnly(draft.startDate),
  endDate: draft.isCurrent ? null : normalizeDateOnly(draft.endDate) || null,
  isCurrent: draft.isCurrent,
  responsibilities: (draft.responsibilities || []).map((item) => item.trim()).filter(Boolean),
  orderIndex: index,
});

const EmploymentForm = ({ resumeSqid }: EmploymentFormProps) => {
  void resumeSqid;
  const employment = useResumeStore((state) => state.data.employmentHistory) || [];
  const updateStore = useResumeStore((state) => state.updateEmployment);
  const { showSuccess } = useToast();
  
  const [drafts, setDrafts] = useState<EmploymentDraft[]>(employment);
  
  const autoSavedSignaturesRef = useRef<Map<string, string>>(new Map());
  const lastPushedToStoreRef = useRef<string | null>(null);
  
  const previewDrafts = useDebounce(drafts, 150);
  const debouncedDrafts = useDebounce(drafts, 1000);

  // Guard external updates
  useEffect(() => {
    const currentStoreSignature = JSON.stringify(employment);
    if (currentStoreSignature !== lastPushedToStoreRef.current) {
      setDrafts(employment);
      lastPushedToStoreRef.current = currentStoreSignature;
    }
  }, [employment]);

  useEffect(() => {
    const signature = JSON.stringify(previewDrafts);
    if (signature !== lastPushedToStoreRef.current) {
      lastPushedToStoreRef.current = signature;
      updateStore(previewDrafts as ResumeReviewResponseDto["employmentHistory"]);
    }
  }, [previewDrafts, updateStore]);

  const setDraftField = <K extends keyof EmploymentDraft>(
    index: number,
    field: K,
    value: EmploymentDraft[K]
  ) => {
    setDrafts((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const setResponsibility = (entryIndex: number, responsibilityIndex: number, value: string) => {
    setDrafts((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== entryIndex) {
          return item;
        }

        const nextResponsibilities = [...(item.responsibilities || [""])];
        nextResponsibilities[responsibilityIndex] = value;

        return { ...item, responsibilities: nextResponsibilities };
      })
    );
  };

  const addResponsibility = (entryIndex: number) => {
    setDrafts((current) =>
      current.map((item, itemIndex) =>
        itemIndex === entryIndex
          ? { ...item, responsibilities: [...(item.responsibilities || []), ""] }
          : item
      )
    );
  };

  const removeResponsibility = (entryIndex: number, responsibilityIndex: number) => {
    setDrafts((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== entryIndex) {
          return item;
        }

        const nextResponsibilities = (item.responsibilities || []).filter(
          (_, idx) => idx !== responsibilityIndex
        );

        return {
          ...item,
          responsibilities: nextResponsibilities.length > 0 ? nextResponsibilities : [""],
        };
      })
    );
  };

  const handleAdd = () => {
    setDrafts((current) => [...current, createEmptyEmployment(current.length)]);
  };

  const persistDraft = async (draft: EmploymentDraft, index: number, silent = false) => {
    const payload = buildEmploymentPayload(draft, index);

    const parsed = createEmploymentHistoryRequestDtoSchema.safeParse(payload);
    if (!parsed.success) {
      if (!silent) {
        showSuccess("Please enter a valid work experience date in YYYY-MM-DD format.");
      }
      return null;
    }

    const signature = JSON.stringify(parsed.data);
    const sourceKey = draft.employmentSqid || `index-${index}`;
    autoSavedSignaturesRef.current.set(sourceKey, signature);
    return { ...draft, orderIndex: index };
  };

  useEffect(() => {
    let cancelled = false;

    const runAutoSave = async () => {
      for (let index = 0; index < debouncedDrafts.length; index += 1) {
        const draft = debouncedDrafts[index];

        if (!hasSufficientEmploymentFields(draft)) {
          continue;
        }

        const parsed = createEmploymentHistoryRequestDtoSchema.safeParse(buildEmploymentPayload(draft, index));
        if (!parsed.success) {
          continue;
        }

        const key = draft.employmentSqid || `index-${index}`;
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
        <p className="text-xs text-white/50 italic">Add and edit experience entries for this resume</p>
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
        {drafts.map((emp, index) => (
          <Card key={emp.employmentSqid || index} className="bg-[#0D0D0D] border-white/10 transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Company Name</Label>
                      <Input
                        value={emp.companyName}
                        onChange={(event) => setDraftField(index, "companyName", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Position Title</Label>
                      <Input
                        value={emp.positionTitle}
                        onChange={(event) => setDraftField(index, "positionTitle", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Location</Label>
                      <Input
                        value={emp.location || ""}
                        onChange={(event) => setDraftField(index, "location", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Start Date</Label>
                      <Input
                        type="date"
                        value={normalizeDateOnly(emp.startDate)}
                        onChange={(event) => setDraftField(index, "startDate", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/85 text-[11px] font-bold uppercase tracking-wider">End Date</Label>
                      <Input
                        type="date"
                        value={normalizeDateOnly(emp.endDate)}
                        onChange={(event) => setDraftField(index, "endDate", event.target.value)}
                        disabled={emp.isCurrent}
                        className={fieldClassName}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-white/85 mt-auto pb-1.5">
                      <input
                        type="checkbox"
                        checked={emp.isCurrent}
                        onChange={(event) => setDraftField(index, "isCurrent", event.target.checked)}
                        className="rounded border-white/20 accent-[#00CEC8]"
                      />
                      <span className="text-xs">I currently work here</span>
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/85">Responsibilities</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-[#00CEC8] hover:text-[#00CEC8] hover:bg-[#00CEC8]/10"
                    onClick={() => addResponsibility(index)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bullet
                  </Button>
                </div>

                {(emp.responsibilities || [""]).map((responsibility, responsibilityIndex) => (
                  <div key={`${emp.employmentSqid || index}-${responsibilityIndex}`} className="flex flex-col gap-2 sm:flex-row">
                    <Textarea
                      value={responsibility}
                      onChange={(event) => setResponsibility(index, responsibilityIndex, event.target.value)}
                      className={`${fieldClassName} min-h-22.5 resize-none`}
                      placeholder="Describe what you achieved or owned in this role"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full shrink-0 border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200 sm:w-[104px]"
                      onClick={() => removeResponsibility(index, responsibilityIndex)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {drafts.length === 0 && (
          <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/55">No experience entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(EmploymentForm);
