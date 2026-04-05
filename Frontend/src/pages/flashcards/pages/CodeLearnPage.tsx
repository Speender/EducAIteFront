import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/educAIte-logo.svg';
import AImpatin from '../../../assets/robot.svg';
import { QuizScoreModal } from '../components/QuizScoreModal'; 
import { motion } from 'framer-motion';
export function CodeLearnPage() {
  const navigate = useNavigate();
  
  // 1. Set the index to 2 and total to 2 to match your requirement
  const [index, setIndex] = useState(2);
  const total = 2;

  // 2. State to control modal
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black px-8 py-10 text-white font-sans antialiased relative">
      
      {/* =========================================
          HEADER ROW (Updated to match CodeChallengePage)
          ========================================= */}
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

      <main className="flex-1 flex flex-col items-center w-full z-10 max-w-[1000px] mx-auto">
        
        {/* PAGE TITLE & SUBMIT BUTTON ROW */}
        <div className="w-full flex items-center justify-between mb-12">
          <div className="w-[120px]"></div> 
          
          <motion.div 
            initial={{ opacity: 0, y: -100 }} // Starts invisible and 100px above
            animate={{ opacity: 1, y: 0 }}    // Slides down to its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="text-center"
          >
            <h1 className="text-[32px] md:text-[38px] font-medium tracking-wide text-white/90">
              Midterm exam for Database
            </h1>
            <div className="h-[2px] w-20 bg-[#00CEC8]/60 mx-auto mt-3 rounded-full"></div>
          </motion.div>
          
          {/* --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM RIGHT ANIMATION --- */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="w-[120px] flex justify-end"
          >
            <button 
              onClick={() => setIsScoreModalOpen(true)}
              className="bg-white text-black font-semibold text-[13px] px-7 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md uppercase tracking-wider"
            >
              Submit
            </button>
          </motion.div>
        </div>

        {/* --- MAIN CODE FLASHCARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}   // Starts invisible and 50px below
          animate={{ opacity: 1, y: 0 }}    // Slides up into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          className="w-full flex flex-col items-center"
        >
          {/* --- CODE SECTION CARD --- */}
          <div className="relative w-full rounded-[40px] bg-[#272365] px-10 py-20 md:px-16 md:py-24 flex flex-col items-center justify-center shadow-[0_0_70px_rgba(0,0,0,0.4)] border border-white/5 transition-all">
            <h2 className="text-2xl font-medium mb-8 text-white/60 tracking-widest uppercase">Code Section</h2>
            <p className="max-w-3xl text-[28px] md:text-[34px] leading-[1.4] font-normal text-center mb-14 text-white/95">
              Given a positive integer <span className="text-[#00CEC8] font-mono italic">millis</span>, write an asynchronous function that sleeps for millis milliseconds. It can resolve any value.
            </p>
            <div className="flex flex-col items-center gap-5">
              <p className="text-[13px] text-white/40 font-medium tracking-wide uppercase">Click to begin and explore</p>
              <button 
                onClick={() => navigate('/code-challenge')}
                className="rounded-full bg-white px-12 py-4 text-black font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all w-[260px]"
              >
                Get started
              </button>
            </div>
          </div>

          {/* --- NAVIGATION CONTROLS --- */}
          <div className="mt-16 flex items-center justify-center gap-12 z-20">
            
            {/* LEFT BUTTON (Active if index > 1) */}
            <button
              onClick={() => {
                setIndex((value) => Math.max(1, value - 1));
                navigate('/learn'); // Navigate back to the standard learn page
              }}
              disabled={index === 1}
              className={`w-[90px] h-[50px] rounded-full flex items-center justify-center transition-all ${
                index === 1 
                  ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                  : 'bg-[#272365] text-white hover:bg-[#342f85] border border-white/10 shadow-lg'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            {/* COUNTER (Displays 2/2) */}
            <div className="text-[28px] font-medium tracking-widest text-white/80 flex items-center">
              {index}<span className="text-white/20 mx-2 font-light">/</span>{total}
            </div>

            {/* RIGHT BUTTON (Disabled because index === total) */}
            <button
              onClick={() => setIndex((value) => Math.min(total, value + 1))}
              disabled={index === total}
              className={`w-[90px] h-[50px] rounded-full flex items-center justify-center transition-all ${
                index === total 
                  ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                  : 'bg-[#272365] text-white hover:bg-[#342f85] border border-white/10 shadow-lg'
              }`}
            >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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

      {/* Floating Robot */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="w-14 h-14 rounded-full border border-white/10 bg-[#050505] flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 transition-all shadow-xl">
          <img src={AImpatin} alt="bot" className="w-8 h-8 opacity-80" />
        </div>
      </div>
      
    </div>
  );
}

export default CodeLearnPage;