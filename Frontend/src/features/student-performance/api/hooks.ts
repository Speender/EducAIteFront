import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import {
  getStudentAnalyticsDashboard,
  getStudentCoursePerformance,
  getStudentOverallPerformance,
} from "./service";

export const studentPerformanceQueryKeys = {
  dashboard: ["student-performance", "dashboard"] as const,
  overall: ["student-performance", "overall"] as const,
  course: (studentCourseSqid: string) => ["student-performance", "course", studentCourseSqid] as const,
};

export function useStudentAnalyticsDashboardQuery() {
  return useQuery({
    queryKey: studentPerformanceQueryKeys.dashboard,
    queryFn: getStudentAnalyticsDashboard,
    enabled: Boolean(getAccessToken()),
  });
}

export function useStudentOverallPerformanceQuery() {
  return useQuery({
    queryKey: studentPerformanceQueryKeys.overall,
    queryFn: getStudentOverallPerformance,
    enabled: Boolean(getAccessToken()),
  });
}

export function useStudentCoursePerformanceQuery(studentCourseSqid: string | null) {
  return useQuery({
    queryKey: studentCourseSqid
      ? studentPerformanceQueryKeys.course(studentCourseSqid)
      : ["student-performance", "course", "missing"] as const,
    queryFn: () => {
      if (!studentCourseSqid) {
        throw new Error("A student course identifier is required.");
      }

      return getStudentCoursePerformance(studentCourseSqid);
    },
    enabled: Boolean(getAccessToken() && studentCourseSqid),
  });
}
