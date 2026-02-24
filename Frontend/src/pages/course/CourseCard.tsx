import React from 'react'

interface CourseCardProps {
  id: string;
  title: string;
  mastery: number;
  color: string; // e.g., 'bg-purple-400' or 'bg-green-500'
}

const CourseCard = ({ id, title, mastery, color }: CourseCardProps) => {
  return (
    <div className="min-w-[300px] bg-black border border-white/10 rounded-[32px] p-6 shadow-[0_10px_30px_rgba(255,255,255,0.05)]">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <span className={`${color} text-black text-[10px] font-bold px-3 py-1 rounded-full`}>
          {id}
        </span>
        <button className="text-white/50 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /></svg>
        </button>
      </div>

      <h3 className="text-white text-2xl font-semibold leading-tight mb-8">
        {title}
      </h3>

      {/* Progress Bar */}
      <div className="space-y-2">
        <p className="text-white/50 text-[10px] font-medium">Mastery: <span className="text-white">{mastery}%</span></p>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500" 
            style={{ width: `${mastery}%` }}
          />
        </div>
      </div>

      {/* Bottom Empty Content Area */}
      <div className="mt-6 h-48 bg-white/5 rounded-[24px] border border-white/5" />
    </div>
  )
}

export default CourseCard