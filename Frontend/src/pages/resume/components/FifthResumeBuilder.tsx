import React from 'react'
import { motion } from 'framer-motion';

interface FifthResumeBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const FifthResumeBuilder = ({ onBack, onNext }: FifthResumeBuilderProps) => {
  return (
    <div className="min-h-screen bg-black text-white pt-36 lg:pt-24 pb-10 px-4 md:px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* --- PROGRESS BAR (Updated to 25%) --- */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }} 
        animate={{ opacity: 1, x: 0 }}    
        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.6 }} 
        className="max-w-7xl mx-auto mb-6 lg:mb-8"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-3 lg:p-4 flex items-center justify-between gap-3 lg:gap-4 shadow-inner">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="bg-[#00CEC8]/20 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-md flex items-center justify-center">
              <span className="text-[#00CEC8] font-bold text-[10px] lg:text-xs">25%</span>
            </div>
            <p className="text-white/40 text-[10px] lg:text-xs font-medium uppercase tracking-wider">Your resume score</p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* LEFT SIDE: WORK EXPERIENCE FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7, ease: "easeOut" }} 
          className="flex-1 space-y-6 lg:space-y-8"
        >
          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl lg:rounded-3xl p-5 md:p-6 lg:p-8">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl lg:text-2xl font-bold">Work Experience</h2>
              <button onClick={onBack} className="text-[#00CEC8] text-xs lg:text-sm font-bold hover:underline">
                Go Back
              </button>
            </div>
            <p className="text-white/40 text-xs lg:text-sm mb-6 lg:mb-8">
              Adding relevant coursework can improve how well your resume matches job descriptions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              
              {/* Job title / Internship */}
              <div>
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Job title / Internship</label>
                <input 
                  type="text" 
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 transition-all text-sm lg:text-base" 
                />
              </div>
              
              {/* Employer */}
              <div>
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Employer</label>
                <input 
                  type="text" 
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 transition-all text-sm lg:text-base" 
                />
              </div>

              {/* Date Row */}
              <div>
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Start & End Date</label>
                <div className="flex gap-2">
                   <input type="text" placeholder="MM/YYYY" className="w-1/2 bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 text-sm lg:text-base placeholder:text-white/10" />
                   <input type="text" placeholder="MM/YYYY" className="w-1/2 bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 text-sm lg:text-base placeholder:text-white/10" />
                </div>
              </div>
              
              {/* City */}
              <div>
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">City</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 text-sm lg:text-base" />
              </div>

              {/* Description (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Description</label>
                <textarea 
                  rows={6}
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 transition-all resize-none text-sm lg:text-base" 
                />
              </div>
            </div>

            {/* ADD ONE MORE EXPERIENCE BUTTON */}
            <button className="flex items-center gap-2 text-[#00CEC8] font-bold text-xs lg:text-sm hover:opacity-80 transition-all mt-4 lg:mt-6">
              <span className="text-lg lg:text-xl">+</span> Add one more experience
            </button>
          </section>

          <button 
            onClick={onNext}
            className="hidden lg:block w-full bg-white text-black font-bold py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:scale-[1.01] transition-transform text-base lg:text-lg shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Next: Review
          </button>
        </motion.div>

        {/* RIGHT SIDE: LIVE PREVIEW */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full lg:w-[450px] flex-shrink-0"
        >
          <div className="sticky top-24 lg:top-32">
            <div className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl shadow-white/5 overflow-hidden transition-all duration-500 hover:shadow-white/10">
              <div className="p-6 lg:p-10 text-black flex flex-col gap-3 lg:gap-4">
                <div className="h-5 lg:h-6 bg-black/10 w-1/2 rounded mb-4 lg:mb-6" />
                <div className="flex gap-2 mb-6 lg:mb-10">
                  <div className="h-4 lg:h-5 bg-[#00CEC8]/20 w-16 lg:w-20 rounded-full border border-[#00CEC8]/30" />
                  <div className="h-4 lg:h-5 bg-black/5 w-12 lg:w-16 rounded-full" />
                </div>
                <div className="space-y-1.5 lg:space-y-2">
                   <div className="h-1.5 lg:h-2 bg-black/5 w-full rounded" />
                   <div className="h-1.5 lg:h-2 bg-black/5 w-5/6 rounded" />
                   <div className="h-1.5 lg:h-2 bg-[#00CEC8]/10 w-full rounded mt-6 lg:mt-8" />
                   <div className="h-1.5 lg:h-2 bg-black/5 w-4/6 rounded" />
                </div>
              </div>
            </div>
            <p className="text-center text-white/20 mt-4 lg:mt-5 text-[10px] lg:text-xs font-bold uppercase tracking-widest font-sans">Live Preview</p>
          </div>

          <button 
            onClick={onNext}
            className="block lg:hidden w-full bg-white text-black font-bold py-4 rounded-xl mt-8 hover:scale-[1.01] transition-transform text-base shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Next: Review
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default FifthResumeBuilder