import React from 'react'

const LearningTrendAnalysis = () => {
  return (
    <div className="w-full border border-white/20 rounded-[32px] p-8 bg-black mt-8">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-bold"><span className="text-[#00CEC8]">Learning Trend</span> Analysis</h2>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ec4899]"></div>
          <span className="text-white font-medium">Study Time</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-[300px] w-full flex">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between h-full text-white/50 text-xs pr-4 pb-8">
          <span>100</span><span>75</span><span>50</span><span>25</span><span className="opacity-0">0</span>
        </div>
        
        {/* Grid & Lines */}
        <div className="relative flex-1 border-l border-white/20 pb-8">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full border-t border-dashed border-white/10 h-0"></div>
            ))}
            <div className="w-full border-t border-solid border-white/20 h-0"></div>
          </div>
          
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-full border-l border-dashed border-white/10 w-0"></div>
            ))}
          </div>

          {/* SVG Spline Curves */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
            {/* Blue Line */}
            <path d="M 0 250 C 200 220, 300 120, 500 80 S 800 20, 1000 10" fill="none" stroke="#2563eb" strokeWidth="4" />
            {/* Magenta Line */}
            <path d="M 0 290 C 150 250, 200 150, 350 180 S 500 120, 700 140 S 850 150, 1000 240" fill="none" stroke="#ec4899" strokeWidth="4" />
          </svg>

          {/* X-Axis Labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-white/50 text-xs translate-y-6 px-4">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      {/* AI Insight Box */}
      <div className="bg-[#005e5d] rounded-2xl p-6 mt-12 flex items-center gap-4">
        <span className="font-bold text-white text-lg whitespace-nowrap">AI Insight:</span>
        <span className="text-white/90 text-sm">Your learning improves when you study consistently 1.8-2.3 hours per day. Continue your routine to maintain strong progress.</span>
      </div>
    </div>
  )
}

export default LearningTrendAnalysis