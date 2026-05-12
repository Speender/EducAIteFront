import { useMutation, useQueryClient } from "@tanstack/react-query";

import { persistAuthSession } from "@/lib/api/auth";
import { currentStudentQueryKey } from "@/features/auth/api/hooks";

import { mapOnboardingSession } from "./mappers";
import { previewStudyLoadRegistration, registerWithStudyLoad } from "./service";
import type { RegistrationStudyLoadPreviewResponseDto } from "./dto";

interface RegisterWithStudyLoadMutationInput {
  values: Parameters<typeof registerWithStudyLoad>[0];
  studyLoadDocument: File;
  reviewedStudyLoad?: RegistrationStudyLoadPreviewResponseDto | null;
}

interface PreviewStudyLoadRegistrationMutationInput {
  studyLoadDocument: File;
}

export function usePreviewStudyLoadRegistrationMutation() {
  return useMutation({
    mutationFn: ({ studyLoadDocument }: PreviewStudyLoadRegistrationMutationInput) =>
      previewStudyLoadRegistration(studyLoadDocument),
  });
}

export function useRegisterWithStudyLoadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, studyLoadDocument, reviewedStudyLoad }: RegisterWithStudyLoadMutationInput) =>
      registerWithStudyLoad(values, studyLoadDocument, reviewedStudyLoad),
    onSuccess: (response) => {
      const session = mapOnboardingSession(response);
      persistAuthSession(session);
      queryClient.setQueryData(currentStudentQueryKey, session.student);
    },
  });
}
