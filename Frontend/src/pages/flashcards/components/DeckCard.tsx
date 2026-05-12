import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DeckCardAction = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
};

interface DeckCardProps {
  title: string;
  subtitle: string;
  meta?: string;
  onClick: () => void;
  actions?: DeckCardAction[];
}

export default function DeckCard({ title, subtitle, meta, onClick, actions = [] }: DeckCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex flex-col h-[220px] bg-black border border-white/20 rounded-[32px] p-[2px] cursor-pointer group hover:border-[#00CEC8]/50 hover:shadow-[0_0_20px_rgba(0,206,200,0.1)] transition-all"
    >
      <div className="flex justify-end pt-4 pr-5 h-16">
        {actions.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Actions for ${title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEC8]/70"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 border-white/10 bg-zinc-950 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  disabled={action.disabled}
                  className={`cursor-pointer gap-2 focus:bg-white/8 focus:text-white ${
                    action.variant === "destructive" ? "text-rose-300 focus:text-rose-200" : ""
                  }`}
                  onSelect={action.onSelect}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

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
