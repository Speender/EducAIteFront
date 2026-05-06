import type { SummarizeNoteResponseDto, SummarizeNoteStyleDto } from "../api/dto";
import MarkdownNoteContent from "./MarkdownNoteContent";

type NoteSummaryModalProps = {
  open: boolean;
  style: SummarizeNoteStyleDto;
  summary: SummarizeNoteResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onStyleChange: (style: SummarizeNoteStyleDto) => void;
  onUseSummary: () => void;
};

const summaryStyleOptions: { value: SummarizeNoteStyleDto; label: string; description: string }[] = [
  { value: "concise", label: "Concise", description: "Shortest study version." },
  { value: "default", label: "Default", description: "Balanced summary for review." },
  { value: "detailed", label: "Detailed", description: "More context and explanation retained." },
];

const NoteSummaryModal = ({
  open,
  style,
  summary,
  isLoading,
  errorMessage,
  onClose,
  onStyleChange,
  onUseSummary,
}: NoteSummaryModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/65 px-6 py-10 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5 lg:px-8">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#00CEC8]">Summary Preview</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Summarize note</h2>
            <p className="mt-2 text-sm text-white/60">
              Preview is generated from the latest saved note content. Use it in the editor, then save if you want to persist it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-[#00CEC8] hover:text-[#00CEC8]"
          >
            Close
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="border-b border-white/10 bg-black/20 p-6 lg:border-b-0 lg:border-r lg:border-white/10">
            <h3 className="text-sm font-semibold text-white">Summary type</h3>
            <div className="mt-4 space-y-3">
              {summaryStyleOptions.map((option) => {
                const selected = option.value === style;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onStyleChange(option.value)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-[#00CEC8] bg-[#00CEC8]/10 text-[#9af8f4]"
                        : "border-white/10 bg-white/[0.03] text-white/70 hover:border-[#00CEC8]/40 hover:bg-[#00CEC8]/5"
                    }`}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="mt-1 text-sm opacity-80">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="flex min-h-[26rem] flex-col">
            <div className="flex-1 overflow-hidden px-6 py-6 lg:px-8">
              {isLoading && (
                <div className="flex h-full min-h-[20rem] items-center justify-center text-center">
                  <div>
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#00CEC8]" />
                    <p className="mt-4 text-white/65">Generating summary preview...</p>
                  </div>
                </div>
              )}

              {!isLoading && errorMessage && (
                <div className="rounded-[24px] border border-rose-400/20 bg-rose-950/20 p-6">
                  <h4 className="text-lg font-semibold text-white">Unable to generate summary</h4>
                  <p className="mt-2 text-sm text-rose-100/80">{errorMessage}</p>
                </div>
              )}

              {!isLoading && !errorMessage && summary && (
                <div className="flex h-full max-h-[56vh] flex-col rounded-[28px] border border-white/10 bg-black/30 px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.24)]">
                  <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-white/45">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 uppercase tracking-[0.18em]">
                      {style}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                      {summary.model}
                    </span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                    <MarkdownNoteContent content={summary.summarizedContent} tone="dark" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-black/20 px-6 py-4 lg:px-8">
              <p className="text-sm text-white/50">Review the summary first. It will not save until you click Save on the note page.</p>
              <button
                type="button"
                onClick={onUseSummary}
                disabled={!summary || isLoading}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  summary && !isLoading
                    ? "bg-[#00CEC8] text-black shadow-[0_0_18px_rgba(0,206,200,0.28)] hover:bg-[#00b7b1]"
                    : "cursor-not-allowed bg-white/10 text-white/35"
                }`}
              >
                Use Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteSummaryModal;
