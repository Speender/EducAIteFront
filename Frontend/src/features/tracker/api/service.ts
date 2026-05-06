import { apiClient } from "@/lib/api/client";

import {
  gradeTrackerResponseDtoSchema,
  trackerCourseDtoSchema,
  trackerGradeTypeSchema,
  updateTrackerFinalGradeRequestSchema,
  type TrackerGradeTypeDto,
  type UpdateTrackerFinalGradeRequestDto,
} from "./dto";

const BASE_URL = "/GradeTracker";

export async function getGradeTracker() {
  const { data } = await apiClient.get(BASE_URL);
  return gradeTrackerResponseDtoSchema.parse(data);
}

export async function updateTrackerFinalGrade(
  studentCourseSqid: string,
  payload: UpdateTrackerFinalGradeRequestDto,
) {
  const request = updateTrackerFinalGradeRequestSchema.parse(payload);
  const { data } = await apiClient.put(`${BASE_URL}/courses/${encodeURIComponent(studentCourseSqid)}/final-grade`, request);
  return trackerCourseDtoSchema.parse(data);
}

export async function updateTrackerGrade(
  studentCourseSqid: string,
  gradeType: TrackerGradeTypeDto,
  payload: UpdateTrackerFinalGradeRequestDto,
) {
  const parsedGradeType = trackerGradeTypeSchema.parse(gradeType);
  const request = updateTrackerFinalGradeRequestSchema.parse(payload);
  const { data } = await apiClient.put(
    `${BASE_URL}/courses/${encodeURIComponent(studentCourseSqid)}/grades/${parsedGradeType}`,
    request,
  );
  return trackerCourseDtoSchema.parse(data);
}
