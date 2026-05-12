import { useState, useRef, useEffect, useDeferredValue, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useResumeStore } from "../hooks/useResumeStore";
import { resumeService } from "../api/service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ToastProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Save,
  History,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize,
  AlertTriangle,
  FileText,
  Eye,
  Search,
  Loader2,
  HelpCircle,
} from "lucide-react";
import {
  type ResumeReviewResponseDto,
} from "../api/dto";
import FormEditor from "./FormEditor";
import ResumePreview from "./ResumePreview";
import ResumeHistory from "./ResumeHistory";
import AiTailorModal from "./AiTailorModal";
import JobTargetRecommendations from "./JobTargetRecommendations";
import CompanyRecommendationsModal from "./CompanyRecommendationsModal";
import { normalizeDateOnly } from "../lib/date";

interface ResumeWorkspaceProps {
  resumeSqid: string;
}

const ResumeWorkspace = ({ resumeSqid }: ResumeWorkspaceProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isStudentMode = searchParams.get("mode") === "student";
  const [activeMobileTab, setActiveMobileTab] = useState<"editor" | "preview">("editor");
  const [studentWizardStep, setStudentWizardStep] = useState<"jobTarget" | "done">(
    isStudentMode ? "jobTarget" : "done"
  );

  const title = useResumeStore((state) => state.data.title);
  const completeness = useResumeStore((state) => state.data.completeness);
  
  const setInitialData = useResumeStore((state) => state.setInitialData);
  const { showSuccess } = useToast();
  const [showHistory, setShowHistory] = useState(false);
  const [isTailorOpen, setIsTailorOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(() => searchParams.get("jobs") === "1");
  const [isSaving, setIsSaving] = useState(false);

  // --- Scaling & Zoom Logic ---
  const [zoom, setZoom] = useState(0.85);
  const [autoScale, setAutoScale] = useState(true);
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "neutral" | "light">("dark");
  const [isExamplePreviewOpen, setIsExamplePreviewOpen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const mobilePreviewContainerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const isComplete = completeness?.isComplete ?? true;
  const missingFields = completeness?.missingRequiredFields || [];

  useEffect(() => {
    if (!isStudentMode) {
      setStudentWizardStep("done");
    }
  }, [isStudentMode]);

  useEffect(() => {
    if (searchParams.get("jobs") === "1") {
      setIsRecommendationsOpen(true);
    }
  }, [searchParams]);

  const calculateAutoScale = useCallback(() => {
    const isDesktopViewport = window.innerWidth >= 1024;
    const container = isDesktopViewport
      ? previewContainerRef.current
      : activeMobileTab === "preview"
        ? mobilePreviewContainerRef.current
        : null;

    if (!container || !autoScale) return;

    const padding = isDesktopViewport ? 64 : 24;
    const availableWidth = container.clientWidth - padding;
    const resumeWidth = 794; // Fixed A4 width

    const newScale = Math.max(0.38, Math.min(availableWidth / resumeWidth, 1.2));
    setZoom(newScale);
  }, [activeMobileTab, autoScale]);

  useEffect(() => {
    const handleResize = () => {
      if (autoScale) {
        calculateAutoScale();
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial call to set correct scale on mount
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, [activeMobileTab, autoScale, calculateAutoScale]);

  const handleManualZoom = (delta: number) => {
    setAutoScale(false);
    setZoom((prev) => Math.max(0.4, Math.min(prev + delta, 2.0)));
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    const data = useResumeStore.getState().data;

    try {
      await resumeService.upsertFixedResume(resumeSqid, toUpsertResumeRequest(data));

      await resumeService.saveVersion(resumeSqid, "Manual save via Editor");

      const latestReview = await resumeService.getResumeReview(resumeSqid);
      setInitialData(latestReview);
      showSuccess("Resume version saved.");
    } catch (error) {
      console.error(error);
      showSuccess("Failed to save the latest resume changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (showHistory) {
    return <ResumeHistory resumeSqid={resumeSqid} onBack={() => setShowHistory(false)} />;
  }

  if (studentWizardStep === "jobTarget") {
    return (
      <div className="min-h-screen bg-[#000000] text-white pt-20 lg:pt-32">
        <JobTargetRecommendations 
          resumeSqid={resumeSqid} 
          onComplete={() => {
            setStudentWizardStep("done");
            setSearchParams({});
          }} 
        />
      </div>
    );
  }

  const PreviewPane = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) => {
    const data = useResumeStore((state) => state.data);
    const deferredPreviewData = useDeferredValue(data);

    return (
      <div
        ref={containerRef}
        className={`relative w-full ${getCanvasClassName(canvasTheme)}`}
      >
        <div className="flex w-full justify-end px-3 pt-3 lg:px-6">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111]/95 p-1.5 shadow-2xl backdrop-blur-xl">
            <Select value={canvasTheme} onValueChange={(value) => setCanvasTheme(value as "dark" | "neutral" | "light")}>
              <SelectTrigger className="h-9 w-[126px] cursor-pointer border-white/10 bg-transparent text-xs text-white/80">
                <SelectValue placeholder="Canvas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="dark">Dark canvas</SelectItem>
                  <SelectItem value="neutral">Neutral canvas</SelectItem>
                  <SelectItem value="light">Light canvas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="h-5 w-px bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="h-9 cursor-pointer px-3 text-xs text-white/70 hover:bg-primary/10 hover:text-primary"
              onClick={() => setIsExamplePreviewOpen(true)}
              title="Show an example completed resume"
            >
              <HelpCircle className="mr-1 w-4 h-4" />
              Example
            </Button>
            <div className="h-5 w-px bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 cursor-pointer text-white/70 hover:bg-primary/10 hover:text-primary"
              onClick={() => handleManualZoom(-0.1)}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="w-10 text-center font-mono text-[10px] text-white/40">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 cursor-pointer text-white/70 hover:bg-primary/10 hover:text-primary"
              onClick={() => handleManualZoom(0.1)}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="h-5 w-px bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 cursor-pointer ${autoScale ? "bg-primary/10 text-primary" : "text-white/70 hover:bg-primary/10 hover:text-primary"}`}
              onClick={() => {
                setAutoScale(true);
                calculateAutoScale();
              }}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex min-h-full w-full flex-col items-center px-6 pb-16 pt-16 lg:px-10 lg:pt-20">
          {(!isComplete || missingFields.length > 0) && (
            <Alert variant="destructive" className="mb-6 w-full max-w-[794px] border-yellow-500/50 bg-yellow-500/10 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Resume Incomplete</AlertTitle>
              <AlertDescription>
                {missingFields.length > 0
                  ? `Please complete the following required sections: ${missingFields.join(", ")}`
                  : "Your resume is missing some required details before it can be finalized."}
              </AlertDescription>
            </Alert>
          )}

          <div
            className="relative shrink-0"
            style={{
              height: 1123 * zoom,
              width: 794 * zoom,
            }}
          >
            <div
              ref={resumeRef}
              className="absolute left-0 top-0 origin-top-left shadow-2xl transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${zoom})`,
                height: 1123,
                width: 794,
              }}
            >
              <ResumePreview data={deferredPreviewData} />
            </div>
          </div>
        </div>

        <ExamplePreviewDialog
          open={isExamplePreviewOpen}
          onOpenChange={setIsExamplePreviewOpen}
          data={data}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] pt-24 lg:pt-28">
      {/* Workspace Header */}
      <header className="border-b border-white/10 bg-[#0A0A0A]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex min-w-0 items-center gap-4">
            <h1 className="text-base lg:text-lg font-bold text-white truncate max-w-[180px] sm:max-w-[300px] lg:max-w-md">
              {title || "Untitled Resume"}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-[9px] lg:text-[10px] uppercase tracking-widest px-2 py-0 bg-[#00CEC8]/10 text-[#00CEC8] border-[#00CEC8]/20 font-bold whitespace-nowrap rounded-md">
                Draft
              </Badge>
              {isComplete && (
                <Badge variant="outline" className="text-[9px] lg:text-[10px] uppercase tracking-widest px-2 py-0 bg-green-500/10 text-green-500 border-green-500/20 font-bold whitespace-nowrap rounded-md">
                  Ready
                </Badge>
              )}
            </div>
          </div>

          <div className="col-span-2 -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide lg:col-span-1 lg:mx-0 lg:justify-self-end lg:px-0 lg:pb-0 lg:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 cursor-pointer text-white/70 hover:bg-primary/10 hover:text-primary whitespace-nowrap lg:flex"
              onClick={() => setShowHistory(true)}
            >
              <History className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">History</span>
            </Button>

            <div className="w-px h-5 bg-primary/20 mx-1 hidden lg:block" />

            <Button
              variant="outline"
              size="sm"
              className="h-10 cursor-pointer border-primary/40 bg-primary/10 px-4 text-primary hover:border-primary/70 hover:bg-primary/15 whitespace-nowrap"
              onClick={() => setIsTailorOpen(true)}
            >
              <Sparkles className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">Tailor AI</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-10 cursor-pointer border-primary/40 bg-primary/10 px-4 text-primary hover:border-primary/70 hover:bg-primary/15 whitespace-nowrap"
              onClick={() => setIsRecommendationsOpen(true)}
            >
              <Search className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">Find Jobs</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="hidden h-10 cursor-pointer border-white/10 bg-white/5 px-4 text-white hover:border-primary/40 hover:bg-primary/10 whitespace-nowrap sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Download</span>
            </Button>

            <Button
              size="lg"
              className="h-11 cursor-pointer px-5 text-base font-bold whitespace-nowrap"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin lg:mr-2" />
              ) : (
                <Save className="w-4 h-4 lg:mr-2" />
              )}
              <span className="hidden lg:inline">{isSaving ? "Saving..." : "Save Version"}</span>
              <span className="lg:hidden">Save</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="w-full">
        {/* Mobile View: Tabs */}
        <div className="w-full lg:hidden">
          <Tabs
            value={activeMobileTab}
            onValueChange={(value) => setActiveMobileTab(value as "editor" | "preview")}
            className="w-full"
          >
            <TabsList className="h-13 w-full justify-start rounded-none border-b border-white/10 bg-[#0A0A0A] p-0">
              <TabsTrigger
                value="editor"
                className="h-full flex-1 cursor-pointer rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                onClick={() => {
                  setActiveMobileTab("editor");
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="h-full flex-1 cursor-pointer rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                onClick={() => {
                  setActiveMobileTab("preview");
                  setTimeout(() => {
                    setAutoScale(true);
                    calculateAutoScale();
                  }, 50);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
                {!isComplete && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-yellow-500" />
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="m-0 p-0">
              <div className="p-4 pb-28">
                <FormEditor resumeSqid={resumeSqid} />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="m-0 p-0">
              <PreviewPane containerRef={mobilePreviewContainerRef} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop View: Side-by-side */}
        <div className="hidden items-start lg:grid lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[460px_minmax(0,1fr)] 2xl:grid-cols-[500px_minmax(0,1fr)]">
          <aside className="@container border-r border-white/10 bg-[#0A0A0A]">
            <div className="p-6 pb-32 xl:p-8">
              <FormEditor resumeSqid={resumeSqid} />
            </div>
          </aside>

          <main className="relative bg-black/40 min-h-[calc(100vh-112px)]">
            <PreviewPane containerRef={previewContainerRef} />
          </main>
        </div>
      </div>

      <AiTailorModal
        resumeSqid={resumeSqid}
        isOpen={isTailorOpen}
        onOpenChange={setIsTailorOpen}
      />

      <CompanyRecommendationsModal
        resumeSqid={resumeSqid}
        isOpen={isRecommendationsOpen}
        onOpenChange={setIsRecommendationsOpen}
      />
    </div>
  );
};

function getCanvasClassName(canvasTheme: "dark" | "neutral" | "light") {
  if (canvasTheme === "light") {
    return "bg-muted";
  }

  if (canvasTheme === "neutral") {
    return "bg-[#161616]";
  }

  return "bg-black/40";
}

function toUpsertResumeRequest(data: Partial<ResumeReviewResponseDto>) {
  return {
    title: data.title || "Untitled Resume",
    targetRole: data.targetRole || null,
    header: data.personalDetails
      ? {
          firstName: data.personalDetails.firstName || "",
          lastName: data.personalDetails.lastName || "",
          middleName: data.personalDetails.middleName || "",
          email: data.personalDetails.email || "",
          phoneNumber: data.personalDetails.phoneNumber || "",
          location: [
            data.personalDetails.city,
            data.personalDetails.provinceState,
            data.personalDetails.country,
          ]
            .filter(Boolean)
            .join(", "),
          linkedInUrl: data.personalDetails.linkedInUrl || "",
          portfolioUrl: data.personalDetails.portfolioUrl || "",
        }
      : null,
    summary: data.summary?.summaryText || null,
    education: (data.education || []).map((education) => ({
      schoolName: education.schoolName,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy || "",
      location: education.location || "",
      startDate: normalizeDateOnly(education.startDate),
      endDate: education.isCurrent ? null : normalizeDateOnly(education.endDate) || null,
      isCurrent: education.isCurrent,
      description: education.description || "",
    })),
    experience: (data.employmentHistory || []).map((employment) => ({
      companyName: employment.companyName,
      positionTitle: employment.positionTitle,
      location: employment.location || "",
      startDate: normalizeDateOnly(employment.startDate),
      endDate: employment.isCurrent ? null : normalizeDateOnly(employment.endDate) || null,
      isCurrent: employment.isCurrent,
      responsibilities: (employment.responsibilities || []).map((item) => item.trim()).filter(Boolean),
    })),
    leadershipActivities: (data.leadershipActivities || []).map((activity) => ({
      organizationName: activity.organizationName,
      roleTitle: activity.roleTitle,
      location: activity.location || "",
      startDate: normalizeDateOnly(activity.startDate),
      endDate: activity.isCurrent ? null : normalizeDateOnly(activity.endDate) || null,
      isCurrent: activity.isCurrent,
      highlights: (activity.highlights || []).map((item) => item.trim()).filter(Boolean),
    })),
    awardsAndCertifications: (data.certificates || []).map((certificate) => ({
      certificationSqid: certificate.certificationSqid,
    })),
    skillsAndInterests: {
      technicalSkills: (data.skillsAndInterests?.technicalSkills || []).map((item) => item.trim()).filter(Boolean),
      languages: (data.skillsAndInterests?.languages || []).map((item) => item.trim()).filter(Boolean),
      interests: (data.skillsAndInterests?.interests || []).map((item) => item.trim()).filter(Boolean),
    },
  };
}

function ExamplePreviewDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Partial<import("../api/dto").ResumeReviewResponseDto>;
}) {
  const [exampleZoom, setExampleZoom] = useState(0.72);
  const examplePreviewData = useMemo(() => buildExamplePreviewData(data), [data]);

  const handleExampleZoom = (delta: number) => {
    setExampleZoom((prev) => Math.max(0.45, Math.min(prev + delta, 1.2)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92vh] max-h-[92vh] flex-col overflow-hidden border-white/10 bg-[#0A0A0A] p-0 text-white sm:max-w-[920px]">
        <div className="shrink-0 border-b border-white/10 bg-[#0A0A0A]/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <HelpCircle className="size-5 text-primary" />
                Completed resume example
              </DialogTitle>
              <DialogDescription className="text-white/60">
                This is only a sample view of a completed resume. It does not save to your fields or replace your current canvas.
              </DialogDescription>
            </DialogHeader>
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-[#111] p-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 cursor-pointer text-white/70 hover:bg-primary/10 hover:text-primary"
                onClick={() => handleExampleZoom(-0.08)}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-mono text-[10px] text-white/50">
                {Math.round(exampleZoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 cursor-pointer text-white/70 hover:bg-primary/10 hover:text-primary"
                onClick={() => handleExampleZoom(0.08)}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 cursor-pointer px-3 text-xs text-white/70 hover:bg-primary/10 hover:text-primary"
                onClick={() => setExampleZoom(0.72)}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden bg-black/40 px-4 py-8">
          <div className="flex h-full w-full items-start justify-center overflow-auto">
            <div
              className="relative shrink-0"
              style={{
                height: 1123 * exampleZoom,
                width: 794 * exampleZoom,
              }}
            >
              <div
                className="absolute left-0 top-0 origin-top-left shadow-2xl"
                style={{
                  transform: `scale(${exampleZoom})`,
                  height: 1123,
                  width: 794,
                }}
              >
                <ResumePreview data={examplePreviewData} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function buildExamplePreviewData(data: Partial<import("../api/dto").ResumeReviewResponseDto>) {
  return {
    ...data,
    personalDetails: {
      firstName: "Alex",
      lastName: "Reyes",
      middleName: null,
      email: "alex.reyes@email.com",
      phoneNumber: "+63 912 345 6789",
      addressLine1: "Quezon City",
      addressLine2: null,
      city: "Quezon City",
      provinceState: "Metro Manila",
      country: "Philippines",
      postalCode: "1100",
      linkedInUrl: null,
      portfolioUrl: null,
    },
    summary: {
      summaryText: "Computer Science student focused on software engineering, data analysis, and practical product delivery for entry-level technology roles.",
    },
    education: [
      {
        educationSqid: "example-education",
        schoolName: "EDUCAITE UNIVERSITY",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        location: "Manila, Philippines",
        startDate: "2022-08-01",
        endDate: "2026-05-01",
        isCurrent: true,
        description: "Relevant coursework: Web Development, Database Systems, Software Engineering, Data Structures.",
        orderIndex: 0,
      },
    ],
    employmentHistory: [
      {
        employmentSqid: "example-experience",
        companyName: "Campus Innovation Lab",
        positionTitle: "Student Developer Intern",
        location: "Remote",
        startDate: "2025-06-01",
        endDate: "2025-09-01",
        isCurrent: false,
        responsibilities: [
          "Built reusable React components for a student-facing academic planning dashboard.",
          "Improved form validation and reduced incomplete submissions by clarifying required fields.",
        ],
        orderIndex: 0,
      },
    ],
    leadershipActivities: [
      {
        leadershipActivitySqid: "example-leadership",
        organizationName: "Computer Science Society",
        roleTitle: "Project Lead",
        location: "Manila, Philippines",
        startDate: "2024-08-01",
        endDate: null,
        isCurrent: true,
        highlights: [
          "Led a five-member team organizing peer coding workshops for first-year students.",
        ],
        orderIndex: 0,
      },
    ],
    awardsAndCertifications: [
      {
        certificationSqid: "example-certification",
        achievementName: "Responsive Web Design Certification",
        institution: "FreeCodeCamp",
        issuedDate: "2025-03-01",
        schoolYear: null,
        gradeOrScore: null,
        description: null,
        tags: ["HTML", "CSS", "Accessibility"],
      },
    ],
    certificates: [],
    skillsAndInterests: {
      technicalSkills: ["React", "TypeScript", "C#", "SQL", "Git"],
      languages: ["English", "Filipino"],
      interests: ["Hackathons", "UI design", "Volunteer teaching"],
    },
  };
}

export default ResumeWorkspace;
