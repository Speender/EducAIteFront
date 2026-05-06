import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

import { useToast } from "@/components/ToastProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useDeleteDeckFlashcardMutation,
  useDeckFlashcardsQuery,
  useFlashcardWorkspaceLatestQuery,
  useStartFlashcardLearnSessionFlowMutation,
  useWorkspaceSubDecksQuery,
} from "@/features/flashcards/api/hooks";
import {
  getFlashcardChallengePath,
  getFlashcardCourseDocumentsPath,
  getFlashcardCreateCardPath,
  getFlashcardLearnPath,
} from "@/features/flashcards/routes";
import logo from "../../../assets/educAIte-logo.svg";

import { FlashcardCard } from "../components/FlashcardCard";
import {
  CardsPageHeader,
  CardsToolbar,
  CardsLoadingState,
  CardsEmptyState,
  CardsErrorState,
} from "../components/CardsPageComponents";

export function CardsPage() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { majorDeckSqid, deckSqid } = useParams();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("new");
  const [sessionLaunchError, setSessionLaunchError] = useState<string | null>(null);

  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const subDecksQuery = useWorkspaceSubDecksQuery(majorDeckSqid ?? null);
  const cardsQuery = useDeckFlashcardsQuery(deckSqid ?? null);
  const deleteFlashcardMutation = useDeleteDeckFlashcardMutation(deckSqid ?? null);
  const startFlowMutation = useStartFlashcardLearnSessionFlowMutation();

  const selectedMajorDeck =
    (workspaceQuery.data?.decks ?? []).find((deck) => deck.majorDeckSqid === majorDeckSqid) ?? null;
  const selectedSubDeck =
    (subDecksQuery.data ?? []).find((subDeck) => subDeck.deckSqid === deckSqid) ?? null;
  const sessionStudentCourseSqid = selectedMajorDeck?.studentCourseSqid ?? null;
  const sessionDeckSqid = selectedSubDeck?.deckSqid ?? null;
  const sessionScopeType = sessionStudentCourseSqid ? "Course" : "Overall";

  const sortedAndFilteredCards = useMemo(() => {
    let result = (cardsQuery.data ?? []).filter((card) =>
      `${card.question} ${card.answer}`.toLowerCase().includes(search.trim().toLowerCase()),
    );

    if (sortBy === "new") {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "created") {
      result = [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return result;
  }, [cardsQuery.data, search, sortBy]);

  const startReview = () => {
    if (!sessionDeckSqid) {
      setSessionLaunchError("This review flow requires a valid deck.");
      return;
    }

    setSessionLaunchError(null);

    startFlowMutation.mutate(
      {
        scopeType: sessionScopeType,
        studentCourseSqid: sessionStudentCourseSqid ?? undefined,
        deckSqid: sessionDeckSqid,
        take: Math.max(cardsQuery.data?.length ?? 0, 1),
        startMode: "auto",
      },
      {
        onSuccess: () => {
          if (majorDeckSqid && deckSqid) {
            navigate(getFlashcardLearnPath(majorDeckSqid, deckSqid));
          }
        },
      },
    );
  };

  const handleAddCard = () => {
    navigate(
      majorDeckSqid && deckSqid
        ? getFlashcardCreateCardPath(majorDeckSqid, deckSqid)
        : "/flashcards",
    );
  };

  return (
    <div className="min-h-screen bg-black px-4 pb-16 pt-28 text-white selection:bg-[#00CEC8]/30 selection:text-[#00CEC8] sm:px-6 lg:px-8">
      <main className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl border-white/15 bg-zinc-950 text-white hover:bg-zinc-900"
            onClick={() => navigate(majorDeckSqid ? getFlashcardCourseDocumentsPath(majorDeckSqid) : "/flashcards")}
            aria-label="Back to documents"
          >
            <ArrowLeftIcon data-icon="inline-start" />
          </Button>
          <img src={logo} alt="educAIte" className="h-5 opacity-70" />
        </div>

        <div className="space-y-8">
          <CardsPageHeader
            workspaceLabel={selectedMajorDeck?.deckName ?? "General"}
            count={cardsQuery.data?.length ?? 0}
            onStartReview={startReview}
            onAddCard={handleAddCard}
            isReviewLoading={startFlowMutation.isPending}
            isDataLoading={cardsQuery.isLoading}
          />

          <CardsToolbar
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {(startFlowMutation.error || sessionLaunchError) && (
            <Card className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              {sessionLaunchError || "Initialization failed. Please check your connection and try again."}
            </Card>
          )}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Cards</h2>
              <span className="text-sm text-zinc-400">{sortedAndFilteredCards.length} total</span>
            </div>

            {cardsQuery.isLoading ? (
              <CardsLoadingState />
            ) : cardsQuery.isError ? (
              <CardsErrorState
                error={cardsQuery.error instanceof Error ? cardsQuery.error.message : "Failed to load cards"}
                onRetry={() => cardsQuery.refetch()}
              />
            ) : sortedAndFilteredCards.length === 0 ? (
              search ? (
                <Card className="rounded-xl border border-dashed border-white/10 bg-zinc-950 p-10 text-center">
                  <p className="text-sm font-medium text-zinc-300">No matches for "{search}"</p>
                  <Button
                    type="button"
                    variant="link"
                    size="default"
                    onClick={() => setSearch("")}
                    className="mt-1 px-0 text-[#00CEC8] hover:text-[#00CEC8]/90"
                  >
                    Clear filter
                  </Button>
                </Card>
              ) : (
                <CardsEmptyState onAddCard={handleAddCard} />
              )
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedAndFilteredCards.map((card) => (
                  <FlashcardCard
                    key={card.sqid}
                    card={card}
                    onEdit={() =>
                      navigate(
                        majorDeckSqid && deckSqid
                          ? `${getFlashcardCreateCardPath(majorDeckSqid, deckSqid)}?flashcard=${encodeURIComponent(card.sqid)}`
                          : "/flashcards",
                      )
                    }
                    onChallenge={() =>
                      navigate(
                        majorDeckSqid && deckSqid
                          ? getFlashcardChallengePath(majorDeckSqid, deckSqid, card.sqid)
                          : "/flashcards",
                      )
                    }
                    onDelete={() => {
                      if (!window.confirm("Delete record?")) return;
                      deleteFlashcardMutation.mutate(card.sqid, {
                        onSuccess: () => showSuccess("Record deleted."),
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CardsPage;
