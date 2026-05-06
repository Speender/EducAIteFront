import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeReviewResponseDto } from "../api/dto";
import { useResumeStore } from "../hooks/useResumeStore";

type SkillsAndInterests = NonNullable<ResumeReviewResponseDto["skillsAndInterests"]>;
type ListKey = keyof SkillsAndInterests;

const emptySkills: SkillsAndInterests = {
  technicalSkills: [""],
  languages: [""],
  interests: [""],
};

const sectionLabels: Record<ListKey, { title: string; placeholder: string }> = {
  technicalSkills: {
    title: "Technical Skills",
    placeholder: "React, C#, SQL, Excel",
  },
  languages: {
    title: "Languages",
    placeholder: "English - Professional",
  },
  interests: {
    title: "Interests",
    placeholder: "Robotics, debate, volunteering",
  },
};

const SkillsInterestsForm = () => {
  const skillsAndInterests = useResumeStore((state) => state.data.skillsAndInterests) ?? emptySkills;
  const updateSkillsAndInterests = useResumeStore((state) => state.updateSkillsAndInterests);

  const updateList = (key: ListKey, values: string[]) => {
    updateSkillsAndInterests({
      technicalSkills: skillsAndInterests.technicalSkills ?? [],
      languages: skillsAndInterests.languages ?? [],
      interests: skillsAndInterests.interests ?? [],
      [key]: values,
    });
  };

  const fieldClassName = "bg-[#161616] border-white/10 text-white placeholder:text-white/45 focus:border-[#00CEC8]/60 focus:ring-[#00CEC8]/15 transition-all";

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-white/50 italic">
        Keep entries short. These become comma-separated resume lines on the preview.
      </p>

      {(Object.keys(sectionLabels) as ListKey[]).map((key) => {
        const values = skillsAndInterests[key]?.length ? skillsAndInterests[key] : [""];
        const meta = sectionLabels[key];

        return (
          <div key={key} className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Label className="text-white/85">{meta.title}</Label>
              <Button type="button" size="sm" variant="ghost" className="h-8 w-full text-[#00CEC8] hover:bg-[#00CEC8]/10 hover:text-[#00CEC8] font-bold sm:w-[96px]" onClick={() => updateList(key, [...values, ""])}>
                <Plus className="mr-1.5 size-3.5" />
                Add
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {values.map((value, index) => (
                <div key={`${key}-${index}`} className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={value}
                    onChange={(event) => {
                      const next = [...values];
                      next[index] = event.target.value;
                      updateList(key, next);
                    }}
                    className={fieldClassName}
                    placeholder={meta.placeholder}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full shrink-0 border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200 sm:w-[104px]"
                    onClick={() => updateList(key, values.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(SkillsInterestsForm);
