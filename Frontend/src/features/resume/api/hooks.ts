import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "./service";
import {
  type CreateResumeRequestDto,
  type UpsertPersonalDetailsRequestDto,
  type CreateEducationRequestDto,
  type UpdateEducationRequestDto,
  type CreateEmploymentHistoryRequestDto,
  type UpdateEmploymentHistoryRequestDto,
  type UpdateSummaryRequestDto,
  type ReplaceResumeCertificatesRequestDto,
  type AiRewriteSummaryRequestDto,
  type AiTailorResumeRequestDto,
  type CertificateSuggestionRequestDto,
} from "./dto";
import {
  type CreateStudentModeResumeRequest,
  type UpdateResumeStudentContextRequest,
  type StudentJobTargetSuggestionsRequest,
  type UpdateResumeTargetRoleRequest,
  type StudentCareerHintRequest,
  type CompanyRecommendationSearchRequest,
  type SaveCompanyRecommendationRequest,
  type UpdateCompanyRecommendationStatusRequest,
} from "./studentDto";

export const RESUME_KEYS = {
  all: ["resume"] as const,
  details: (sqid: string) => [...RESUME_KEYS.all, "details", sqid] as const,
  review: (sqid: string) => [...RESUME_KEYS.all, "review", sqid] as const,
  history: (sqid: string) => [...RESUME_KEYS.all, "history", sqid] as const,
  certifications: () => ["certificates"] as const,
  achievements: (sqid: string) => [...RESUME_KEYS.all, "achievements", sqid] as const,
  suggestions: (sqid: string) => [...RESUME_KEYS.all, "suggestions", sqid] as const,
};

// --- Resume Queries ---

export const useResume = (resumeSqid: string) => {
  return useQuery({
    queryKey: RESUME_KEYS.details(resumeSqid),
    queryFn: () => resumeService.getResume(resumeSqid),
    enabled: !!resumeSqid,
  });
};

export const useResumeList = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: [...RESUME_KEYS.all, "list", page, pageSize],
    queryFn: () => resumeService.listResumes(page, pageSize),
  });
};

export const useResumeReview = (resumeSqid: string) => {
  return useQuery({
    queryKey: RESUME_KEYS.review(resumeSqid),
    queryFn: () => resumeService.getResumeReview(resumeSqid),
    enabled: !!resumeSqid,
  });
};

export const useResumeHistory = (resumeSqid: string, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: [...RESUME_KEYS.history(resumeSqid), page, pageSize],
    queryFn: () => resumeService.getHistory(resumeSqid, page, pageSize),
    enabled: !!resumeSqid,
  });
};

export const useStudentCertifications = () => {
  return useQuery({
    queryKey: RESUME_KEYS.certifications(),
    queryFn: () => resumeService.getCertificates(),
  });
};

export const useSchoolYearAchievements = (resumeSqid: string) => {
  return useQuery({
    queryKey: [...RESUME_KEYS.achievements(resumeSqid), "school-year"],
    queryFn: () => resumeService.getSchoolYearAchievements(resumeSqid),
    enabled: !!resumeSqid,
  });
};

export const useLifetimeAchievements = (resumeSqid: string) => {
  return useQuery({
    queryKey: [...RESUME_KEYS.achievements(resumeSqid), "lifetime"],
    queryFn: () => resumeService.getLifetimeAchievements(resumeSqid),
    enabled: !!resumeSqid,
  });
};

export const useCertificateSuggestions = (resumeSqid: string, payload?: CertificateSuggestionRequestDto) => {
  return useMutation({
    mutationFn: (requestPayload?: CertificateSuggestionRequestDto) =>
      resumeService.getCertificateSuggestions(resumeSqid, requestPayload ?? payload),
  });
};

// --- Resume Mutations ---

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateResumeRequestDto) => resumeService.createResume(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.all });
    },
  });
};

export const useUpdatePersonalDetails = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertPersonalDetailsRequestDto) =>
      resumeService.upsertPersonalDetails(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useAddEducation = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEducationRequestDto) =>
      resumeService.addEducation(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useUpdateEducation = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ educationSqid, payload }: { educationSqid: string; payload: UpdateEducationRequestDto }) =>
      resumeService.updateEducation(resumeSqid, educationSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useDeleteEducation = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (educationSqid: string) => resumeService.deleteEducation(resumeSqid, educationSqid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useAddEmployment = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmploymentHistoryRequestDto) =>
      resumeService.addEmployment(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useUpdateEmployment = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employmentSqid, payload }: { employmentSqid: string; payload: UpdateEmploymentHistoryRequestDto }) =>
      resumeService.updateEmployment(resumeSqid, employmentSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useDeleteEmployment = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employmentSqid: string) => resumeService.deleteEmployment(resumeSqid, employmentSqid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useUpdateSummary = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSummaryRequestDto) => resumeService.updateSummary(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useReplaceCertificates = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReplaceResumeCertificatesRequestDto) =>
      resumeService.replaceCertificates(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
    },
  });
};

export const useAiRewriteSummary = (resumeSqid: string) => {
  return useMutation({
    mutationFn: (payload: AiRewriteSummaryRequestDto) =>
      resumeService.aiRewriteSummary(resumeSqid, payload),
  });
};

export const useAiTailorResume = (resumeSqid: string) => {
  return useMutation({
    mutationFn: (payload: AiTailorResumeRequestDto) =>
      resumeService.aiTailorResume(resumeSqid, payload),
  });
};

export const useSaveVersion = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saveNote?: string) => resumeService.saveVersion(resumeSqid, saveNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.history(resumeSqid) });
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.details(resumeSqid) });
    },
  });
};

// --- Student Mode Hooks ---

export const useStudentResumeContext = () => {
  return useQuery({
    queryKey: [...RESUME_KEYS.all, "student-context"],
    queryFn: () => resumeService.getStudentResumeContext(),
  });
};

export const useCreateStudentModeResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStudentModeResumeRequest) => resumeService.createStudentModeResume(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.all });
    },
  });
};

export const useUpdateStudentContext = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateResumeStudentContextRequest) => resumeService.updateStudentContext(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.details(resumeSqid) });
    },
  });
};

export const useJobTargetSuggestions = (resumeSqid: string) => {
  return useMutation({
    mutationFn: (payload: StudentJobTargetSuggestionsRequest) => resumeService.getJobTargetSuggestions(resumeSqid, payload),
  });
};

export const useUpdateTargetRole = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateResumeTargetRoleRequest) => resumeService.updateTargetRole(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.review(resumeSqid) });
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.details(resumeSqid) });
    },
  });
};

export const useCareerHint = (resumeSqid: string) => {
  return useMutation({
    mutationFn: (payload: StudentCareerHintRequest) => resumeService.getCareerHint(resumeSqid, payload),
  });
};

export const useSearchCompanyRecommendations = (resumeSqid: string) => {
  return useMutation({
    mutationFn: (payload: CompanyRecommendationSearchRequest) => resumeService.searchCompanyRecommendations(resumeSqid, payload),
  });
};

export const useSearchJobSuggestions = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompanyRecommendationSearchRequest) => resumeService.searchJobSuggestions(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...RESUME_KEYS.all, "job-suggestions", resumeSqid] });
    },
  });
};

export const useSaveCompanyRecommendation = (resumeSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveCompanyRecommendationRequest) => resumeService.saveCompanyRecommendation(resumeSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...RESUME_KEYS.all, "company-recommendations", resumeSqid] });
      queryClient.invalidateQueries({ queryKey: [...RESUME_KEYS.all, "job-suggestions", resumeSqid] });
    },
  });
};

export const useSavedCompanyRecommendations = (resumeSqid: string) => {
  return useQuery({
    queryKey: [...RESUME_KEYS.all, "company-recommendations", resumeSqid],
    queryFn: () => resumeService.getSavedCompanyRecommendations(resumeSqid),
    enabled: !!resumeSqid,
  });
};

export const useJobSuggestions = (resumeSqid: string) => {
  return useQuery({
    queryKey: [...RESUME_KEYS.all, "job-suggestions", resumeSqid],
    queryFn: () => resumeService.getJobSuggestions(resumeSqid),
    enabled: !!resumeSqid,
  });
};

export const useUpdateCompanyRecommendationStatus = (resumeSqid: string, recommendationSqid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCompanyRecommendationStatusRequest) => resumeService.updateCompanyRecommendationStatus(resumeSqid, recommendationSqid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...RESUME_KEYS.all, "company-recommendations", resumeSqid] });
      queryClient.invalidateQueries({ queryKey: [...RESUME_KEYS.all, "job-suggestions", resumeSqid] });
    },
  });
};
