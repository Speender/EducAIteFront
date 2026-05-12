import React from "react";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RegistrationStudyLoadPreviewResponseDto } from "@/features/onboarding/api/dto";

interface StudyLoadReviewDialogProps {
  open: boolean;
  isLoading: boolean;
  response?: RegistrationStudyLoadPreviewResponseDto;
  errorMessage?: string;
  fileName?: string;
  onOpenChange: (open: boolean) => void;
  onBackToUpload: () => void;
  onApply: (review: RegistrationStudyLoadPreviewResponseDto) => void;
}

const emptyCourse = {
  edpCode: "",
  courseName: "",
  units: 3,
};

export function StudyLoadReviewDialog({
  open,
  isLoading,
  response,
  errorMessage,
  fileName,
  onOpenChange,
  onBackToUpload,
  onApply,
}: StudyLoadReviewDialogProps) {
  const [draft, setDraft] = React.useState<RegistrationStudyLoadPreviewResponseDto | null>(null);

  React.useEffect(() => {
    if (response) {
      setDraft(response);
    }
  }, [response]);

  const hasError = Boolean(errorMessage);
  const courses = draft?.parseResult.parsedCourses ?? [];
  const validCourseCount = courses.filter((course) => course.edpCode.trim() && course.courseName.trim()).length;
  const canApply = Boolean(draft && validCourseCount > 0 && !isLoading && !hasError);

  const updateStudent = (
    key: keyof RegistrationStudyLoadPreviewResponseDto["suggestedStudent"],
    value: string,
  ) => {
    setDraft((current) => current
      ? {
        ...current,
        suggestedStudent: {
          ...current.suggestedStudent,
          [key]: value,
        },
      }
      : current);
  };

  const updateParseResult = (
    key: keyof RegistrationStudyLoadPreviewResponseDto["parseResult"],
    value: number,
  ) => {
    setDraft((current) => current
      ? {
        ...current,
        parseResult: {
          ...current.parseResult,
          [key]: value,
        },
      }
      : current);
  };

  const updateCourse = (
    index: number,
    key: keyof RegistrationStudyLoadPreviewResponseDto["parseResult"]["parsedCourses"][number],
    value: string,
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const parsedCourses = current.parseResult.parsedCourses.map((course, courseIndex) => {
        if (courseIndex !== index) {
          return course;
        }

        return {
          ...course,
          [key]: key === "units" ? Number(value) || 0 : value,
        };
      });

      return {
        ...current,
        parseResult: {
          ...current.parseResult,
          parsedCourses,
        },
      };
    });
  };

  const addCourse = () => {
    setDraft((current) => current
      ? {
        ...current,
        parseResult: {
          ...current.parseResult,
          parsedCourses: [...current.parseResult.parsedCourses, emptyCourse],
        },
      }
      : current);
  };

  const removeCourse = (index: number) => {
    setDraft((current) => current
      ? {
        ...current,
        parseResult: {
          ...current.parseResult,
          parsedCourses: current.parseResult.parsedCourses.filter((_, courseIndex) => courseIndex !== index),
        },
      }
      : current);
  };

  const applyDraft = () => {
    if (!draft) {
      return;
    }

    const parsedCourses = draft.parseResult.parsedCourses
      .map((course) => ({
        edpCode: course.edpCode.trim(),
        courseName: course.courseName.trim(),
        units: Number(course.units) || 0,
      }))
      .filter((course) => course.edpCode && course.courseName);

    if (parsedCourses.length === 0) {
      return;
    }

    onApply({
      ...draft,
      suggestedStudent: {
        firstName: draft.suggestedStudent.firstName.trim(),
        middleName: draft.suggestedStudent.middleName.trim(),
        lastName: draft.suggestedStudent.lastName.trim(),
        studentIdNumber: draft.suggestedStudent.studentIdNumber.trim(),
        program: draft.suggestedStudent.program.trim(),
        schoolEducation: draft.suggestedStudent.schoolEducation.trim(),
      },
      parseResult: {
        ...draft.parseResult,
        parsedCourses,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden border-white/10 bg-[#111111] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-h-[92dvh] sm:max-w-5xl"
      >
        <DialogHeader className="border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="min-w-0">
                <DialogTitle className="text-xl font-semibold text-white">
                  {hasError ? "Study load review failed" : "Review extracted study load"}
                </DialogTitle>
                <DialogDescription className="mt-2 text-white/60">
                  {isLoading
                    ? "Scanning your PDF before the registration form is completed."
                    : "Edit the detected profile and courses, then apply them to registration."}
                </DialogDescription>
              </div>
            </div>
            {isLoading || hasError ? (
              <Badge variant={isLoading ? "info" : "destructive"} className="w-fit">
                {isLoading ? "Parsing" : "Needs attention"}
              </Badge>
            ) : null}
          </div>
        </DialogHeader>

        <div className="modern-dark-scrollbar flex min-h-0 flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Uploaded PDF</p>
              <p className="truncate text-sm text-white/55">{fileName ?? "Study load document"}</p>
            </div>
          </div>

          {hasError ? (
            <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
              <AlertCircle />
              <AlertTitle>We could not finish parsing this study load.</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {!hasError ? (
            <>
              <div className="rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">
                <p className="font-semibold text-yellow-200">Double-check the AI extraction</p>
                <p className="mt-1 text-yellow-100/80">
                  AI can make mistakes when reading a study load. Please review the student details and courses before applying them.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <EditableField
                  label="First name"
                  value={draft?.suggestedStudent.firstName ?? ""}
                  isLoading={isLoading}
                  onChange={(value) => updateStudent("firstName", value)}
                />
                <EditableField
                  label="Middle name"
                  value={draft?.suggestedStudent.middleName ?? ""}
                  isLoading={isLoading}
                  onChange={(value) => updateStudent("middleName", value)}
                />
                <EditableField
                  label="Last name"
                  value={draft?.suggestedStudent.lastName ?? ""}
                  isLoading={isLoading}
                  onChange={(value) => updateStudent("lastName", value)}
                />
                <EditableField
                  label="School ID"
                  value={draft?.suggestedStudent.studentIdNumber ?? ""}
                  isLoading={isLoading}
                  onChange={(value) => updateStudent("studentIdNumber", value)}
                />
                <EditableField
                  label="Program"
                  value={draft?.suggestedStudent.program ?? ""}
                  isLoading={isLoading}
                  onChange={(value) => updateStudent("program", value)}
                />
                <EditableField
                  label="School education"
                  value={draft?.suggestedStudent.schoolEducation ?? ""}
                  isLoading={isLoading}
                  onChange={(value) => updateStudent("schoolEducation", value)}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <EditableNumberField
                  label="Semester"
                  value={draft?.parseResult.parsedSemester ?? 1}
                  isLoading={isLoading}
                  onChange={(value) => updateParseResult("parsedSemester", value)}
                />
                <EditableNumberField
                  label="School year start"
                  value={draft?.parseResult.parsedSchoolYearStart ?? new Date().getFullYear()}
                  isLoading={isLoading}
                  onChange={(value) => updateParseResult("parsedSchoolYearStart", value)}
                />
                <EditableNumberField
                  label="School year end"
                  value={draft?.parseResult.parsedSchoolYearEnd ?? new Date().getFullYear() + 1}
                  isLoading={isLoading}
                  onChange={(value) => updateParseResult("parsedSchoolYearEnd", value)}
                />
              </div>

              <div className="min-h-0 rounded-xl border border-white/10">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Detected courses</h3>
                    <p className="text-xs text-white/50">
                      {isLoading ? "Waiting for AI extraction." : `${courses.length} subject${courses.length === 1 ? "" : "s"} ready for review.`}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading || !draft}
                    onClick={addCourse}
                    className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <Plus data-icon="inline-start" />
                    Add course
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="w-[150px] px-4 text-white/55">EDP code</TableHead>
                      <TableHead className="text-white/55">Course</TableHead>
                      <TableHead className="w-[110px] text-white/55">Units</TableHead>
                      <TableHead className="w-[70px] text-right text-white/55"> </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? <LoadingCourseRows /> : null}
                    {!isLoading && courses.length === 0 ? (
                      <TableRow className="border-white/10 hover:bg-white/[0.03]">
                        <TableCell colSpan={4} className="h-24 px-4 text-center text-white/55">
                          No courses were returned. Add the courses manually before applying.
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {!isLoading
                      ? courses.map((course, index) => (
                          <TableRow key={index} className="border-white/10 hover:bg-white/[0.03]">
                            <TableCell className="px-4">
                              <Input
                                value={course.edpCode}
                                onChange={(event) => updateCourse(index, "edpCode", event.target.value)}
                                className="border-white/10 bg-black/40 text-white"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={course.courseName}
                                onChange={(event) => updateCourse(index, "courseName", event.target.value)}
                                className="border-white/10 bg-black/40 text-white"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={0}
                                value={course.units}
                                onChange={(event) => updateCourse(index, "units", event.target.value)}
                                className="border-white/10 bg-black/40 text-white"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCourse(index)}
                                aria-label="Remove course"
                                className="text-white/70 hover:bg-white/10 hover:text-white"
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 gap-3 border-t border-white/10 bg-white/[0.03] px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-4">
          <Button
            variant="outline"
            onClick={onBackToUpload}
            disabled={isLoading}
            className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
          >
            Back to upload
          </Button>
          <Button
            onClick={applyDraft}
            disabled={!canApply}
            className="w-full bg-white text-[#111111] hover:bg-white/90 disabled:bg-white/40 disabled:text-[#111111]/60 sm:w-auto"
          >
            {isLoading ? <Spinner data-icon="inline-start" /> : null}
            {isLoading ? "Parsing study load..." : "Apply to registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditableFieldProps {
  label: string;
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
}

function EditableField({ label, value, isLoading, onChange }: EditableFieldProps) {
  return (
    <label className="flex min-h-20 flex-col justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <span className="text-xs font-medium text-white/45">{label}</span>
      {isLoading ? (
        <Skeleton className="h-9 w-full bg-white/10" />
      ) : (
        <Input value={value} onChange={(event) => onChange(event.target.value)} className="border-white/10 bg-black/40 text-white" />
      )}
    </label>
  );
}

interface EditableNumberFieldProps {
  label: string;
  value: number;
  isLoading: boolean;
  onChange: (value: number) => void;
}

function EditableNumberField({ label, value, isLoading, onChange }: EditableNumberFieldProps) {
  return (
    <label className="flex min-h-20 flex-col justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <span className="text-xs font-medium text-white/45">{label}</span>
      {isLoading ? (
        <Skeleton className="h-9 w-full bg-white/10" />
      ) : (
        <Input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          className="border-white/10 bg-black/40 text-white"
        />
      )}
    </label>
  );
}

function LoadingCourseRows() {
  return Array.from({ length: 4 }).map((_, index) => (
    <TableRow key={index} className="border-white/10 hover:bg-transparent">
      <TableCell className="px-4">
        <Skeleton className="h-9 w-full bg-white/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-9 w-full bg-white/10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-9 w-full bg-white/10" />
      </TableCell>
      <TableCell />
    </TableRow>
  ));
}
