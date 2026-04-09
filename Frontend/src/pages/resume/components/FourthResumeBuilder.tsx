import React from 'react'
import { motion } from 'framer-motion';

interface FourthResumeBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const FourthResumeBuilder = ({ onBack, onNext }: FourthResumeBuilderProps) => {
  return (
    <div className="min-h-screen bg-black text-white pt-36 lg:pt-24 pb-10 px-4 md:px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* --- PROGRESS BAR--- */}
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
        
        {/* LEFT SIDE: PROFESSIONAL SUMMARY SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7, ease: "easeOut" }} 
          className="flex-1 space-y-6 lg:space-y-8"
        >
          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl lg:rounded-3xl p-5 md:p-6 lg:p-8">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">Professional Summary</h2>
              
              <button onClick={onBack} className="text-[#00CEC8] text-xs lg:text-sm font-bold hover:underline transition-all">
                Go Back
              </button>
            </div>
            
            <p className="text-white/40 text-xs lg:text-sm mb-6 lg:mb-8 leading-relaxed">
              Start your summary with a strong statement that reflects your career goal and expertise.
            </p>

            {/* --- PROFESSIONAL SUMMARY TEXTAREA --- */}
            <textarea 
              className="w-full h-[250px] lg:h-[320px] bg-[#2A2A2A] rounded-xl lg:rounded-2xl p-4 lg:p-6 outline-none focus:ring-1 focus:ring-[#00CEC8]/50 text-white text-sm lg:text-base resize-none transition-all placeholder:text-white/20"
              placeholder="Enter your professional summary here..."
            />
          </section>

          {/* DESKTOP BUTTON ONLY */}
          <button 
            onClick={onNext}
            className="hidden lg:block w-full bg-white text-black font-bold py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:scale-[1.01] transition-transform text-base lg:text-lg shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Next: Employment History
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
                
                <div className="space-y-1.5 lg:space-y-2 mt-2 lg:mt-4">
                   <div className="h-1.5 lg:h-2 bg-black/5 w-full rounded" />
                   <div className="h-1.5 lg:h-2 bg-black/5 w-full rounded" />
                   <div className="h-1.5 lg:h-2 bg-black/5 w-5/6 rounded" />
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
            Next: Employment History
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default FourthResumeBuilder