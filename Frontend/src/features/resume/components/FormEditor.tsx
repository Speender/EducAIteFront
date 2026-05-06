import { memo, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  Briefcase,
  Check,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  Sparkles,
  Target,
  Trophy,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useCareerHint, useJobTargetSuggestions } from "../api/hooks";
import { useResumeStore } from "../hooks/useResumeStore";
import {
  FIXED_RESUME_TEMPLATES,
  resolveTemplateDefinition,
  type ResumeSectionId,
} from "../lib/templateRuntime";
import CertificatesForm from "./CertificatesForm";
import EducationForm from "./EducationForm";
import EmploymentForm from "./EmploymentForm";
import LeadershipActivitiesForm from "./LeadershipActivitiesForm";
import PersonalDetailsForm from "./PersonalDetailsForm";
import SkillsInterestsForm from "./SkillsInterestsForm";
import SummaryForm from "./SummaryForm";

interface FormEditorProps {
  resumeSqid: string;
}

type EditorSectionId = "personal-details" | ResumeSectionId;

const sectionMeta: Record<ResumeSectionId, { icon: ReactNode; defaultTitle: string; description: string }> = {
  summary: {
    icon: <FileText className="size-5" />,
    defaultTitle: "Professional Summary",
    description: "Short opening statement for recruiter context",
  },
  education: {
    icon: <GraduationCap className="size-5" />,
    defaultTitle: "Education",
    description: "School, degree, dates, location, and academic highlights",
  },
  experience: {
    icon: <Briefcase className="size-5" />,
    defaultTitle: "Experience",
    description: "Roles, dates, locations, and measurable impact bullets",
  },
  leadership: {
    icon: <Trophy className="size-5" />,
    defaultTitle: "Leadership & Activities",
    description: "Organizations, roles, dates, locations, and activity highlights",
  },
  certificates: {
    icon: <Award className="size-5" />,
    defaultTitle: "Awards & Certifications",
    description: "Verified achievements, awards, and certificates",
  },
  skills: {
    icon: <Wrench className="size-5" />,
    defaultTitle: "Skills & Interests",
    description: "Technical skills, languages, and interview-friendly interests",
  },
};

const sectionForms: Record<ResumeSectionId, (resumeSqid: string) => ReactNode> = {
  summary: (resumeSqid) => <SummaryForm resumeSqid={resumeSqid} />,
  education: (resumeSqid) => <EducationForm resumeSqid={resumeSqid} />,
  experience: (resumeSqid) => <EmploymentForm resumeSqid={resumeSqid} />,
  leadership: () => <LeadershipActivitiesForm />,
  certificates: (resumeSqid) => <CertificatesForm resumeSqid={resumeSqid} />,
  skills: () => <SkillsInterestsForm />,
};

const templateDescriptions: Record<string, string> = {
  harvard_classic: "Best for students, internships, and ATS-friendly one-page applications.",
  modern_minimal: "Best for job-ready resumes where summary, experience, and skills should lead.",
  academic_cv: "Best for education-heavy resumes with leadership, achievements, and academic evidence.",
};

const FormEditor = ({ resumeSqid }: FormEditorProps) => {
  const [activeSection, setActiveSection] = useState<EditorSectionId>("personal-details");
  const [openSections, setOpenSections] = useState<string[]>(["personal-details"]);
  const [hint, setHint] = useState<string | null>(null);
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set());

  const targetRole = useResumeStore((state) => state.data.targetRole);
  const setData = useResumeStore((state) => state.setData);
  const selectedTemplateCode = useResumeStore((state) => state.selectedTemplateCode);
  const selectedAccentColor = useResumeStore((state) => state.selectedAccentColor);
  const setSelectedTemplateCode = useResumeStore((state) => state.setSelectedTemplateCode);
  const setSelectedAccentColor = useResumeStore((state) => state.setSelectedAccentColor);
  const getHintMutation = useCareerHint(resumeSqid);
  const jobTargetSuggestionsMutation = useJobTargetSuggestions(resumeSqid);
  const [selectedTargetRoles, setSelectedTargetRoles] = useState<string[]>([]);
  const [customTargetRole, setCustomTargetRole] = useState("");
  const [targetRoleSuggestions, setTargetRoleSuggestions] = useState<string[]>([]);

  const { definition, sectionOrder } = useMemo(
    () => resolveTemplateDefinition(selectedTemplateCode),
    [selectedTemplateCode]
  );

  useEffect(() => {
    if (!activeSection || dismissedHints.has(activeSection)) {
      setHint(null);
      return;
    }

    const timeout = setTimeout(() => {
      void getHintMutation
        .mutateAsync({
          activeSection,
          targetRole: targetRole || null,
        })
        .then((res) => setHint(res.hint))
        .catch(() => setHint(null));
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeSection, targetRole, dismissedHints]);

  useEffect(() => {
    const parsedRoles = (targetRole ?? "")
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
    setSelectedTargetRoles(parsedRoles);
  }, [targetRole]);

  useEffect(() => {
    if (jobTargetSuggestionsMutation.isPending || targetRoleSuggestions.length > 0) {
      return;
    }

    jobTargetSuggestionsMutation.mutate(
      {
        degreeProgram: null,
        yearLevel: null,
        subjects: [],
        certificates: [],
      },
      {
        onSuccess: (result) => {
          setTargetRoleSuggestions((result.suggestions ?? []).map((item) => item.title).filter(Boolean));
        },
      },
    );
  }, [jobTargetSuggestionsMutation, targetRoleSuggestions.length]);

  const syncTargetRoles = (roles: string[]) => {
    const normalized = Array.from(new Set(roles.map((role) => role.trim()).filter(Boolean)));
    setSelectedTargetRoles(normalized);
    setData({ targetRole: normalized.length > 0 ? normalized.join(", ") : null });
  };

  const toggleSuggestedRole = (role: string) => {
    if (selectedTargetRoles.includes(role)) {
      syncTargetRoles(selectedTargetRoles.filter((item) => item !== role));
      return;
    }
    syncTargetRoles([...selectedTargetRoles, role]);
  };

  const addCustomRole = () => {
    const role = customTargetRole.trim();
    if (!role) {
      return;
    }
    syncTargetRoles([...selectedTargetRoles, role]);
    setCustomTargetRole("");
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-[#0A0A0A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="size-5 text-[#00CEC8]" />
            Target roles
          </CardTitle>
          <CardDescription>
            Select one or more roles. This is editable here in workspace and saved with your resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {targetRoleSuggestions.length > 0 ? (
              targetRoleSuggestions.slice(0, 8).map((role) => {
                const selected = selectedTargetRoles.includes(role);
                return (
                  <Button
                    key={role}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    className={selected ? "bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}
                    onClick={() => toggleSuggestedRole(role)}
                  >
                    {selected && <Check className="size-3.5" />}
                    {role}
                  </Button>
                );
              })
            ) : (
              <span className="text-xs text-white/50">
                {jobTargetSuggestionsMutation.isPending ? "Loading role suggestions..." : "No role suggestions available yet."}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={customTargetRole}
              onChange={(event) => setCustomTargetRole(event.target.value)}
              placeholder="Add custom target role"
              className="border-white/10 bg-[#161616] text-white"
            />
            <Button
              type="button"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-[140px]"
              onClick={addCustomRole}
            >
              <Plus className="size-4" />
              Add role
            </Button>
          </div>

          {selectedTargetRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedTargetRoles.map((role) => (
                <Badge key={role} variant="outline" className="gap-1 border-[#00CEC8]/40 bg-[#00CEC8]/10 text-[#00CEC8]">
                  {role}
                  <button
                    type="button"
                    className="ml-1 inline-flex rounded-full p-0.5 hover:bg-[#00CEC8]/20"
                    onClick={() => syncTargetRoles(selectedTargetRoles.filter((item) => item !== role))}
                    aria-label={`Remove ${role}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-[#0A0A0A]">
        <CardHeader>
          <CardTitle className="text-white">Resume template</CardTitle>
          <CardDescription>
            The canvas changes immediately. The editor below only shows the fields needed by the selected template.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select value={selectedTemplateCode} onValueChange={setSelectedTemplateCode}>
            <SelectTrigger className="w-full border-white/10 bg-[#161616] text-white">
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {FIXED_RESUME_TEMPLATES.map((template) => (
                  <SelectItem key={template.code} value={template.code}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="text-sm text-white/60">
            {templateDescriptions[definition.code] ?? "A fixed resume structure with template-specific ordering."}
          </div>

          {definition.code !== "harvard_classic" ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">RGB accent color</p>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={selectedAccentColor}
                  onChange={(event) => setSelectedAccentColor(event.target.value)}
                  className="h-10 w-14 cursor-pointer border-white/10 bg-[#161616] p-1"
                />
                <Input
                  value={hexToRgbLabel(selectedAccentColor)}
                  readOnly
                  className="border-white/10 bg-[#161616] font-mono text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["r", "g", "b"] as const).map((channel) => {
                  const rgb = hexToRgb(selectedAccentColor);

                  return (
                    <label key={channel} className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                      {channel}
                      <Input
                        type="number"
                        min={0}
                        max={255}
                        value={rgb[channel]}
                        onChange={(event) => {
                          const nextValue = clampRgbChannel(event.target.value);
                          setSelectedAccentColor(rgbToHex({ ...rgb, [channel]: nextValue }));
                        }}
                        className="border-white/10 bg-[#161616] text-white"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {getHintMutation.isPending ? (
        <Alert className="border-white/10 bg-[#0A0A0A] text-white">
          <Loader2 className="size-4 animate-spin" />
          <AlertTitle>Generating guidance</AlertTitle>
          <AlertDescription>Preparing a short hint for this section.</AlertDescription>
        </Alert>
      ) : hint && !dismissedHints.has(activeSection) ? (
        <Alert className="border-white/10 bg-[#0A0A0A] text-white">
          <Sparkles className="size-4" />
          <AlertTitle>Writing hint</AlertTitle>
          <AlertDescription className="pr-8 text-white/70">{hint}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-white/50 hover:bg-white/10 hover:text-white"
            onClick={() => setDismissedHints(new Set(dismissedHints).add(activeSection))}
          >
            <X className="size-4" />
          </Button>
        </Alert>
      ) : null}

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={(sections) => {
          setOpenSections(sections);
          const newlyOpened = sections.find((section) => !openSections.includes(section));
          if (newlyOpened) {
            setActiveSection(newlyOpened as EditorSectionId);
            return;
          }

          if (sections.length > 0 && !sections.includes(activeSection)) {
            setActiveSection(sections[sections.length - 1] as EditorSectionId);
          }
        }}
        className="flex flex-col gap-4"
      >
        <AccordionItem value="personal-details" className={getEditorItemClassName(activeSection === "personal-details")}>
          <AccordionTrigger className="cursor-pointer py-6 hover:no-underline">
            <SectionTitle
              icon={<User className="size-5" />}
              title="Personal Details"
              description="Name, contact, location, LinkedIn, and portfolio"
              active={activeSection === "personal-details"}
            />
          </AccordionTrigger>
          <AccordionContent className="pb-8 pt-2">
            <PersonalDetailsForm resumeSqid={resumeSqid} />
          </AccordionContent>
        </AccordionItem>

        <Separator className="bg-white/10" />

        {sectionOrder.map((sectionId) => {
          const meta = sectionMeta[sectionId];
          const title = definition.defaultSectionTitles?.[sectionId] ?? meta.defaultTitle;

          return (
            <AccordionItem key={sectionId} value={sectionId} className={getEditorItemClassName(activeSection === sectionId)}>
              <AccordionTrigger className="cursor-pointer py-6 hover:no-underline">
                <SectionTitle icon={meta.icon} title={title} description={meta.description} active={activeSection === sectionId} />
              </AccordionTrigger>
              <AccordionContent className="pb-8 pt-2">
                {sectionForms[sectionId](resumeSqid)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

function SectionTitle({
  icon,
  title,
  description,
  active,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 text-left">
      <div className={`flex size-10 items-center justify-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/75"}`}>
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>
        <p className="text-xs text-white/60">{description}</p>
      </div>
    </div>
  );
}

function getEditorItemClassName(active: boolean) {
  return [
    "rounded-xl border bg-[#0A0A0A] px-6 transition-colors",
    active ? "border-primary/60 bg-[#0A0A0A]" : "border-white/10 hover:border-primary/35",
  ].join(" ");
}

function hexToRgb(hexColor: string) {
  const sanitized = hexColor.replace("#", "");
  const parsed = Number.parseInt(sanitized.length === 6 ? sanitized : "00cec8", 16);

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function hexToRgbLabel(hexColor: string) {
  const rgb = hexToRgb(hexColor);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function rgbToHex(rgb: { r: number; g: number; b: number }) {
  return `#${[rgb.r, rgb.g, rgb.b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function clampRgbChannel(value: string) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.min(255, Math.max(0, parsed));
}

export default memo(FormEditor);
