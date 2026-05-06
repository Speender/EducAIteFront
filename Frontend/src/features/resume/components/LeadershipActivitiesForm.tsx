import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeReviewResponseDto } from "../api/dto";
import { useResumeStore } from "../hooks/useResumeStore";
import { normalizeDateOnly } from "../lib/date";

type LeadershipDraft = NonNullable<ResumeReviewResponseDto["leadershipActivities"]>[number];

const createEmptyLeadership = (orderIndex: number): LeadershipDraft => ({
  leadershipActivitySqid: `temp-leadership-${Date.now()}-${orderIndex}`,
  organizationName: "",
  roleTitle: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  highlights: [""],
  orderIndex,
});

const LeadershipActivitiesForm = () => {
  const leadershipActivities = useResumeStore((state) => state.data.leadershipActivities) ?? [];
  const updateLeadershipActivities = useResumeStore((state) => state.updateLeadershipActivities);

  const updateItem = <K extends keyof LeadershipDraft>(index: number, field: K, value: LeadershipDraft[K]) => {
    updateLeadershipActivities(
      leadershipActivities.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateHighlight = (entryIndex: number, highlightIndex: number, value: string) => {
    updateLeadershipActivities(
      leadershipActivities.map((item, itemIndex) => {
        if (itemIndex !== entryIndex) return item;
        const highlights = [...(item.highlights ?? [""])];
        highlights[highlightIndex] = value;
        return { ...item, highlights };
      })
    );
  };

  const addItem = () => {
    updateLeadershipActivities([...leadershipActivities, createEmptyLeadership(leadershipActivities.length)]);
  };

  const removeItem = (index: number) => {
    updateLeadershipActivities(
      leadershipActivities
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, orderIndex: itemIndex }))
    );
  };

  const addHighlight = (entryIndex: number) => {
    updateLeadershipActivities(
      leadershipActivities.map((item, itemIndex) =>
        itemIndex === entryIndex ? { ...item, highlights: [...(item.highlights ?? []), ""] } : item
      )
    );
  };

  const removeHighlight = (entryIndex: number, highlightIndex: number) => {
    updateLeadershipActivities(
      leadershipActivities.map((item, itemIndex) => {
        if (itemIndex !== entryIndex) return item;
        const highlights = (item.highlights ?? []).filter((_, index) => index !== highlightIndex);
        return { ...item, highlights: highlights.length > 0 ? highlights : [""] };
      })
    );
  };

  const fieldClassName = "bg-[#161616] border-white/10 text-white placeholder:text-white/45 focus:border-[#00CEC8]/60 focus:ring-[#00CEC8]/15 transition-all";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/50 italic">Campus leadership, organizations, volunteering, and activities.</p>
        <Button type="button" size="sm" onClick={addItem} className="w-full bg-[#00CEC8] font-bold text-black hover:bg-[#00CEC8]/90 sm:w-[120px]">
          <Plus className="mr-2 size-4" />
          Add Entry
        </Button>
      </div>

      {leadershipActivities.length === 0 ? (
        <Card className="border-white/10 bg-[#0D0D0D]">
          <CardContent className="py-10 text-center text-sm text-white/55">
            Add activities only when they strengthen the resume. Empty sections stay off the preview.
          </CardContent>
        </Card>
      ) : null}

      {leadershipActivities.map((activity, index) => (
        <Card key={activity.leadershipActivitySqid ?? index} className="border-white/10 bg-[#0D0D0D]">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-white/85">Organization</Label>
                  <Input value={activity.organizationName} onChange={(event) => updateItem(index, "organizationName", event.target.value)} className={fieldClassName} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-white/85">Role</Label>
                  <Input value={activity.roleTitle} onChange={(event) => updateItem(index, "roleTitle", event.target.value)} className={fieldClassName} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-white/85">Location</Label>
                  <Input value={activity.location ?? ""} onChange={(event) => updateItem(index, "location", event.target.value)} className={fieldClassName} />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-white/85">Start Date</Label>
                    <Input type="date" value={normalizeDateOnly(activity.startDate)} onChange={(event) => updateItem(index, "startDate", event.target.value)} className={fieldClassName} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-white/85">End Date</Label>
                    <Input type="date" value={normalizeDateOnly(activity.endDate)} onChange={(event) => updateItem(index, "endDate", event.target.value)} disabled={activity.isCurrent} className={fieldClassName} />
                  </div>
                </div>
              </div>
              <Button type="button" size="sm" variant="outline" className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200 sm:w-[116px] sm:self-end" onClick={() => removeItem(index)}>
                <Trash2 className="mr-2 size-4" />
                Delete Entry
              </Button>
            </div>

            <label className="flex items-center gap-2 text-sm text-white/85">
              <input type="checkbox" checked={activity.isCurrent} onChange={(event) => updateItem(index, "isCurrent", event.target.checked)} />
              I currently do this
            </label>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-white/85">Highlights</Label>
                <Button type="button" size="sm" variant="ghost" className="text-[#00CEC8] hover:bg-[#00CEC8]/10 hover:text-[#00CEC8]" onClick={() => addHighlight(index)}>
                  <Plus className="mr-2 size-4" />
                  Add Bullet
                </Button>
              </div>

              {(activity.highlights ?? [""]).map((highlight, highlightIndex) => (
                <div key={`${activity.leadershipActivitySqid}-${highlightIndex}`} className="flex flex-col gap-2 sm:flex-row">
                  <Textarea
                    value={highlight}
                    onChange={(event) => updateHighlight(index, highlightIndex, event.target.value)}
                    className={`${fieldClassName} min-h-20 resize-none`}
                    placeholder="Led a team, organized an event, raised participation, or improved an outcome"
                  />
                  <Button type="button" size="sm" variant="outline" className="w-full shrink-0 border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200 sm:w-[104px]" onClick={() => removeHighlight(index, highlightIndex)}>
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default memo(LeadershipActivitiesForm);
