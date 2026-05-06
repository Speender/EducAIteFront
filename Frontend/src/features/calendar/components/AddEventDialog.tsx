import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ToastProvider";
import { type CreateCalendarEventRequest, type CalendarEventCategory, CreateCalendarEventRequestSchema } from "../api/dto";
import { useCreateCalendarEvent } from "../api/hooks";
import { calendarCategories } from "../lib/category";
import { getErrorMessage } from "@/lib/api/errors";

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

const addEventFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().optional(),
  category: z.string().trim().min(1, "Category is required."),
  startAtLocal: z.string().trim().min(1, "Start time is required."),
  endAtLocal: z.string().trim().min(1, "End time is required."),
  isAllDay: z.boolean(),
  location: z.string().trim().optional(),
}).refine((payload) => {
  return new Date(payload.endAtLocal).getTime() >= new Date(payload.startAtLocal).getTime();
}, {
  path: ["endAtLocal"],
  message: "End time must be later than start time.",
});

type AddEventFormValues = z.infer<typeof addEventFormSchema>;

function toLocalDateTimeValue(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function buildInitialValues(defaultDate?: string): AddEventFormValues {
  const now = new Date();
  const start = defaultDate ? new Date(`${defaultDate}T09:00:00`) : now;
  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  return {
    title: "",
    description: "",
    category: "study",
    startAtLocal: toLocalDateTimeValue(start),
    endAtLocal: toLocalDateTimeValue(end),
    isAllDay: false,
    location: "",
  };
}

export function AddEventDialog({ isOpen, onClose, defaultDate }: AddEventDialogProps) {
  const createMutation = useCreateCalendarEvent();
  const { showSuccess } = useToast();

  const initialValues = useMemo(() => buildInitialValues(defaultDate), [defaultDate]);

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddEventFormValues>({
    resolver: zodResolver(addEventFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!isOpen) return;
    reset(buildInitialValues(defaultDate));
  }, [defaultDate, isOpen, reset]);

  const category = watch("category");
  const isAllDay = watch("isAllDay");

  const onSubmit = handleSubmit((values) => {
    const payload: CreateCalendarEventRequest = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      category: values.category as CalendarEventCategory,
      startAtUtc: new Date(values.startAtLocal).toISOString(),
      endAtUtc: new Date(values.endAtLocal).toISOString(),
      isAllDay: values.isAllDay,
      location: values.location?.trim() || undefined,
    };

    const parsed = CreateCalendarEventRequestSchema.safeParse(payload);
    if (!parsed.success) {
      return;
    }

    createMutation.mutate(parsed.data, {
      onSuccess: () => {
        showSuccess("Event created successfully.");
        onClose();
      },
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[460px] border-white/10 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">Add new event</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 py-2" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="calendar-title" className="text-zinc-400">Title</Label>
            <Input
              id="calendar-title"
              {...register("title")}
              placeholder="Database Quiz"
              className="border-white/10 bg-black text-white"
            />
            {errors.title ? <p className="text-xs text-rose-300">{errors.title.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Category</Label>
              <Select value={category} onValueChange={(value) => setValue("category", value, { shouldValidate: true })}>
                <SelectTrigger className="border-white/10 bg-black text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-900 text-white">
                  {calendarCategories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar-location" className="text-zinc-400">Location</Label>
              <Input
                id="calendar-location"
                {...register("location")}
                placeholder="Room 401"
                className="border-white/10 bg-black text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calendar-start" className="text-zinc-400">Start time</Label>
              <Input
                id="calendar-start"
                type="datetime-local"
                {...register("startAtLocal")}
                className="border-white/10 bg-black text-white [color-scheme:dark]"
              />
              {errors.startAtLocal ? <p className="text-xs text-rose-300">{errors.startAtLocal.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar-end" className="text-zinc-400">End time</Label>
              <Input
                id="calendar-end"
                type="datetime-local"
                {...register("endAtLocal")}
                className="border-white/10 bg-black text-white [color-scheme:dark]"
              />
              {errors.endAtLocal ? <p className="text-xs text-rose-300">{errors.endAtLocal.message}</p> : null}
            </div>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-3 py-2.5">
            <span className="text-sm text-zinc-300">All-day event</span>
            <Checkbox checked={isAllDay} onCheckedChange={(checked) => setValue("isAllDay", Boolean(checked), { shouldValidate: true })} />
          </label>

          <div className="space-y-2">
            <Label htmlFor="calendar-description" className="text-zinc-400">Description</Label>
            <Textarea
              id="calendar-description"
              {...register("description")}
              placeholder="Review joins and indexing"
              className="border-white/10 bg-black text-white"
            />
          </div>

          {createMutation.isError ? (
            <p className="text-sm text-rose-300">{getErrorMessage(createMutation.error)}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="bg-white text-black hover:bg-zinc-200">
              {createMutation.isPending ? "Creating..." : "Save event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
