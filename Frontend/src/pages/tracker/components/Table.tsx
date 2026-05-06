import { useEffect, useMemo, useState } from 'react';

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
}

type DraftGradeRow = {
    midtermGrade: string;
    finalGrade: string;
};

const EMPTY_DRAFT: DraftGradeRow = {
    midtermGrade: "",
    finalGrade: "",
};

const formatGradeInput = (value: number | null) => value?.toFixed(2) ?? "";

const parseGradeValue = (value: string) => {
    const normalized = value.trim();
    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) {
        return null;
    }

    return Number(parsed.toFixed(2));
};

const areGradeValuesEqual = (left: number | null, right: number | null) => left === right;

const Table = ({ data, onSaveGrades, isSaving = false }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftGrades, setDraftGrades] = useState<Record<string, DraftGradeRow>>({});

    useEffect(() => {
        const nextDrafts = data.reduce<Record<string, DraftGradeRow>>((acc, item) => {
            acc[item.studentCourseSqid] = {
                midtermGrade: formatGradeInput(item.midtermGrade),
                finalGrade: formatGradeInput(item.finalGrade),
            };
            return acc;
        }, {});

        setDraftGrades(nextDrafts);
        setIsEditing(false);
    }, [data]);

    const hasData = data.length > 0;
    const totalUnits = data.reduce((acc, item) => acc + item.units, 0).toFixed(0);

    const normalizedRows = useMemo(
        () =>
            data.map((item) => {
                const draft = draftGrades[item.studentCourseSqid] ?? EMPTY_DRAFT;
                return {
                    ...item,
                    parsedMidtermGrade: parseGradeValue(draft.midtermGrade),
                    parsedFinalGrade: parseGradeValue(draft.finalGrade),
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
                .map(({ changed: _changed, ...update }) => update),
        [normalizedRows],
    );

    const midtermValues = normalizedRows
        .map((item) => item.parsedMidtermGrade)
        .filter((value): value is number => value !== null);
    const finalValues = normalizedRows
        .map((item) => item.parsedFinalGrade)
        .filter((value): value is number => value !== null);
    const gwaValues = normalizedRows
        .map((item) => {
            if (item.parsedMidtermGrade !== null && item.parsedFinalGrade !== null) {
                return (item.parsedMidtermGrade + item.parsedFinalGrade) * 0.5;
            }

            return item.parsedFinalGrade ?? item.parsedMidtermGrade;
        })
        .filter((value): value is number => value !== null);

    const midtermAvg = midtermValues.length > 0
        ? (midtermValues.reduce((acc, value) => acc + value, 0) / midtermValues.length).toFixed(2)
        : "-";
    const finalAvg = finalValues.length > 0
        ? (finalValues.reduce((acc, value) => acc + value, 0) / finalValues.length).toFixed(2)
        : "-";
    const gwaAvg = gwaValues.length > 0
        ? (gwaValues.reduce((acc, value) => acc + value, 0) / gwaValues.length).toFixed(2)
        : "-";

    let potentialHonor = "";
    if (gwaAvg !== "-") {
        const gwaValue = parseFloat(gwaAvg);
        if (gwaValue <= 1.20) {
            potentialHonor = "SUMMA CUM LAUDE";
        } else if (gwaValue <= 1.45) {
            potentialHonor = "MAGNA CUM LAUDE";
        } else if (gwaValue <= 1.75) {
            potentialHonor = "CUM LAUDE";
        }
    }

    const handleDraftChange = (studentCourseSqid: string, key: keyof DraftGradeRow, value: string) => {
        setDraftGrades((current) => ({
            ...current,
            [studentCourseSqid]: {
                ...(current[studentCourseSqid] ?? EMPTY_DRAFT),
                [key]: value,
            },
        }));
    };

    const handleCancelEdit = () => {
        const resetDrafts = data.reduce<Record<string, DraftGradeRow>>((acc, item) => {
            acc[item.studentCourseSqid] = {
                midtermGrade: formatGradeInput(item.midtermGrade),
                finalGrade: formatGradeInput(item.finalGrade),
            };
            return acc;
        }, {});

        setDraftGrades(resetDrafts);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (pendingUpdates.length === 0) {
            setIsEditing(false);
            return;
        }

        await onSaveGrades(pendingUpdates);
    };

    return (
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.02] px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/40">Grade Controls</p>
                    <p className="mt-2 text-sm text-white/60">
                        Edit both midterm and final grades locally, then save all changes in one action.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
                        >
                            Edit Grades
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={handleCancelEdit}
                                className="rounded-xl border border-white/15 bg-transparent px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white/70 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={handleSave}
                                className="rounded-xl border border-[#00CEC8]/40 bg-[#00CEC8]/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-[#00CEC8] transition hover:bg-[#00CEC8]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : `Save Changes${pendingUpdates.length > 0 ? ` (${pendingUpdates.length})` : ""}`}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-white/40">Course</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-white/40">Units</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-white/40">Midterm Grade</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-white/40">Final Grade</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-[#00CEC8]">GWA</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-white/40">Final Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!hasData ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center italic text-white/40">
                                    No courses registered for this semester yet.
                                </td>
                            </tr>
                        ) : (
                            normalizedRows.map((item) => {
                                const computedGwa = item.parsedMidtermGrade !== null && item.parsedFinalGrade !== null
                                    ? ((item.parsedMidtermGrade + item.parsedFinalGrade) * 0.5).toFixed(2)
                                    : item.parsedFinalGrade !== null
                                        ? item.parsedFinalGrade.toFixed(2)
                                        : item.parsedMidtermGrade !== null
                                            ? item.parsedMidtermGrade.toFixed(2)
                                            : "-";

                                const draft = draftGrades[item.studentCourseSqid] ?? EMPTY_DRAFT;

                                return (
                                    <tr key={item.studentCourseSqid} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                                        <td className="px-6 py-5 font-medium text-white/90">{item.course}</td>
                                        <td className="px-6 py-5 text-white/70">{item.units}</td>
                                        <td className="px-6 py-5 text-white/70">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={draft.midtermGrade}
                                                    onChange={(event) => handleDraftChange(item.studentCourseSqid, "midtermGrade", event.target.value)}
                                                    className="w-24 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#00CEC8]"
                                                    placeholder="1.50"
                                                />
                                            ) : (
                                                item.midtermGrade !== null ? item.midtermGrade.toFixed(2) : "-"
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-white/70">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={draft.finalGrade}
                                                    onChange={(event) => handleDraftChange(item.studentCourseSqid, "finalGrade", event.target.value)}
                                                    className="w-24 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#00CEC8]"
                                                    placeholder="1.50"
                                                />
                                            ) : (
                                                item.finalGrade !== null ? item.finalGrade.toFixed(2) : "-"
                                            )}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-white">{computedGwa}</td>
                                        <td className="px-6 py-5 text-white/70">{item.finalRemarks || "-"}</td>
                                    </tr>
                                );
                            })
                        )}

                        {hasData && (
                            <tr className="border-t border-[#00CEC8]/30 bg-[#00CEC8]/10">
                                <td className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-[#00CEC8]">Averages</td>
                                <td className="px-6 py-5 font-bold text-white">{totalUnits}</td>
                                <td className="px-6 py-5 font-bold text-white">{midtermAvg}</td>
                                <td className="px-6 py-5 font-bold text-white">{finalAvg}</td>
                                <td className="px-6 py-5 text-lg font-extrabold text-[#00CEC8]">{gwaAvg}</td>
                                <td className="px-6 py-5 font-bold tracking-wide text-yellow-400">{potentialHonor}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
