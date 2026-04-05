import React from 'react'

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

const weeks = Array.from({ length: 53 });
const days = Array.from({ length: 7 });

const getSquareStyle = (weekIndex: number, dayIndex: number) => {
  const random = Math.random();
  if (random > 0.95) return "bg-[#4ade80] border-[#4ade80]";
  if (random > 0.90) return "bg-[#22c55e] border-[#22c55e]"; 
  if (random > 0.85) return "bg-[#16a34a] border-[#16a34a]";
  if (random > 0.80) return "bg-[#14532d] border-[#14532d]"; 
  
  return "bg-transparent border border-white/20"; 
}

const ActivityHeatmap = () => {
  return (
    <div className="w-full border border-white/20 rounded-2xl md:rounded-[32px] p-4 md:p-8 mt-6 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300">
      <div className="w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="min-w-[700px]">
          
          {/* Months Header Row */}
          <div className="flex ml-12 mb-3 justify-between pr-4 text-white/80 group-hover:text-white transition-colors text-xs md:text-sm font-medium">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Days Sidebar */}
            <div className="flex flex-col justify-between h-[120px] text-white/80 group-hover:text-white transition-colors text-xs md:text-sm font-medium">
              <span className="invisible">Sun</span>
              <span>Mon</span>
              <span className="invisible">Tue</span>
              <span>Wed</span>
              <span className="invisible">Thu</span>
              <span>Fri</span>
              <span className="invisible">Sat</span>
            </div>

            {/* The Grid */}
            <div className="flex-1 grid grid-rows-7 grid-flow-col gap-1 md:gap-1.5 h-[120px]">
              {weeks.map((_, w) =>
                days.map((_, d) => (
                  <div 
                    key={`${w}-${d}`} 
                    className={`w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-[3px] md:rounded-[4px] ${getSquareStyle(w, d)} hover:scale-125 hover:ring-2 hover:ring-[#00CEC8] transition-all cursor-pointer`}
                  ></div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Legend at the bottom right */}
      <div className="flex justify-end items-center gap-1.5 md:gap-2 mt-2 md:mt-6 text-white/80 text-xs md:text-sm font-medium">
        <span className="mr-1">Less</span>
        <div className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-[3px] md:rounded-[4px] bg-transparent border border-white/20"></div>
        <div className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-[3px] md:rounded-[4px] bg-[#14532d]"></div>
        <div className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-[3px] md:rounded-[4px] bg-[#16a34a]"></div>
        <div className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-[3px] md:rounded-[4px] bg-[#22c55e]"></div>
        <div className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-[3px] md:rounded-[4px] bg-[#4ade80]"></div>
        <span className="ml-1">More</span>
      </div>
    </div>
  )
}

export default ActivityHeatmap