import React from 'react'
import { motion } from 'framer-motion'

const OverallPerformance = () => {
  return (
    // 1. The Wrapper: Handles ONLY the Framer Motion entrance animation
    <motion.div 
      initial={{ opacity: 0, x: -100 }} 
      animate={{ opacity: 1, x: 0 }}    
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className="h-full" // Ensures the wrapper fills the grid cell properly
    >
      {/* 2. The Card: Handles all the visuals, hover effects, and CSS transitions */}
      <div className="h-full border border-white/20 rounded-[32px] p-6 flex flex-col group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <h3 className="font-bold mb-6 text-sm"><span className="text-[#00CEC8]">Overall</span> Performance</h3>
        
        {/* Stats List */}
        <div className="space-y-4 mb-10 text-xs text-white/80">
          <div className="flex justify-between items-center">
            <span>Total Mastery:</span> 
            <span className="font-bold text-white text-sm group-hover:text-[#00CEC8] transition-colors">82% <span className="text-green-500 text-[10px] ml-1">&uarr;+5%</span></span>
          </div>
          <div className="flex justify-between items-center">
            <span>Study Hours:</span> <span className="font-bold text-white text-sm group-hover:text-[#00CEC8] transition-colors">13.4 / 15</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Flashcard Accuracy:</span> <span className="font-bold text-white text-sm group-hover:text-[#00CEC8] transition-colors">84%</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Task Completed:</span> <span className="font-bold text-white text-sm group-hover:text-[#00CEC8] transition-colors">12 / 15</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Study Streak:</span> <span className="font-bold text-[#00CEC8] text-sm">13 Days</span>
          </div>
        </div>

        <h3 className="font-bold text-[#00CEC8] mb-4 text-xs">Progressive Overview:</h3>
        
        {/* Mini Progress Bars */}
        <div className="space-y-4 mb-10">
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-medium"><span>Mastery</span><span>82%</span></div>
            <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white group-hover:bg-[#00CEC8] transition-colors rounded-full w-[82%]"></div></div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-medium"><span>Study Time Goal</span><span>8h9%</span></div>
            <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white group-hover:bg-[#00CEC8] transition-colors rounded-full w-[65%]"></div></div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-medium"><span>Flashcards</span><span>84%</span></div>
            <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white group-hover:bg-[#00CEC8] transition-colors rounded-full w-[84%]"></div></div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-medium"><span>Tasks</span><span>80%</span></div>
            <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white group-hover:bg-[#00CEC8] transition-colors rounded-full w-[80%]"></div></div>
          </div>
        </div>

        <h3 className="font-bold text-[#00CEC8] mb-2 text-xs">AI Insight:</h3>
        <p className="text-[10px] text-white/70 mb-8 leading-relaxed pr-4">
          You're strongest in Theoretical subjects (88%). Focus on Practical courses to balance mastery.
        </p>

        <div className="mt-auto space-y-2 flex flex-col items-start">
          <span className="bg-white/10 text-[10px] font-bold px-3 py-1.5 rounded-md group-hover:border-[#00CEC8]/30 border border-transparent transition-colors">Consistent Performer</span>
          <span className="bg-white/10 text-[10px] font-bold px-3 py-1.5 rounded-md group-hover:border-[#00CEC8]/30 border border-transparent transition-colors">Bro is cooking</span>
        </div>
      </div>
    </motion.div>
  )
}

export default OverallPerformance