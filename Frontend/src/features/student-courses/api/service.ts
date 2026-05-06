import axios from "axios";

import { apiClient } from "@/lib/api/client";

import {
  studentCourseDashboardDtoSchema,
  studentCourseResponseListDtoSchema,
  studyLoadResponseListDtoSchema,
} from "./dto";
import { mapStudentCourseGroups } from "./mappers";

export async function getStudentCourseGroups(studentSqid: string) {
  const [studyLoadsResponse, studentCoursesResponse, dashboardResponse] = await Promise.allSettled([
    apiClient.get(`/StudyLoad/student/${encodeURIComponent(studentSqid)}`),
    apiClient.get("/StudentCourse/me"),
    apiClient.get("/StudentPerformance/dashboard"),
  ]);

  if (studyLoadsResponse.status === "rejected") {
    throw studyLoadsResponse.reason;
  }

  if (studentCoursesResponse.status === "rejected") {
    throw studentCoursesResponse.reason;
  }

  const studyLoads =
    studyLoadsResponse.value.status === 204
      ? []
      : studyLoadResponseListDtoSchema.parse(studyLoadsResponse.value.data);
  const studentCourses = studentCourseResponseListDtoSchema.parse(studentCoursesResponse.value.data);

  let dashboard = null;
  if (dashboardResponse.status === "fulfilled") {
    dashboard = studentCourseDashboardDtoSchema.parse(dashboardResponse.value.data);
  } else if (!axios.isAxiosError(dashboardResponse.reason) || dashboardResponse.reason.response?.status !== 404) {
    console.warn("Unable to enrich courses with performance data.", dashboardResponse.reason);
  }

  return mapStudentCourseGroups(studyLoads, studentCourses, dashboard);
}
