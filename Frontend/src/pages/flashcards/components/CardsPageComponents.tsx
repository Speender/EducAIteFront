import { Files, Search, Plus, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface CardsPageHeaderProps {
  workspaceLabel: string;
  count: number;
  onStartReview: () => void;
  onAddCard: () => void;
  onOpenRequestCenter?: () => void;
  requestCount?: number;
  isReviewLoading?: boolean;
  isDataLoading?: boolean;
}

export function CardsPageHeader({
  workspaceLabel,
  count,
  onStartReview,
  onAddCard,
  onOpenRequestCenter,
  requestCount = 0,
  isReviewLoading,
  isDataLoading,
}: CardsPageHeaderProps) {
  return (
    <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#00CEC8]">
          Workspace / {workspaceLabel}
        </p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-white md:text-6xl">
          {count}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-zinc-400">
          Manage your flashcards and start a review session.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onOpenRequestCenter ? (
          <Button
            type="button"
            onClick={onOpenRequestCenter}
            variant="outline"
            size="default"
            className="border-white/10 bg-zinc-950 text-white hover:bg-white/5"
          >
            <Files data-icon="inline-start" />
            Request Center
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/75">
              {requestCount}
            </span>
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={onStartReview}
          variant="default"
          size="default"
          disabled={isReviewLoading || isDataLoading || count === 0}
          className="bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90 disabled:opacity-50"
        >
          {isReviewLoading ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Play data-icon="inline-start" />
          )}
          Start Review
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onAddCard}
          className="border-white/10 bg-zinc-950 text-white hover:bg-white/5"
          aria-label="Add card"
        >
          <Plus data-icon="inline-start" />
        </Button>
      </div>
    </section>
  );
}

interface CardsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function CardsToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}: CardsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Filter cards..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-white/10 bg-zinc-950 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-[#00CEC8]/20"
        />
      </div>

      <Tabs value={sortBy} onValueChange={onSortChange}>
        <TabsList className="border border-white/10 bg-zinc-950 p-1">
          <TabsTrigger
            value="new"
            className="px-4 text-xs data-[state=active]:bg-white/5 data-[state=active]:text-white"
          >
            New Added
          </TabsTrigger>
          <TabsTrigger
            value="created"
            className="px-4 text-xs data-[state=active]:bg-white/5 data-[state=active]:text-white"
          >
            Created At
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export function CardsLoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="border-white/10 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24 bg-zinc-900" />
            <Skeleton className="size-8 rounded-md bg-zinc-900" />
          </div>
          <Skeleton className="mt-6 h-16 w-full bg-zinc-900" />
          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-3 w-16 bg-zinc-900" />
            <Skeleton className="h-10 w-full bg-zinc-900" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-9 w-full bg-zinc-900" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function CardsEmptyState({ onAddCard }: { onAddCard: () => void }) {
  return (
    <Card className="border-dashed border-white/10 bg-zinc-950 p-10 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#00CEC8]/10">
        <Sparkles className="size-5 text-[#00CEC8]" />
      </div>
      <h3 className="text-lg font-medium text-white">No flashcards yet</h3>
      <p className="mt-2 text-sm text-zinc-400">
        Add a card to start building this deck.
      </p>
      <Button
        type="button"
        onClick={onAddCard}
        variant="default"
        size="default"
        className="mt-4 bg-[#00CEC8] text-black hover:bg-[#00CEC8]/90"
      >
        <Plus data-icon="inline-start" />
        Add Card
      </Button>
    </Card>
  );
}

export function CardsErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card className="border-red-500/20 bg-red-500/5 p-6">
      <h3 className="text-base font-medium text-red-300">Unable to load cards</h3>
      <p className="mt-2 text-sm text-zinc-400">
        {error || "Please try again."}
      </p>
      <Button
        type="button"
        variant="outline"
        size="default"
        onClick={onRetry}
        className="mt-4 border-red-500/20 text-red-300 hover:bg-red-500/10"
      >
        Try Again
      </Button>
    </Card>
  );
}
