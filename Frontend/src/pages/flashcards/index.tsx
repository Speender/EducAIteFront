import { Navigate, Route, Routes } from "react-router-dom";

import FlashcardsOverviewPage from "./pages/FlashcardsOverviewPage";
import DecksPage from "./pages/DecksPage";
import CardsPage from "./pages/CardsPage";
import CreateCardPage from "./pages/CreateCardPage";
import LearnPage from "./pages/LearnPage";
import SessionPage from "./pages/SessionPage";
import CodingChallengePage from "./pages/CodingChallengePage";
import PerformancePage from "./pages/PerformancePage";

const Flashcards: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/flashcards/workspace" replace />} />
        <Route path="workspace" element={<FlashcardsOverviewPage />} />
        <Route path="workspace/:studentCourseSqid" element={<DecksPage />} />
        <Route path="workspace/:majorDeckSqid/:deckSqid/cards" element={<CardsPage />} />
        <Route
          path="workspace/:majorDeckSqid/:deckSqid/cards/create"
          element={<CreateCardPage />}
        />
        <Route
          path="workspace/:studentCourseSqid/:documentSqid/cards/learn"
          element={<LearnPage />}
        />
        <Route
          path="workspace/:studentCourseSqid/:documentSqid/cards/session"
          element={<SessionPage />}
        />
        <Route
          path="workspace/:studentCourseSqid/:documentSqid/cards/challenge"
          element={<CodingChallengePage />}
        />
        <Route
          path="workspace/:studentCourseSqid/:documentSqid/cards/performance"
          element={<PerformancePage />}
        />
        <Route path="decks/:deckId" element={<Navigate to="/flashcards/workspace" replace />} />
        <Route path="decks/:deckId/cards/:subdeckId" element={<Navigate to="/flashcards/workspace" replace />} />
        <Route path="decks/:deckId/cards/:subdeckId/create" element={<Navigate to="/flashcards/workspace" replace />} />
        <Route path="decks/:deckId/cards/:subdeckId/learn" element={<Navigate to="/flashcards/workspace" replace />} />
        <Route path="decks/:deckId/cards/:subdeckId/challenge" element={<Navigate to="/flashcards/workspace" replace />} />
        <Route path="decks/:deckId/cards/:subdeckId/performance" element={<Navigate to="/flashcards/workspace" replace />} />
        <Route path="*" element={<Navigate to="/flashcards" replace />} />
      </Routes>
    </>
  );
};

export default Flashcards;
