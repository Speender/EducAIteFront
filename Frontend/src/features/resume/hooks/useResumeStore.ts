import { create } from "zustand";
import { type ResumeReviewResponseDto } from "../api/dto";
import { normalizeTemplateCode } from "../lib/templateRuntime";

interface ResumeState {
  data: Partial<ResumeReviewResponseDto>;
  selectedTemplateCode: string;
  selectedAccentColor: string;
  setData: (data: Partial<ResumeReviewResponseDto>) => void;
  setSelectedTemplateCode: (code: string) => void;
  setSelectedAccentColor: (color: string) => void;
  updatePersonalDetails: (details: ResumeReviewResponseDto["personalDetails"]) => void;
  updateSummary: (summary: ResumeReviewResponseDto["summary"]) => void;
  updateEducation: (education: ResumeReviewResponseDto["education"]) => void;
  updateEmployment: (employment: ResumeReviewResponseDto["employmentHistory"]) => void;
  updateLeadershipActivities: (leadershipActivities: ResumeReviewResponseDto["leadershipActivities"]) => void;
  updateCertificates: (certificates: ResumeReviewResponseDto["certificates"]) => void;
  updateSkillsAndInterests: (skillsAndInterests: ResumeReviewResponseDto["skillsAndInterests"]) => void;
  updateTemplate: (template: ResumeReviewResponseDto["template"]) => void;
  setInitialData: (data: ResumeReviewResponseDto) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  data: {
    education: [],
    employmentHistory: [],
    leadershipActivities: [],
    certificates: [],
    skillsAndInterests: {
      technicalSkills: [],
      languages: [],
      interests: [],
    },
  },
  selectedTemplateCode: "harvard_classic",
  selectedAccentColor: "#00cec8",
  setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
  setSelectedTemplateCode: (code) => set({ selectedTemplateCode: code }),
  setSelectedAccentColor: (selectedAccentColor) => set({ selectedAccentColor }),
  updatePersonalDetails: (personalDetails) =>
    set((state) => ({ data: { ...state.data, personalDetails } })),
  updateSummary: (summary) =>
    set((state) => ({ data: { ...state.data, summary } })),
  updateEducation: (education) =>
    set((state) => ({ data: { ...state.data, education } })),
  updateEmployment: (employmentHistory) =>
    set((state) => ({ data: { ...state.data, employmentHistory } })),
  updateLeadershipActivities: (leadershipActivities) =>
    set((state) => ({ data: { ...state.data, leadershipActivities } })),
  updateCertificates: (certificates) =>
    set((state) => ({ data: { ...state.data, certificates } })),
  updateSkillsAndInterests: (skillsAndInterests) =>
    set((state) => ({ data: { ...state.data, skillsAndInterests } })),
  updateTemplate: (template) =>
    set((state) => ({ 
      data: { ...state.data, template },
      selectedTemplateCode: normalizeTemplateCode(template?.code ?? state.selectedTemplateCode)
    })),
  setInitialData: (data) => set({ 
    data, 
    selectedTemplateCode: normalizeTemplateCode(data.template?.code)
  }),
}));
