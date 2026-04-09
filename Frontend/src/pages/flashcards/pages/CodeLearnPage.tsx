import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import logo from '../../../assets/educAIte-logo.svg';
import { QuizScoreModal } from '../components/QuizScoreModal'; 


export function CodeLearnPage() {
  const navigate = useNavigate();
  
  const [index, setIndex] = useState(2);
  const total = 2;

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black px-4 lg:px-8 pt-24 pb-10 lg:py-10 text-white font-sans antialiased relative">
      
      {/* HEADER ROW */}
      <div className="flex items-center gap-4 lg:gap-6 mb-8">
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

      <main className="flex-1 flex flex-col items-center w-full z-10 max-w-[1000px] mx-auto">
        
        {/* PAGE TITLE & SUBMIT BUTTON ROW */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 mb-10 lg:mb-12">
          
          <div className="hidden md:block w-[120px]"></div> 
          
          <motion.div 
            initial={{ opacity: 0, y: -100 }} 
            animate={{ opacity: 1, y: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="text-center"
          >
            <h1 className="text-2xl lg:text-[38px] font-medium tracking-wide text-white/90">
              Midterm exam for Database
            </h1>
            <div className="h-[2px] w-16 lg:w-20 bg-[#00CEC8]/60 mx-auto mt-3 rounded-full"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="w-full md:w-[120px] flex justify-center md:justify-end"
          >
            <button 
              onClick={() => setIsScoreModalOpen(true)}
              className="w-full max-w-[260px] md:w-auto bg-white text-black font-semibold text-[13px] px-7 py-3 md:py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md uppercase tracking-wider"
            >
              Submit
            </button>
          </motion.div>
        </div>

        {/* --- MAIN CODE FLASHCARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}  
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="w-full flex flex-col items-center"
        >
          {/* --- CODE SECTION CARD --- */}
          <div className="relative w-full rounded-[28px] lg:rounded-[40px] bg-[#272365] px-6 py-10 lg:px-16 lg:py-24 flex flex-col items-center justify-center shadow-[0_0_70px_rgba(0,0,0,0.4)] border border-white/5 transition-all">
            
            <h2 className="text-sm lg:text-2xl font-medium mb-4 lg:mb-8 text-white/60 tracking-widest uppercase text-center">
              Code Section
            </h2>
            
            <p className="max-w-3xl text-xl sm:text-2xl lg:text-[34px] leading-[1.4] font-normal text-center mb-10 lg:mb-14 text-white/95 px-2">
              Given a positive integer <span className="text-[#00CEC8] font-mono italic">millis</span>, write an asynchronous function that sleeps for millis milliseconds. It can resolve any value.
            </p>
            
            <div className="flex flex-col items-center gap-4 lg:gap-5 w-full">
              <p className="text-[11px] lg:text-[13px] text-white/40 font-medium tracking-wide uppercase">Click to begin and explore</p>
              <button 
                onClick={() => navigate('/code-challenge')}
                className="rounded-full bg-white px-12 py-3.5 lg:py-4 text-black font-bold text-sm lg:text-base shadow-lg hover:scale-105 active:scale-95 transition-all w-full max-w-[260px]"
              >
                Get started
              </button>
            </div>
          </div>

          {/* --- NAVIGATION CONTROLS --- */}
          <div className="mt-10 lg:mt-16 flex items-center justify-center gap-6 lg:gap-12 z-20">
            
            {/* LEFT BUTTON */}
            <button
              onClick={() => {
                setIndex((value) => Math.max(1, value - 1));
                navigate('/learn'); 
              }}
              disabled={index === 1}
              className={`w-[60px] lg:w-[90px] h-[45px] lg:h-[50px] rounded-full flex items-center justify-center transition-all ${
                index === 1 
                  ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                  : 'bg-[#272365] text-white hover:bg-[#342f85] border border-white/10 shadow-lg'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            {/* COUNTER */}
            <div className="text-xl lg:text-[28px] font-medium tracking-widest text-white/80 flex items-center">
              {index}<span className="text-white/20 mx-2 font-light">/</span>{total}
            </div>

            {/* RIGHT BUTTON */}
            <button
              onClick={() => setIndex((value) => Math.min(total, value + 1))}
              disabled={index === total}
              className={`w-[60px] lg:w-[90px] h-[45px] lg:h-[50px] rounded-full flex items-center justify-center transition-all ${
                index === total 
                  ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                  : 'bg-[#272365] text-white hover:bg-[#342f85] border border-white/10 shadow-lg'
              }`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </motion.div>
        
      </main>

      {/* RENDER MODAL */}
      {isScoreModalOpen && (
        <QuizScoreModal 
            score={85} 
            message="You've mastered the Database Midterm! Your detailed performance breakdown is now ready for review."
            onClose={() => setIsScoreModalOpen(false)} 
        />
       )}   
    </div>
  );
}

export default CodeLearnPage;