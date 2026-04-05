import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeckCard from '../components/DeckCard';
import SearchBar from '../components/SearchBar';
import { useFlashcards } from '../hooks/useFlashcards';
import { AddSubdeckModal } from '../components/AddSubdeckModal'; 
import { EditModal } from '../components/EditModal'; // New Import
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal'; // New Import
import logo from '../../../assets/educAIte-logo.svg'; 
import { motion } from 'framer-motion';

export function DecksPage() {
  const navigate = useNavigate();
  const { search, setSearch } = useFlashcards();
  
  // Modal Visibility States
  const [isAddSubdeckModalOpen, setIsAddSubdeckModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; title: string } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; title: string } | null>(null);

  // Data State
  const [subdecks, setSubdecks] = useState([
    { id: '1', title: 'Relational Models and Normalization', cardCount: 2 },
    { id: '2', title: 'Language Paradigms', cardCount: 2 },
    { id: '3', title: 'Task Analysis', cardCount: 120 },
    { id: '4', title: 'Syntax vs Semantics', cardCount: 12 },
    { id: '5', title: 'Machine Learning Fundamentals', cardCount: 27 },
    { id: '6', title: 'Cybersecurity', cardCount: 48 },
  ]);

  // --- ACTIONS ---

  const handleSaveEdit = (newTitle: string) => {
    if (editingItem) {
      setSubdecks(prev => prev.map(deck => 
        deck.id === editingItem.id ? { ...deck, title: newTitle.trim() } : deck
      ));
      setEditingItem(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setSubdecks(prev => prev.filter(deck => deck.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const filteredSubdecks = subdecks.filter(deck =>
    deck.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black px-8 py-10 text-white font-sans antialiased relative">
      
      {/* HEADER ROW */}
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
        
        {/* FLOATING ACTION ROW */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
          animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          className="flex justify-end mb-4"
        >
          <button 
            onClick={() => setIsAddSubdeckModalOpen(true)}
            className="flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add deck
          </button>
        </motion.div>

        {/* TITLE & SEARCH ROW */}
        <div className="flex items-end justify-between mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <span className="text-[#00CEC8]">Database Management System</span> 🔥 <span className="text-[#FF4500]">13</span>
            </h1>
            <p className="text-lg text-white/50 font-medium">
              Keep your daily reviews active to maintain your streak!
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="w-[320px]"
          >
            <SearchBar value={search} onChange={setSearch} />
          </motion.div>
        </div>

        {/* SUBDECKS GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} // Starts invisible and 50px below
          animate={{ opacity: 1, y: 0 }}    // Slides up into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredSubdecks.map((subdeck) => (
            <DeckCard
              key={subdeck.id}
              title={subdeck.title}
              subtitle={`Cards: ${subdeck.cardCount}`}
              onClick={() => navigate(`/cards`)}
              showMenu={true}
              onEdit={() => setEditingItem({ id: subdeck.id, title: subdeck.title })}
              onDelete={() => setDeletingItem({ id: subdeck.id, title: subdeck.title })}
            />
          ))}
        </motion.div>
      </main>

      {/* --- MODAL RENDERING --- */}

      {/* ADD MODAL */}
      {isAddSubdeckModalOpen && (
        <AddSubdeckModal 
          parentDeckName="Database Management System"
          onClose={() => setIsAddSubdeckModalOpen(false)}
          onSubmit={(title) => {
            const newDeck = {
              id: Date.now().toString(),
              title: title,
              cardCount: 0
            };
            setSubdecks(prev => [...prev, newDeck]);
            setIsAddSubdeckModalOpen(false);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editingItem && (
        <EditModal 
          title="Edit Subdeck"
          label="Deck Name"
          initialValue={editingItem.title}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <DeleteConfirmationModal 
          title={deletingItem.title}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      
    </div>
  );
}

export default DecksPage;