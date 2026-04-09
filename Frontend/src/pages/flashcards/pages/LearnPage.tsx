import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import logo from '../../../assets/educAIte-logo.svg';

export function LearnPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const total = 2; 

  const currentCard = {
    question: "Before the rise of machines and technology, how was the act of listening primarily experienced?",
    answer: "Through oral traditions, live storytelling, and face-to-face communication."
  };

  const handleNext = () => {
    setIsFlipped(false);
    setIndex((value) => Math.min(total, value + 1));
    navigate('/code-learn'); 
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setIndex((value) => Math.max(1, value - 1));
  };

  return (
    <div className="min-h-screen bg-black px-4 lg:px-8 pt-24 pb-10 lg:py-10 text-white font-sans antialiased relative">
      
      {/* HEADER ROW */}
      <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-8">
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

      <main className="flex-1 flex flex-col items-center w-full z-10 max-w-[1200px] mx-auto">
        
        {/* --- PAGE TITLE --- */}
        <motion.div 
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="mb-10 lg:mb-16 text-center px-2"
        >
          <h1 className="text-2xl lg:text-[38px] font-medium tracking-wide text-white/90">
            Midterm exam for Database
          </h1>
          <div className="h-[2px] w-16 lg:w-20 bg-[#00CEC8]/60 mx-auto mt-3 rounded-full"></div>
        </motion.div>

        {/* --- FLIPPING MAIN FLASHCARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}  
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="w-full max-w-5xl [perspective:1500px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full min-h-[320px] lg:min-h-[500px] transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* FRONT OF CARD (Question) */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] lg:rounded-[40px] bg-[#272365] px-6 py-8 lg:px-10 lg:py-16 flex flex-col items-center justify-center shadow-[0_0_70px_rgba(0,0,0,0.4)] border border-white/5 [backface-visibility:hidden]">
              
              <div className="absolute top-6 right-6 lg:top-10 lg:right-10 text-[#FFD700]/80">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-7 lg:h-7">
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                  <path d="M9 21h6v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1z" />
                </svg>
              </div>
              <p className="text-white/40 text-[10px] lg:text-sm tracking-[0.2em] uppercase font-bold mb-4 lg:mb-6 mt-auto">Question</p>
              <p className="max-w-4xl text-lg sm:text-xl lg:text-[40px] leading-[1.4] font-normal text-center text-white/95 tracking-tight px-2 mb-auto">
                {currentCard.question}
              </p>
              
              <p className="absolute bottom-5 lg:bottom-10 text-white/20 text-[10px] lg:text-sm animate-pulse">Click card to reveal answer</p>
            </div>

            {/* BACK OF CARD (Answer) */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] lg:rounded-[40px] bg-[#272365] px-4 py-8 lg:px-10 lg:py-16 flex flex-col items-center justify-center shadow-[0_0_70px_rgba(0,0,0,0.4)] border border-white/5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              
              <div className="absolute top-6 right-6 lg:top-10 lg:right-10 text-[#FFD700]/80">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-7 lg:h-7">
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                  <path d="M9 21h6v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1z" />
                </svg>
              </div>
              <p className="text-white/40 text-[10px] lg:text-sm tracking-[0.2em] uppercase font-bold mb-3 lg:mb-6 mt-auto">Answer</p>
              <p className="max-w-4xl text-lg sm:text-xl lg:text-[40px] leading-[1.4] font-normal text-center text-white/95 tracking-tight mb-8 lg:mb-16 px-4">
                {currentCard.answer}
              </p>
              <div 
                className="flex flex-row justify-center gap-2 lg:gap-5 mt-auto w-full px-2 lg:px-0"
                onClick={(e) => e.stopPropagation()} 
              >
                <button 
                  onClick={handleNext} 
                  className="flex-1 rounded-lg lg:rounded-xl bg-white px-2 py-2.5 lg:px-10 lg:py-3.5 text-black font-semibold text-[11px] lg:text-[14px] hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Mastered
                </button>
                <button 
                  onClick={handleNext} 
                  className="flex-1 rounded-lg lg:rounded-xl bg-white px-2 py-2.5 lg:px-10 lg:py-3.5 text-black font-semibold text-[11px] lg:text-[14px] hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Almost
                </button>
                <button 
                  onClick={handleNext} 
                  className="flex-1 rounded-lg lg:rounded-xl bg-white px-2 py-2.5 lg:px-10 lg:py-3.5 text-black font-semibold text-[11px] lg:text-[14px] hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Unfamiliar
                </button>
              </div>

            </div>

          </div>
        </motion.div>

        {/* --- NAVIGATION CONTROLS --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}   
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="mt-10 lg:mt-16 flex items-center justify-center gap-6 lg:gap-12 z-20"
        >
          <button
            onClick={handlePrev}
            disabled={index === 1}
            className={`w-[60px] lg:w-[90px] h-[45px] lg:h-[50px] rounded-full flex items-center justify-center transition-all ${
              index === 1 
                ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                : 'bg-[#272365] text-white hover:bg-[#342f85] border border-white/10 shadow-lg'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div className="text-xl lg:text-[28px] font-medium tracking-widest text-white/80 flex items-center">
            {index}<span className="text-white/20 mx-2 font-light">/</span>{total}
          </div>

          <button
            onClick={handleNext} 
            className="w-[60px] lg:w-[90px] h-[45px] lg:h-[50px] rounded-full flex items-center justify-center transition-all bg-[#272365] text-white hover:bg-[#342f85] border border-white/10 shadow-lg"
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </motion.div>
      </main>
    </div>
  );
}

export default LearnPage;