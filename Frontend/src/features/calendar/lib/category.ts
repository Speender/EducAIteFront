export const calendarCategoryValues = [
  "assignment",
  "exam",
  "study",
  "class",
  "meeting",
  "project",
  "personal",
  "other",
] as const;

export type CalendarCategoryValue = (typeof calendarCategoryValues)[number];

export const calendarCategories: Array<{ value: CalendarCategoryValue; label: string }> = [
  { value: "assignment", label: "Assignment" },
  { value: "exam", label: "Exam" },
  { value: "study", label: "Study" },
  { value: "class", label: "Class" },
  { value: "meeting", label: "Meeting" },
  { value: "project", label: "Project" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

const categorySet = new Set<string>(calendarCategoryValues);

export function normalizeCalendarCategory(value: string): CalendarCategoryValue {
  const normalized = value.trim().toLowerCase();
  return categorySet.has(normalized) ? (normalized as CalendarCategoryValue) : "other";
}

export function getCalendarCategoryLabel(value: string): string {
  const normalized = normalizeCalendarCategory(value);
  const category = calendarCategories.find((item) => item.value === normalized);
  return category?.label ?? "Other";
}
