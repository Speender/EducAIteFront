import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useResumeList,
  useStudentResumeContext,
  useCreateStudentModeResume,
} from "../api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  RefreshCw,
  GraduationCap,
  AlertCircle,
  FileText,
} from "lucide-react";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const ResumeDashboard = () => {
  const navigate = useNavigate();

  const { mutate: createStudentResume, isPending: isCreatingStudent } = useCreateStudentModeResume();
  const { data: existingResumes, isLoading: isLoadingResumes, refetch, isFetching } = useResumeList();
  const { data: studentContext, isLoading: isLoadingContext, isError: isContextError } = useStudentResumeContext();

  const [activeTab, setActiveTab] = useState<"create" | "existing">("create");
  const hasExistingResumes = (existingResumes?.items.length ?? 0) > 0;

  const existingResumeCards = useMemo(() => {
    return existingResumes?.items ?? [];
  }, [existingResumes]);



  const handleCreateStudentMode = () => {
    const title = `Student Resume ${new Date().toLocaleDateString()}`;

    createStudentResume(
      { title },
      {
        onSuccess: (data) => {
          navigate(`/resume/${data.resumeSqid}?mode=student`);
        },
      },
    );
  };

  const handleOpenResume = (resumeSqid: string) => {
    navigate(`/resume/${resumeSqid}`);
  };

  const handleFindJobs = (resumeSqid: string) => {
    navigate(`/resume/${resumeSqid}?jobs=1`);
  };

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-28 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center space-y-8">
        <PageHeader />

        <ResumeModeToggle activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "create" ? (
          <div className="w-full space-y-6">
            <ResumeOptionCard
              isLoadingContext={isLoadingContext}
              isContextError={isContextError}
              isCreatingStudent={isCreatingStudent}
              degreeProgram={studentContext?.degreeProgram ?? ""}
              onStart={handleCreateStudentMode}
            />

          </div>
        ) : (
          <Card className="w-full border-white/10 bg-zinc-950 text-white">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">Existing Resumes</CardTitle>
                <CardDescription className="text-zinc-400">
                  Open an existing resume and continue editing.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="border-[#00CEC8]/40 bg-[#00CEC8]/10 text-[#00CEC8] hover:bg-[#00CEC8]/20"
              >
                {isFetching ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <RefreshCw data-icon="inline-start" />}
                Refresh
              </Button>
            </CardHeader>

            <Separator className="bg-white/10" />

            <CardContent className="p-0">
              <ScrollArea className="h-[460px]">
                <div className="space-y-3 p-4">
                  {isLoadingResumes && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Loader2 className="mb-3 size-7 animate-spin text-[#00CEC8]" />
                      <p className="text-sm text-zinc-400">Loading resumes...</p>
                    </div>
                  )}

                  {!isLoadingResumes && !hasExistingResumes && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
                      <FileText className="mb-3 size-8 text-zinc-500" />
                      <p className="text-base text-white">No saved resumes yet</p>
                      <p className="mt-1 text-sm text-zinc-400">Create your first resume from Create New.</p>
                    </div>
                  )}

                  {existingResumeCards.map((resume) => (
                    <Card
                      key={resume.resumeSqid}
                      className="border-white/10 bg-zinc-900/50 transition-colors hover:border-[#00CEC8]/40 hover:bg-zinc-900"
                    >
                      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() => handleOpenResume(resume.resumeSqid)}
                          className="min-w-0 flex-1 space-y-2 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-white">{resume.title}</h3>
                            <Badge className="border-[#00CEC8]/30 bg-[#00CEC8]/10 text-[10px] uppercase tracking-wider text-[#00CEC8]">
                              {resume.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />
                              Created {formatDateTime(resume.createdAt)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />
                              Updated {formatDateTime(resume.updatedAt)}
                            </span>
                          </div>
                        </button>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleFindJobs(resume.resumeSqid)}
                            className="border-[#00CEC8]/40 bg-[#00CEC8]/10 text-[#00CEC8] hover:bg-[#00CEC8]/20"
                          >
                            <BriefcaseBusiness data-icon="inline-start" className="size-4" />
                            Find Jobs
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenResume(resume.resumeSqid)}
                            className="text-[#00CEC8] hover:bg-[#00CEC8]/10 hover:text-[#00CEC8]"
                          >
                            Open
                            <ChevronRight data-icon="inline-end" className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

function PageHeader() {
  return (
    <header className="space-y-4 text-center">
      <Badge className="border-[#00CEC8]/20 bg-[#00CEC8]/10 text-[#00CEC8]">Resume Builder</Badge>
      <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Build Your Future</h1>
      <p className="text-sm text-zinc-400">Start fresh or continue from an existing resume.</p>
    </header>
  );
}

function ResumeModeToggle({
  activeTab,
  onChange,
}: {
  activeTab: "create" | "existing";
  onChange: (value: "create" | "existing") => void;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/60 p-1">
      <div className="grid grid-cols-2 gap-1">
        <Button
          variant="ghost"
          onClick={() => onChange("create")}
          className={activeTab === "create" ? "bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90" : "text-zinc-300 hover:bg-zinc-800"}
        >
          Create New
        </Button>
        <Button
          variant="ghost"
          onClick={() => onChange("existing")}
          className={activeTab === "existing" ? "bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90" : "text-zinc-300 hover:bg-zinc-800"}
        >
          Use Existing
        </Button>
      </div>
    </div>
  );
}

function ResumeOptionCard({
  isLoadingContext,
  isContextError,
  isCreatingStudent,
  degreeProgram,
  onStart,
}: {
  isLoadingContext: boolean;
  isContextError: boolean;
  isCreatingStudent: boolean;
  degreeProgram: string;
  onStart: () => void;
}) {
  const normalizedDegreeProgram = degreeProgram.trim();
  const showDegreeProgram = normalizedDegreeProgram.length > 0 && normalizedDegreeProgram !== "0";

  return (
    <Card className="w-full overflow-hidden rounded-3xl border-white/10 bg-zinc-950 text-white">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-zinc-900 sm:size-14">
                <GraduationCap className="size-6 text-[#00CEC8] sm:size-7" />
              </span>
              Student resume
            </CardTitle>
            <CardDescription className="mt-2 pl-[3.75rem] text-base text-zinc-400 sm:pl-[4.5rem]">
              Create a resume using your academic profile and study load.
            </CardDescription>
          </div>

         <Button
          size="sm"
          onClick={onStart}
          disabled={isCreatingStudent || isLoadingContext}
          className="h-9 w-full rounded-xl bg-[#00CEC8] px-4 text-sm font-semibold tracking-tight text-black hover:bg-[#00CEC8]/90 md:h-10 md:w-[100px] md:px-4 md:text-sm"
        >
          {isCreatingStudent ? (
            <>
              <Loader2 className="mr-1 size-3 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <span>Start</span>
              <ArrowRight data-icon="inline-end" className="size-4" />
            </>
          )}
        </Button>
        </div>
      </CardHeader>

      {(isLoadingContext || isContextError || showDegreeProgram) && (
        <CardContent className="px-4 pb-5 pt-0 text-sm text-zinc-300 sm:px-6">
          {isLoadingContext ? (
            <div className="space-y-2 pl-[3.75rem] sm:pl-[4.5rem]">
              <Skeleton className="h-4 w-48 bg-white/10" />
              <Skeleton className="h-4 w-36 bg-white/10" />
            </div>
          ) : isContextError ? (
            <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
              <AlertCircle className="size-4" />
              <AlertTitle>Cannot load context</AlertTitle>
              <AlertDescription>Failed to retrieve your student profile.</AlertDescription>
            </Alert>
          ) : (
            <p className="pl-[3.75rem] sm:pl-[4.5rem]">{normalizedDegreeProgram}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}





export default ResumeDashboard;
