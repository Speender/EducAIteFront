import type { ReactNode } from "react";
import { BookOpenIcon, BrainIcon, FileTextIcon, FolderKanbanIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type WorkspaceOverviewStatsProps = {
  totals: {
    majorDecks: number;
    subDecks: number;
    flashcards: number;
    quizItems: number;
    documents: number;
  };
};

export function WorkspaceOverviewStats({ totals }: WorkspaceOverviewStatsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="border-white/10 bg-[#0b0f14] text-white">
        <CardHeader>
          <CardTitle className="text-xl">Flashcards workspace</CardTitle>
          <CardDescription className="text-white/55">
            Manage major decks, organize subdecks, and run adaptive quiz practice from one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <StatRow icon={<FolderKanbanIcon className="h-4 w-4 text-cyan-300" />} label="Major decks" value={totals.majorDecks} />
          <StatRow icon={<BrainIcon className="h-4 w-4 text-cyan-300" />} label="Subdecks" value={totals.subDecks} />
          <StatRow icon={<BookOpenIcon className="h-4 w-4 text-cyan-300" />} label="Flashcards" value={totals.flashcards} />
          <StatRow icon={<FileTextIcon className="h-4 w-4 text-cyan-300" />} label="Documents" value={totals.documents} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-[#0b0f14] text-white">
        <CardHeader>
          <CardTitle className="text-xl">AI workflow</CardTitle>
          <CardDescription className="text-white/55">
            AI generation stays inside subdecks. The workspace separates deck organization from quiz-item execution.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <InsightTile title="Deck layer" description="Create or open a major deck from the workspace grid." />
          <InsightTile title="Subdeck layer" description="Add focused subdecks for notes, documents, or AI-generated content." />
          <InsightTile title="Practice layer" description={`${totals.quizItems} saved practice items are currently available for adaptive sessions.`} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.03] px-3 py-3">
      <div className="flex items-center gap-3 text-sm text-white/65">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-base font-semibold text-white">{value}</span>
    </div>
  );
}

function InsightTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-2 text-sm font-medium text-white">{title}</div>
      <p className="text-sm leading-6 text-white/55">{description}</p>
    </div>
  );
}
