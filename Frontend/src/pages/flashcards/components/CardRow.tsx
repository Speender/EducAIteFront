import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon, ZapIcon, BookOpenIcon } from "lucide-react";

interface CardRowProps {
  card: {
    sqid: string;
    question: string;
    answer: string;
    conceptExplanation?: string;
    answeringGuidance?: string;
    acceptedAnswerAliases?: string[];
    itemType?: string;
    technicalLanguage?: string;
  };
  onLearn?: () => void;
  onChallenge?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const technicalItemTypes = new Set(["CodeReading", "Debugging", "Sql", "Algorithm", "OutputPrediction", "FillInCode"]);

export function CardRow({ card, onLearn, onChallenge, onEdit, onDelete }: CardRowProps) {
  const isTechnicalCard = technicalItemTypes.has(card.itemType ?? "");

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/[0.03] bg-white/[0.01] transition-all hover:border-primary/20 hover:bg-white/[0.02]">
      <div className="flex flex-col flex-1 p-6 sm:p-8">
        {/* Top Meta */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {card.itemType && (
              <span className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                {card.itemType}
              </span>
            )}
            <span className="font-mono text-[8px] uppercase tracking-tighter text-white/5">
              ID_{card.sqid.slice(0, 6)}
            </span>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-7 w-7 rounded-md text-white/20 hover:bg-white/5 hover:text-white"
              >
                <Edit2Icon className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-7 w-7 rounded-md text-white/20 hover:bg-rose-500/10 hover:text-rose-400"
              >
                <Trash2Icon className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Area */}
        <div className="mb-6 flex-1">
          <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Prompt</span>
          <h3 className="line-clamp-4 text-lg font-medium leading-snug text-white group-hover:text-primary/90 transition-colors">
            {card.question}
          </h3>
        </div>

        {/* Answer Area */}
        <div className="mb-6">
          <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Target</span>
          <div className="rounded-lg border border-white/[0.03] bg-black/20 p-3">
            <span className="line-clamp-2 text-base font-bold tracking-tight text-primary">
              {card.answer}
            </span>
          </div>
        </div>

        {/* Protocol/Guidance Snippet */}
        {(card.answeringGuidance || card.acceptedAnswerAliases?.length) && (
          <div className="border-t border-white/[0.02] pt-4 mt-auto">
            <p className="line-clamp-2 text-[11px] leading-relaxed text-white/30">
              {card.answeringGuidance || card.acceptedAnswerAliases?.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-white/[0.03] bg-white/[0.01] p-4 flex gap-2">
        {onLearn && (
          <Button
            size="sm"
            onClick={onLearn}
            className="flex-1 h-9 rounded-lg bg-white text-[10px] font-black uppercase tracking-widest text-black hover:bg-white/90"
          >
            <BookOpenIcon className="mr-2 h-3 w-3" />
            Learn
          </Button>
        )}
        {isTechnicalCard && onChallenge && (
          <Button
            variant="outline"
            size="sm"
            onClick={onChallenge}
            className="flex-1 h-9 rounded-lg border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10"
          >
            <ZapIcon className="mr-2 h-3 w-3" />
            Test
          </Button>
        )}
      </div>
    </div>
  );
}




