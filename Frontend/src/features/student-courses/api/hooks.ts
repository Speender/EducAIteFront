import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api/auth";

import { getStudentCourseGroups } from "./service";

export const studentCourseQueryKeys = {
  groups: (studentSqid: string) => ["student-courses", "groups", studentSqid] as const,
};

export function useStudentCourseGroupsQuery(studentSqid: string | null) {
  return useQuery({
    queryKey: studentSqid ? studentCourseQueryKeys.groups(studentSqid) : ["student-courses", "groups", "missing"] as const,
    queryFn: () => {
      if (!studentSqid) {
        throw new Error("A student identifier is required.");
      }

      return getStudentCourseGroups(studentSqid);
    },
    enabled: Boolean(getAccessToken() && studentSqid),
  });
}
