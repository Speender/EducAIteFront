import { z } from "zod";
import type {
  ResumeCertificateDto,
  ResumeEducationDto,
  ResumeEmploymentHistoryDto,
  ResumeLeadershipActivityDto,
  ResumeReviewResponseDto,
} from "../api/dto";

const resumeSectionIdSchema = z.enum([
  "summary",
  "education",
  "experience",
  "leadership",
  "certificates",
  "skills",
]);

export const resumeAccentSchema = z.enum(["teal", "navy", "slate", "forest", "burgundy", "monochrome", "ink"]);
export type ResumeAccent = z.infer<typeof resumeAccentSchema>;

const templateRenderConfigSchema = z.object({
  layout: z.enum(["classic", "sidebar", "academic"]).optional(),
  density: z.enum(["compact", "comfortable"]).optional(),
  accent: resumeAccentSchema.optional(),
  sectionOrder: z.array(resumeSectionIdSchema).max(6).optional(),
  hiddenSections: z.array(resumeSectionIdSchema).max(6).optional(),
  sectionTitles: z
    .object({
      summary: z.string().min(1).max(80).optional(),
      education: z.string().min(1).max(80).optional(),
      experience: z.string().min(1).max(80).optional(),
      leadership: z.string().min(1).max(80).optional(),
      certificates: z.string().min(1).max(80).optional(),
      skills: z.string().min(1).max(80).optional(),
    })
    .optional(),
});

export type ResumeSectionId = z.infer<typeof resumeSectionIdSchema>;
export type TemplateRenderConfig = z.infer<typeof templateRenderConfigSchema>;

export interface TemplateDefinition {
  type: "HarvardClassic" | "ModernMinimal" | "AcademicCv";
  code: string;
  name: string;
  layout: "classic" | "sidebar" | "academic";
  density: "compact" | "comfortable";
  accent: ResumeAccent;
  defaultSectionOrder: ResumeSectionId[];
  defaultHiddenSections?: ResumeSectionId[];
  defaultSectionTitles?: Partial<Record<ResumeSectionId, string>>;
}

export interface NormalizedResumePreviewData {
  templateName: string;
  targetRole?: string | null;
  personalDetails: ResumeReviewResponseDto["personalDetails"];
  summary: ResumeReviewResponseDto["summary"];
  education: ResumeEducationDto[];
  employmentHistory: ResumeEmploymentHistoryDto[];
  leadershipActivities: ResumeLeadershipActivityDto[];
  certificates: ResumeCertificateDto[];
  skillsAndInterests: NonNullable<ResumeReviewResponseDto["skillsAndInterests"]>;
  sections: Array<{
    id: ResumeSectionId;
    title: string;
  }>;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  harvard_classic: {
    type: "HarvardClassic",
    code: "harvard_classic",
    name: "Harvard Classic",
    layout: "classic",
    density: "comfortable",
    accent: "ink",
    defaultSectionOrder: ["education", "experience", "leadership", "certificates", "skills"],
    defaultSectionTitles: {
      summary: "Professional Summary",
      education: "Education",
      experience: "Experience",
      leadership: "Leadership & Activities",
      certificates: "Awards & Certifications",
      skills: "Skills & Interests",
    },
  },
  modern_minimal: {
    type: "ModernMinimal",
    code: "modern_minimal",
    name: "Modern Minimal",
    layout: "sidebar",
    density: "comfortable",
    accent: "teal",
    defaultSectionOrder: ["summary", "experience", "skills", "education", "certificates"],
    defaultSectionTitles: {
      summary: "Profile",
      education: "Education",
      experience: "Experience",
      leadership: "Leadership",
      certificates: "Certificates",
      skills: "Skills",
    },
  },
  academic_cv: {
    type: "AcademicCv",
    code: "academic_cv",
    name: "Academic CV",
    layout: "academic",
    density: "compact",
    accent: "slate",
    defaultSectionOrder: ["education", "summary", "leadership", "certificates", "experience", "skills"],
    defaultSectionTitles: {
      summary: "Academic Summary",
      education: "Education",
      experience: "Research & Experience",
      leadership: "Leadership & Activities",
      certificates: "Awards, Certifications & Achievements",
      skills: "Skills & Interests",
    },
  },
};

export const FIXED_RESUME_TEMPLATES = Object.values(TEMPLATE_REGISTRY);

export function resolveTemplateDefinition(
  templateCode?: string | null,
  renderConfigJson?: string | null,
) {
  const normalizedCode = normalizeTemplateCode(templateCode);
  const definition = TEMPLATE_REGISTRY[normalizedCode] ?? TEMPLATE_REGISTRY.harvard_classic;
  const config = parseRenderConfig(renderConfigJson);

  const hiddenSections = new Set([
    ...(definition.defaultHiddenSections ?? []),
    ...(config?.hiddenSections ?? []),
  ]);

  const sectionOrder = uniqueSectionOrder(config?.sectionOrder ?? definition.defaultSectionOrder).filter(
    (sectionId) => !hiddenSections.has(sectionId),
  );

  return {
    definition: {
      ...definition,
      layout: config?.layout ?? definition.layout,
      density: config?.density ?? definition.density,
      accent: config?.accent ?? definition.accent,
      defaultSectionTitles: {
        ...definition.defaultSectionTitles,
        ...config?.sectionTitles,
      },
    },
    config,
    sectionOrder,
  };
}

export function normalizeTemplateCode(templateCode?: string | null) {
  const normalized = templateCode?.trim().toLowerCase() || "harvard_classic";
  if (normalized === "harvard") return "harvard_classic";
  if (normalized === "modern") return "modern_minimal";
  if (normalized === "executive") return "academic_cv";
  return normalized;
}

export function buildNormalizedPreviewData(
  data: Partial<ResumeReviewResponseDto>,
  templateCode?: string | null,
  renderConfigJson?: string | null,
): NormalizedResumePreviewData {
  const { definition, sectionOrder } = resolveTemplateDefinition(templateCode, renderConfigJson);

  return {
    templateName: definition.name,
    targetRole: data.targetRole,
    personalDetails: data.personalDetails ?? null,
    summary: data.summary ?? null,
    education: data.education ?? [],
    employmentHistory: data.employmentHistory ?? [],
    leadershipActivities: data.leadershipActivities ?? [],
    certificates: data.awardsAndCertifications ?? data.certificates ?? [],
    skillsAndInterests: data.skillsAndInterests ?? {
      technicalSkills: [],
      languages: [],
      interests: [],
    },
    sections: sectionOrder.map((id) => ({
      id,
      title: definition.defaultSectionTitles?.[id] ?? id,
    })),
  };
}

function parseRenderConfig(renderConfigJson?: string | null) {
  if (!renderConfigJson) {
    return null;
  }

  try {
    return templateRenderConfigSchema.parse(JSON.parse(renderConfigJson));
  } catch {
    return null;
  }
}

function uniqueSectionOrder(sectionOrder: ResumeSectionId[]) {
  const seen = new Set<ResumeSectionId>();
  return sectionOrder.filter((sectionId) => {
    if (seen.has(sectionId)) {
      return false;
    }

    seen.add(sectionId);
    return true;
  });
}
