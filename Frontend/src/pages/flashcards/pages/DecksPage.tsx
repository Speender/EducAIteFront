import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderPlus } from "lucide-react";

import {
  useCreateWorkspaceSubDeckMutation,
  useFlashcardWorkspaceLatestQuery,
  useWorkspaceSubDecksQuery,
} from "@/features/flashcards/api/hooks";
import { getFlashcardDocumentCardsPath, getFlashcardWorkspacePath } from "@/features/flashcards/routes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ToastProvider";
import logo from "../../../assets/educAIte-logo.svg";

import { CreateSubDeckDialog } from "../components/CreateSubDeckDialog";
import DeckCard from "../components/DeckCard";
import SearchBar from "../components/SearchBar";

export function DecksPage() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { studentCourseSqid: majorDeckSqid } = useParams();
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const subDecksQuery = useWorkspaceSubDecksQuery(majorDeckSqid ?? null);
  const createSubDeckMutation = useCreateWorkspaceSubDeckMutation(majorDeckSqid ?? null);
  const selectedDeck =
    (workspaceQuery.data?.decks ?? []).find((deck) => deck.majorDeckSqid === majorDeckSqid) ?? null;

  const filteredSubDecks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const subDecks = subDecksQuery.data ?? [];
    if (!normalizedSearch) {
      return subDecks;
    }

    return subDecks.filter((subDeck) =>
      [subDeck.title, subDeck.sourceType].join(" ").toLowerCase().includes(normalizedSearch),
    );
  }, [search, subDecksQuery.data]);

  async function handleCreateSubDeck(payload: {
    title: string;
    description: string;
    sourceType: number;
  }) {
    await createSubDeckMutation.mutateAsync({
      ...payload,
      difficultyFloor: 0,
      difficultyCeiling: 100,
      visibility: 0,
      status: 1,
    });

    setIsCreateDialogOpen(false);
    showSuccess("Subdeck created.");
  }

  return (
    <div className="min-h-screen bg-black px-4 md:px-8 pb-20 pt-24 md:pt-32 font-sans text-white antialiased">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 md:mb-14 flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => navigate(getFlashcardWorkspacePath())}
            className="flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/50 transition-all hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <img src={logo} alt="educAIte" className="h-8 md:h-10" />
        </div>

        <div className="mb-10 md:mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1
              title={selectedDeck?.deckName ?? "Workspace Deck"}
              className="mb-2 truncate text-3xl md:text-4xl font-bold tracking-tight text-[#00CEC8]"
            >
              {selectedDeck?.deckName ?? "Workspace Deck"} <span className="text-[#FF4500]"></span>
            </h1>
            <p className="text-base md:text-lg font-medium text-white/50">
              Open a subdeck to manage practice items and adaptive sessions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:items-center">
            <div className="w-full sm:w-[320px]">
              <SearchBar value={search} onChange={setSearch} placeholder="Search subdecks" />
            </div>
            <Button
              type="button"
              className="h-11 md:h-12 w-full sm:w-auto rounded-full bg-[#00CEC8] px-8 text-sm font-bold text-black hover:bg-[#34e5df] transition-all"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <FolderPlus className="h-4 w-4" />
              Add Subdeck
            </Button>
          </div>
        </div>

        {workspaceQuery.isLoading || subDecksQuery.isLoading ? (
          <div className="rounded-[32px] border border-white/10 bg-[#050505] px-8 py-16 text-center text-white/55">
            Loading subdecks...
          </div>
        ) : workspaceQuery.error || subDecksQuery.error ? (
          <div className="rounded-[32px] border border-rose-400/20 bg-rose-500/10 px-8 py-16 text-center text-rose-100">
            Unable to load the subdecks.
          </div>
        ) : !selectedDeck ? (
          <div className="rounded-[32px] border border-white/10 bg-[#050505] px-8 py-16 text-center text-white/55">
            Workspace deck not found in the latest flashcards workspace.
          </div>
        ) : filteredSubDecks.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-white/10 bg-[#050505] px-8 py-16 text-center text-white/50">
            {(subDecksQuery.data?.length ?? 0)
              ? "No subdecks matched your search."
              : "No subdecks are available in this deck yet. Create one from this page first."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubDecks.map((subDeck) => (
              <DeckCard
                key={subDeck.deckSqid}
                title={subDeck.title}
                subtitle={`Practice Items: ${subDeck.quizItemCount}`}
                meta={subDeck.sourceType}
                onClick={() =>
                  navigate(
                    majorDeckSqid
                      ? getFlashcardDocumentCardsPath(majorDeckSqid, subDeck.deckSqid)
                      : "/flashcards",
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      <CreateSubDeckDialog
        open={isCreateDialogOpen}
        isSubmitting={createSubDeckMutation.isPending}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubDeck}
      />
    </div>
  );
}

export default DecksPage;
