import React from 'react';

interface SidebarStats {
  totalDecks: number;
  totalFlashcards: number;
  completedReviews: number;
  activeStreak: number;
  accuracy: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalReviewed: number;
  weeklyReviewed: number;
  weeklyAccuracy: number;
  decksAdded: number;
  timeSpent: number;
}

export default function FlashcardOverviewSidebar({ stats }: { stats: SidebarStats }) {
  // SVG Doughnut Chart calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.accuracy / 100) * circumference;

  return (
    // MOBILE FIX: w-full so it fills the phone screen. lg:w-[300px] restores laptop size.
    <aside className="w-full lg:w-[300px] border border-white/20 rounded-3xl p-5 lg:p-6 font-sans shrink-0 bg-black/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
      
      {/* Centered title on mobile, left-aligned on laptop */}
      <h2 className="text-xl font-bold text-white mb-6 lg:mb-8 text-center lg:text-left">
        Flashcard Overview
      </h2>

      {/* GENERAL STATS FIX: 
          Mobile -> 2x2 Grid of mini-cards to save vertical space
          Laptop (lg:) -> Restores your exact vertical list 
      */}
      <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:space-y-4 mb-8 lg:mb-10 lg:pl-2">
        
        <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left text-sm bg-white/5 lg:bg-transparent p-3 lg:p-0 rounded-2xl lg:rounded-none">
          <span className="text-white/80 text-xs lg:text-sm mb-1 lg:mb-0">Total Decks:</span>
          <span className="text-white font-medium text-lg lg:text-sm">{stats.totalDecks}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left text-sm bg-white/5 lg:bg-transparent p-3 lg:p-0 rounded-2xl lg:rounded-none">
          <span className="text-white/80 text-xs lg:text-sm mb-1 lg:mb-0">Total Flashcards:</span>
          <span className="text-white font-medium text-lg lg:text-sm">{stats.totalFlashcards}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left text-sm bg-white/5 lg:bg-transparent p-3 lg:p-0 rounded-2xl lg:rounded-none">
          <span className="text-white/80 text-xs lg:text-sm mb-1 lg:mb-0">Completed Reviews:</span>
          <span className="text-white font-medium text-lg lg:text-sm">{stats.completedReviews}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left text-sm bg-white/5 lg:bg-transparent p-3 lg:p-0 rounded-2xl lg:rounded-none">
          <span className="text-white/80 text-xs lg:text-sm mb-1 lg:mb-0">Active Streak:</span>
          <span className="text-white font-medium text-lg lg:text-sm">{stats.activeStreak}</span>
        </div>

      </div>

      {/* BOTTOM BOXES FIX: 
          sm:flex-row allows them to sit side-by-side on wide phones/tablets.
          lg:block restores the exact vertical stacking for laptop.
      */}
      <div className="flex flex-col sm:flex-row lg:block gap-4 lg:gap-0">
        
        {/* Accuracy Rate Box */}
        {/* lg:mb-6 restores the margin on laptop since gap goes away */}
        <div className="flex-1 border border-white/20 rounded-2xl p-4 lg:p-5 lg:mb-6">
          <p className="text-sm font-bold text-white mb-4">
            <span className="text-[#00CEC8]">Accuracy</span> Rate
          </p>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                <circle 
                  cx="50%" cy="50%" r={radius} 
                  stroke="#00CEC8" strokeWidth="4" fill="transparent" 
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-white">{stats.accuracy}%</span>
            </div>

            <div className="flex-1 space-y-1.5 text-[8px] lg:text-[9px] uppercase tracking-wider font-bold">
              <div className="flex justify-between"><span className="text-white/50">Accuracy Rate</span><span className="text-[#00CEC8]">{stats.accuracy}%</span></div>
              <div className="flex justify-between"><span className="text-white/50">Correct Answers</span><span className="text-[#00CEC8]">{stats.correctAnswers}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Wrong Answers</span><span className="text-[#00CEC8]">{stats.wrongAnswers}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Total Reviewed</span><span className="text-[#00CEC8]">{stats.totalReviewed}</span></div>
            </div>
          </div>
        </div>

        {/* Weekly Summary Box */}
        <div className="flex-1 border border-white/20 rounded-2xl p-4 lg:p-5 flex flex-col">
          <p className="text-sm font-bold text-white mb-4">
            <span className="text-[#00CEC8]">Weekly</span> Summary
          </p>
          
          <div className="space-y-3 mb-8 lg:mb-10">
            <div className="flex justify-between items-center text-[10px] lg:text-[11px]">
              <span className="text-white/70">Flashcards Reviewed:</span>
              <span className="text-white font-medium">{stats.weeklyReviewed}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] lg:text-[11px]">
              <span className="text-white/70">Accuracy Rate:</span>
              <span className="text-white font-medium">{stats.weeklyAccuracy}%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] lg:text-[11px]">
              <span className="text-white/70">Review Streak:</span>
              <span className="text-white font-medium flex items-center gap-1">
                {stats.activeStreak} Days <span className="text-green-500 text-[9px] font-bold">↑ +1</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] lg:text-[11px]">
              <span className="text-white/70">Decks Added:</span>
              <span className="text-white font-medium">{stats.decksAdded}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] lg:text-[11px]">
              <span className="text-white/70">Time spent:</span>
              <span className="text-white font-medium">{stats.timeSpent} Hours</span>
            </div>
          </div>

          <div className="h-20 lg:h-24 flex items-end justify-center pb-2 mt-auto">
            <p className="text-white/50 font-bold text-sm lg:text-lg tracking-wide">Bar Graph</p>
          </div>
        </div>
        
      </div>
    </aside>
  );
}