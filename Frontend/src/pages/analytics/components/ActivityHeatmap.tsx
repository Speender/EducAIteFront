import React from 'react'

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

// We need 53 columns (weeks) and 7 rows (days) to make a full year grid
const weeks = Array.from({ length: 53 });
const days = Array.from({ length: 7 });

// Helper to generate the square styles based on the image's colors
const getSquareStyle = (weekIndex: number, dayIndex: number) => {
  // Creating some dummy data that looks like your screenshot
  const random = Math.random();
  if (random > 0.95) return "bg-[#4ade80] border-[#4ade80]"; // Brightest green
  if (random > 0.90) return "bg-[#22c55e] border-[#22c55e]"; 
  if (random > 0.85) return "bg-[#16a34a] border-[#16a34a]";
  if (random > 0.80) return "bg-[#14532d] border-[#14532d]"; // Darkest green
  
  // Empty state: transparent with white/20 border
  return "bg-transparent border border-white/20"; 
}

const ActivityHeatmap = () => {
  return (
    <div className="w-full border border-white/20 rounded-[32px] p-8 mt-6">
      
      {/* Months Header Row */}
      <div className="flex ml-12 mb-3 justify-between pr-4 text-white/80 text-sm font-medium">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Days Sidebar */}
        <div className="flex flex-col justify-between h-[120px] text-white/80 text-sm font-medium">
          <span className="invisible">Sun</span>
          <span>Mon</span>
          <span className="invisible">Tue</span>
          <span>Wed</span>
          <span className="invisible">Thu</span>
          <span>Fri</span>
          <span className="invisible">Sat</span>
        </div>

        {/* The Grid */}
        <div className="flex-1 grid grid-rows-7 grid-flow-col gap-1.5 h-[120px]">
          {weeks.map((_, w) =>
            days.map((_, d) => (
              <div 
                key={`${w}-${d}`} 
                className={`w-[14px] h-[14px] rounded-[4px] ${getSquareStyle(w, d)}`}
              ></div>
            ))
          )}
        </div>
      </div>

      {/* Legend at the bottom right */}
      <div className="flex justify-end items-center gap-2 mt-6 text-white/80 text-sm font-medium">
        <span className="mr-1">Less</span>
        <div className="w-[14px] h-[14px] rounded-[4px] bg-transparent border border-white/20"></div>
        <div className="w-[14px] h-[14px] rounded-[4px] bg-[#14532d]"></div>
        <div className="w-[14px] h-[14px] rounded-[4px] bg-[#16a34a]"></div>
        <div className="w-[14px] h-[14px] rounded-[4px] bg-[#22c55e]"></div>
        <div className="w-[14px] h-[14px] rounded-[4px] bg-[#4ade80]"></div>
        <span className="ml-1">More</span>
      </div>
      
    </div>
  )
}

export default ActivityHeatmap