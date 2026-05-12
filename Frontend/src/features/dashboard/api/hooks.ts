import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import { getStudentDashboard } from "./service";

export const dashboardQueryKeys = {
  student: ["dashboard", "student"] as const,
};

export function useStudentDashboardQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.student,
    queryFn: getStudentDashboard,
    enabled: Boolean(getAccessToken()),
  });
}
