import { z } from "zod";

// --- Base Types ---

const dateOnlyStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD date");
const optionalNullableString = (schema: z.ZodString) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    },
    schema.nullable().optional()
  );

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  middleName: optionalNullableString(z.string().max(80)),
  email: z.string().email().max(255),
  phoneNumber: z.string().min(7).max(20),
  addressLine1: z.string().min(1).max(200),
  addressLine2: optionalNullableString(z.string().max(200)),
  city: z.string().min(1).max(100),
  provinceState: z.string().min(1).max(100),
  country: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  linkedInUrl: optionalNullableString(z.string().url().max(500)),
  portfolioUrl: optionalNullableString(z.string().url().max(500)),
});

export const educationSchema = z.object({
  educationSqid: z.string().optional(),
  schoolName: z.string().min(1).max(160),
  degree: z.string().min(1).max(120),
  fieldOfStudy: z.string().max(120).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  startDate: z.string(), // ISO date string
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean(),
  description: z.string().max(2000).optional().nullable(),
  orderIndex: z.number().int().min(0),
});
export type ResumeEducationDto = z.infer<typeof educationSchema>;

export const employmentHistorySchema = z.object({
  employmentSqid: z.string().optional(),
  companyName: z.string().min(1).max(160),
  positionTitle: z.string().min(1).max(120),
  location: z.string().max(120).optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean(),
  responsibilities: z.array(z.string().min(1).max(300)).max(20).optional().nullable(),
  orderIndex: z.number().int().min(0),
});
export type ResumeEmploymentHistoryDto = z.infer<typeof employmentHistorySchema>;

export const leadershipActivitySchema = z.object({
  leadershipActivitySqid: z.string().optional(),
  organizationName: z.string().min(1).max(160),
  roleTitle: z.string().min(1).max(120),
  location: z.string().max(120).optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean(),
  highlights: z.array(z.string().min(1).max(300)).max(20).optional().nullable(),
  orderIndex: z.number().int().min(0),
});
export type ResumeLeadershipActivityDto = z.infer<typeof leadershipActivitySchema>;

export const resumeSummarySchema = z.object({
  summaryText: z.string().min(80).max(2000),
});

export const resumeCertificateSchema = z.object({
  certificationSqid: z.string(),
  achievementName: z.string(),
  institution: z.string(),
  issuedDate: z.string().nullish(),
  schoolYear: z.string().nullish(),
  gradeOrScore: z.string().nullish(),
  description: z.string().nullish(),
  tags: z.array(z.string()).optional(),
  status: z.string().nullish(),
});
export type ResumeCertificateDto = z.infer<typeof resumeCertificateSchema>;

export const skillsAndInterestsSchema = z.object({
  technicalSkills: z.array(z.string().min(1).max(120)).default([]),
  languages: z.array(z.string().min(1).max(120)).default([]),
  interests: z.array(z.string().min(1).max(120)).default([]),
});
export type ResumeSkillsAndInterestsDto = z.infer<typeof skillsAndInterestsSchema>;

export const achievementSchoolYearGroupDtoSchema = z.object({
  schoolYear: z.string(),
  achievements: z.array(resumeCertificateSchema),
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
  items: z.array(resumeCertificateSchema),
});

export type LifetimeAchievementResponse = z.infer<typeof lifetimeAchievementResponseSchema>;

export const certificateSuggestionItemDtoSchema = z.object({
  certificationSqid: z.string(),
  name: z.string().nullish(),
  issuer: z.string().nullish(),
  issuedAt: z.string().nullish(),
  schoolYear: z.string().nullish(),
  gradeOrScore: z.string().nullish(),
  description: z.string().nullish(),
  tags: z.array(z.string()).default([]),
  status: z.string().nullish(),
  relevanceScore: z.number().int().min(0).max(100),
  matchReason: z.string(),
  recommendedUsage: z.string(),
});

export type CertificateSuggestionItemDto = z.infer<typeof certificateSuggestionItemDtoSchema>;

export const certificateSuggestionResponseSchema = z.object({
  resumeSqid: z.string(),
  targetRole: z.string().nullish(),
  totalCertificatesReviewed: z.number().int().nonnegative(),
  suggestions: z.array(certificateSuggestionItemDtoSchema),
});

export type CertificateSuggestionResponse = z.infer<typeof certificateSuggestionResponseSchema>;

export const certificateSuggestionRequestDtoSchema = z.object({
  maxResults: z.number().int().min(1).max(20).optional(),
});

export type CertificateSuggestionRequestDto = z.infer<typeof certificateSuggestionRequestDtoSchema>;

export const exportResumeRequestDtoSchema = z.object({
  templateType: z.enum(["HarvardClassic", "ModernMinimal", "AcademicCv"]).optional(),
  includeLifetimeAchievements: z.boolean().optional(),
  includeSchoolYearGrouping: z.boolean().optional(),
});

export type ExportResumeRequestDto = z.infer<typeof exportResumeRequestDtoSchema>;

export const exportResumeResponseSchema = z.object({
  resumeSqid: z.string(),
  format: z.enum(["pdf", "docx"]),
  fileName: z.string(),
  downloadUrl: z.string(),
  generatedAt: z.string(),
});

export type ExportResumeResponse = z.infer<typeof exportResumeResponseSchema>;

export const resumeTemplateSchema = z.object({
  type: z.enum(["HarvardClassic", "ModernMinimal", "AcademicCv"]),
  code: z.string(),
  displayName: z.string(),
  requiredSections: z.array(z.string()),
  recommendedSections: z.array(z.string()),
  sectionOrder: z.array(z.string()),
});
export type ResumeTemplateDto = z.infer<typeof resumeTemplateSchema>;

// --- Requests ---

export const createResumeRequestDtoSchema = z.object({
  title: z.string().min(1).max(120),
  targetRole: z.string().max(200).optional().nullable(),
  templateType: z.enum(["HarvardClassic", "ModernMinimal", "AcademicCv"]).optional().nullable(),
});

export type CreateResumeRequestDto = z.infer<typeof createResumeRequestDtoSchema>;

export const upsertPersonalDetailsRequestDtoSchema = personalDetailsSchema;
export type UpsertPersonalDetailsRequestDto = z.infer<typeof upsertPersonalDetailsRequestDtoSchema>;

export const createEducationRequestDtoSchema = z.object({
  schoolName: z.string().min(1).max(160),
  degree: z.string().min(1).max(120),
  fieldOfStudy: z.string().max(120).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  startDate: dateOnlyStringSchema,
  endDate: dateOnlyStringSchema.optional().nullable(),
  isCurrent: z.boolean(),
  description: z.string().max(2000).optional().nullable(),
  orderIndex: z.number().int().min(0),
});
export type CreateEducationRequestDto = z.infer<typeof createEducationRequestDtoSchema>;

export const updateEducationRequestDtoSchema = createEducationRequestDtoSchema.extend({
  educationSqid: z.string(),
});
export type UpdateEducationRequestDto = z.infer<typeof updateEducationRequestDtoSchema>;

export const createEmploymentHistoryRequestDtoSchema = z.object({
  companyName: z.string().min(1).max(160),
  positionTitle: z.string().min(1).max(120),
  location: z.string().max(120).optional().nullable(),
  startDate: dateOnlyStringSchema,
  endDate: dateOnlyStringSchema.optional().nullable(),
  isCurrent: z.boolean(),
  responsibilities: z.array(z.string().min(1).max(300)).max(20).optional().nullable(),
  orderIndex: z.number().int().min(0),
});
export type CreateEmploymentHistoryRequestDto = z.infer<typeof createEmploymentHistoryRequestDtoSchema>;

export const updateEmploymentHistoryRequestDtoSchema = createEmploymentHistoryRequestDtoSchema.extend({
  employmentSqid: z.string(),
});
export type UpdateEmploymentHistoryRequestDto = z.infer<typeof updateEmploymentHistoryRequestDtoSchema>;

export const updateSummaryRequestDtoSchema = resumeSummarySchema;
export type UpdateSummaryRequestDto = z.infer<typeof updateSummaryRequestDtoSchema>;

export const replaceResumeCertificatesRequestDtoSchema = z.object({
  certificationSqids: z.array(z.string()),
});
export type ReplaceResumeCertificatesRequestDto = z.infer<typeof replaceResumeCertificatesRequestDtoSchema>;

export const replaceResumeCertificatesResponseSchema = z.object({
  resumeSqid: z.string(),
  certificates: z.array(resumeCertificateSchema),
});
export type ReplaceResumeCertificatesResponse = z.infer<typeof replaceResumeCertificatesResponseSchema>;

export const saveResumeVersionRequestDtoSchema = z.object({
  saveNote: z.string().max(200).optional(),
});
export type SaveResumeVersionRequestDto = z.infer<typeof saveResumeVersionRequestDtoSchema>;

export const selectResumeTemplateRequestDtoSchema = z.object({
  templateType: z.enum(["HarvardClassic", "ModernMinimal", "AcademicCv"]),
});
export type SelectResumeTemplateRequestDto = z.infer<typeof selectResumeTemplateRequestDtoSchema>;

export const aiRewriteSummaryRequestDtoSchema = z.object({
  summaryText: z.string().min(10).max(2000),
  tone: z.enum(["professional", "concise", "impact"]),
  targetLength: z.number().int().min(50).max(1200),
});
export type AiRewriteSummaryRequestDto = z.infer<typeof aiRewriteSummaryRequestDtoSchema>;

export const aiTailorResumeRequestDtoSchema = z.object({
  jobTitle: z.string().min(1),
  companyName: z.string().min(1).optional().nullable(),
  jobDescription: z.string().min(10),
  includeExperiences: z.boolean().default(true),
  includeEducations: z.boolean().default(true),
  includeSkills: z.boolean().default(true),
  includeProjects: z.boolean().default(true),
  includeCertifications: z.boolean().default(true),
});
export type AiTailorResumeRequestDto = z.infer<typeof aiTailorResumeRequestDtoSchema>;

// --- Responses ---

export const resumeResponseDtoSchema = z.object({
  resumeSqid: z.string(),
  title: z.string(),
  targetRole: z.string().optional().nullable(),
  template: resumeTemplateSchema.optional(),
  status: z.string(),
  currentTemplateSqid: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ResumeResponseDto = z.infer<typeof resumeResponseDtoSchema>;

export const resumeReviewResponseDtoSchema = z.object({
  resumeSqid: z.string(),
  title: z.string(),
  targetRole: z.string().optional().nullable(),
  template: resumeTemplateSchema.optional().nullable(),
  personalDetails: personalDetailsSchema.optional().nullable(),
  education: z.array(educationSchema),
  employmentHistory: z.array(employmentHistorySchema),
  leadershipActivities: z.array(leadershipActivitySchema).optional().default([]),
  summary: resumeSummarySchema.optional().nullable(),
  certificates: z.array(resumeCertificateSchema),
  awardsAndCertifications: z.array(resumeCertificateSchema).optional().default([]),
  skillsAndInterests: skillsAndInterestsSchema.optional().nullable(),
  completeness: z.object({
    isComplete: z.boolean(),
    missingRequiredFields: z.array(z.string()),
  }),
});

export type ResumeReviewResponseDto = z.infer<typeof resumeReviewResponseDtoSchema>;

export const resumeVersionResponseDtoSchema = z.object({
  resumeVersionSqid: z.string(),
  resumeSqid: z.string(),
  versionNumber: z.number(),
  savedAt: z.string(),
  saveNote: z.string().optional().nullable(),
  snapshotHash: z.string(),
});

export type ResumeVersionResponseDto = z.infer<typeof resumeVersionResponseDtoSchema>;

export const pagedResumeVersionResponseDtoSchema = z.object({
  resumeSqid: z.string(),
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  items: z.array(resumeVersionResponseDtoSchema),
});

export type PagedResumeVersionResponseDto = z.infer<typeof pagedResumeVersionResponseDtoSchema>;

export const pagedResumeTemplateResponseDtoSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  items: z.array(resumeTemplateSchema),
});

export type PagedResumeTemplateResponseDto = z.infer<typeof pagedResumeTemplateResponseDtoSchema>;

export const pagedResumeResponseDtoSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  items: z.array(resumeResponseDtoSchema),
});

export type PagedResumeResponseDto = z.infer<typeof pagedResumeResponseDtoSchema>;

export const aiRewriteSummaryResponseDtoSchema = z.object({
  resumeSqid: z.string(),
  originalSummary: z.string(),
  rewrittenSummary: z.string(),
  model: z.string(),
  generatedAt: z.string(),
  safetyFlags: z.array(z.string()).optional(),
});

export type AiRewriteSummaryResponseDto = z.infer<typeof aiRewriteSummaryResponseDtoSchema>;

export const aiTailorResumeResponseDtoSchema = z.object({
  resume: z.any(),
  jobProfile: z.object({
    targetRole: z.string(),
    companyName: z.string(),
    targetTone: z.string(),
    recruiterSignals: z.array(z.string()),
    coreRequirements: z.array(z.object({
      requirement: z.string(),
      priority: z.string(),
      rationale: z.string(),
      keywords: z.array(z.string()),
    })),
    focusAreas: z.array(z.string()),
    downplayAreas: z.array(z.string()),
  }),
  alignment: z.object({
    score: z.number(),
    matched: z.array(z.object({
      requirement: z.string(),
      evidence: z.string(),
      priority: z.string(),
    })),
    gaps: z.array(z.object({
      requirement: z.string(),
      reason: z.string(),
      priority: z.string(),
    })),
    priorityFocus: z.array(z.string()),
  }),
  tailoredResume: z.object({
    headline: z.object({
      statementId: z.string(),
      text: z.string(),
    }),
    professionalSummary: z.array(z.object({
      statementId: z.string(),
      text: z.string(),
    })),
    keySkills: z.array(z.object({
      statementId: z.string(),
      text: z.string(),
    })),
    experiences: z.array(z.object({
      employmentSqid: z.string().optional().nullable(),
      companyName: z.string(),
      positionTitle: z.string(),
      location: z.string(),
      dateRange: z.string(),
      bullets: z.array(z.object({
        statementId: z.string(),
        text: z.string(),
      })),
    })),
    education: z.array(z.any()),
    certifications: z.array(z.any()),
  }),
  tailoringDecisions: z.object({
    highlighted: z.array(z.string()),
    downplayed: z.array(z.string()),
    noiseReduced: z.array(z.string()),
  }),
  evidenceMap: z.array(z.object({
    statementId: z.string(),
    statement: z.string(),
    sourceRefs: z.array(z.object({
      relationType: z.string(),
      relationSqid: z.string().optional().nullable(),
      field: z.string(),
      quote: z.string(),
    })),
  })),
  metadata: z.object({
    model: z.string(),
    generatedAt: z.string(),
    retryCount: z.number(),
  }),
});

export type AiTailorResumeResponseDto = z.infer<typeof aiTailorResumeResponseDtoSchema>;
