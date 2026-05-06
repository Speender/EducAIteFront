import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService, type UpdateProfileRequest, updateProfileRequestSchema } from "./service";
import { currentStudentQueryKey } from "@/features/auth/api/hooks";
import { syncAuthSessionStudent } from "@/lib/api/auth";

export { updateProfileRequestSchema, type UpdateProfileRequest };

export const PROFILE_KEYS = {
  all: ["profile"] as const,
  education: () => [...PROFILE_KEYS.all, "education"] as const,
  experience: () => [...PROFILE_KEYS.all, "experience"] as const,
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => profileService.updateProfile(payload),
    onSuccess: (updatedStudent) => {
      queryClient.setQueryData(currentStudentQueryKey, updatedStudent);
      syncAuthSessionStudent(updatedStudent);
    },
  });
};

export const useProfileEducation = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.education(),
    queryFn: () => profileService.getEducation(),
  });
};

export const useAddProfileEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => profileService.addEducation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.education() });
    },
  });
};

export const useUpdateProfileEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ educationSqid, payload }: { educationSqid: string; payload: any }) => 
      profileService.updateEducation(educationSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.education() });
    },
  });
};

export const useDeleteProfileEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (educationSqid: string) => profileService.deleteEducation(educationSqid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.education() });
    },
  });
};

export const useProfileExperience = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.experience(),
    queryFn: () => profileService.getExperience(),
  });
};

export const useAddProfileExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => profileService.addExperience(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.experience() });
    },
  });
};

export const useUpdateProfileExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employmentSqid, payload }: { employmentSqid: string; payload: any }) => 
      profileService.updateExperience(employmentSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.experience() });
    },
  });
};

export const useDeleteProfileExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employmentSqid: string) => profileService.deleteExperience(employmentSqid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.experience() });
    },
  });
};
