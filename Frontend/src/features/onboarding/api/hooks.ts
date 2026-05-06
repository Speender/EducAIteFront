import { useMutation, useQueryClient } from "@tanstack/react-query";

import { persistAuthSession } from "@/lib/api/auth";
import { currentStudentQueryKey } from "@/features/auth/api/hooks";

import { mapOnboardingSession } from "./mappers";
import { registerWithStudyLoad } from "./service";

interface RegisterWithStudyLoadMutationInput {
  values: Parameters<typeof registerWithStudyLoad>[0];
  studyLoadDocument: File;
}

export function useRegisterWithStudyLoadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, studyLoadDocument }: RegisterWithStudyLoadMutationInput) =>
      registerWithStudyLoad(values, studyLoadDocument),
    onSuccess: (response) => {
      const session = mapOnboardingSession(response);
      persistAuthSession(session);
      queryClient.setQueryData(currentStudentQueryKey, session.student);
    },
  });
}
