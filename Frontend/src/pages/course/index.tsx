import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion' 
import CourseCard from './component/CourseCard'
import { SemesterDropdown } from './component/component'
import UploadModal from './component/UploadModal'
import Logo from '../../components/Logo';

import { courses } from '../../data/courses'

const CoursePage = () => {
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
      {/* 1. Increased pt-32 to pt-40 on mobile to clear the floating Navbar 
          2. Added relative z-0 to the main container
      */}
      <div className="min-h-screen bg-black text-white pt-40 lg:pt-32 pb-12 px-6 lg:px-16 font-sans relative overflow-x-hidden antialiased">
        <Logo />
        
        {/* FIX: SEMESTER DROPDOWN 
            - Added z-[60] so it opens OVER the Navbar (z-50)
            - Added mb-12 to push the hero text further down
        */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="flex justify-center lg:justify-end mb-12 relative z-[60] w-full max-w-[1600px] mx-auto"
        >
          <SemesterDropdown />
        </motion.div>

        {/* MAIN CONTENT ROW */}
        <div className="flex flex-col lg:flex-row items-start relative z-10 w-full max-w-[1600px] mx-auto gap-12 lg:gap-0">
          
          {/* LEFT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="w-full lg:w-[420px] flex-shrink-0 flex flex-col lg:pr-16 relative z-10 pt-2 text-center lg:text-left items-center lg:items-start"
          >
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-[36px] font-semibold leading-[1.15]">
                Ace <span className="text-[#00CEC8]">The</span> Semester.<br />
                Learn Smarter.<br />
                Organize <span className="text-[#00CEC8]">Better</span>.
              </h1>
              
              <p className="text-white/70 leading-relaxed text-[15px] max-w-[340px] pt-2 mx-auto lg:mx-0">
                Your current semester study load at a glance. Easily renew for the next term, 
                view your subjects, and dive into notes or flashcards — all in one place.
              </p>
              
              <div className="flex items-center gap-2 font-medium pt-2 justify-center lg:justify-start">
                <span className="text-lg">📅</span>
                <p className="text-[14px]">Current Study Load: <span className="text-[#00CEC8] font-bold">3rd Year - 1st Semester</span></p>
              </div>

              <div className="pt-8">
                <p className="text-[10px] text-white/50 mb-3 uppercase tracking-wider font-semibold">Upload / Renew Study Load</p>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-white text-black font-bold w-full lg:w-auto lg:px-12 py-3 rounded-xl hover:bg-gray-200 transition-all mb-4 active:scale-95"
                >
                  Upload
                </button>
                <p className="text-sm text-white/50">Ready for upload after semester ends.</p>
              </div>
            </div>
          </motion.div>

          {/* VERTICAL DIVIDER */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block w-[1.5px] bg-white/20 h-[480px] mt-4 relative z-20 rounded-full" 
          />

          {/* RIGHT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex-1 w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none relative z-10 touch-pan-x"
          >
            <div className="flex gap-6 w-max pointer-events-none py-8">
              <div className="w-0 lg:w-8 flex-shrink-0" />
                {courses.map((course) => (
                  <div key={course.id} className="pointer-events-auto">
                    <CourseCard {...course} />
                  </div>
                ))}
              <div className="w-16 flex-shrink-0" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </>
  )
}

export default CoursePage;