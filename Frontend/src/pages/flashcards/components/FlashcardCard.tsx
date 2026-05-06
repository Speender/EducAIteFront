import { MoreVertical, BookOpen, Zap, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FlashcardResponseDto } from "@/features/flashcards/api/dto";

interface FlashcardCardProps {
  card: FlashcardResponseDto;
  onEdit: () => void;
  onDelete: () => void;
  onChallenge?: () => void;
  onLearn?: () => void;
}

const technicalItemTypes = new Set([
  "CodeReading",
  "Debugging",
  "Sql",
  "Algorithm",
  "OutputPrediction",
  "FillInCode",
  "Programming",
]);

export function FlashcardCard({
  card,
  onEdit,
  onDelete,
  onChallenge,
  onLearn,
}: FlashcardCardProps) {
  const isTechnicalCard = technicalItemTypes.has(card.itemType ?? "");
  const formattedDate = format(new Date(card.createdAt), "d MMMM");

  return (
    <Card className="flex h-full flex-col overflow-hidden border-white/10 bg-zinc-950 text-white transition-colors hover:border-white/20">
      <CardHeader className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#00CEC8]/40 bg-[#00CEC8]/10 text-[10px] font-medium text-[#00CEC8]"
            >
              {card.itemType ?? "Flashcard"}
            </Badge>
            <span className="text-xs text-zinc-500">{formattedDate}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:bg-transparent hover:text-white"
                aria-label="Card actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 border-white/10 bg-zinc-950 text-white">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer focus:bg-white/5 focus:text-white">
                <Edit2 className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-0">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Prompt</p>
          <h3 className="mt-2 line-clamp-3 text-base font-medium leading-6 text-zinc-100">
            {card.question}
          </h3>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Target</p>
          <div className="mt-2 rounded-xl border border-[#00CEC8]/30 bg-[#00CEC8]/5 p-3 text-sm text-[#00CEC8]">
            <p className="line-clamp-2">{card.answer}</p>
          </div>
        </div>

        {(card.answeringGuidance || card.acceptedAnswerAliases?.length) && (
          <p className="line-clamp-1  text-xs text-zinc-500">
            {card.answeringGuidance || card.acceptedAnswerAliases?.join(", ")}
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto p-3 bg-black">
        {isTechnicalCard && onChallenge ? (
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={onChallenge}
            className="w-full text-[#00CEC8] bg-black"
          >
            <Zap data-icon="inline-start" />
            Test
          </Button>
        ) : onLearn ? (
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={onLearn}
            className="w-full text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <BookOpen data-icon="inline-start" />
            Learn
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={onEdit}
            className="w-full text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <Edit2 data-icon="inline-start" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
