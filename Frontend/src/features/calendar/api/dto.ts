import { z } from "zod";
import { calendarCategoryValues } from "../lib/category";

export const CalendarEventCategorySchema = z.enum(calendarCategoryValues);
export type CalendarEventCategory = z.infer<typeof CalendarEventCategorySchema>;

export const CalendarEventResponseSchema = z.object({
  sqid: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string().trim().min(1).transform((value) => value.toLowerCase()),
  startAtUtc: z.string(),
  endAtUtc: z.string(),
  isAllDay: z.boolean(),
  location: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CalendarEventResponse = z.infer<typeof CalendarEventResponseSchema>;

export const CalendarEventListResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  items: z.array(CalendarEventResponseSchema),
});

export type CalendarEventListResponse = z.infer<typeof CalendarEventListResponseSchema>;

export const UpcomingCalendarEventsResponseSchema = z.object({
  totalCount: z.number(),
  items: z.array(CalendarEventResponseSchema),
});

export type UpcomingCalendarEventsResponse = z.infer<typeof UpcomingCalendarEventsResponseSchema>;

const CalendarEventRequestBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: CalendarEventCategorySchema,
  startAtUtc: z.string().datetime(),
  endAtUtc: z.string().datetime(),
  isAllDay: z.boolean().default(false),
  location: z.string().optional(),
});

export const CreateCalendarEventRequestSchema = CalendarEventRequestBaseSchema.refine((payload) => {
  return new Date(payload.endAtUtc).getTime() >= new Date(payload.startAtUtc).getTime();
}, {
  message: "End time must be later than start time.",
  path: ["endAtUtc"],
});

export type CreateCalendarEventRequest = z.infer<typeof CreateCalendarEventRequestSchema>;

export const UpdateCalendarEventRequestSchema = CreateCalendarEventRequestSchema;
export type UpdateCalendarEventRequest = z.infer<typeof UpdateCalendarEventRequestSchema>;

export const PatchCalendarEventRequestSchema = CalendarEventRequestBaseSchema.partial().refine((payload) => {
  if (!payload.startAtUtc || !payload.endAtUtc) {
    return true;
  }

  return new Date(payload.endAtUtc).getTime() >= new Date(payload.startAtUtc).getTime();
}, {
  message: "End time must be later than start time.",
  path: ["endAtUtc"],
});
export type PatchCalendarEventRequest = z.infer<typeof PatchCalendarEventRequestSchema>;

export interface CalendarEventListFilters {
  page?: number;
  pageSize?: number;
  category?: string;
  year?: number;
  month?: number;
  fromUtc?: string;
  toUtc?: string;
  search?: string;
  isAllDay?: boolean;
  sortBy?: "startAtUtc" | "createdAt" | "updatedAt" | "title";
  sortDirection?: "asc" | "desc";
}
