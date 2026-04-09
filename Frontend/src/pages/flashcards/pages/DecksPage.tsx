import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import DeckCard from '../components/DeckCard';
import SearchBar from '../components/SearchBar';
import { AddSubdeckModal } from '../components/AddSubdeckModal'; 
import { EditModal } from '../components/EditModal'; 
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal'; 
import logo from '../../../assets/educAIte-logo.svg'; 
import { useFlashcards } from '../hooks/useFlashcards';

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
    <div className="min-h-screen bg-black px-4 lg:px-8 pt-24 pb-10 lg:py-10 text-white font-sans antialiased relative">
      
      {/* HEADER ROW */}
      <div className="flex items-center gap-4 lg:gap-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="educAIte" className="h-8 lg:h-10 w-auto" />
      </div>

      <main className="max-w-[1400px] mx-auto">
        
        {/* FLOATING ACTION ROW */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }} 
          animate={{ opacity: 1, x: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          // FIX: Centered on mobile, right-aligned exactly as original on laptop
          className="flex justify-center lg:justify-end mb-6 lg:mb-4 w-full"
        >
          <button 
            onClick={() => setIsAddSubdeckModalOpen(true)}
            className="w-full max-w-[350px] sm:w-auto flex justify-center items-center gap-2 bg-white text-black text-sm font-bold px-6 py-3 lg:py-2.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add deck
          </button>
        </motion.div>

        {/* TITLE & SEARCH ROW */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between items-center gap-6 lg:gap-0 mb-10 lg:mb-12 text-center lg:text-left">
          
          <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start"
          >
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-[#00CEC8]">Database Management System</span> 
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
          >
            <SearchBar value={search} onChange={setSearch} />
          </motion.div>
        </div>

        {/* SUBDECKS GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 w-full max-w-[350px] sm:max-w-none mx-auto lg:mx-0"
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