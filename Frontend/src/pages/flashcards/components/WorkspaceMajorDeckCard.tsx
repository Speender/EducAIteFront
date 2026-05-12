import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  FileTextIcon,
  FolderPlusIcon,
  SparklesIcon,
} from "lucide-react";

import type { FlashcardDeckResponseDto } from "@/features/flashcards/api/dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type WorkspaceMajorDeckCardProps = {
  deck: FlashcardDeckResponseDto;
  onOpenDeck: (deck: FlashcardDeckResponseDto) => void;
  onOpenDocuments?: (studentCourseSqid: string) => void;
};

export function WorkspaceMajorDeckCard({
  deck,
  onOpenDeck,
  onOpenDocuments,
}: WorkspaceMajorDeckCardProps) {
  const subDeckCount = deck.subDecks.length;
  const quizItemCount = deck.subDecks.reduce((total, subDeck) => total + subDeck.quizItemCount, 0);

  return (
    <Card className="border-white/10 bg-[#0b0f14] text-white">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{deck.deckName}</CardTitle>
            <CardDescription className="mt-1 text-white/55">
              {deck.sourceType === "Course"
                ? "Course-backed workspace deck with subdecks for adaptive quiz practice."
                : "Manual workspace deck for self-organized study and AI-generated quiz work."}
            </CardDescription>
          </div>
          <CardAction className="static">
            <Badge
              variant="outline"
              className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
            >
              {deck.sourceType}
            </Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {deck.edpCode ? (
          <div className="inline-flex w-fit items-center rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            {deck.edpCode}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricTile icon={<FolderPlusIcon className="h-4 w-4" />} label="Subdecks" value={subDeckCount} />
          <MetricTile icon={<SparklesIcon className="h-4 w-4" />} label="Quiz items" value={quizItemCount} />
          <MetricTile icon={<FileTextIcon className="h-4 w-4" />} label="Documents" value={deck.documentCount} />
          <MetricTile icon={<BookOpenIcon className="h-4 w-4" />} label="Flashcards" value={deck.flashcardCount} />
        </div>

        <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3 text-sm text-white/55">
          <div className="mb-2 flex items-center gap-2 text-white/80">
            <BrainIcon className="h-4 w-4 text-cyan-300" />
            Smart Quiz workspace
          </div>
          <p>
            Open this deck to create subdecks, generate practice items, and run adaptive sessions.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-white/10 bg-white/[0.03]">
        {deck.studentCourseSqid && onOpenDocuments ? (
          <Button
            type="button"
            variant="outline"
            className="border-white/12 bg-transparent text-white hover:bg-white/8"
            onClick={() => onOpenDocuments(deck.studentCourseSqid!)}
          >
            <FileTextIcon data-icon="inline-start" />
            Documents
          </Button>
        ) : (
          <span className="text-xs text-white/35">Manual deck</span>
        )}

        <Button
          type="button"
          className="bg-cyan-400 text-black hover:bg-cyan-300"
          onClick={() => onOpenDeck(deck)}
        >
          <ArrowRightIcon data-icon="inline-start" />
          Open workspace
        </Button>
      </CardFooter>
    </Card>
  );
}

function MetricTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-white/45">
        <span>{label}</span>
        <span className="text-cyan-200">{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}
