import { useNavigate, useParams } from "react-router-dom";

import {
  useFlashcardDocumentsQuery,
  useFlashcardReviewQueueQuery,
  useFlashcardWorkspaceLatestQuery,
  useFlashcardsByDocumentQuery,
} from "@/features/flashcards/api/hooks";
import {
  getFlashcardDocumentCardsPath,
  getFlashcardLearnPath,
} from "@/features/flashcards/routes";
import { useStudentCoursePerformanceQuery } from "@/features/student-performance/api/hooks";
import logo from "../../../assets/educAIte-logo.svg";

export function PerformancePage() {
  const navigate = useNavigate();
  const { studentCourseSqid, documentSqid } = useParams();

  const workspaceQuery = useFlashcardWorkspaceLatestQuery();
  const documentsQuery = useFlashcardDocumentsQuery(studentCourseSqid ?? null);
  const cardsQuery = useFlashcardsByDocumentQuery(documentSqid ?? null);
  const coursePerformanceQuery = useStudentCoursePerformanceQuery(studentCourseSqid ?? null);
  const reviewQueueQuery = useFlashcardReviewQueueQuery();

  const selectedDeck = (workspaceQuery.data?.decks ?? []).find((deck) => deck.studentCourseSqid === studentCourseSqid) ?? null;
  const selectedDocument =
    (documentsQuery.data ?? []).find((document) => document.sqid === documentSqid) ?? null;
  const dueFlashcards = (reviewQueueQuery.data ?? []).filter(
    (item) => item.studentCourseSqid === studentCourseSqid,
  ).length;

  const handleBack = () => {
    if (studentCourseSqid && documentSqid) {
      navigate(getFlashcardDocumentCardsPath(studentCourseSqid, documentSqid));
      return;
    }

    navigate(-1);
  };

  const handleBackToLesson = () => {
    if (studentCourseSqid && documentSqid) {
      navigate(getFlashcardLearnPath(studentCourseSqid, documentSqid));
      return;
    }

    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black px-8 py-8 font-sans text-white antialiased">
      <div className="mx-auto max-w-[1200px] pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 transition-all hover:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <img src={logo} alt="educAIte" className="h-8" />
          </div>
        </div>

        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-[44px] font-semibold tracking-tight text-[#00CEC8]">Flashcard Performance</h1>
            <p
              title={
                selectedDeck && selectedDocument
                  ? `${selectedDeck.deckName} | ${selectedDocument.name}`
                  : undefined
              }
              className="mt-2 truncate text-white/55"
            >
              {selectedDeck?.deckName ?? "Deck"} | {selectedDocument?.name ?? "Document"}
            </p>
          </div>
          <button
            onClick={handleBackToLesson}
            className="rounded-full bg-white px-8 py-2.5 text-sm font-bold text-black transition hover:scale-105"
          >
            Back to lesson
          </button>
        </div>

        {coursePerformanceQuery.isLoading || cardsQuery.isLoading ? (
          <div className="rounded-[32px] border border-white/10 bg-[#050505] px-8 py-16 text-center text-white/55">
            Loading performance insights...
          </div>
        ) : coursePerformanceQuery.error || cardsQuery.error ? (
          <div className="rounded-[32px] border border-rose-400/20 bg-rose-500/10 px-8 py-16 text-center text-rose-100">
            Unable to load flashcard performance.
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-white/20 bg-[#050505] p-6">
                <p className="mb-2 text-[44px] font-bold leading-none text-[#00CEC8]">
                  {cardsQuery.data?.length ?? 0}
                </p>
                <p className="text-[15px] font-medium text-white/80">Cards in document</p>
              </div>
              <div className="rounded-[24px] border border-white/20 bg-[#050505] p-6">
                <p className="mb-2 text-[44px] font-bold leading-none text-[#00CEC8]">
                  {Math.round(Number(coursePerformanceQuery.data?.overallPerformanceScore ?? 0))}%
                </p>
                <p className="text-[15px] font-medium text-white/80">Overall course performance</p>
              </div>
              <div className="rounded-[24px] border border-white/20 bg-[#050505] p-6">
                <p className="mb-2 text-[44px] font-bold leading-none text-[#00CEC8]">
                  {Math.round(Number(coursePerformanceQuery.data?.learningRetentionRate ?? 0))}%
                </p>
                <p className="text-[15px] font-medium text-white/80">Retention rate</p>
              </div>
              <div className="rounded-[24px] border border-white/20 bg-[#050505] p-6">
                <p className="mb-2 text-[44px] font-bold leading-none text-[#00CEC8]">{dueFlashcards}</p>
                <p className="text-[15px] font-medium text-white/80">Cards due now</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[24px] border border-white/20 bg-[#050505] p-8">
                <h2 className="mb-4 text-[18px] font-semibold text-[#00CEC8]">Course Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">Tracked flashcards</p>
                    <p className="mt-3 text-3xl font-bold text-white">{coursePerformanceQuery.data?.trackedFlashcardsCount ?? 0}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">Mastered</p>
                    <p className="mt-3 text-3xl font-bold text-white">{coursePerformanceQuery.data?.masteredFlashcardsCount ?? 0}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">Accuracy</p>
                    <p className="mt-3 text-3xl font-bold text-white">{Math.round(Number(coursePerformanceQuery.data?.flashcardAccuracyRate ?? 0))}%</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">Confidence</p>
                    <p className="mt-3 text-3xl font-bold text-white">{Math.round(Number(coursePerformanceQuery.data?.confidenceScore ?? 0))}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/20 bg-[#050505] p-8">
                  <h3 className="mb-4 text-[18px] font-semibold text-[#00CEC8]">AI Insight</h3>
                  <p className="text-[13px] font-medium leading-[1.8] text-white/90">
                    {coursePerformanceQuery.data?.aiInsight || "Keep practicing this document to generate stronger analytics."}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/20 bg-[#050505] p-8">
                  <h3 className="mb-4 text-[18px] font-semibold text-[#00CEC8]">Improvement Suggestion</h3>
                  <p className="text-[13px] font-medium leading-[1.8] text-white/90">
                    {coursePerformanceQuery.data?.improvementSuggestion || "Answer more cards to unlock targeted study suggestions."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PerformancePage;
