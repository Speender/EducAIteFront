import { apiClient } from "@/lib/api/client";
import type {
  CalendarEventListFilters,
  CalendarEventListResponse,
  CalendarEventResponse,
  CreateCalendarEventRequest,
  PatchCalendarEventRequest,
  UpcomingCalendarEventsResponse,
  UpdateCalendarEventRequest,
} from "./dto";
import {
  CalendarEventListResponseSchema,
  CalendarEventResponseSchema,
  UpcomingCalendarEventsResponseSchema,
} from "./dto";

export const calendarService = {
  getEvents: async (filters: CalendarEventListFilters = {}): Promise<CalendarEventListResponse> => {
    const response = await apiClient.get("/calendar/events", { params: filters });
    return CalendarEventListResponseSchema.parse(response.data);
  },

  getUpcomingEvents: async (take: number = 5, category?: string, fromUtc?: string): Promise<UpcomingCalendarEventsResponse> => {
    const response = await apiClient.get("/calendar/events/upcoming", {
      params: { take, category, fromUtc },
    });
    return UpcomingCalendarEventsResponseSchema.parse(response.data);
  },

  getEvent: async (sqid: string): Promise<CalendarEventResponse> => {
    const response = await apiClient.get(`/calendar/events/${encodeURIComponent(sqid)}`);
    return CalendarEventResponseSchema.parse(response.data);
  },

  createEvent: async (request: CreateCalendarEventRequest): Promise<CalendarEventResponse> => {
    const response = await apiClient.post("/calendar/events", request);
    return CalendarEventResponseSchema.parse(response.data);
  },

  updateEvent: async (sqid: string, request: UpdateCalendarEventRequest): Promise<CalendarEventResponse> => {
    const response = await apiClient.put(`/calendar/events/${encodeURIComponent(sqid)}`, request);
    return CalendarEventResponseSchema.parse(response.data);
  },

  patchEvent: async (sqid: string, request: PatchCalendarEventRequest): Promise<CalendarEventResponse> => {
    const response = await apiClient.patch(`/calendar/events/${encodeURIComponent(sqid)}`, request);
    return CalendarEventResponseSchema.parse(response.data);
  },

  deleteEvent: async (sqid: string): Promise<void> => {
    await apiClient.delete(`/calendar/events/${encodeURIComponent(sqid)}`);
  },
};
