import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { CardRow } from '../components/CardRow';
import { FlashcardsTopActions } from '../components/FlashcardsTopActions';
import SearchBar from '../components/SearchBar';
import { EditModal } from '../components/EditModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import logo from '../../../assets/educAIte-logo.svg';
import { useFlashcards } from '../hooks/useFlashcards';


export function CardsPage() {
  const navigate = useNavigate();
  const { search, setSearch } = useFlashcards();

  // Local State for Cards
  const [cards, setCards] = useState([
    { id: 'c1', question: 'What is a Primary Key?', answer: 'A unique identifier for a record in a database table.' },
    { id: 'c2', question: 'What is a Foreign Key?', answer: 'A field in one table that uniquely identifies a row of another table.' },
    { id: 'c3', question: 'What does ACID stand for?', answer: 'Atomicity, Consistency, Isolation, Durability' },
  ]);

  const [editingCard, setEditingCard] = useState<{ id: string; question: string } | null>(null);
  const [deletingCard, setDeletingCard] = useState<{ id: string; question: string } | null>(null);

  // --- ACTIONS ---
  const handleSaveEdit = (newQuestion: string) => {
    if (editingCard) {
      setCards(prevCards => prevCards.map(card => 
        card.id === editingCard.id ? { ...card, question: newQuestion.trim() } : card
      ));
      setEditingCard(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingCard) {
      setCards(prevCards => prevCards.filter(card => card.id !== deletingCard.id));
      setDeletingCard(null);
    }
  };

  const displayedCards = cards.filter(card =>
    card.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black px-4 lg:px-8 pt-24 pb-10 lg:py-10 text-white font-sans antialiased relative">
      
      {/* HEADER ROW */}
      <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="educAIte" className="h-8 lg:h-10 w-auto" />
      </div>

      <main className="max-w-[1400px] mx-auto">

        {/* TITLE & SEARCH ROW */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between items-center gap-6 lg:gap-0 mb-10 lg:mb-12 text-center lg:text-left">
          
          <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="flex flex-col items-center lg:items-start"
          >
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-[#00CEC8]">Midterm exam for Database</span> 
              <span>🔥 <span className="text-[#FF4500]">13</span></span>
            </h1>
            <p className="text-sm lg:text-lg text-white/50 font-medium max-w-[280px] lg:max-w-none">
              Keep your daily reviews active to maintain your streak!
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[350px] lg:max-w-none lg:w-[320px] mx-auto lg:mx-0 flex flex-col gap-4 lg:gap-4"
          >
            <div className="flex justify-center lg:justify-end w-full">
              <FlashcardsTopActions />
            </div>
            
            <SearchBar value={search} onChange={setSearch} />
          </motion.div>
        </div>

        {/* CARDS LIST HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
        >
          <h2 className="mb-4 lg:mb-6 text-xl lg:text-[22px] font-bold tracking-wide text-center lg:text-left">
            Cards <span className="text-white/40 font-normal">({displayedCards.length})</span>
          </h2>

          <div className="space-y-4 lg:space-y-6 pb-20">
            {displayedCards.map((card) => (
              <CardRow 
                key={card.id} 
                card={card} 
                onEdit={() => setEditingCard({ id: card.id, question: card.question })}
                onDelete={() => setDeletingCard({ id: card.id, question: card.question })}
              />
            ))}
          </div>
        </motion.div>
      </main>

      {/* MODALS RENDERED ABOVE EVERYTHING ELSE */}
      {editingCard && (
        <EditModal 
          title="Edit Flashcard"
          label="Question Text"
          initialValue={editingCard.question}
          onClose={() => setEditingCard(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deletingCard && (
        <DeleteConfirmationModal 
          title={deletingCard.question}
          onClose={() => setDeletingCard(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default CardsPage;