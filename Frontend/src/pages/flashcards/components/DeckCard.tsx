interface DeckCardProps {
  title: string;
  subtitle: string;
  meta?: string;
  onClick: () => void;
}

export default function DeckCard({ title, subtitle, meta, onClick }: DeckCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex flex-col h-[220px] bg-black border border-white/20 rounded-[32px] p-[2px] cursor-pointer group hover:border-[#00CEC8]/50 hover:shadow-[0_0_20px_rgba(0,206,200,0.1)] transition-all"
    >
      {/* Top empty space with dots */}
      <div className="flex justify-end pt-4 pr-5 h-16">
        <button className="text-white/40 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5"></circle>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="19" cy="12" r="1.5"></circle>
          </svg>
        </button>
      </div>

      {/* Inner bounded content container */}
      <div className="flex-1 border border-white/90 rounded-[30px] p-6 pb-5 flex flex-col justify-center group-hover:border-[#00CEC8]/80 transition-colors">
        <h3
          title={title}
          className="mb-2 text-[20px] font-bold leading-tight text-white transition-colors group-hover:text-[#00CEC8] line-clamp-2"
        >
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[14px] text-white/50 font-medium">
            {subtitle}
          </p>
          {meta ? (
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
              {meta}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
