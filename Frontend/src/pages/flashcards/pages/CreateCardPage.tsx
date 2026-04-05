import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/educAIte-logo.svg';
import { CardMenu } from '../components/CardMenu';
import { motion } from 'framer-motion';

export function CreateCardPage() {
  const navigate = useNavigate();
  const [activeSubdeck, setActiveSubdeck] = useState('Cards');

  const subdecks = [
    { name: 'Cards', count: 13, emoji: '🔥' },
    { name: 'Subdeck 1', count: 0 },
    { name: 'Subdeck 2', count: 0 },
  ];

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

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 pb-20">
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
          animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          className="mb-12"
        >
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight text-white/90">
            Midterm exam for Database
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar / Subdecks */}
          <motion.aside 
            initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="space-y-2"
          >
            {subdecks.map((deck) => (
              <button
                key={deck.name}
                onClick={() => setActiveSubdeck(deck.name)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                  activeSubdeck === deck.name 
                    ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <span className="text-lg font-medium">
                  {deck.name} {deck.emoji}
                </span>
                <span className="text-sm font-mono">{deck.count}</span>
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-6 py-4 text-[#00CEC8]/60 hover:text-[#00CEC8] transition-colors text-lg">
              <span className="text-2xl">+</span> Add subdeck
            </button>
          </motion.aside>

          {/* Main Editor Area */}
          <motion.section 
            initial={{ opacity: 0, y: 50 }}   // Starts invisible and 50px below
            animate={{ opacity: 1, y: 0 }}    // Slides up to its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="space-y-8"
          >
            <h2 className="text-3xl font-medium text-white/90 mb-8">{activeSubdeck}</h2>
            <CardMenu />
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default CreateCardPage;