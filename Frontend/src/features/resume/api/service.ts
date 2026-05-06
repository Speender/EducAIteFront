import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import {
  personalDetailsSchema,
  resumeSummarySchema,
  resumeResponseDtoSchema,
  resumeReviewResponseDtoSchema,
  resumeCertificateSchema,
  aiRewriteSummaryResponseDtoSchema,
  pagedResumeVersionResponseDtoSchema,
  pagedResumeResponseDtoSchema,
  aiTailorResumeResponseDtoSchema,
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
  type ResumeReviewResponseDto,
} from "./dto";
import {
  replaceResumeCertificatesResponseSchema,
  achievementGroupedBySchoolYearResponseSchema,
  lifetimeAchievementResponseSchema,
  certificateSuggestionResponseSchema,
} from "./dto";
import {
  studentResumeContextPrefillResponseSchema,
  studentModeResumeCreatedResponseSchema,
  resumeStudentContextResponseSchema,
  studentJobTargetSuggestionsResponseSchema,
  studentCareerHintResponseSchema,
  companyRecommendationSearchResponseSchema,
  companyRecommendationItemResponseSchema,
  savedCompanyRecommendationsResponseSchema,
  type CreateStudentModeResumeRequest,
  type UpdateResumeStudentContextRequest,
  type StudentJobTargetSuggestionsRequest,
  type UpdateResumeTargetRoleRequest,
  type StudentCareerHintRequest,
  type CompanyRecommendationSearchRequest,
  type SaveCompanyRecommendationRequest,
  type UpdateCompanyRecommendationStatusRequest,
} from "./studentDto";

const BASE_URL = "/Resume";
const JOB_SUGGESTIONS_BASE_URL = "/resume";

export const resumeService = {
  // --- Student Mode & Context ---
  async getStudentResumeContext() {
    const { data } = await apiClient.get("/Student/me/resume-context");
    return studentResumeContextPrefillResponseSchema.parse(data);
  },

  async createStudentModeResume(payload: CreateStudentModeResumeRequest) {
    const { data } = await apiClient.post(`${BASE_URL}/student-mode`, payload);
    return studentModeResumeCreatedResponseSchema.parse(data);
  },

  async updateStudentContext(resumeSqid: string, payload: UpdateResumeStudentContextRequest) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/student-context`, payload);
    return resumeStudentContextResponseSchema.parse(data);
  },

  async getJobTargetSuggestions(resumeSqid: string, payload: StudentJobTargetSuggestionsRequest) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/job-target-suggestions`, payload);
    return studentJobTargetSuggestionsResponseSchema.parse(data);
  },

  async updateTargetRole(resumeSqid: string, payload: UpdateResumeTargetRoleRequest) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/target-role`, payload);
    return resumeResponseDtoSchema.parse(data);
  },

  async getCareerHint(resumeSqid: string, payload: StudentCareerHintRequest) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/ai/career-hint`, payload);
    return studentCareerHintResponseSchema.parse(data);
  },

  // --- Company Recommendations ---
  async searchJobSuggestions(resumeSqid: string, payload: CompanyRecommendationSearchRequest) {
    const { data } = await apiClient.post(`${JOB_SUGGESTIONS_BASE_URL}/${resumeSqid}/ai/job-suggestions/search`, payload);
    return companyRecommendationSearchResponseSchema.parse(data);
  },

  async getJobSuggestions(resumeSqid: string) {
    const { data } = await apiClient.get(`${JOB_SUGGESTIONS_BASE_URL}/${resumeSqid}/job-suggestions`);
    return savedCompanyRecommendationsResponseSchema.parse(data);
  },

  async searchCompanyRecommendations(resumeSqid: string, payload: CompanyRecommendationSearchRequest) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/ai/company-recommendations/search`, payload);
    return companyRecommendationSearchResponseSchema.parse(data);
  },

  async saveCompanyRecommendation(resumeSqid: string, payload: SaveCompanyRecommendationRequest) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/company-recommendations`, payload);
    return companyRecommendationItemResponseSchema.parse(data);
  },

  async getSavedCompanyRecommendations(resumeSqid: string) {
    const { data } = await apiClient.get(`${BASE_URL}/${resumeSqid}/company-recommendations`);
    return savedCompanyRecommendationsResponseSchema.parse(data);
  },

  async updateCompanyRecommendationStatus(resumeSqid: string, recommendationSqid: string, payload: UpdateCompanyRecommendationStatusRequest) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/company-recommendations/${recommendationSqid}/status`, payload);
    return companyRecommendationItemResponseSchema.parse(data);
  },

  // Resume Management
  async createResume(payload: CreateResumeRequestDto) {
    const { data } = await apiClient.post(`${BASE_URL}`, payload);
    return resumeResponseDtoSchema.parse(data);
  },

  async getResume(resumeSqid: string) {
    const { data } = await apiClient.get(`${BASE_URL}/${resumeSqid}`);
    return resumeResponseDtoSchema.parse(data);
  },

  async listResumes(page = 1, pageSize = 20) {
    const { data } = await apiClient.get(`${BASE_URL}`, {
      params: { page, pageSize },
    });
    return pagedResumeResponseDtoSchema.parse(data);
  },

  async getResumeReview(resumeSqid: string) {
    const { data } = await apiClient.get(`${BASE_URL}/${resumeSqid}/review`);
    return normalizeResumeReviewResponse(data);
  },

  async upsertFixedResume(resumeSqid: string, payload: unknown) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}`, payload);
    return data;
  },

  // Personal Details
  async upsertPersonalDetails(resumeSqid: string, payload: UpsertPersonalDetailsRequestDto) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/personal-details`, payload);
    return data;
  },

  // Education
  async addEducation(resumeSqid: string, payload: CreateEducationRequestDto) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/education`, payload);
    return data;
  },

  async updateEducation(resumeSqid: string, educationSqid: string, payload: UpdateEducationRequestDto) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/education/${educationSqid}`, payload);
    return data;
  },

  async deleteEducation(resumeSqid: string, educationSqid: string) {
    await apiClient.delete(`${BASE_URL}/${resumeSqid}/education/${educationSqid}`);
  },

  // Employment History
  async addEmployment(resumeSqid: string, payload: CreateEmploymentHistoryRequestDto) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/employment-history`, payload);
    return data;
  },

  async updateEmployment(resumeSqid: string, employmentSqid: string, payload: UpdateEmploymentHistoryRequestDto) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/employment-history/${employmentSqid}`, payload);
    return data;
  },

  async deleteEmployment(resumeSqid: string, employmentSqid: string) {
    await apiClient.delete(`${BASE_URL}/${resumeSqid}/employment-history/${employmentSqid}`);
  },

  // Summary
  async updateSummary(resumeSqid: string, payload: UpdateSummaryRequestDto) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/summary`, payload);
    return data;
  },

  // Certificates
  async getCertificates() {
    const { data } = await apiClient.get("/certificates");
    return z.object({ items: z.array(resumeCertificateSchema) }).parse(data).items;
  },

  async replaceCertificates(resumeSqid: string, payload: ReplaceResumeCertificatesRequestDto) {
    const { data } = await apiClient.put(`${BASE_URL}/${resumeSqid}/certificates`, payload);
    return replaceResumeCertificatesResponseSchema.parse(data);
  },

  async getSchoolYearAchievements(resumeSqid: string) {
    const { data } = await apiClient.get(`${BASE_URL}/${resumeSqid}/achievements/school-year`);
    return achievementGroupedBySchoolYearResponseSchema.parse(data);
  },

  async getLifetimeAchievements(resumeSqid: string) {
    const { data } = await apiClient.get(`${BASE_URL}/${resumeSqid}/achievements/lifetime`);
    return lifetimeAchievementResponseSchema.parse(data);
  },

  async getCertificateSuggestions(resumeSqid: string, payload?: CertificateSuggestionRequestDto) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/certificate-suggestions`, payload ?? {});
    return certificateSuggestionResponseSchema.parse(data);
  },

  // AI
  async aiRewriteSummary(resumeSqid: string, payload: AiRewriteSummaryRequestDto) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/ai/summary/rewrite`, payload);
    return aiRewriteSummaryResponseDtoSchema.parse(data);
  },

  async aiTailorResume(resumeSqid: string, payload: AiTailorResumeRequestDto) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/ai/tailor`, payload);
    return aiTailorResumeResponseDtoSchema.parse(data);
  },

  // Save/Version
  async saveVersion(resumeSqid: string, saveNote?: string) {
    const { data } = await apiClient.post(`${BASE_URL}/${resumeSqid}/save`, { saveNote });
    return data;
  },

  async getHistory(resumeSqid: string, page = 1, pageSize = 20) {
    const { data } = await apiClient.get(`${BASE_URL}/${resumeSqid}/history`, {
      params: { page, pageSize },
    });
    return pagedResumeVersionResponseDtoSchema.parse(data);
  },
};

function normalizeResumeReviewResponse(input: unknown): ResumeReviewResponseDto {
  const raw = (input ?? {}) as Record<string, any>;
  const header = raw.personalDetails ?? raw.header ?? null;
  const rawSummary = raw.summary;
  const mappedSummary =
    typeof rawSummary === "string"
      ? { summaryText: rawSummary }
      : rawSummary && typeof rawSummary === "object" && typeof rawSummary.summaryText === "string"
        ? { summaryText: rawSummary.summaryText }
        : null;

  const mappedPersonalDetails = header
    ? {
        firstName: header.firstName ?? "",
        lastName: header.lastName ?? "",
        middleName: header.middleName ?? null,
        email: header.email ?? "",
        phoneNumber: header.phoneNumber ?? "",
        addressLine1: header.addressLine1 ?? "",
        addressLine2: header.addressLine2 ?? null,
        city: header.city ?? "",
        provinceState: header.provinceState ?? "",
        country: header.country ?? "",
        postalCode: header.postalCode ?? "",
        linkedInUrl: header.linkedInUrl ?? null,
        portfolioUrl: header.portfolioUrl ?? null,
      }
    : null;
  const safePersonalDetails = mappedPersonalDetails && personalDetailsSchema.safeParse(mappedPersonalDetails).success
    ? mappedPersonalDetails
    : null;
  const safeSummary = mappedSummary && resumeSummarySchema.safeParse(mappedSummary).success ? mappedSummary : null;

  const normalized = {
    resumeSqid: raw.resumeSqid ?? "",
    title: raw.title ?? "Untitled Resume",
    targetRole: raw.targetRole ?? null,
    template: raw.template ?? null,
    personalDetails: safePersonalDetails,
    education: Array.isArray(raw.education) ? raw.education : [],
    employmentHistory: Array.isArray(raw.employmentHistory)
      ? raw.employmentHistory
      : Array.isArray(raw.experience)
        ? raw.experience
        : [],
    leadershipActivities: Array.isArray(raw.leadershipActivities) ? raw.leadershipActivities : [],
    summary: safeSummary,
    certificates: Array.isArray(raw.certificates)
      ? raw.certificates
      : Array.isArray(raw.awardsAndCertifications)
        ? raw.awardsAndCertifications
        : [],
    awardsAndCertifications: Array.isArray(raw.awardsAndCertifications)
      ? raw.awardsAndCertifications
      : Array.isArray(raw.certificates)
        ? raw.certificates
        : [],
    skillsAndInterests: raw.skillsAndInterests ?? {
      technicalSkills: [],
      languages: [],
      interests: [],
    },
    completeness: raw.completeness ?? {
      isComplete: false,
      missingRequiredFields: [],
    },
  };

  return resumeReviewResponseDtoSchema.parse(normalized);
}

