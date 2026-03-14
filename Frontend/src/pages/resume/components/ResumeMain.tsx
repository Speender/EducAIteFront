import React, { useState } from 'react'
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
      
      {/* Brand Logo - Top Left */}
      <div className="absolute top-10 left-12">
        <img src={logo} alt="educAIte" className="h-10" />
      </div>

      <div className="max-w-7xl mx-auto px-12 flex flex-col items-center">
        
        {/* Header Content */}
        <div className="w-full relative flex flex-col items-center mb-12 text-center">
          
          {/* History Action */}
          <div className="absolute right-0 top-2">
            <button 
              onClick={() => setStep(10)}
              className="bg-white text-black px-4 py-1.5 text-sm rounded-full shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 transition-all mb-20"
            >
              View History
            </button>
          </div>

          <h1 className="text-6xl font-bold mb-6 tracking-tight">Resume Builder</h1>
          
          {/* CLICKABLE TEXT TRIGGER */}
          <p 
            onClick={() => setStep(1)}
            className="text-white/70 text-xl max-w-2xl leading-relaxed cursor-pointer hover:text-white transition-colors group"
          >
            Create a professional resume effortlessly with your Educ<span className="text-[#00CEC8] group-hover:drop-shadow-[0_0_10px_#00CEC8]">AI</span>te profile
          </p>
        </div>

        {/* Primary Call to Action */}
        <button 
          onClick={() => setStep(1)}
          className="bg-white text-black font-bold text-lg px-12 py-4 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 transition-all mb-20"
        >
          Create my Resume
        </button>

        {/* Template Selection Label */}
        <div className="mb-12">
          <span className="border border-white/20 bg-white/5 text-white/60 px-8 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold">
            Select Template
          </span>
        </div>

        {/* --- TEMPLATES GRID --- */}
        <div className="flex justify-center items-end gap-12 w-full max-w-6xl">
          
          {/* Side Template (Left) */}
          <div className="w-1/3 cursor-pointer opacity-50 hover:opacity-100 hover:-translate-y-4 transition-all duration-500">
            <div className="rounded-xl overflow-hidden border border-white/5 bg-[#111]">
              <img src={template1} alt="Modern Template" className="w-full h-auto" />
            </div>
          </div>

          {/* Featured Template (Center) */}
          <div className="w-1/3 scale-110 cursor-pointer hover:-translate-y-6 transition-all duration-500 z-10">
            <div className="rounded-xl overflow-hidden border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-[#111]">
              <img src={template2} alt="Professional Template" className="w-full h-auto" />
            </div>
          </div>

          {/* Side Template (Right) */}
          <div className="w-1/3 cursor-pointer opacity-50 hover:opacity-100 hover:-translate-y-4 transition-all duration-500">
            <div className="rounded-xl overflow-hidden border border-white/5 bg-[#111]">
              <img src={template3} alt="Creative Template" className="w-full h-auto" />
            </div>
          </div>
 
        </div>
      </div>
    </div>
  )
}

export default ResumeMain