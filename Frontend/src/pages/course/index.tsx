import React, { useRef, useState } from 'react'
import CourseCard from './component/CourseCard'
import { SemesterDropdown } from './component/component'
import AImpatin from '../../assets/robot.svg'
import logo from '../../assets/educAIte-logo.svg' 
import UploadModal from './component/UploadModal'

import { courses } from '../../data/courses'

{courses.map((course) => (
  <CourseCard key={course.id} {...course} /> 
))}
const CoursePage = () => {
  // --- Custom Drag-to-Scroll Logic (Kept exactly as you had it) ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
        
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => isDragging.current = false;
  const handleMouseUp = () => isDragging.current = false;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.3; 
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white pt-32 pb-12 px-8 lg:px-16 font-sans relative overflow-x-hidden antialiased">
        
        {/* LOGO */}
        <div className="absolute top-10 left-12">
          <img src={logo} alt="educAIte" className="h-10" />
        </div>

        {/* SEMESTER DROPDOWN: Positioned right above the cards */}
        <div className="flex justify-end mb-8 relative z-20 w-full max-w-[1600px] mx-auto">
          <SemesterDropdown />
        </div>

        {/* ================= MAIN CONTENT ROW ================= */}
        {/* Changed to items-start so the text aligns towards the top, matching the reference images */}
        <div className="flex flex-col lg:flex-row items-start relative z-10 w-full max-w-[1600px] mx-auto">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col pr-8 lg:pr-16 relative z-10 pt-2">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-[36px] font-semibold leading-[1.15]">
                Ace <span className="text-[#00CEC8]">The</span> Semester.<br />
                Learn Smarter.<br />
                Organize <span className="text-[#00CEC8]">Better</span>.
              </h1>
              
              <p className="text-white/70 leading-relaxed text-[15px] max-w-[340px] pt-2">
                Your current semester study load at a glance. Easily renew for the next term, 
                view your subjects, and dive into notes or flashcards — all in one place.
              </p>
              
              <div className="flex items-center gap-2 font-medium pt-2">
                 <span className="text-lg">📅</span>
                 <p className="text-[14px]">Current Study Load: <span className="text-[#00CEC8] font-bold">3rd Year - 1st Semester</span></p>
              </div>

              <div className="pt-8">
                <p className="text-[10px] text-white/50 mb-3 uppercase tracking-wider font-semibold">Upload / Renew Study Load</p>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-white text-black font-bold px-12 py-3 rounded-xl hover:bg-gray-200 transition-all mb-4"
                >
                  Upload
                </button>
                <p className="text-sm text-white/50">Ready for upload after semester ends.</p>
              </div>
            </div>
          </div>

          {/* ================= VERTICAL DIVIDER LINE ================= */}
          <div className="hidden lg:block w-[1.5px] bg-white/20 h-[480px] mt-4 relative z-20 rounded-full" />

          {/* ================= RIGHT COLUMN: DRAGGABLE CARDS ================= */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex-1 w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing select-none relative z-10"
          >
            {/* Added py-8 so shadows on bottom of cards don't clip */}
            <div className="flex gap-6 w-max pointer-events-none py-8">
              
              {/* THE INVISIBLE SPACER: Keeps first card away from line at rest */}
              <div className="w-8 flex-shrink-0" />

              {courses.map((course) => (
                <div key={course.id} className="pointer-events-auto">
                  <CourseCard {...course} />
                </div>
              ))}

              {/* Trailing spacer */}
              <div className="w-16 flex-shrink-0" />
            </div>
          </div>

        </div>

        {/* ================= FLOATING ROBOT ================= */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="w-14 h-14 rounded-full border border-white/20 bg-black flex items-center justify-center overflow-hidden cursor-pointer hover:bg-white/5 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <img 
              src={AImpatin} 
              alt="AI Assistant" 
              className="w-10 h-10 object-contain" 
            />
          </div>
        </div>

      </div>

      {/* ================= UPLOAD MODAL ================= */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </>
  )
}

export default CoursePage