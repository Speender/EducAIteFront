import React from 'react'
import { motion } from 'framer-motion';

interface SecondResumeBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const SecondResumeBuilder = ({ onBack, onNext }: SecondResumeBuilderProps) => {
  return (
    <div className="min-h-screen bg-black text-white pt-36 lg:pt-24 pb-10 px-4 md:px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* 25% PROGRESS BAR (Updated for Education stage) */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }} 
        animate={{ opacity: 1, x: 0 }}    
        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.6 }} 
        className="max-w-7xl mx-auto mb-6 lg:mb-8"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-3 lg:p-4 flex items-center gap-3 lg:gap-4 shadow-lg">
          <div className="bg-[#00CEC8]/20 px-2.5 py-1 lg:px-3 lg:py-1 rounded-md">
            <span className="text-[#00CEC8] font-bold text-[10px] lg:text-xs">25%</span>
          </div>
          <p className="text-white/40 text-[10px] lg:text-xs font-medium uppercase tracking-wider">Your resume score</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* LEFT SIDE: EDUCATION FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7, ease: "easeOut" }} 
          className="flex-1 space-y-6 lg:space-y-8"
        >
          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl lg:rounded-3xl p-5 md:p-6 lg:p-8">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl lg:text-2xl font-bold">Education</h2>
              <button onClick={onBack} className="text-[#00CEC8] text-xs lg:text-sm font-bold hover:underline">
                Go Back
              </button>
            </div>
            <p className="text-white/40 text-xs lg:text-sm mb-6 lg:mb-8">
              A varied education on your resume sums up the value that your learnings and background will bring to job.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              
              {/* School (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">School</label>
                <input 
                  type="text" 
                  placeholder="e.g. University of San Carlos"
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 transition-all placeholder:text-white/5 text-sm lg:text-base" 
                />
              </div>
              
              {/* Degree */}
              <div className="md:col-span-2">
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Degree</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bachelor of Science in Information Technology"
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 transition-all placeholder:text-white/5 text-sm lg:text-base" 
                />
              </div>

              {/* Date Row */}
              <div>
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Start & End Date</label>
                <div className="flex gap-2">
                   <input type="text" placeholder="MM/YYYY" className="w-1/2 bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 text-sm lg:text-base" />
                   <input type="text" placeholder="MM/YYYY" className="w-1/2 bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 text-sm lg:text-base" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">City</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 text-sm lg:text-base" />
              </div>

              {/* Description (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Description</label>
                <textarea 
                  rows={5}
                  placeholder="e.g. Graduated with honors, specialized in Web Development..."
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 transition-all placeholder:text-white/5 resize-none text-sm lg:text-base" 
                />
              </div>
            </div>
          </section>

          {/* DESKTOP BUTTON ONLY */}
          <button 
            onClick={onNext}
            className="hidden lg:block w-full bg-white text-black font-bold py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:scale-[1.01] active:scale-95 transition-all text-base lg:text-lg shadow-xl shadow-white/5"
          >
            Next: Professional Experience
          </button>
        </motion.div>

        {/* RIGHT SIDE: PREVIEW */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full lg:w-[450px] flex-shrink-0"
        >
          <div className="sticky top-24 lg:top-32">
            <div className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl shadow-white/5 overflow-hidden">
              <div className="p-6 lg:p-10 text-black flex flex-col gap-3 lg:gap-4">
                <div className="h-5 lg:h-6 bg-black/10 w-1/2 rounded mb-2 lg:mb-4" />
                <div className="space-y-1.5 lg:space-y-2">
                   <div className="h-1.5 lg:h-2 bg-black/5 w-full rounded" />
                   <div className="h-1.5 lg:h-2 bg-black/10 w-3/4 rounded mt-4 lg:mt-6" /> 
                   <div className="h-1.5 lg:h-2 bg-black/5 w-full rounded" />
                </div>
              </div>
            </div>
            <p className="text-center text-white/20 mt-4 text-[10px] lg:text-xs font-bold uppercase tracking-widest">Live Preview</p>
          </div>

          <button 
            onClick={onNext}
            className="block lg:hidden w-full bg-white text-black font-bold py-4 rounded-xl mt-8 hover:scale-[1.01] active:scale-95 transition-all text-base shadow-xl shadow-white/5"
          >
            Next: Professional Experience
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default SecondResumeBuilder