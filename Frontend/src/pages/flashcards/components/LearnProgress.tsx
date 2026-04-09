import React from 'react';

interface LearnProgressProps {
  current: number;
  total: number;
}

export function LearnProgress({ current, total }: LearnProgressProps) {
  const progressPercentage = Math.round((current / total) * 100);

  return (
    <div className="flex flex-col items-center gap-4 min-w-[120px]">
      
      {/* The Numbers */}
      <div className="text-4xl font-bold tracking-widest">
        <span className="text-[#00CEC8]">{current}</span>
        <span className="text-white/20 mx-2">/</span>
        <span className="text-white/70">{total}</span>
      </div>

      {/* The Visual Progress Bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#00CEC8] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
    </div>
  );
}