import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken, persistAuthSession } from "@/lib/api/auth";

import { getCurrentStudent, login } from "./service";

export const currentStudentQueryKey = ["auth", "current-student"] as const;

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      persistAuthSession(session);
      queryClient.setQueryData(currentStudentQueryKey, session.student);
    },
  });
}

export function useCurrentStudentQuery(options?: {
  staleTime?: number;
  refetchOnMount?: boolean | "always";
  refetchOnWindowFocus?: boolean;
}) {
  return useQuery({
    queryKey: currentStudentQueryKey,
    queryFn: getCurrentStudent,
    enabled: Boolean(getAccessToken()),
    ...options,
  });
}
