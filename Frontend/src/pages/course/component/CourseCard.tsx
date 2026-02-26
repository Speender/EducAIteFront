import React from 'react'

interface CourseCardProps {
  id: string;
  title: string;
  mastery: number;
  color: string;
}

const CourseCard = ({ id, title, mastery, color }: CourseCardProps) => {
  return (
    <div className="min-w-[320px] max-w-[320px] bg-[#050505] border border-white/20 rounded-[32px] p-6 select-none relative transition-all duration-300 hover:border-white/40 shadow-[0_35px_40px_-15px_rgba(255,255,255,0.15)] flex flex-col h-[480px]">
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <span className={`${color} text-black text-[11px] font-bold px-4 py-1.5 rounded-full`}>
          {id}
        </span>
        <button className="text-white/50 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /></svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="text-white text-3xl font-bold leading-tight mb-8">
        {title}
      </h3>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <p className="text-white text-[11px] font-semibold tracking-wide">
          Mastery: <span className="font-bold">{mastery}%</span>
        </p>
        <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-[#64748b] rounded-full" 
            style={{ width: `${mastery}%` }}
          />
        </div>
      </div>

      {/* Bottom Empty Content Area */}
      <div className="flex-1 mt-2 bg-white/5 rounded-[24px] border border-white/5" />
    </div>
  )
}

export default CourseCard