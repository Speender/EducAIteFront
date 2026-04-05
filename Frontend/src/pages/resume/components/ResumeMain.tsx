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
    <div className="min-h-screen bg-black text-white pt-32 pb-20 font-sans relative">
      

      <div className="max-w-7xl mx-auto px-12 flex flex-col items-center">
        
        {/* Header Content */}
        <div className="w-full relative flex flex-col items-center mb-12 text-center">
          
          {/* History Action */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} // Starts invisible and 50px to the right
            animate={{ opacity: 1, x: 0 }}   // Slides into its original position
            transition={{ duration: 0.8, ease: "easeOut" }} // Smooth 0.5s transition
            className="absolute right-0 top-2"
          >
            <button 
              onClick={() => setStep(10)}
              className="bg-white text-black px-4 py-1.5 text-sm rounded-full shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all mb-20"
            >
              View History
            </button>
          </motion.div>

          <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl font-bold mb-6 tracking-tight"
          >
            Resume Builder
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            onClick={() => setStep(1)}
            className="text-white/70 text-xl max-w-2xl leading-relaxed cursor-pointer hover:text-white transition-colors group"
          >
            Create a professional resume effortlessly with your Educ<span className="text-[#00CEC8] group-hover:drop-shadow-[0_0_10px_#00CEC8]">AI</span>te profile
          </motion.p>
        </div>

        {/* Primary Call to Action */}
        <motion.button 
          onClick={() => setStep(1)}
          initial={{ opacity: 0, x: 50 }} // Starts invisible and 50px to the right
          animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
          transition={{ duration: 0.8, ease: "easeOut" }} // Smooth 0.5s transition
          className="bg-white text-black font-bold text-lg px-12 py-4 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all mb-20"
        >
          Create my Resume
        </motion.button>
  
        <motion.div 
          initial={{ opacity: 0, y: 40 }} // Starts invisible and 40px below
          animate={{ opacity: 1, y: 0 }}    // Slides up to its original position
          transition={{ duration: 0.8, ease: "easeOut" }} // Smooth 0.6s transition
          className="mb-12"
        >
          <span className="border border-white/20 bg-white/5 text-white/60 px-8 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold shadow-xl">
            Select Template
          </span>
        </motion.div>

        {/* --- TEMPLATES GRID --- */}
        <div className="flex justify-center items-end gap-12 w-full max-w-6xl">
          
          {/* Side Template (Left) - Slides up first */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.5, y: 0 }}
            whileHover={{ opacity: 1, y: -16 }} // Replaces the hover:-translate-y-4
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="w-1/3 cursor-pointer transition-all duration-500"
          >
            <div className="rounded-xl overflow-hidden border border-white/5 bg-[#111]">
              <img src={template1} alt="Modern Template" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Featured Template (Center) - Slides up second */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 1.1 }}
            animate={{ opacity: 1, y: 0, scale: 1.1 }}
            whileHover={{ y: -24 }} // Replaces the hover:-translate-y-6
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="w-1/3 cursor-pointer z-10 transition-all duration-500"
          >
            <div className="rounded-xl overflow-hidden border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-[#111]">
              <img src={template2} alt="Professional Template" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Side Template (Right) - Slides up last */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.5, y: 0 }}
            whileHover={{ opacity: 1, y: -16 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="w-1/3 cursor-pointer transition-all duration-500"
          >
            <div className="rounded-xl overflow-hidden border border-white/5 bg-[#111]">
              <img src={template3} alt="Creative Template" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResumeMain