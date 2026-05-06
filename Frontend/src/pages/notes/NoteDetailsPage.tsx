import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AiGenerationLoadingModal from "@/components/AiGenerationLoadingModal";
import { useToast } from "@/components/ToastProvider";
import {
  noteQueryKeys,
  useNoteQuery,
  useSummarizeNoteMutation,
  useUpdateNoteMutation,
} from "@/features/notes/api/hooks";
import StatusBanner from "@/components/StatusBanner";
import type { SummarizeNoteResponseDto, SummarizeNoteStyleDto } from "@/features/notes/api/dto";
import MarkdownNoteContent from "@/features/notes/components/MarkdownNoteContent";
import NoteEditorToolbar from "@/features/notes/components/NoteEditorToolbar";
import NoteSummaryModal from "@/features/notes/components/NoteSummaryModal";
import { formatLines, wrapSelection, type EditorUpdate } from "@/features/notes/editor/markdownFormatting";
import { getErrorMessage } from "@/lib/api/errors";

type EditorMode = "preview" | "edit";

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const primaryCyanButtonClass =
  "rounded-full bg-[#00CEC8] px-5 py-3 text-sm font-semibold text-black shadow-[0_0_18px_rgba(0,206,200,0.28)] transition hover:bg-[#00b7b1] disabled:cursor-not-allowed disabled:bg-[#00CEC8]/50 disabled:text-black/60";

const NoteDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();
  const { noteSqid } = useParams();
  const noteQuery = useNoteQuery(noteSqid ?? null);
  const updateNoteMutation = useUpdateNoteMutation(noteSqid ?? null);
  const summarizeNoteMutation = useSummarizeNoteMutation(noteSqid ?? null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editorMode, setEditorMode] = useState<EditorMode>("preview");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState<SummarizeNoteStyleDto>("default");
  const [summaryPreview, setSummaryPreview] = useState<SummarizeNoteResponseDto | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const backTarget = useMemo(() => {
    const candidate = (location.state as { from?: string } | null)?.from;
    return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : "/courses";
  }, [location.state]);

  useEffect(() => {
    if (!noteQuery.data) {
      return;
    }

    setDraftTitle(noteQuery.data.name);
    setDraftContent(noteQuery.data.noteContent);
    setIsDirty(false);
  }, [noteQuery.data?.sqid, noteQuery.data?.updatedAt.getTime()]);

  function applyEditorUpdate(update: EditorUpdate) {
    setDraftContent(update.value);
    setIsDirty(true);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(update.selectionStart, update.selectionEnd);
    });
  }

  function handleWrap(prefix: string, suffix: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    applyEditorUpdate(
      wrapSelection(
        draftContent,
        textarea.selectionStart,
        textarea.selectionEnd,
        prefix,
        suffix,
        placeholder,
      ),
    );
  }

  function handleLineFormat(mode: "bullet" | "numbered") {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    applyEditorUpdate(formatLines(draftContent, textarea.selectionStart, textarea.selectionEnd, mode));
  }

  async function requestSummaryPreview(nextStyle: SummarizeNoteStyleDto) {
    setSummaryStyle(nextStyle);
    setSummaryError(null);

    try {
      const result = await summarizeNoteMutation.mutateAsync({ style: nextStyle });
      setSummaryPreview(result);
    } catch (error) {
      setSummaryPreview(null);
      setSummaryError(getErrorMessage(error));
    }
  }

  async function handleSave() {
    if (!noteQuery.data || !draftTitle.trim() || !draftContent.trim()) {
      return;
    }

    setSaveError(null);

    try {
      await updateNoteMutation.mutateAsync({
        name: draftTitle.trim(),
        noteContent: draftContent.trim(),
        documentSqid: noteQuery.data.documentSqid,
      });
      setIsDirty(false);
      showSuccess("Note saved successfully.");

      await queryClient.invalidateQueries({
        queryKey: noteQueryKeys.detail(noteQuery.data.sqid),
      });
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  }

  async function handleOpenSummaryModal() {
    setSummaryOpen(true);
    await requestSummaryPreview(summaryStyle);
  }

  if (noteQuery.isPending) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-white lg:px-16">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-10 w-32 rounded-full bg-white/10" />
          <div className="h-16 w-2/3 rounded-3xl bg-white/10" />
          <div className="h-[32rem] rounded-[32px] border border-white/10 bg-white/5" />
        </div>
      </div>
    );
  }

  if (noteQuery.error || !noteQuery.data) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-white lg:px-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-rose-400/20 bg-rose-950/20 p-8">
          <button
            type="button"
            onClick={() => navigate(backTarget)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#00CEC8] hover:text-[#00CEC8]"
          >
            Back
          </button>
          <h1 className="mt-6 text-3xl font-semibold">Unable to load note</h1>
          <p className="mt-3 text-white/70">{getErrorMessage(noteQuery.error)}</p>
        </div>
      </div>
    );
  }

  const note = noteQuery.data;
  const saveDisabled = updateNoteMutation.isPending || !draftTitle.trim() || !draftContent.trim();

  return (
    <>
      <div className={`min-h-screen bg-black px-6 py-10 text-white lg:px-16 ${summaryOpen ? "blur-sm" : ""}`}>
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate(backTarget)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#00CEC8] hover:text-[#00CEC8]"
          >
            Back to files
          </button>

          <header className="mt-8 rounded-[32px] border border-white/10 bg-[#050505] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] lg:p-10">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#00CEC8]">Learning Note</p>
                {editorMode === "edit" ? (
                  <input
                    value={draftTitle}
                    onChange={(event) => {
                      setDraftTitle(event.target.value);
                      setIsDirty(true);
                    }}
                    title={draftTitle}
                    className="mt-4 w-full truncate overflow-hidden whitespace-nowrap bg-transparent text-4xl font-semibold tracking-tight outline-none placeholder:text-white/20 lg:text-5xl"
                    placeholder="Untitled note"
                  />
                ) : (
                  <h1
                    title={draftTitle}
                    className="mt-4 truncate overflow-hidden whitespace-nowrap text-4xl font-semibold tracking-tight lg:text-5xl"
                  >
                    {draftTitle}
                  </h1>
                )}

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/55">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                    Updated {formatDateLabel(note.updatedAt)}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                    Sequence {note.sequenceNumber}
                  </span>
                  {isDirty && (
                    <span className="rounded-full border border-[#00CEC8]/20 bg-[#00CEC8]/10 px-3 py-1.5 text-[#8bf7f3]">
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
                  <button
                    type="button"
                    onClick={() => setEditorMode("preview")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      editorMode === "preview" ? "bg-white text-black" : "text-white/65 hover:text-white"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("edit")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      editorMode === "edit" ? "bg-white text-black" : "text-white/65 hover:text-white"
                    }`}
                  >
                    Edit
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => void handleOpenSummaryModal()}
                  disabled={summarizeNoteMutation.isPending}
                  className={primaryCyanButtonClass}
                >
                  {summarizeNoteMutation.isPending ? "Generating..." : "Summarize"}
                </button>

                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saveDisabled}
                  className="rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/20 disabled:text-white/40"
                >
                  {updateNoteMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {saveError && (
              <StatusBanner
                message={saveError}
                tone="error"
                className="mt-6 rounded-[20px]"
              />
            )}
          </header>

          <section className="mt-8 rounded-[32px] border border-white/10 bg-[#050505] px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:px-12 lg:py-12">
            {editorMode === "edit" ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Edit note</h2>
                    <p className="mt-2 text-sm text-white/55">
                      Use lightweight markdown formatting so the note stays compatible with the current storage model.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <NoteEditorToolbar
                    onBold={() => handleWrap("**", "**", "bold text")}
                    onItalic={() => handleWrap("*", "*", "italic text")}
                    onUnderline={() => handleWrap("<u>", "</u>", "underlined text")}
                    onBulletList={() => handleLineFormat("bullet")}
                    onNumberedList={() => handleLineFormat("numbered")}
                  />
                </div>

                <textarea
                  ref={textareaRef}
                  value={draftContent}
                  onChange={(event) => {
                    setDraftContent(event.target.value);
                    setIsDirty(true);
                  }}
                  className="mt-6 h-[28rem] w-full resize-none overflow-y-auto rounded-[24px] border border-white/10 bg-black/30 px-5 py-4 text-base leading-8 text-white outline-none transition focus:border-[#00CEC8]/60"
                  placeholder="Write your note content here..."
                  spellCheck={false}
                />

                <div className="mt-10 border-t border-white/10 pt-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Live preview</h3>
                      <p className="mt-2 text-sm text-white/55">This preview uses the same markdown renderer shown in reading mode.</p>
                    </div>
                  </div>

                  <div className="mt-6 max-h-[28rem] overflow-y-auto rounded-[24px] border border-white/10 bg-black/20 px-5 py-4">
                    <MarkdownNoteContent content={draftContent} />
                  </div>
                </div>
              </>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto pr-2">
                <MarkdownNoteContent content={draftContent} />
              </div>
            )}
          </section>
        </div>
      </div>

      <NoteSummaryModal
        open={summaryOpen}
        style={summaryStyle}
        summary={summaryPreview}
        isLoading={summarizeNoteMutation.isPending}
        errorMessage={summaryError}
        onClose={() => setSummaryOpen(false)}
        onStyleChange={(nextStyle) => {
          void requestSummaryPreview(nextStyle);
        }}
        onUseSummary={() => {
          if (!summaryPreview) {
            return;
          }

          setDraftContent(summaryPreview.summarizedContent);
          setEditorMode("edit");
          setIsDirty(true);
          setSummaryOpen(false);
          setSaveError(null);
        }}
      />

      <AiGenerationLoadingModal
        open={summarizeNoteMutation.isPending}
        title="Generating summary preview"
        subtitle="educAIte is preparing a study summary from the latest saved note content. The preview will open as soon as it is ready."
        stages={[
          { label: "Fetching data...", description: "Loading the saved note content for the selected summary mode." },
          { label: "Processing input...", description: "Interpreting the note structure, sections, and key concepts." },
          { label: "Generating content...", description: "Building the summary preview in the selected style." },
          { label: "Finalizing result...", description: "Preparing the preview so you can review it before applying anything." },
        ]}
      />
    </>
  );
};

export default NoteDetailsPage;
