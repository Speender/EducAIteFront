import React, { useState } from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

const AnalyticsHeader = () => {
  // 1. State for controlling the modal visibility
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // 2. State for the selected date (defaults to today's date)
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });

  return (
    <>
      {/* --- CONVERTED TO MOTION.DIV WITH SLIDE-IN ANIMATION --- */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
        animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
        transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
        className="flex items-center w-full py-8 text-white bg-black"
      >
        {/* Left Group: Date & Buttons */}
        <div className="flex items-center gap-6 shrink-0">
          {/* The Circle */}
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-3xl font-semibold shrink-0">
            4
          </div>
          
          {/* Date Text */}
          <div className="text-sm leading-tight text-white/90 shrink-0">
            <p>Tue,</p>
            <p>November</p>
          </div>

          {/* The Pill Button */}
          <button className="bg-black text-white border border-white/20 hover:bg-white/5 transition-colors text-[10px] font-bold px-8 py-3 rounded-full">
            Show my Progress &rarr;
          </button>

          {/* Calendar Icon Button (Triggers Modal) */}
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="bg-white w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition shrink-0 shadow-lg"
          >
            <svg className="w-5 h-5 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* THE DISTANCE: ml-16 creates that specific gap between the buttons and greeting */}
        <div className="flex flex-col ml-16 min-w-0">
          <h1 className="text-4xl font-bold whitespace-nowrap">
            Hey, <span className="text-[#00CEC8]">Christian</span> 👋
          </h1>
          <p className="text-white/40 text-lg mt-1 whitespace-nowrap">
            Here's your performance summary this week!
          </p>
        </div>
      </motion.div>

      {/* =========================================
          THE DATE PICKER MODAL
          ========================================= */}
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsCalendarOpen(false)} // Clicking outside closes it
        >
          <div 
            className="w-full max-w-[340px] rounded-[24px] bg-[#0A0A0A] p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevents clicks inside from closing it
          >
            
            {/* Header & Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white tracking-wide">Select Date</h2>
              <button 
                onClick={() => setIsCalendarOpen(false)} 
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* The Date Input you provided */}
            <input
              type="date"
              value={date}
              style={{ colorScheme: 'dark' }}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black border-[1.5px] border-white/20 text-white px-5 py-4 rounded-xl focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)] outline-none transition-all text-sm cursor-pointer mb-6"
            />

            {/* Action Button */}
            <button 
              onClick={() => {
                console.log("Fetching analytics for date:", date);
                setIsCalendarOpen(false);
              }}
              className="w-full py-3.5 rounded-full bg-[#00CEC8] text-black font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,206,200,0.3)] text-sm uppercase tracking-wide"
            >
              View Analytics
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default AnalyticsHeader;