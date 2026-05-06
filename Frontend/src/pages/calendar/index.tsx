import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CalendarEventListFilters, CalendarEventResponse } from "@/features/calendar/api/dto";
import { useCalendarEvents, useUpcomingCalendarEvents } from "@/features/calendar/api/hooks";
import { AddEventDialog } from "@/features/calendar/components/AddEventDialog";
import {
  calendarCategories,
  type CalendarCategoryValue,
  getCalendarCategoryLabel,
  normalizeCalendarCategory,
} from "@/features/calendar/lib/category";
import { useDebounce } from "@/hooks/use-debounce";
import { getErrorMessage } from "@/lib/api/errors";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function getMonthCells(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const startCellDate = new Date(year, month, 1 - mondayOffset);
  const today = new Date();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startCellDate);
    date.setDate(startCellDate.getDate() + index);

    const isCurrentMonth = date.getMonth() === month;
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    return {
      key: toDateKey(date),
      date,
      muted: !isCurrentMonth,
      active: isToday,
    };
  });
}

function getCategoryStyles(category: string) {
  const normalized = normalizeCalendarCategory(category);
  switch (normalized) {
    case "exam":
      return {
        pill: "bg-rose-200 text-black",
        dot: "bg-rose-300",
        badge: "destructive" as const,
      };
    case "assignment":
      return {
        pill: "bg-cyan-200 text-black",
        dot: "bg-cyan-400",
        badge: "outline" as const,
      };
    case "study":
      return {
        pill: "bg-[#00CEC8]/25 text-[#8af4f0]",
        dot: "bg-[#00CEC8]",
        badge: "default" as const,
      };
    case "class":
      return {
        pill: "bg-blue-200 text-black",
        dot: "bg-blue-400",
        badge: "info" as const,
      };
    case "meeting":
      return {
        pill: "bg-amber-200 text-black",
        dot: "bg-amber-300",
        badge: "warning" as const,
      };
    case "project":
      return {
        pill: "bg-violet-200 text-black",
        dot: "bg-violet-300",
        badge: "secondary" as const,
      };
    case "personal":
      return {
        pill: "bg-zinc-300 text-black",
        dot: "bg-zinc-300",
        badge: "secondary" as const,
      };
    case "other":
    default:
      return {
        pill: "bg-zinc-200 text-black",
        dot: "bg-zinc-400",
        badge: "outline" as const,
      };
  }
}

function getRelativeDateLabel(isoDate: string) {
  const input = new Date(isoDate);
  const normalizedInput = new Date(input);
  normalizedInput.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (normalizedInput.getTime() === today.getTime()) return "Today";
  if (normalizedInput.getTime() === tomorrow.getTime()) return "Tomorrow";

  return input.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CalendarPage() {
  const now = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CalendarCategoryValue>("all");
  const [allDayOnly, setAllDayOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(searchInput, 350);

  const monthTitle = useMemo(() => formatMonthTitle(viewDate), [viewDate]);
  const monthCells = useMemo(() => getMonthCells(viewDate), [viewDate]);

  const listFilters = useMemo<CalendarEventListFilters>(() => {
    const filters: CalendarEventListFilters = {
      year: viewDate.getFullYear(),
      month: viewDate.getMonth() + 1,
      page: 1,
      pageSize: 100,
      sortBy: "startAtUtc",
      sortDirection: "asc",
    };

    if (debouncedSearch.trim()) {
      filters.search = debouncedSearch.trim();
    }

    if (selectedCategory !== "all") {
      filters.category = selectedCategory;
    }

    if (allDayOnly) {
      filters.isAllDay = true;
    }

    return filters;
  }, [allDayOnly, debouncedSearch, selectedCategory, viewDate]);

  const eventsQuery = useCalendarEvents(listFilters);
  const upcomingQuery = useUpcomingCalendarEvents(5, selectedCategory === "all" ? undefined : selectedCategory);

  const monthEvents = useMemo(() => eventsQuery.data?.items ?? [], [eventsQuery.data?.items]);
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEventResponse[]>();
    for (const event of monthEvents) {
      const key = toDateKey(new Date(event.startAtUtc));
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [monthEvents]);

  const upcomingEvents = upcomingQuery.data?.items ?? [];

  const monthlyCounts = useMemo(() => {
    const counts = Object.fromEntries(calendarCategories.map((category) => [category.value, 0])) as Record<
      CalendarCategoryValue,
      number
    >;

    for (const event of monthEvents) {
      const normalized = normalizeCalendarCategory(event.category);
      counts[normalized] += 1;
    }

    return counts;
  }, [monthEvents]);

  return (
    <main className="min-h-screen bg-black px-4 pb-6 pt-28 text-white md:px-6 md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_1fr_320px]">
        <Card className="border-white/10 bg-zinc-950 p-4 text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900">
              <CalendarIcon className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          </div>

          <Card className="border-white/10 bg-black p-4 text-white">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-medium">{monthTitle}</h2>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-zinc-400"
                  onClick={() => setViewDate((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-zinc-400"
                  onClick={() => setViewDate((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-7 text-center text-xs text-zinc-500">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {monthCells.map((cell) => (
                <span
                  key={`mini-${cell.key}`}
                  className={
                    cell.active
                      ? "mx-auto flex size-8 items-center justify-center rounded-full bg-[#00CEC8] font-medium text-black"
                      : cell.muted
                        ? "text-zinc-600"
                        : "text-zinc-100"
                  }
                >
                  {cell.date.getDate()}
                </span>
              ))}
            </div>
          </Card>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">Categories</h3>
            <div className="flex flex-col gap-3">
              {calendarCategories.map((category) => (
                <div key={category.value} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${getCategoryStyles(category.value).dot}`} />
                    <span className="text-zinc-300">{category.label}</span>
                  </div>
                  <span className="text-zinc-500">{monthlyCounts[category.value]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <section className="flex flex-col gap-4">
          <Card className="border-white/10 bg-zinc-950 p-4 text-white">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{monthTitle}</h2>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative w-full sm:max-w-sm xl:w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    value={searchInput}
                    placeholder="Search events"
                    className="w-full rounded-xl border-white/10 bg-black pl-10 text-white placeholder:text-zinc-500"
                    onChange={(event) => setSearchInput(event.target.value)}
                  />
                </div>

                <div className="relative flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    className="h-9 rounded-xl px-4"
                    onClick={() => setViewDate(new Date(now.getFullYear(), now.getMonth(), 1))}
                  >
                    Today
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="size-9 rounded-xl"
                    onClick={() => setViewDate((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="size-9 rounded-xl"
                    onClick={() => setViewDate((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
                  >
                    <ChevronRight />
                  </Button>
                  <Button size="icon" variant="secondary" className="size-9 rounded-xl" onClick={() => setShowFilters((value) => !value)}>
                    <Filter />
                  </Button>
                  <Button className="h-9 rounded-xl bg-white px-4 text-black hover:bg-zinc-200" onClick={() => setShowAddDialog(true)}>
                    <Plus />
                    Add event
                  </Button>

                  {showFilters ? (
                    <Card className="absolute right-0 top-11 z-20 w-64 border-white/10 bg-[#090909] p-4 text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
                      <h4 className="mb-3 text-sm font-semibold text-zinc-200">Filters</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {calendarCategories.map((category) => (
                            <button
                              key={category.value}
                              type="button"
                              onClick={() => setSelectedCategory(category.value)}
                              className={`w-full rounded-lg border px-2.5 py-2 text-left text-sm transition ${
                                selectedCategory === category.value
                                  ? "border-[#00CEC8]/60 bg-[#00CEC8]/10 text-[#8af4f0]"
                                  : "border-white/10 bg-black text-zinc-300 hover:border-white/20"
                              }`}
                            >
                              {category.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setSelectedCategory("all")}
                            className={`w-full rounded-lg border px-2.5 py-2 text-left text-sm transition ${
                              selectedCategory === "all"
                                ? "border-[#00CEC8]/60 bg-[#00CEC8]/10 text-[#8af4f0]"
                                : "border-white/10 bg-black text-zinc-300 hover:border-white/20"
                            }`}
                          >
                            All categories
                          </button>
                        </div>
                        <Separator className="bg-white/10" />
                        <label className="flex items-center justify-between text-sm text-zinc-300">
                          <span>All-day only</span>
                          <Checkbox checked={allDayOnly} onCheckedChange={(value) => setAllDayOnly(Boolean(value))} />
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 w-full text-zinc-400 hover:bg-white/5 hover:text-white"
                          onClick={() => {
                            setSelectedCategory("all");
                            setAllDayOnly(false);
                            setSearchInput("");
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    </Card>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>

          {eventsQuery.isLoading ? (
            <Card className="border-white/10 bg-zinc-950 p-4">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 42 }).map((_, index) => (
                  <Skeleton key={`calendar-skeleton-${index}`} className="h-24 bg-white/5" />
                ))}
              </div>
            </Card>
          ) : eventsQuery.isError ? (
            <Alert className="border-rose-400/20 bg-rose-950/20 text-white">
              <AlertTitle>Unable to load calendar</AlertTitle>
              <AlertDescription>{getErrorMessage(eventsQuery.error)}</AlertDescription>
            </Alert>
          ) : (
            <Card className="overflow-hidden border-white/10 bg-zinc-950 text-white">
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-7 border-b border-white/10 bg-black">
                    {weekDays.map((day) => (
                      <div key={day} className="border-r border-white/10 p-3 text-center text-xs font-medium text-zinc-400 last:border-r-0 md:p-4 md:text-sm">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {monthCells.map((cell) => {
                      const cellEvents = eventsByDate.get(cell.key) ?? [];

                      return (
                        <button
                          key={cell.key}
                          type="button"
                          onClick={() => {
                            if (!cell.muted) {
                              setPrefilledDate(cell.key);
                              setShowAddDialog(true);
                            }
                          }}
                          className={[
                            "min-h-28 border-b border-r border-white/10 p-2 text-left last:border-r-0 md:min-h-32 md:p-3",
                            cell.muted ? "bg-zinc-950 text-zinc-600" : "bg-black text-zinc-100",
                          ].join(" ")}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span>{cell.date.getDate()}</span>
                            {cell.active ? (
                              <span className="flex size-7 items-center justify-center rounded-full bg-[#00CEC8] text-sm font-medium text-black md:size-8">
                                {cell.date.getDate()}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex flex-col gap-2">
                            {cellEvents.slice(0, 3).map((event) => (
                              <div
                                key={event.sqid}
                                className={`break-words rounded-lg px-2 py-1 text-xs font-medium leading-snug md:rounded-xl md:px-3 md:py-2 md:text-sm ${getCategoryStyles(event.category).pill}`}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </section>

        <Card className="border-white/10 bg-zinc-950 p-4 text-white">
          <h3 className="mb-5 text-2xl font-semibold tracking-tight">Upcoming Events</h3>
          {upcomingQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`upcoming-skeleton-${index}`} className="h-24 bg-white/5" />
              ))}
            </div>
          ) : upcomingQuery.isError ? (
            <Alert className="border-rose-400/20 bg-rose-950/20 text-white">
              <AlertTitle>Unable to load upcoming events</AlertTitle>
              <AlertDescription>{getErrorMessage(upcomingQuery.error)}</AlertDescription>
            </Alert>
          ) : upcomingEvents.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black p-4 text-sm text-zinc-400">
              No upcoming events yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcomingEvents.map((event, index) => (
                <div key={event.sqid}>
                  <div className="rounded-xl border border-white/10 bg-black p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                      <CalendarIcon className="size-4" />
                      <span>{getRelativeDateLabel(event.startAtUtc)}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 size-2.5 rounded-full ${getCategoryStyles(event.category).dot}`} />
                      <div className="flex flex-col gap-2">
                        <span className="break-words leading-snug text-zinc-100">{event.title}</span>
                        <Badge variant={getCategoryStyles(event.category).badge} className="w-fit">
                          {getCalendarCategoryLabel(event.category)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < upcomingEvents.length - 1 ? <Separator className="my-4 bg-white/10" /> : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <AddEventDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setPrefilledDate(undefined);
        }}
        defaultDate={prefilledDate}
      />
    </main>
  );
}
