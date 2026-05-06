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
    <aside className="w-full rounded-[32px] border border-white/10 bg-[#111111] p-6 font-sans shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      
      <h2 className="mb-6 text-xl font-bold text-white">Flashcard Overview</h2>

      {/* General Stats */}
      <div className="mb-8 space-y-3.5 pl-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">Total Decks:</span>
          <span className="text-white font-medium">{stats.totalDecks}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">Total Flashcards:</span>
          <span className="text-white font-medium">{stats.totalFlashcards}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">Completed Reviews:</span>
          <span className="text-white font-medium">{stats.completedReviews}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">Active Streak:</span>
          <span className="text-white font-medium">{stats.activeStreak}</span>
        </div>
      </div>

      {/* Accuracy Rate Box */}
      <div className="mb-5 rounded-[24px] border border-white/10 bg-black/30 p-5">
        <p className="text-sm font-bold text-white mb-4">
          <span className="text-[#00CEC8]">Accuracy</span> Rate
        </p>
        
        <div className="flex items-center gap-6">
          {/* Custom SVG Doughnut Chart */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
              <circle 
                cx="32" cy="32" r="24" 
                stroke="#00CEC8" strokeWidth="4" fill="transparent" 
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{stats.accuracy}%</span>
          </div>

          <div className="flex-1 space-y-1.5 text-[9px] uppercase tracking-wider font-bold">
            <div className="flex justify-between"><span className="text-white/50">Accuracy Rate</span><span className="text-[#00CEC8]">{stats.accuracy}%</span></div>
            <div className="flex justify-between"><span className="text-white/50">Correct Answers</span><span className="text-[#00CEC8]">{stats.correctAnswers}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Wrong Answers</span><span className="text-[#00CEC8]">{stats.wrongAnswers}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Total Reviewed</span><span className="text-[#00CEC8]">{stats.totalReviewed}</span></div>
          </div>
        </div>
      </div>

      {/* Weekly Summary Box */}
      <div className="flex flex-col rounded-[24px] border border-white/10 bg-black/30 p-5">
        <p className="text-sm font-bold text-white mb-4">
          <span className="text-[#00CEC8]">Weekly</span> Summary
        </p>
        
        <div className="space-y-3 mb-10">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">Flashcards Reviewed:</span>
            <span className="text-white">{stats.weeklyReviewed}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">Accuracy Rate:</span>
            <span className="text-white">{stats.weeklyAccuracy}%</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">Review Streak:</span>
            <span className="text-white flex items-center gap-1">
              {stats.activeStreak} Days <span className="text-green-500 text-[9px] font-bold">↑ +1</span>
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">Decks Added:</span>
            <span className="text-white">{stats.decksAdded}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">Time spent:</span>
            <span className="text-white">{stats.timeSpent} Hours</span>
          </div>
        </div>

        {/* Placeholder for the Bar Graph */}
        <div className="flex h-20 items-end justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] pb-2">
          <p className="text-base font-bold tracking-wide text-white/55">Bar Graph</p>
        </div>
      </div>

    </aside>
  );
}
