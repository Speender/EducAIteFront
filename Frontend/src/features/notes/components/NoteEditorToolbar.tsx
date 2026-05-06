type NoteEditorToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onBulletList: () => void;
  onNumberedList: () => void;
};

function ToolbarButton({
  label,
  title,
  onClick,
  className = "",
}: {
  label: string;
  title: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-white/75 transition hover:border-[#00CEC8]/50 hover:text-[#00CEC8] ${className}`}
    >
      {label}
    </button>
  );
}

const NoteEditorToolbar = ({
  onBold,
  onItalic,
  onUnderline,
  onBulletList,
  onNumberedList,
}: NoteEditorToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-white/10 bg-black/30 p-4">
      <ToolbarButton label="B" title="Bold" onClick={onBold} className="text-base" />
      <ToolbarButton label="I" title="Italic" onClick={onItalic} className="text-base italic" />
      <ToolbarButton label="U" title="Underline" onClick={onUnderline} className="text-base underline" />
      <div className="h-8 w-px bg-white/10" />
      <ToolbarButton label="Bullet" title="Bullet list" onClick={onBulletList} />
      <ToolbarButton label="Numbered" title="Numbered list" onClick={onNumberedList} />
    </div>
  );
};

export default NoteEditorToolbar;
