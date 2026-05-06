import { apiClient } from "@/lib/api/client";

import {
  studentAnalyticsDashboardResponseDtoSchema,
  studentCoursePerformanceSummaryResponseDtoSchema,
  studentOverallPerformanceSummaryResponseDtoSchema,
} from "./dto";
import {
  mapStudentAnalyticsDashboard,
  mapStudentCoursePerformance,
  mapStudentOverallPerformance,
} from "./mappers";

export async function getStudentAnalyticsDashboard() {
  const { data } = await apiClient.get("/StudentPerformance/dashboard");
  return mapStudentAnalyticsDashboard(studentAnalyticsDashboardResponseDtoSchema.parse(data));
}

export async function getStudentOverallPerformance() {
  const { data } = await apiClient.get("/StudentPerformance/overall");
  return mapStudentOverallPerformance(studentOverallPerformanceSummaryResponseDtoSchema.parse(data));
}

export async function getStudentCoursePerformance(studentCourseSqid: string) {
  const { data } = await apiClient.get(`/StudentPerformance/student-courses/${encodeURIComponent(studentCourseSqid)}`);
  return mapStudentCoursePerformance(studentCoursePerformanceSummaryResponseDtoSchema.parse(data));
}
