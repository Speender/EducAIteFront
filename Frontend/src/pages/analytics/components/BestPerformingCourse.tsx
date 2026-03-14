import React from 'react'

const BestPerformingCourse = () => {
  const bars = [
    { color: 'bg-[#1d4ed8]', height: '90%', label: '↑ +6% from last exam' },
    { color: 'bg-[#fbbf24]', height: '35%', label: '↑ +2% from last exam' },
    { color: 'bg-[#ec4899]', height: '52%', label: '↑ +7% from last exam' },
    { color: 'bg-[#ef4444]', height: '22%', label: '↑ +4% from last exam' },
    { color: 'bg-[#00CEC8]', height: '40%', label: '↑ +6% from last exam' },
    { color: 'bg-[#22c55e]', height: '93%', label: '↑ +9% from last exam' },
  ];

  return (
    <div className="w-full border border-white/20 rounded-[32px] p-8 bg-black mt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold"><span className="text-[#00CEC8]">Best Performing</span> Course</h2>
        <p className="text-white/60 text-lg">Human Computer Interaction <span className="text-[#00CEC8] ml-2">%87</span></p>
      </div>

      <div className="relative h-[300px] w-full flex">
        <div className="flex flex-col justify-between h-full text-white/50 text-xs pr-4 pb-8">
          <span>100</span><span>75</span><span>50</span><span>25</span><span className="opacity-0">0</span>
        </div>
        
        <div className="relative flex-1 border-l border-white/20 pb-8">
          {/* Horizontal Grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
            {[...Array(4)].map((_, i) => <div key={i} className="w-full border-t border-dashed border-white/10 h-0"></div>)}
            <div className="w-full border-t border-solid border-white/20 h-0"></div>
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex justify-around items-end pb-8 z-10 px-4">
            {bars.map((bar, i) => (
              <div key={i} className="flex flex-col items-center w-20 sm:w-28 h-full justify-end">
                <span className="text-[#22c55e] text-[10px] mb-3 opacity-80 whitespace-nowrap">{bar.label}</span>
                <div className={`w-full rounded-2xl ${bar.color} hover:scale-[1.02] transition-transform`} style={{ height: bar.height }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#005e5d] rounded-2xl p-6 mt-12 flex items-center gap-4">
        <span className="font-bold text-white text-lg whitespace-nowrap">AI Insight:</span>
        <span className="text-white/90 text-sm">Your learning improves when you study consistently 1.8-2.3 hours per day. Continue your routine to maintain strong progress.</span>
      </div>
    </div>
  )
}

export default BestPerformingCourse