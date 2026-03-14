import React from 'react'

interface Props {
  titleHighlight: string;
  titleRest: string;
  subtitleLabel: string;
  subtitleValue: string;
}

const MultiLineChartCard = ({ titleHighlight, titleRest, subtitleLabel, subtitleValue }: Props) => {
  return (
    <div className="w-full border border-white/20 rounded-[32px] p-8 bg-black mt-8">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1"><span className="text-[#00CEC8]">{titleHighlight}</span> {titleRest}</h2>
          <div className="flex items-center gap-4">
            <p className="text-white/60 text-lg">{subtitleLabel} <span className="text-white font-bold ml-1">{subtitleValue}</span></p>
            <span className="text-[#22c55e] text-xs">↑ +4% this week</span>
          </div>
        </div>
        
        {/* Dropdown */}
        <div className="border border-white/20 rounded-xl px-4 py-3 flex items-center gap-6 bg-black cursor-pointer hover:bg-white/5 transition">
          <span className="text-sm font-medium">{titleHighlight} {titleRest}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm font-medium">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#2563eb]"></div>Human Computer Interaction</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#ec4899]"></div>Freetrnds</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#eab308]"></div>Proglan</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>Comprog 11</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>Eldroid</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div>FreeAI</div>
      </div>

      {/* Chart Area */}
      <div className="relative h-[400px] w-full flex">
        <div className="flex flex-col justify-between h-full text-white/50 text-xs pr-4 pb-8">
          <span>100</span><span>75</span><span>50</span><span>25</span><span className="opacity-0">0</span>
        </div>
        
        <div className="relative flex-1 border-l border-white/20 pb-8">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(4)].map((_, i) => <div key={i} className="w-full border-t border-dashed border-white/10 h-0"></div>)}
            <div className="w-full border-t border-solid border-white/20 h-0"></div>
          </div>
          <div className="absolute inset-0 flex justify-between pointer-events-none px-4">
            {[...Array(7)].map((_, i) => <div key={i} className="h-full border-l border-dashed border-white/10 w-0"></div>)}
          </div>

          {/* SVGs with 6 different paths mimicking your image */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <path d="M 0 320 C 200 290, 300 250, 500 150 S 800 50, 1000 20" fill="none" stroke="#2563eb" strokeWidth="4" />
            <path d="M 0 380 C 150 350, 200 250, 400 280 S 600 200, 800 220 S 900 300, 1000 350" fill="none" stroke="#ec4899" strokeWidth="4" />
            <path d="M 0 280 C 250 200, 350 100, 600 120 S 800 150, 1000 50" fill="none" stroke="#eab308" strokeWidth="4" />
            <path d="M 0 390 C 100 250, 300 180, 500 180 S 700 150, 1000 110" fill="none" stroke="#22c55e" strokeWidth="4" />
            <path d="M 0 390 C 200 350, 300 250, 500 220 S 800 180, 1000 80" fill="none" stroke="#ef4444" strokeWidth="4" />
            <path d="M 0 390 C 150 390, 250 250, 400 220" fill="none" stroke="#ffffff" strokeWidth="4" strokeDasharray="10,10" />
          </svg>

          <div className="absolute bottom-0 left-0 w-full flex justify-between text-white/50 text-xs translate-y-6 px-4">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
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

export default MultiLineChartCard