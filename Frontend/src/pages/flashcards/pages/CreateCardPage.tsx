import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import logo from '../../../assets/educAIte-logo.svg';
import { CardMenu } from '../components/CardMenu';


export function CreateCardPage() {
  const navigate = useNavigate();
  const [activeSubdeck, setActiveSubdeck] = useState('Cards');

  const subdecks = [
    { name: 'Cards', count: 13, emoji: '🔥' },
    { name: 'Subdeck 1', count: 0 },
    { name: 'Subdeck 2', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-black px-4 md:px-8 pt-24 md:py-10 text-white font-sans antialiased relative overflow-x-hidden">
      
      {/* HEADER ROW */}
      <div className="flex items-center gap-4 md:gap-6 mb-8 max-w-[1200px] mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="educAIte" className="h-8 md:h-10 w-auto" />
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto w-full pb-20">
        
        {/* TITLE SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="mb-8 md:mb-12 text-center md:text-left"
        >
          <h1 className="text-2xl md:text-[40px] font-medium tracking-tight text-white/90 px-2">
            Midterm exam for Database
          </h1>
        </motion.div>

        <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
          
          {/* SIDEBAR */}
          <motion.aside 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="space-y-2 w-full max-w-[400px] mx-auto md:max-w-none md:mx-0"
          >
            {subdecks.map((deck) => (
              <button
                key={deck.name}
                onClick={() => setActiveSubdeck(deck.name)}
                className={`w-full flex items-center justify-between px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all ${
                  activeSubdeck === deck.name 
                    ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <span className="text-base md:text-lg font-medium">
                  {deck.name} {deck.emoji}
                </span>
                <span className="text-xs md:text-sm font-mono opacity-50">{deck.count}</span>
              </button>
            ))}

            {/* Add Subdeck Button - Styled to fit mobile row height */}
            <button className="w-full flex items-center justify-center md:justify-start gap-3 px-6 py-3 md:py-4 text-[#00CEC8]/60 hover:text-[#00CEC8] transition-colors text-base md:text-lg font-medium">
              <span className="text-xl md:text-2xl">+</span> Add subdeck
            </button>
          </motion.aside>

          {/* MAIN EDITOR AREA */}
          <motion.section 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="space-y-6 md:space-y-8 w-full"
          >
            <h2 className="text-xl md:text-3xl font-medium text-white/90 mb-4 md:mb-8 text-center md:text-left border-l-4 md:border-l-0 border-[#00CEC8] md:border-transparent pl-4 md:pl-0">
              {activeSubdeck}
            </h2>
            
            <div className="w-full">
              <CardMenu />
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default CreateCardPage;