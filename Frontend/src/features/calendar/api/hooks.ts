import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CalendarEventListFilters, CreateCalendarEventRequest, UpdateCalendarEventRequest, PatchCalendarEventRequest } from "./dto";
import { calendarService } from "./service";

export const calendarKeys = {
  all: ["calendar"] as const,
  lists: () => [...calendarKeys.all, "list"] as const,
  list: (filters: CalendarEventListFilters) => [...calendarKeys.lists(), { filters }] as const,
  upcoming: (take: number, category?: string) => [...calendarKeys.all, "upcoming", { take, category }] as const,
  details: () => [...calendarKeys.all, "detail"] as const,
  detail: (sqid: string) => [...calendarKeys.details(), sqid] as const,
};

export const useCalendarEvents = (filters: CalendarEventListFilters = {}) => {
  return useQuery({
    queryKey: calendarKeys.list(filters),
    queryFn: () => calendarService.getEvents(filters),
  });
};

export const useUpcomingCalendarEvents = (take: number = 5, category?: string) => {
  return useQuery({
    queryKey: calendarKeys.upcoming(take, category),
    queryFn: () => calendarService.getUpcomingEvents(take, category),
  });
};

export const useCalendarEvent = (sqid: string) => {
  return useQuery({
    queryKey: calendarKeys.detail(sqid),
    queryFn: () => calendarService.getEvent(sqid),
    enabled: !!sqid,
  });
};

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCalendarEventRequest) => calendarService.createEvent(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
};

export const useUpdateCalendarEvent = (sqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateCalendarEventRequest) => calendarService.updateEvent(sqid, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
};

export const usePatchCalendarEvent = (sqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PatchCalendarEventRequest) => calendarService.patchEvent(sqid, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sqid: string) => calendarService.deleteEvent(sqid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
};
