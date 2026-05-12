import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table as ShadcnTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { GradeTrackerResponseDto } from '@/features/tracker/api/dto';
import { cn } from '@/lib/utils';

type RowData = {
    studentCourseSqid: string;
    course: string;
    units: number;
    midtermGrade: number | null;
    finalGrade: number | null;
    finalRemarks?: string;
}

export type GradeBatchUpdate = {
    studentCourseSqid: string;
    midtermGrade: number | null;
    finalGrade: number | null;
};

interface Props {
    data: RowData[],
    onSaveGrades: (updates: GradeBatchUpdate[]) => Promise<void>,
    isSaving?: boolean,
    honorThresholds: GradeTrackerResponseDto["honorThresholds"],
    noHonorLabel: string,
    projectionDisclaimer?: string,
}

type DraftGradeRow = {
    midtermGrade: string;
    finalGrade: string;
};

type GradeStanding = "pending" | "passing" | "improved" | "increased" | "same" | "failed";

const EMPTY_DRAFT: DraftGradeRow = {
    midtermGrade: "",
    finalGrade: "",
};

const FAILING_GRADE_MIN = 3.1;
const PASSING_GRADE_MAX = 3;

const standingStyles: Record<GradeStanding, { label: string; badge: string; value: string; input: string; row: string }> = {
    pending: {
        label: "Pending",
        badge: "border-white/10 bg-white/5 text-white/45",
        value: "text-white/45",
        input: "border-white/10 text-white",
        row: "hover:bg-white/[0.02]",
    },
    passing: {
        label: "Passing",
        badge: "border-[#00CEC8]/25 bg-[#00CEC8]/10 text-[#7df8f3]",
        value: "text-[#7df8f3]",
        input: "border-[#00CEC8]/30 text-[#7df8f3]",
        row: "hover:bg-[#00CEC8]/[0.03]",
    },
    improved: {
        label: "Improved",
        badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        value: "text-emerald-300",
        input: "border-emerald-500/30 text-emerald-300",
        row: "hover:bg-emerald-500/[0.03]",
    },
    increased: {
        label: "Increased",
        badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        value: "text-emerald-300",
        input: "border-emerald-500/30 text-emerald-300",
        row: "hover:bg-emerald-500/[0.03]",
    },
    same: {
        label: "Same",
        badge: "border-white/15 bg-white/5 text-white/60",
        value: "text-white/70",
        input: "border-white/20 text-white/80",
        row: "hover:bg-white/[0.02]",
    },
    failed: {
        label: "Failed",
        badge: "border-rose-500/25 bg-rose-500/10 text-rose-200",
        value: "text-rose-200",
        input: "border-rose-500/35 text-rose-200",
        row: "hover:bg-rose-500/[0.03]",
    },
};

const formatGradeInput = (value: number | null) => value?.toFixed(1) ?? "";

const normalizeGradeDraftInput = (value: string) => {
    const compactValue = value.replace(/\s/g, "");

    if (!compactValue) {
        return "";
    }

    if (compactValue.includes(".")) {
        const [whole = "", decimal = ""] = compactValue.split(".");
        const wholeDigit = whole.replace(/\D/g, "").slice(0, 1);
        const decimalDigit = decimal.replace(/\D/g, "").slice(0, 1);

        if (!wholeDigit) {
            return "";
        }

        return decimalDigit ? `${wholeDigit}.${decimalDigit}` : `${wholeDigit}.`;
    }

    const digits = compactValue.replace(/\D/g, "").slice(0, 2);

    if (digits.length < 2) {
        return digits;
    }

    return `${digits[0]}.${digits[1]}`;
};

const parseGradeValue = (value: string) => {
    const normalized = value.trim();
    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) {
        return null;
    }

    return Number(parsed.toFixed(1));
};

const areGradeValuesEqual = (left: number | null, right: number | null) => left === right;

const isFailingGrade = (value: number | null) => value !== null && value >= FAILING_GRADE_MIN && value <= 5;

const isPassingGrade = (value: number | null) => value !== null && value >= 1 && value <= PASSING_GRADE_MAX;

const calculateCourseGrade = (midtermGrade: number | null, finalGrade: number | null) => {
    if (midtermGrade !== null && finalGrade !== null) {
        return Number(((midtermGrade + finalGrade) * 0.5).toFixed(2));
    }

    return finalGrade ?? midtermGrade;
};

const getGradeStanding = (midtermGrade: number | null, finalGrade: number | null): GradeStanding => {
    const courseGrade = calculateCourseGrade(midtermGrade, finalGrade);

    if (courseGrade === null) {
        return "pending";
    }

    if (isFailingGrade(midtermGrade) || isFailingGrade(finalGrade) || isFailingGrade(courseGrade)) {
        return "failed";
    }

    if (midtermGrade !== null && finalGrade !== null) {
        if (finalGrade > midtermGrade) {
            return "increased";
        }

        if (finalGrade === midtermGrade) {
            return "same";
        }

        return "improved";
    }

    return isPassingGrade(courseGrade) ? "passing" : "pending";
};

const getGradeTone = (value: number | null) => {
    if (isFailingGrade(value)) {
        return standingStyles.failed;
    }

    if (isPassingGrade(value)) {
        return standingStyles.passing;
    }

    return standingStyles.pending;
};

const calculateWeightedAverage = (items: Array<{ value: number | null; units: number }>) => {
    const gradedItems = items.filter((item): item is { value: number; units: number } => item.value !== null);

    if (gradedItems.length === 0) {
        return null;
    }

    const gradedUnits = gradedItems.reduce((acc, item) => acc + item.units, 0);

    if (gradedUnits > 0) {
        const weightedTotal = gradedItems.reduce((acc, item) => acc + item.value * item.units, 0);
        return Number((weightedTotal / gradedUnits).toFixed(2));
    }

    const total = gradedItems.reduce((acc, item) => acc + item.value, 0);
    return Number((total / gradedItems.length).toFixed(2));
};

const formatAverage = (value: number | null) => value?.toFixed(2) ?? "-";

const getProjectedHonorLabel = (
    projectedGwa: number | null,
    honorThresholds: GradeTrackerResponseDto["honorThresholds"],
    noHonorLabel: string,
) => {
    if (projectedGwa === null) {
        return noHonorLabel;
    }

    const threshold = honorThresholds.find(
        (item) => projectedGwa >= item.minAverage && projectedGwa <= item.maxAverage,
    );

    return threshold?.label ?? noHonorLabel;
};

const Table = ({
    data,
    onSaveGrades,
    isSaving = false,
    honorThresholds,
    noHonorLabel,
    projectionDisclaimer,
}: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftGrades, setDraftGrades] = useState<Record<string, Partial<DraftGradeRow>>>({});

    const hasData = data.length > 0;
    const totalUnits = data.reduce((acc, item) => acc + item.units, 0).toFixed(0);

    const normalizedRows = useMemo(
        () =>
            data.map((item) => {
                const draft = draftGrades[item.studentCourseSqid] ?? EMPTY_DRAFT;
                const midtermValue = draft.midtermGrade ?? formatGradeInput(item.midtermGrade);
                const finalValue = draft.finalGrade ?? formatGradeInput(item.finalGrade);
                const parsedMidtermGrade = parseGradeValue(midtermValue);
                const parsedFinalGrade = parseGradeValue(finalValue);

                return {
                    ...item,
                    parsedMidtermGrade,
                    parsedFinalGrade,
                    projectedGrade: calculateCourseGrade(parsedMidtermGrade, parsedFinalGrade),
                    standing: getGradeStanding(parsedMidtermGrade, parsedFinalGrade),
                };
            }),
        [data, draftGrades],
    );

    const pendingUpdates = useMemo(
        () =>
            normalizedRows
                .map((row) => ({
                    studentCourseSqid: row.studentCourseSqid,
                    midtermGrade: row.parsedMidtermGrade,
                    finalGrade: row.parsedFinalGrade,
                    changed:
                        !areGradeValuesEqual(row.midtermGrade, row.parsedMidtermGrade) ||
                        !areGradeValuesEqual(row.finalGrade, row.parsedFinalGrade),
                }))
                .filter((row) => row.changed)
                .map((row) => ({
                    studentCourseSqid: row.studentCourseSqid,
                    midtermGrade: row.midtermGrade,
                    finalGrade: row.finalGrade,
                })),
        [normalizedRows],
    );

    const midtermAverageValue = calculateWeightedAverage(
        normalizedRows.map((item) => ({ value: item.parsedMidtermGrade, units: item.units })),
    );
    const finalAverageValue = calculateWeightedAverage(
        normalizedRows.map((item) => ({ value: item.parsedFinalGrade, units: item.units })),
    );
    const gwaAverageValue = calculateWeightedAverage(
        normalizedRows.map((item) => ({ value: item.projectedGrade, units: item.units })),
    );

    const midtermAvg = formatAverage(midtermAverageValue);
    const finalAvg = formatAverage(finalAverageValue);
    const gwaAvg = formatAverage(gwaAverageValue);
    const projectedHonor = getProjectedHonorLabel(gwaAverageValue, honorThresholds, noHonorLabel);
    const projectedGwaTone = getGradeTone(gwaAverageValue);
    const hasProjectedHonor = projectedHonor !== noHonorLabel;

    const handleDraftChange = (studentCourseSqid: string, key: keyof DraftGradeRow, value: string) => {
        const normalizedValue = normalizeGradeDraftInput(value);

        setDraftGrades((current) => ({
            ...current,
            [studentCourseSqid]: {
                ...current[studentCourseSqid],
                [key]: normalizedValue,
            },
        }));
    };

    const handleCancelEdit = () => {
        setDraftGrades({});
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (pendingUpdates.length === 0) {
            setIsEditing(false);
            return;
        }

        await onSaveGrades(pendingUpdates);
        setDraftGrades({});
        setIsEditing(false);
    };

    return (
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.02] px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase text-white/40">Grade Controls</p>
                    <p className="mt-2 text-sm text-white/60">
                        Edit both midterm and final grades locally, then save all changes in one action.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {!isEditing ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => {
                                setDraftGrades({});
                                setIsEditing(true);
                            }}
                            className="h-11 rounded-xl border-white/15 bg-white/5 px-5 text-xs font-bold uppercase text-white hover:bg-white/10"
                        >
                            Edit Grades
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                size="lg"
                                disabled={isSaving}
                                onClick={handleCancelEdit}
                                className="h-11 rounded-xl border border-white/15 px-5 text-xs font-bold uppercase text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                disabled={isSaving}
                                onClick={handleSave}
                                className="h-11 rounded-xl border-[#00CEC8]/40 bg-[#00CEC8]/10 px-5 text-xs font-bold uppercase text-[#00CEC8] hover:bg-[#00CEC8]/20"
                            >
                                {isSaving ? "Saving..." : `Save Changes${pendingUpdates.length > 0 ? ` (${pendingUpdates.length})` : ""}`}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-white/10 bg-black/20 px-6 py-4">
                <Badge variant="outline" className={cn("border px-3 py-1 text-[11px] font-bold uppercase", standingStyles.passing.badge)}>
                    Passing 1.0-3.0
                </Badge>
                <Badge variant="outline" className={cn("border px-3 py-1 text-[11px] font-bold uppercase", standingStyles.failed.badge)}>
                    Failed 3.1-5.0
                </Badge>
                <Badge variant="outline" className={cn("border px-3 py-1 text-[11px] font-bold uppercase", standingStyles.increased.badge)}>
                    Increased
                </Badge>
                <Badge variant="outline" className={cn("border px-3 py-1 text-[11px] font-bold uppercase", standingStyles.same.badge)}>
                    Same
                </Badge>
            </div>

            <ShadcnTable className="min-w-[1040px] table-fixed border-collapse text-left">
                    <colgroup>
                        <col className="w-[30%]" />
                        <col className="w-[8%]" />
                        <col className="w-[13%]" />
                        <col className="w-[13%]" />
                        <col className="w-[10%]" />
                        <col className="w-[13%]" />
                        <col className="w-[13%]" />
                    </colgroup>
                    <TableHeader>
                        <TableRow className="border-b border-white/10 bg-white/[0.02] hover:bg-white/[0.02]">
                            <TableHead className="px-6 py-5 text-xs font-bold uppercase text-white/40">Course</TableHead>
                            <TableHead className="px-6 py-5 text-xs font-bold uppercase text-white/40">Units</TableHead>
                            <TableHead className="px-6 py-5 text-xs font-bold uppercase text-white/40">Midterm Grade</TableHead>
                            <TableHead className="px-6 py-5 text-xs font-bold uppercase text-white/40">Final Grade</TableHead>
                            <TableHead className="px-6 py-5 text-xs font-bold uppercase text-[#00CEC8]">GWA</TableHead>
                            <TableHead className="px-6 py-5 text-xs font-bold uppercase text-white/40">Status</TableHead>
                            <TableHead className="px-6 py-5 text-xs font-bold uppercase text-white/40">Final Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!hasData ? (
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableCell colSpan={7} className="px-6 py-12 text-center italic text-white/40">
                                    No courses registered for this semester yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            normalizedRows.map((item) => {
                                const computedGwa = item.projectedGrade !== null ? item.projectedGrade.toFixed(2) : "-";
                                const draft = draftGrades[item.studentCourseSqid] ?? EMPTY_DRAFT;
                                const midtermInputValue = draft.midtermGrade ?? formatGradeInput(item.midtermGrade);
                                const finalInputValue = draft.finalGrade ?? formatGradeInput(item.finalGrade);
                                const rowTone = standingStyles[item.standing];
                                const midtermTone = getGradeTone(item.parsedMidtermGrade);
                                const finalTone = item.standing === "increased" ? standingStyles.increased : getGradeTone(item.parsedFinalGrade);

                                return (
                                    <TableRow key={item.studentCourseSqid} className={cn("border-b border-white/5 transition-colors", rowTone.row)}>
                                        <TableCell className="whitespace-normal break-words px-6 py-5 font-medium text-white/90">{item.course}</TableCell>
                                        <TableCell className="px-6 py-5 text-white/70">{item.units}</TableCell>
                                        <TableCell className={cn("px-6 py-5 font-medium", midtermTone.value)}>
                                            {isEditing ? (
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={midtermInputValue}
                                                    onChange={(event) => handleDraftChange(item.studentCourseSqid, "midtermGrade", event.target.value)}
                                                    className={cn("h-9 w-24 border bg-black/30 px-3 text-sm focus-visible:border-[#00CEC8] focus-visible:ring-[#00CEC8]/20", midtermTone.input)}
                                                    placeholder="1.0"
                                                />
                                            ) : (
                                                item.midtermGrade !== null ? formatGradeInput(item.midtermGrade) : "-"
                                            )}
                                        </TableCell>
                                        <TableCell className={cn("px-6 py-5 font-medium", finalTone.value)}>
                                            {isEditing ? (
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={finalInputValue}
                                                    onChange={(event) => handleDraftChange(item.studentCourseSqid, "finalGrade", event.target.value)}
                                                    className={cn("h-9 w-24 border bg-black/30 px-3 text-sm focus-visible:border-[#00CEC8] focus-visible:ring-[#00CEC8]/20", finalTone.input)}
                                                    placeholder="1.0"
                                                />
                                            ) : (
                                                item.finalGrade !== null ? formatGradeInput(item.finalGrade) : "-"
                                            )}
                                        </TableCell>
                                        <TableCell className={cn("px-6 py-5 font-bold", rowTone.value)}>{computedGwa}</TableCell>
                                        <TableCell className="px-6 py-5">
                                            <Badge variant="outline" className={cn("border px-3 py-1 text-[11px] font-bold uppercase", rowTone.badge)}>
                                                {rowTone.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="whitespace-normal break-words px-6 py-5 text-white/70">{item.finalRemarks || "-"}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}

                        {hasData && (
                            <TableRow className="border-t border-[#00CEC8]/30 bg-[#00CEC8]/10 hover:bg-[#00CEC8]/10">
                                <TableCell className="px-6 py-5 text-sm font-bold uppercase text-[#00CEC8]">Averages</TableCell>
                                <TableCell className="px-6 py-5 font-bold text-white">{totalUnits}</TableCell>
                                <TableCell className="px-6 py-5 font-bold text-white">{midtermAvg}</TableCell>
                                <TableCell className="px-6 py-5 font-bold text-white">{finalAvg}</TableCell>
                                <TableCell className={cn("px-6 py-5 text-lg font-extrabold", projectedGwaTone.value)}>{gwaAvg}</TableCell>
                                <TableCell className={cn("px-6 py-5 font-bold", hasProjectedHonor ? "text-[#00CEC8]" : "text-white/60")}>
                                    <div>{projectedHonor}</div>
                                    {projectionDisclaimer ? (
                                        <div className="mt-1 text-xs font-medium normal-case text-white/40">{projectionDisclaimer}</div>
                                    ) : null}
                                </TableCell>
                                <TableCell className="px-6 py-5 text-white/45">Projected</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
            </ShadcnTable>
        </div>
    );
};

export default Table;
