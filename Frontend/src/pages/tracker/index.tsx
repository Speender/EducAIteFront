import React, { useMemo, useState } from 'react'

import { useToast } from '@/components/ToastProvider';
import Logo from '../../components/Logo';
import { useCurrentStudentQuery } from '@/features/auth/api/hooks';
import { useGradeTrackerQuery, useUpdateTrackerGradeMutation } from '@/features/tracker/api/hooks';
import { getErrorMessage } from '@/lib/api/errors';

import Header from './components/Header'
import DropdownSemester from './components/DropdownSemester'
import Table, { type GradeBatchUpdate } from './components/Table'

const Tracker: React.FC = () => {
    const { showSuccess } = useToast();
    const currentStudentQuery = useCurrentStudentQuery();
    const trackerQuery = useGradeTrackerQuery();
    const updateGradeMutation = useUpdateTrackerGradeMutation();

    const [currentSem, setCurrentSem] = useState<string>("");

    const selectedSemesterLabel = useMemo(() => {
        const semesters = trackerQuery.data?.semesters ?? [];
        const hasMatch = semesters.some((semester) => semester.displayLabel === currentSem);

        return hasMatch ? currentSem : semesters[0]?.displayLabel ?? "";
    }, [currentSem, trackerQuery.data]);

    const currentSemester = useMemo(
        () => trackerQuery.data?.semesters.find((semester) => semester.displayLabel === selectedSemesterLabel) ?? null,
        [selectedSemesterLabel, trackerQuery.data],
    );

    const tableData = useMemo(
        () =>
            (currentSemester?.courses ?? []).map((course) => ({
                studentCourseSqid: course.studentCourseSqid,
                course: course.courseName,
                units: course.units,
                midtermGrade: course.midtermGrade ?? null,
                finalGrade: course.finalGrade ?? null,
                finalRemarks: course.finalRemarks ?? "-",
            })),
        [currentSemester],
    );

    const handleSemSelection = (value: string) => {
        setCurrentSem(value);
    }

    const handleSaveGrades = async (updates: GradeBatchUpdate[]) => {
        const changedGradeEntries = updates.flatMap((update) => [
            {
                studentCourseSqid: update.studentCourseSqid,
                gradeType: "MIDTERM" as const,
                gradeValue: update.midtermGrade,
            },
            {
                studentCourseSqid: update.studentCourseSqid,
                gradeType: "FINAL" as const,
                gradeValue: update.finalGrade,
            },
        ]);

        await Promise.all(
            changedGradeEntries.map((entry) =>
                updateGradeMutation.mutateAsync({
                    studentCourseSqid: entry.studentCourseSqid,
                    gradeType: entry.gradeType,
                    payload: {
                        gradeValue: entry.gradeValue,
                    },
                }),
            ),
        );

        showSuccess(`Saved ${updates.length} course${updates.length === 1 ? "" : "s"} successfully.`);
    };

    const studentName = currentStudentQuery.data?.firstName ?? "Student";
    const semesterSelections = trackerQuery.data?.semesters.map((semester) => semester.displayLabel) ?? [];
    const currentSemesterLabel = currentSemester?.displayLabel || selectedSemesterLabel || "No semester selected";

    return (
        <div className="min-h-screen bg-black text-white font-sans antialiased pt-32 pb-24 px-6 relative z-10">
            <Logo />
            <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 w-full">
                    <Header name={studentName} semester={currentSemesterLabel} />

                    <div className="shrink-0 relative z-20 w-full md:w-auto">
                        <DropdownSemester
                            selections={semesterSelections}
                            currentSelection={currentSemesterLabel}
                            onSelectChange={handleSemSelection}
                        />
                    </div>
                </div>

                {trackerQuery.isError ? (
                    <div className="w-full rounded-3xl border border-rose-500/20 bg-rose-500/10 px-6 py-5 text-sm text-rose-100">
                        {getErrorMessage(trackerQuery.error)}
                    </div>
                ) : (
                    <Table
                        key={currentSemester?.studyLoadSqid ?? currentSemesterLabel}
                        data={tableData}
                        onSaveGrades={handleSaveGrades}
                        isSaving={updateGradeMutation.isPending}
                        honorThresholds={trackerQuery.data?.honorThresholds ?? []}
                        noHonorLabel={trackerQuery.data?.noHonorLabel ?? "No Latin Honor"}
                        projectionDisclaimer={trackerQuery.data?.projectionDisclaimer}
                    />
                )}
            </div>
        </div>
    );
}

export default Tracker;
