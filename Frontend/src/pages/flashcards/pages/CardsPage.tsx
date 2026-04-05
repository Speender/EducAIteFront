import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardRow } from '../components/CardRow';
import { FlashcardsTopActions } from '../components/FlashcardsTopActions';
import SearchBar from '../components/SearchBar';
import { useFlashcards } from '../hooks/useFlashcards';
import { EditModal } from '../components/EditModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import logo from '../../../assets/educAIte-logo.svg';
import AImpatin from '../../../assets/robot.svg';
import { motion } from 'framer-motion';

export function CardsPage() {
  const navigate = useNavigate();
  // We remove filteredCards from here and handle it locally so we can edit/delete instantly
  const { selectedSubdeck, search, setSearch } = useFlashcards();

  // 1. Local State for Cards (Add your actual mock data here)
  const [cards, setCards] = useState([
    { id: 'c1', question: 'What is a Primary Key?', answer: 'A unique identifier for a record in a database table.' },
    { id: 'c2', question: 'What is a Foreign Key?', answer: 'A field in one table that uniquely identifies a row of another table.' },
    { id: 'c3', question: 'What does ACID stand for?', answer: 'Atomicity, Consistency, Isolation, Durability' },
  ]);

  // State for modals tracking which card was clicked
  const [editingCard, setEditingCard] = useState<{ id: string; question: string } | null>(null);
  const [deletingCard, setDeletingCard] = useState<{ id: string; question: string } | null>(null);

  // --- ACTIONS ---

  // 2. Handle Editing a Card
  const handleSaveEdit = (newQuestion: string) => {
    if (editingCard) {
      // Maps through the cards and updates the question of the matching ID
      setCards(prevCards => prevCards.map(card => 
        card.id === editingCard.id ? { ...card, question: newQuestion.trim() } : card
      ));
      setEditingCard(null); // Close modal
    }
  };

  // 3. Handle Deleting a Card
  const handleConfirmDelete = () => {
    if (deletingCard) {
      // Filters out the card with the matching ID
      setCards(prevCards => prevCards.filter(card => card.id !== deletingCard.id));
      setDeletingCard(null); // Close modal
    }
  };

  // 4. Apply the search filter to our local cards state
  const displayedCards = cards.filter(card =>
    card.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black px-8 py-10 text-white font-sans antialiased relative">
      
      {/* HEADER ROW (Back Button & Logo) */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="educAIte" className="h-10 w-auto" />
      </div>

      <main className="max-w-[1400px] mx-auto">


        {/* TITLE & SEARCH ROW */}
        <div className="flex items-end justify-between mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <span className="text-[#00CEC8]">Midterm exam for Database</span> 🔥 <span className="text-[#FF4500]">13</span>
            </h1>
            <p className="text-lg text-white/50 font-medium">
              Keep your daily reviews active to maintain your streak!
            </p>
          </motion.div>

          {/* --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM RIGHT ANIMATION --- */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="w-[320px]"
          >
            <FlashcardsTopActions />
            <SearchBar value={search} onChange={setSearch} />
          </motion.div>
        </div>

        {/* CARDS LIST HEADER */}
        {/* --- WRAPPED IN MOTION.DIV WITH SLIDE-UP FROM BOTTOM ANIMATION --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} // Starts invisible and 50px below
          animate={{ opacity: 1, y: 0 }}    // Slides up into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
        >
          <h2 className="mb-6 text-[22px] font-bold tracking-wide">
            Cards <span className="text-white/40 font-normal">({displayedCards.length})</span>
          </h2>

          {/* HORIZONTAL CARDS LIST */}
          <div className="space-y-6 pb-20">
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