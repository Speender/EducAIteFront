import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import DeckCard from '../components/DeckCard';
import FlashcardOverviewSidebar from '../components/FlashcardOverviewSidebar';
import SearchBar from '../components/SearchBar';
import { AddDeckModal } from '../components/AddDeckModal';
import Logo from '../../../components/Logo';
import { useFlashcards } from '../hooks/useFlashcards';

export function FlashcardsOverviewPage() {
  const navigate = useNavigate();
  const { stats, filteredDecks, search, setSearch, setSelectedDeckId } = useFlashcards();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black px-4 lg:px-12 pt-28 pb-10 lg:py-12 text-white font-sans antialiased relative">
      
      {/* LOGO: Centered on mobile, left-aligned on laptop */}
      <div className="relative z-50 mb-8 lg:mb-20 flex justify-center lg:justify-start"> 
        <Logo />
      </div>

      {/* MAIN LAYOUT: Stacked on mobile, reverts to flex-row gap-14 on laptop */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 relative z-10">
        <motion.aside 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="w-full max-w-[380px] mx-auto lg:max-w-none lg:mx-0 lg:w-72 flex-shrink-0"
        >
          <FlashcardOverviewSidebar stats={stats} />
        </motion.aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col items-center lg:items-stretch">
          
          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="w-full"
          >
            {/* ACTION BUTTON: Centered on mobile, aligned right on laptop */}
            <div className="flex justify-center lg:justify-end mb-8 lg:mb-8 w-full">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-full max-w-[380px] sm:w-auto flex justify-center items-center gap-2 bg-white text-black text-[13px] font-bold px-7 py-3.5 lg:py-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add deck
              </button>
            </div>

            {/* HEADER & SEARCH: Stacked and centered on mobile, exactly as original on laptop */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between items-center gap-6 mb-10 lg:mb-16 text-center lg:text-left">
              
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-4xl lg:text-[44px] font-semibold tracking-tight mb-3 flex items-center justify-center lg:justify-start">
                  <span className="text-[#00CEC8]">My Deck</span> 
                  <span className="mx-2 opacity-80 text-3xl lg:text-4xl">🔥</span> 
                  <span className="text-[#FF4500]">13</span>
                </h1>
                <p className="text-sm lg:text-xl text-white/40 font-medium max-w-[280px] lg:max-w-lg leading-relaxed">
                  Keep your daily reviews active to maintain your streak!
                </p>
              </div>

              {/* SEARCH: Centered compact max-width on mobile, exactly 350px on laptop */}
              <div className="w-full max-w-[350px] lg:max-w-none lg:w-[350px]">
                <SearchBar value={search} onChange={setSearch} />
              </div>

            </div>
          </motion.div>

          {/* DECKS GRID: Centered column on mobile, original grid on laptop */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 w-full max-w-[380px] sm:max-w-none mx-auto lg:mx-0"
          >
              {filteredDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  title={deck.title}
                  subtitle={`Decks: ${deck.subdeckCount}`}
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    navigate(`/flashcards/decks/${deck.id}`);
                  }}
                />
              ))}
          </motion.div>
        </main>
      </div>

      {/* ADD DECK MODAL */}
      {isAddModalOpen && (
        <AddDeckModal 
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(title, color) => {
            console.log("New Main Deck submitted:", title, color);
            setIsAddModalOpen(false);
          }}
        />
      )}

    </div>
  );
}

export default FlashcardsOverviewPage;