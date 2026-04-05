import React from 'react';
import { useNavigate } from 'react-router-dom';

import { motion, type Variants } from 'framer-motion';

const BentoCards: React.FC = () => {
  const navigate = useNavigate();
  
  // 2. EXPLICITLY TYPE AS 'Variants'
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, 
      }
    }
  };

  // 3. EXPLICITLY TYPE AS 'Variants'
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 }, 
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } } 
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] relative z-10"
    >
      
      {/* Weekly Performance - Top Left */}
      <motion.div variants={itemVariants} className="bg-black border border-white/20 rounded-3xl p-6 flex flex-col justify-between group hover:border-[#00CEC8]/60 hover:shadow-[0_0_20px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#00CEC8] text-lg font-medium">Weekly Performance</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00CEC8" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full border-[6px] border-[#111111] flex items-center justify-center">
             {/* Simple CSS Circle Progress */}
            <div className="absolute inset-[-6px] rounded-full border-[6px] border-[#00CEC8]" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 16%)' }}></div>
            <span className="text-xl font-bold text-white group-hover:text-[#00CEC8] transition-colors">84%</span>
          </div>
          <div>
            <p className="text-white font-medium">84% Weekly Goal Achieved</p>
            <p className="text-xs text-white/50">You've improved <span className="text-white font-bold group-hover:text-[#00CEC8] transition-colors">12%</span> since last week</p>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Tasks - Top Middle */}
      <motion.div variants={itemVariants} className="bg-black border border-white/20 rounded-3xl p-6 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_20px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#00CEC8] text-lg font-medium">Upcoming Tasks</span>
            <span className="text-xl">📅</span>
          </div>
          <button 
            onClick={() => navigate('/calendar')}
            className="bg-white text-black rounded-lg px-3 py-1 text-[10px] font-bold hover:scale-105 hover:bg-[#00CEC8] active:scale-95 transition-all"
          >
            Open Calendar
          </button>
        </div>
        <p className="text-white mb-4">You have <span className="font-bold group-hover:text-[#00CEC8] transition-colors">2</span> Deadlines this week</p>
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2 text-white/70"><span className="font-bold text-white">Today</span> - Eldroid Midterm</div>
          <div className="flex items-center gap-2 text-white/70"><span className="font-bold text-white">Today</span> - Proglan Midterm</div>
        </div>
      </motion.div>

      {/* AI Insights - Right Side (Spans 2 rows) */}
      <motion.div variants={itemVariants} className="lg:row-span-2 bg-black border border-white/20 rounded-3xl p-8 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_20px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[#00CEC8] text-lg font-medium">AI Insights</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00CEC8" strokeWidth="2"><path d="M3 3v18h18M3 18l5.5-5.5M12.5 16.5 18 11"/></svg>
        </div>
        <div className="space-y-10">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Strength</p>
            <p className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-[#00CEC8] transition-colors">Programming Language</p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#4A6792] group-hover:bg-[#00CEC8] transition-colors" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-white/40"><span>Mastery</span></div>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Weakness</p>
            <p className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-red-400 transition-colors">Fundamentals of AI</p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#4A6792] group-hover:bg-red-400 transition-colors" style={{ width: '30%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-white/40"><span>Mastery</span></div>
          </div>
        </div>
      </motion.div>

      {/* Flashcards - Bottom Left */}
      <motion.div 
        variants={itemVariants}
        onClick={() => navigate('/decks')}
        className="bg-black border border-white/20 rounded-3xl p-6 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_20px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#00CEC8] text-lg font-medium">Flashcards Today</span>
          <span>🎴</span>
        </div>
        <div className="text-xl text-white font-bold mb-4">
          <span className="text-white group-hover:text-[#00CEC8] transition-colors">12</span> <span className="text-white/60 font-normal">of 20 completed</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-[#4A6792] group-hover:bg-[#00CEC8] transition-colors" style={{ width: '60%' }}></div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-white/60">Keep your 5-day streak</p>
          <span className="text-xs text-white font-bold group-hover:text-[#00CEC8] transition-colors">60%</span>
        </div>
      </motion.div>

      {/* Resume Snapshot - Bottom Middle */}
      <motion.div variants={itemVariants} className="bg-black border border-white/20 rounded-3xl p-6 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_20px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#00CEC8] text-lg font-medium">Resume Snapshot</span>
          <span>📝</span>
        </div>
        <p className="text-white text-lg mb-6">
          <span className="font-bold group-hover:text-[#00CEC8] transition-colors">2</span> new certifications added this semester
        </p>
        <button 
          onClick={() => navigate('/resume')}
          className="bg-white text-black rounded-lg px-4 py-1.5 text-xs font-bold hover:scale-105 hover:bg-[#00CEC8] active:scale-95 transition-all"
        >
          Edit Resume
        </button>
      </motion.div>

    </motion.div>
  );
};

export default BentoCards;