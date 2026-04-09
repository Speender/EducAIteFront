import React, { useState } from 'react'
import { motion } from 'framer-motion';
import logo from '../../../assets/educAIte-logo.svg'

import template1 from '../../../assets/Resume1.svg'
import template2 from '../../../assets/Resume2.svg'
import template3 from '../../../assets/Resume3.svg'

import FirstResumeBuilder from './FirstResumeBuilder'
import SecondResumeBuilder from './SecondResumeBuilder'
import ThirdResumeBuilder from './ThirdResumeBuilder' 
import FourthResumeBuilder from './FourthResumeBuilder'
import FifthResumeBuilder from './FifthResumeBuilder'
import CertificateResumeBuilder from './CertificateResumeBuilder'

import ResumeHistory from './ResumeHistory'

const ResumeMain = () => {
  const [step, setStep] = useState(0);

  if (step === 1) return <FirstResumeBuilder onBack={() => setStep(0)} onNext={() => setStep(2)} />;
  if (step === 2) return <SecondResumeBuilder onBack={() => setStep(1)} onNext={() => setStep(3)} />;
  if (step === 3) return <ThirdResumeBuilder onBack={() => setStep(2)} onNext={() => setStep(4)} />;
  if (step === 4) return <FourthResumeBuilder onBack={() => setStep(3)} onNext={() => setStep(5)} />;
  if (step === 5) return <FifthResumeBuilder onBack={() => setStep(4)} onNext={() => setStep(6)} />;
  if (step === 6) return <CertificateResumeBuilder onBack={() => setStep(5)} onNext={() => setStep(7)} />;

  if (step === 10) {
    return (
      <ResumeHistory 
        onBack={() => setStep(0)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 font-sans relative overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col items-center">
        
        {/* Header Content */}
        <div className="w-full relative flex flex-col items-center mb-8 lg:mb-12 text-center">
          
          {/* History Action - Added Option 2 Fix: -translate-y-4 on mobile, reset on lg */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }}   
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="absolute right-0 top-12 lg:top-2 z-50 -translate-y-7 lg:translate-y-0"
          >
            <button 
              onClick={() => setStep(10)}
              className="bg-white text-black px-3 py-1.5 lg:px-4 lg:py-1.5 text-xs lg:text-sm rounded-full shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all lg:mb-20"
            >
              View History
            </button>
          </motion.div>

          {/* Title - RESPONSIVE FIX: Added mt-16 on mobile so it doesn't overlap with the newly lowered button */}
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 tracking-tight mt-16 lg:mt-0"
          >
            Resume Builder
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            onClick={() => setStep(1)}
            className="text-white/70 text-base lg:text-xl max-w-2xl leading-relaxed cursor-pointer hover:text-white transition-colors group px-4 lg:px-0"
          >
            Create a professional resume effortlessly with your Educ<span className="text-[#00CEC8] group-hover:drop-shadow-[0_0_10px_#00CEC8]">AI</span>te profile
          </motion.p>
        </div>

        {/* Primary Call to Action */}
        <motion.button 
          onClick={() => setStep(1)}
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }}    
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="bg-white text-black font-bold text-base lg:text-lg px-8 lg:px-12 py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all mb-12 lg:mb-20"
        >
          Create my Resume
        </motion.button>
  
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="mb-8 lg:mb-12"
        >
          <span className="border border-white/20 bg-white/5 text-white/60 px-6 lg:px-8 py-2 lg:py-2.5 rounded-full text-[10px] lg:text-xs uppercase tracking-[0.2em] font-semibold shadow-xl">
            Select Template
          </span>
        </motion.div>

        {/* --- TEMPLATES GRID --- */}
        {/* RESPONSIVE FIX: flex-row ensures they stay side-by-side on all screens. Gap shrinks drastically on mobile (gap-2) to fit them in. */}
        <div className="flex flex-row justify-center items-end gap-2 sm:gap-4 lg:gap-12 w-full max-w-6xl">
          
          {/* Side Template (Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.5, y: 0 }}
            whileHover={{ opacity: 1, y: -16 }} 
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="w-1/3 cursor-pointer transition-all duration-500"
          >
            <div className="rounded-md lg:rounded-xl overflow-hidden border border-white/5 bg-[#111]">
              <img src={template1} alt="Modern Template" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Featured Template (Center) */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 1.1 }}
            animate={{ opacity: 1, y: 0, scale: 1.1 }}
            whileHover={{ y: -24 }} 
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="w-1/3 cursor-pointer z-10 transition-all duration-500"
          >
            <div className="rounded-md lg:rounded-xl overflow-hidden border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.6)] lg:shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-[#111]">
              <img src={template2} alt="Professional Template" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Side Template (Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.5, y: 0 }}
            whileHover={{ opacity: 1, y: -16 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="w-1/3 cursor-pointer transition-all duration-500"
          >
            <div className="rounded-md lg:rounded-xl overflow-hidden border border-white/5 bg-[#111]">
              <img src={template3} alt="Creative Template" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
        
      </div>
    </div>
  )
}

export default ResumeMain