import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnalyticsHeader = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col lg:flex-row lg:items-center w-full py-6 md:py-8 text-white bg-black gap-8 lg:gap-0"
      >
        {/* Left Group: Date & Buttons */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-xl md:text-3xl font-semibold shrink-0">
            4
          </div>
          
          {/* Date Text */}
          <div className="text-xs md:text-sm leading-tight text-white/90 shrink-0">
            <p>Tue,</p>
            <p>November</p>
          </div>

          {/* The Pill Button - Responsive padding and hidden text on tiny screens */}
          <button className="bg-black text-white border border-white/20 hover:bg-white/5 transition-colors text-[10px] font-bold px-4 md:px-8 py-3 rounded-full flex items-center gap-2">
            <span className="hidden xs:inline">Show my Progress</span>
            <span className="xs:hidden">Progress</span>
            <span>&rarr;</span>
          </button>

          {/* Calendar Icon Button */}
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="bg-white w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition shrink-0 shadow-lg"
          >
            <svg className="w-5 h-5 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:ml-16 min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold">
            Hey, <span className="text-[#00CEC8]">Christian</span> 👋
          </h1>
          <p className="text-white/40 text-base md:text-lg mt-1">
            Here's your performance summary this week!
          </p>
        </div>
      </motion.div>

      {/* MODAL remains the same as it is already centered and uses max-width */}
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={() => setIsCalendarOpen(false)}
        >
          <div 
            className="w-full max-w-[340px] rounded-[24px] bg-[#0A0A0A] p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white tracking-wide">Select Date</h2>
              <button onClick={() => setIsCalendarOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <input
              type="date"
              value={date}
              style={{ colorScheme: 'dark' }}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black border-[1.5px] border-white/20 text-white px-5 py-4 rounded-xl focus:border-[#00CEC8] outline-none transition-all text-sm cursor-pointer mb-6"
            />

            <button 
              onClick={() => setIsCalendarOpen(false)}
              className="w-full py-3.5 rounded-full bg-[#00CEC8] text-black font-bold hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wide"
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