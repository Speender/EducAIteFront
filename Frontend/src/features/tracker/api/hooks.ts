import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getGradeTracker,
  updateTrackerFinalGrade,
  updateTrackerGrade,
} from "./service";
import type {
  TrackerGradeTypeDto,
  UpdateTrackerFinalGradeRequestDto,
} from "./dto";

export const trackerQueryKeys = {
  all: ["grade-tracker"] as const,
};

export function useGradeTrackerQuery() {
  return useQuery({
    queryKey: trackerQueryKeys.all,
    queryFn: getGradeTracker,
  });
}

export function useUpdateTrackerFinalGradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentCourseSqid,
      payload,
    }: {
      studentCourseSqid: string;
      payload: UpdateTrackerFinalGradeRequestDto;
    }) => updateTrackerFinalGrade(studentCourseSqid, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: trackerQueryKeys.all });
    },
  });
}

export function useUpdateTrackerGradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentCourseSqid,
      gradeType,
      payload,
    }: {
      studentCourseSqid: string;
      gradeType: TrackerGradeTypeDto;
      payload: UpdateTrackerFinalGradeRequestDto;
    }) => updateTrackerGrade(studentCourseSqid, gradeType, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: trackerQueryKeys.all });
    },
  });
}
