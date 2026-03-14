import React from 'react'

const OverallPerformance = () => {
  return (
    <div className="border border-white/20 rounded-[32px] p-6 flex flex-col">
      <h3 className="font-bold mb-6 text-sm"><span className="text-[#00CEC8]">Overall</span> Performance</h3>
      
      {/* Stats List */}
      <div className="space-y-4 mb-10 text-xs text-white/80">
        <div className="flex justify-between items-center">
          <span>Total Mastery:</span> 
          <span className="font-bold text-white text-sm">82% <span className="text-green-500 text-[10px] ml-1">&uarr;+5%</span></span>
        </div>
        <div className="flex justify-between items-center">
          <span>Study Hours:</span> <span className="font-bold text-white text-sm">13.4 / 15</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Flashcard Accuracy:</span> <span className="font-bold text-white text-sm">84%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Task Completed:</span> <span className="font-bold text-white text-sm">12 / 15</span>
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
          <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full w-[82%]"></div></div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1 font-medium"><span>Study Time Goal</span><span>8h9%</span></div>
          <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full w-[65%]"></div></div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1 font-medium"><span>Flashcards</span><span>84%</span></div>
          <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full w-[84%]"></div></div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1 font-medium"><span>Tasks</span><span>80%</span></div>
          <div className="h-2.5 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full w-[80%]"></div></div>
        </div>
      </div>

      <h3 className="font-bold text-[#00CEC8] mb-2 text-xs">AI Insight:</h3>
      <p className="text-[10px] text-white/70 mb-8 leading-relaxed pr-4">
        You're strongest in Theoretical subjects (88%). Focus on Practical courses to balance mastery.
      </p>

      <div className="mt-auto space-y-2 flex flex-col items-start">
        <span className="bg-white/10 text-[10px] font-bold px-3 py-1.5 rounded-md">Consistent Performer</span>
        <span className="bg-white/10 text-[10px] font-bold px-3 py-1.5 rounded-md">Bro is cooking</span>
      </div>
    </div>
  )
}

export default OverallPerformance