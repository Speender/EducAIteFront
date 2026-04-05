import React from 'react'
import { motion } from 'framer-motion';

interface FirstResumeBuilderProps {
  onBack: () => void;
  onNext: () => void; 
}

const FirstResumeBuilder = ({ onBack, onNext }: FirstResumeBuilderProps) => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* 10% PROGRESS BAR SECTION */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
        animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20, 
          duration: 0.6 
        }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className="bg-[#00CEC8]/20 px-3 py-1 rounded-md">
            <span className="text-[#00CEC8] font-bold text-xs">10%</span>
          </div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
            Your resume score
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* LEFT SIDE: FORM FIELDS */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 space-y-8"
        >
          <section className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
            <p className="text-white/40 text-sm mb-8">
              Resumes with measurable achievements are 45% more likely to get recruiter callbacks.
            </p>

            {/* --- INTEGRATED FORM GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Job Title (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-3">Job Title</label>
                <input 
                  type="text" 
                  placeholder="Software Engineer"
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50 transition-all placeholder:text-white/10" 
                />
              </div>
              
              {/* Name Row */}
              <div>
                <label className="block text-sm font-semibold mb-3">First Name</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">Last Name</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

              {/* Contact Row */}
              <div>
                <label className="block text-sm font-semibold mb-3">Email</label>
                <input type="email" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">Phone</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-3">Address</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

              {/* City / State & Country Row */}
              <div>
                <label className="block text-sm font-semibold mb-3">City / State</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">Country</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

              {/* Postal Code & Place of Birth Row */}
              <div>
                <label className="block text-sm font-semibold mb-3">Postal Code</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">Place of Birth</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

              {/* Nationality Row */}
              <div>
                <label className="block text-sm font-semibold mb-3">Nationality</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

            </div>
          </section>

          {/* NEXT STEP BUTTON */}
          <button 
            onClick={onNext} 
            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:scale-[1.01] active:scale-95 transition-all text-lg shadow-xl shadow-white/5"
          >
            Next: Education
          </button>
        </motion.div>

        {/* RIGHT SIDE: LIVE PREVIEW (Paper feel) */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} // Starts invisible and 60px below
          animate={{ opacity: 1, y: 0 }}    // Slides up to its original position
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1], // Custom "expo" ease-out for a premium feel
            delay: 0.2               // Slight delay so it follows the form entrance
          }}
          className="w-full lg:w-[450px] flex-shrink-0"
        >
          <div className="sticky top-32">
            {/* --- PREVIEW CARD WITH SUBTLE HOVER --- */}
            <motion.div 
              whileHover={{ y: -5 }} 
              className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl shadow-white/5 overflow-hidden"
            >
              <div className="p-10 text-black flex flex-col gap-4">
                <div className="h-6 bg-black/10 w-1/2 rounded mb-4" />
                <div className="space-y-2">
                   <div className="h-2 bg-black/5 w-full rounded" />
                   <div className="h-2 bg-black/5 w-full rounded" />
                   <div className="h-2 bg-black/5 w-2/3 rounded" />
                </div>
              </div>
            </motion.div>
            
            <p className="text-center text-white/20 mt-4 text-xs font-bold uppercase tracking-widest">
              Live Preview
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FirstResumeBuilder;