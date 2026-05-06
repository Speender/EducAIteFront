import { z } from "zod";

export const certificateStatusSchema = z.enum([
  "uploaded",
  "pending_processing",
  "processing",
  "parsed",
  "needs_review",
  "verified_by_user",
  "failed",
]);

export type CertificateStatus = z.infer<typeof certificateStatusSchema>;

export const certificateProcessingJobStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
]);

export type CertificateProcessingJobStatus = z.infer<typeof certificateProcessingJobStatusSchema>;

export const certificateFileDtoSchema = z.object({
  fileName: z.string(),
  fileMimeType: z.enum(["image/jpeg", "image/png", "application/pdf"]),
  fileSizeBytes: z.number(),
  fileUrl: z.string().url(),
});

export type CertificateFileDto = z.infer<typeof certificateFileDtoSchema>;

export const certificateFieldConfidenceDtoSchema = z.object({
  fieldName: z.string(),
  value: z.string().nullish(),
  confidence: z.number(),
  needsReview: z.boolean(),
});

export type CertificateFieldConfidenceDto = z.infer<typeof certificateFieldConfidenceDtoSchema>;

// Upload Certificates
export const uploadCertificateItemDtoSchema = z.object({
  certificationSqid: z.string(),
  fileName: z.string(),
  fileMimeType: z.enum(["image/jpeg", "image/png", "application/pdf"]),
  fileSizeBytes: z.number(),
  status: certificateStatusSchema,
  fileUrl: z.string().url(),
  createdAt: z.string(),
});

export type UploadCertificateItemDto = z.infer<typeof uploadCertificateItemDtoSchema>;

export const uploadCertificateErrorDtoSchema = z.object({
  fileName: z.string().optional(),
  message: z.string(),
});

export type UploadCertificateErrorDto = z.infer<typeof uploadCertificateErrorDtoSchema>;

export const uploadCertificatesResponseSchema = z.object({
  uploadedCount: z.number(),
  failedCount: z.number(),
  items: z.array(uploadCertificateItemDtoSchema),
  errors: z.array(uploadCertificateErrorDtoSchema),
});

export type UploadCertificatesResponse = z.infer<typeof uploadCertificatesResponseSchema>;

// Certificate List
export const certificateListItemDtoSchema = z.object({
  certificationSqid: z.string(),
  achievementName: z.string().nullish(),
  institution: z.string().nullish(),
  issuedDate: z.string().nullish(),
  schoolYear: z.string().nullish(),
  status: certificateStatusSchema,
  overallConfidence: z.number().nullish(),
});

export type CertificateListItemDto = z.infer<typeof certificateListItemDtoSchema>;

export const certificateListResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  items: z.array(certificateListItemDtoSchema),
});

export type CertificateListResponse = z.infer<typeof certificateListResponseSchema>;

// Certificate Detail
export const certificateDetailResponseSchema = z.object({
  certificationSqid: z.string(),
  achievementName: z.string().nullish(),
  institution: z.string().nullish(),
  issuedDate: z.string().nullish(),
  schoolYear: z.string().nullish(),
  gradeOrScore: z.string().nullish(),
  description: z.string().nullish(),
  tags: z.array(z.string()),
  file: certificateFileDtoSchema,
  status: certificateStatusSchema,
  overallConfidence: z.number().nullish(),
  fieldConfidence: z.array(certificateFieldConfidenceDtoSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CertificateDetailResponse = z.infer<typeof certificateDetailResponseSchema>;

// Update, Confirm
export const updateCertificateRequestSchema = z.object({
  achievementName: z.string().nullish(),
  institution: z.string().nullish(),
  issuedDate: z.string().nullish(),
  schoolYear: z.string().nullish(),
  gradeOrScore: z.string().nullish(),
  description: z.string().nullish(),
  tags: z.array(z.string()).optional(),
});

export type UpdateCertificateRequest = z.infer<typeof updateCertificateRequestSchema>;

export const confirmCertificateRequestSchema = z.object({
  confirmed: z.boolean(),
  reviewNote: z.string().nullish(),
});

export type ConfirmCertificateRequest = z.infer<typeof confirmCertificateRequestSchema>;

// Processing
export const startCertificateProcessingResponseSchema = z.object({
  certificationSqid: z.string(),
  jobSqid: z.string(),
  status: certificateProcessingJobStatusSchema,
  startedAt: z.string().nullish(),
});

export type StartCertificateProcessingResponse = z.infer<typeof startCertificateProcessingResponseSchema>;

export const batchProcessCertificateItemDtoSchema = z.object({
  certificationSqid: z.string(),
  jobSqid: z.string().nullish(),
  status: certificateProcessingJobStatusSchema,
  errorMessage: z.string().nullish(),
});

export type BatchProcessCertificateItemDto = z.infer<typeof batchProcessCertificateItemDtoSchema>;

export const batchProcessCertificatesResponseSchema = z.object({
  requestedCount: z.number(),
  startedCount: z.number(),
  failedCount: z.number(),
  items: z.array(batchProcessCertificateItemDtoSchema),
});

export type BatchProcessCertificatesResponse = z.infer<typeof batchProcessCertificatesResponseSchema>;

export const certificateProcessingStatusResponseSchema = z.object({
  certificationSqid: z.string(),
  jobSqid: z.string().nullish(),
  status: certificateProcessingJobStatusSchema,
  startedAt: z.string().nullish(),
  completedAt: z.string().nullish(),
  errorMessage: z.string().nullish(),
  retryCount: z.number(),
});

export type CertificateProcessingStatusResponse = z.infer<typeof certificateProcessingStatusResponseSchema>;

// Resume related DTOs (these will also be needed in Resume feature)
export const resumeCertificateItemDtoSchema = z.object({
  certificationSqid: z.string(),
  achievementName: z.string(),
  institution: z.string(),
  issuedDate: z.string().nullish(),
  schoolYear: z.string().nullish(),
  gradeOrScore: z.string().nullish(),
  description: z.string().nullish(),
  tags: z.array(z.string()).optional(),
});

export type ResumeCertificateItemDto = z.infer<typeof resumeCertificateItemDtoSchema>;

export const replaceResumeCertificatesResponseSchema = z.object({
  resumeSqid: z.string(),
  certificates: z.array(resumeCertificateItemDtoSchema),
});

export type ReplaceResumeCertificatesResponse = z.infer<typeof replaceResumeCertificatesResponseSchema>;

export const achievementSchoolYearGroupDtoSchema = z.object({
  schoolYear: z.string(),
  achievements: z.array(resumeCertificateItemDtoSchema),
});

export type AchievementSchoolYearGroupDto = z.infer<typeof achievementSchoolYearGroupDtoSchema>;

export const achievementGroupedBySchoolYearResponseSchema = z.object({
  resumeSqid: z.string(),
  groups: z.array(achievementSchoolYearGroupDtoSchema),
});

export type AchievementGroupedBySchoolYearResponse = z.infer<typeof achievementGroupedBySchoolYearResponseSchema>;

export const lifetimeAchievementResponseSchema = z.object({
  resumeSqid: z.string(),
  totalCount: z.number(),
  items: z.array(resumeCertificateItemDtoSchema),
});

export type LifetimeAchievementResponse = z.infer<typeof lifetimeAchievementResponseSchema>;

export const certificateSuggestionJobProfileDtoSchema = z.object({
  jobTitle: z.string().optional(),
  targetRole: z.string().optional(),
  companyName: z.string().nullish(),
  detectedSignals: z.array(z.string()),
});

export type CertificateSuggestionJobProfileDto = z.infer<typeof certificateSuggestionJobProfileDtoSchema>;

export const certificateSuggestionItemDtoSchema = z.object({
  certificationSqid: z.string(),
  achievementName: z.string(),
  institution: z.string(),
  matchScore: z.number(),
  reason: z.string(),
  matchedSignals: z.array(z.string()),
});

export type CertificateSuggestionItemDto = z.infer<typeof certificateSuggestionItemDtoSchema>;

export const certificateNotRecommendedItemDtoSchema = z.object({
  certificationSqid: z.string(),
  achievementName: z.string(),
  reason: z.string(),
});

export type CertificateNotRecommendedItemDto = z.infer<typeof certificateNotRecommendedItemDtoSchema>;

export const certificateSuggestionResponseSchema = z.object({
  resumeSqid: z.string(),
  jobProfile: certificateSuggestionJobProfileDtoSchema,
  suggestions: z.array(certificateSuggestionItemDtoSchema),
  notRecommended: z.array(certificateNotRecommendedItemDtoSchema),
});

export type CertificateSuggestionResponse = z.infer<typeof certificateSuggestionResponseSchema>;

export const exportResumeResponseSchema = z.object({
  resumeSqid: z.string(),
  format: z.enum(["pdf", "docx"]),
  fileName: z.string(),
  downloadUrl: z.string(),
  generatedAt: z.string(),
});

export type ExportResumeResponse = z.infer<typeof exportResumeResponseSchema>;
