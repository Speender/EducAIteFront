import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownNoteContentProps = {
  content: string;
  tone?: "dark" | "light";
};

const toneClasses = {
  dark: {
    heading: "text-white",
    subheading: "text-[#9af8f4]",
    paragraph: "text-white/78",
    list: "text-white/78",
    strong: "text-white",
    code: "border-white/10 bg-white/[0.06] text-[#9af8f4]",
    tableWrap: "border-white/10",
    table: "bg-black/20",
    thead: "bg-white/[0.05]",
    th: "border-white/10 text-white/70",
    td: "border-white/10 text-white/75",
    divider: "border-white/10",
  },
  light: {
    heading: "text-slate-950",
    subheading: "text-cyan-700",
    paragraph: "text-slate-700",
    list: "text-slate-700",
    strong: "text-slate-950",
    code: "border-slate-200 bg-slate-100 text-cyan-700",
    tableWrap: "border-slate-200",
    table: "bg-white",
    thead: "bg-slate-100",
    th: "border-slate-200 text-slate-600",
    td: "border-slate-200 text-slate-700",
    divider: "border-slate-200",
  },
} as const;

const MarkdownNoteContent = ({ content, tone = "dark" }: MarkdownNoteContentProps) => {
  const colors = toneClasses[tone];

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className={`mt-12 border-b pb-4 text-3xl font-semibold tracking-tight first:mt-0 ${colors.heading} ${colors.divider}`}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className={`mt-10 text-2xl font-semibold tracking-tight ${colors.subheading}`}>{children}</h3>
        ),
        p: ({ children }) => <p className={`mt-5 text-[1.02rem] leading-8 ${colors.paragraph}`}>{children}</p>,
        ul: ({ children }) => <ul className={`mt-5 list-disc space-y-2 pl-6 ${colors.list}`}>{children}</ul>,
        ol: ({ children }) => <ol className={`mt-5 list-decimal space-y-3 pl-6 ${colors.list}`}>{children}</ol>,
        li: ({ children }) => <li className="pl-1 leading-8">{children}</li>,
        strong: ({ children }) => <strong className={`font-semibold ${colors.strong}`}>{children}</strong>,
        code: ({ children }) => (
          <code className={`rounded-md border px-1.5 py-1 text-[0.92em] ${colors.code}`}>{children}</code>
        ),
        table: ({ children }) => (
          <div className={`mt-8 overflow-x-auto rounded-2xl border ${colors.tableWrap}`}>
            <table className={`min-w-full border-collapse ${colors.table}`}>{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className={`text-left ${colors.thead}`}>{children}</thead>,
        th: ({ children }) => (
          <th className={`border-b px-4 py-3 text-sm font-semibold uppercase tracking-widest ${colors.th}`}>
            {children}
          </th>
        ),
        td: ({ children }) => <td className={`border-t px-4 py-3 align-top ${colors.td}`}>{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownNoteContent;
