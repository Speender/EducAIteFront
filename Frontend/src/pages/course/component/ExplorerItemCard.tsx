type ExplorerItemType = "folder" | "document" | "note";

type ExplorerItemCardProps = {
  name: string;
  type: ExplorerItemType;
  typeLabel: string;
  createdAtLabel: string;
  updatedAtLabel: string;
  detailLabel?: string;
  detailValue?: string;
  isInteractive: boolean;
  isPending?: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

function renderItemIcon(type: ExplorerItemType) {
  if (type === "folder") {
    return (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
      </svg>
    );
  }

  if (type === "document") {
    return (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M10 13l-1 2H8l2-4h1l2 4h-1l-1-2z" />
      </svg>
    );
  }

  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h12" />
    </svg>
  );
}

const ExplorerItemCard = ({
  name,
  type,
  typeLabel,
  createdAtLabel,
  updatedAtLabel,
  detailLabel,
  detailValue,
  isInteractive,
  isPending = false,
  onClick,
  onEdit,
  onDelete,
}: ExplorerItemCardProps) => {
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive || isPending) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive && !isPending ? 0 : -1}
      onClick={() => {
        if (isInteractive && !isPending) {
          onClick();
        }
      }}
      onKeyDown={handleKeyDown}
      className={`group relative rounded-[24px] border border-white/10 bg-[#050505] p-6 text-left transition-all ${
        isInteractive
          ? "cursor-pointer hover:-translate-y-1 hover:border-[#00CEC8]/100 hover:bg-[#0b0b0b] active:translate-y-0"
          : "cursor-default opacity-70"
      } ${isPending ? "cursor-wait" : ""}`}
    >
      {(onEdit || onDelete) && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          {onEdit ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 transition hover:border-[#00CEC8]/50 hover:text-[#00CEC8]"
            >
              Edit
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:border-rose-400/40 hover:bg-rose-500/20"
            >
              Delete
            </button>
          ) : null}
        </div>
      )}

      <div className="flex flex-col items-center pb-10 pt-8 text-center">
        <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
          {renderItemIcon(type)}
        </div>
        <p title={name} className="w-full truncate px-2 text-lg font-semibold leading-tight">
          {name}
        </p>
      </div>

      <div className="space-y-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
        <p>
          Type: <span className="text-white/80">{typeLabel}</span>
        </p>
        <p className="truncate" title={createdAtLabel}>
          Created at: <span className="text-white/80">{createdAtLabel}</span>
        </p>
        <p className="truncate" title={updatedAtLabel}>
          Updated at: <span className="text-white/80">{updatedAtLabel}</span>
        </p>
        {detailLabel && detailValue ? (
          <p className="truncate" title={detailValue}>
            {detailLabel}: <span className="text-white/80">{detailValue}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <div className="h-px flex-1 bg-white/8" />
      </div>

      {isInteractive && (
        <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#00CEC8]">
          <span>{type === "folder" ? "Open folder" : type === "note" ? "Open note" : "Open document"}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      )}

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-black/55">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#050505] px-4 py-2 text-sm text-white">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-[#00CEC8]" />
            Opening...
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorerItemCard;
