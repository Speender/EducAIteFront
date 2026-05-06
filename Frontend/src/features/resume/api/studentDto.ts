import { z } from "zod";

// 1. Resume Dashboard Student Entry
export const studentResumeContextPrefillResponseSchema = z.object({
  studentSqid: z.string(),
  fullName: z.string(),
  degreeProgram: z.string(),
  yearLevel: z.string().nullable(),
  academicTerm: z.string().nullable(),
  subjects: z.array(z.string()),
  studyLoadSource: z.object({
    uploaded: z.boolean(),
    studyLoadSqid: z.string().nullable(),
    fileName: z.string().nullable(),
    extractedAt: z.string().nullable(),
  }).nullable(),
});
export type StudentResumeContextPrefillResponse = z.infer<typeof studentResumeContextPrefillResponseSchema>;

export const createStudentModeResumeRequestSchema = z.object({
  title: z.string().nullable().optional(),
});
export type CreateStudentModeResumeRequest = z.infer<typeof createStudentModeResumeRequestSchema>;

export const studentModeResumeCreatedResponseSchema = z.object({
  resumeSqid: z.string(),
  studentContextApplied: z.boolean(),
  nextStep: z.string(),
});
export type StudentModeResumeCreatedResponse = z.infer<typeof studentModeResumeCreatedResponseSchema>;

// 2. Academic Context Review
export const updateResumeStudentContextRequestSchema = z.object({
  schoolName: z.string().nullable().optional(),
  degreeProgram: z.string().min(1),
  yearLevel: z.string().nullable().optional(),
  academicTerm: z.string().nullable().optional(),
  subjects: z.array(z.string().max(120)).max(30),
  experienceTypes: z.array(z.string().max(80)).max(20),
  source: z.enum(["study_load", "manual", "mixed"]),
});
export type UpdateResumeStudentContextRequest = z.infer<typeof updateResumeStudentContextRequestSchema>;

export const resumeStudentContextResponseSchema = z.object({
  resumeSqid: z.string(),
  schoolName: z.string().nullable(),
  degreeProgram: z.string(),
  yearLevel: z.string().nullable(),
  academicTerm: z.string().nullable(),
  subjects: z.array(z.string()),
  experienceTypes: z.array(z.string()),
  source: z.string(),
  updatedAt: z.string(),
});
export type ResumeStudentContextResponse = z.infer<typeof resumeStudentContextResponseSchema>;

// 3. Job Target Recommendation
export const studentJobTargetSuggestionsRequestSchema = z.object({
  degreeProgram: z.string().nullable().optional(),
  yearLevel: z.string().nullable().optional(),
  subjects: z.array(z.string()),
  certificates: z.array(z.string()),
});
export type StudentJobTargetSuggestionsRequest = z.infer<typeof studentJobTargetSuggestionsRequestSchema>;

export const studentJobTargetSuggestionsResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string(),
      roleType: z.string(),
      matchReason: z.string(),
      importantSkills: z.array(z.string()),
      recommendedResumeFocus: z.array(z.string()),
      companyTypes: z.array(z.string()),
    })
  ),
});
export type StudentJobTargetSuggestionsResponse = z.infer<typeof studentJobTargetSuggestionsResponseSchema>;

export const updateResumeTargetRoleRequestSchema = z.object({
  targetRole: z.string().nullable().optional(),
});
export type UpdateResumeTargetRoleRequest = z.infer<typeof updateResumeTargetRoleRequestSchema>;

// 4. Resume Workspace Student Enhancements
export const studentCareerHintRequestSchema = z.object({
  activeSection: z.string(),
  targetRole: z.string().nullable().optional(),
});
export type StudentCareerHintRequest = z.infer<typeof studentCareerHintRequestSchema>;

export const studentCareerHintResponseSchema = z.object({
  hint: z.string(),
});
export type StudentCareerHintResponse = z.infer<typeof studentCareerHintResponseSchema>;

// 6 & 7. Company Recommendation Search and Save
export const companyRecommendationSearchRequestSchema = z.object({
  targetRole: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  workSetup: z.array(z.string()),
  employmentType: z.array(z.string()),
  maxResults: z.number().min(1).max(20).default(10),
});
export type CompanyRecommendationSearchRequest = z.infer<typeof companyRecommendationSearchRequestSchema>;
export type JobSuggestionSearchRequest = CompanyRecommendationSearchRequest;

export const companyRecommendationItemResponseSchema = z.object({
  recommendationSqid: z.string().nullable().optional(),
  companyName: z.string(),
  roleTitle: z.string(),
  matchScore: z.number(),
  matchLevel: z.string(),
  whyItMatches: z.string(),
  requiredSkills: z.array(z.string()),
  studentMatchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  location: z.string().nullable().optional(),
  workSetup: z.string(),
  employmentType: z.string().nullable().optional(),
  sourceUrl: z.string().url(),
  sourceDomain: z.string().nullable().optional(),
  recommendedAction: z.string(),
  status: z.string().nullable().optional(),
  savedAt: z.string().nullable().optional(),
  searchedAt: z.string().nullable().optional(),
});
export type CompanyRecommendationItemResponse = z.infer<typeof companyRecommendationItemResponseSchema>;
export type JobSuggestionItemResponse = CompanyRecommendationItemResponse;

export const companyRecommendationSearchResponseSchema = z.object({
  resumeSqid: z.string(),
  targetRole: z.string(),
  results: z.array(companyRecommendationItemResponseSchema),
  searchedAt: z.string(),
});
export type CompanyRecommendationSearchResponse = z.infer<typeof companyRecommendationSearchResponseSchema>;
export type JobSuggestionSearchResponse = CompanyRecommendationSearchResponse;

export const saveCompanyRecommendationRequestSchema = z.object({
  companyName: z.string(),
  roleTitle: z.string(),
  matchScore: z.number(),
  whyItMatches: z.string(),
  requiredSkills: z.array(z.string()),
  studentMatchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  location: z.string().nullable().optional(),
  workSetup: z.string(),
  employmentType: z.string().nullable().optional(),
  sourceUrl: z.string().url(),
  recommendedAction: z.string(),
  status: z.enum(["Saved", "Applied", "Interviewing", "Rejected", "Offer", "NotInterested"]),
});
export type SaveCompanyRecommendationRequest = z.infer<typeof saveCompanyRecommendationRequestSchema>;

export const savedCompanyRecommendationsResponseSchema = z.object({
  resumeSqid: z.string(),
  items: z.array(companyRecommendationItemResponseSchema),
});
export type SavedCompanyRecommendationsResponse = z.infer<typeof savedCompanyRecommendationsResponseSchema>;
export type SavedJobSuggestionsResponse = SavedCompanyRecommendationsResponse;

export const updateCompanyRecommendationStatusRequestSchema = z.object({
  status: z.enum(["Saved", "Applied", "Interviewing", "Rejected", "Offer", "NotInterested"]),
});
export type UpdateCompanyRecommendationStatusRequest = z.infer<typeof updateCompanyRecommendationStatusRequestSchema>;
