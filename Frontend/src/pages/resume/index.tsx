import React from 'react'
import logo from '../../assets/educAIte logo.svg'
import template1 from '../../assets/Resume1.svg'
import template2 from '../../assets/Resume2.svg'
import template3 from '../../assets/Resume3.svg'

const ResumePage = () => {
  return (
    // pt-32 gives room for your fixed navbar from App.tsx
    <div className="min-h-screen bg-black text-white pt-32 pb-20 font-sans relative">
      
      {/* Logo placed on the top left */}
      <div className="absolute top-10 left-12">
        <img src={logo} alt="educAIte" className="h-8" />
      </div>

      <div className="max-w-7xl mx-auto px-12 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="w-full relative flex flex-col items-center mb-12">
          
          {/* View History Button on the far right */}
          <div className="absolute right-0 top-2">
            <button className="border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-colors text-sm">
              View History
            </button>
          </div>

          <h1 className="text-5xl font-bold mb-4">Resume Builder</h1>
          <p className="text-white/80 text-lg">
            Create a professional resume effortlessly with your Educ<span className="text-[#00CEC8]">AI</span>te profile
          </p>
        </div>

        {/* Create Resume Button */}
        <button className="bg-white text-black font-semibold text-lg px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-all mb-16">
          Create my Resume
        </button>

        {/* Select Template Badge */}
        <div className="mb-10">
          <span className="border border-white/30 bg-transparent text-white/70 px-6 py-2 rounded-full text-sm">
            Select Template
          </span>
        </div>

        {/* Template Images Grid */}
        <div className="flex justify-center items-end gap-8 w-full">
          
          {/* Template 1 (Left) */}
          <div className="w-1/3 max-w-[320px] cursor-pointer opacity-80 hover:opacity-100 hover:-translate-y-2 transition-all">
            <img 
              src={template1}
              alt="Template 1" 
              className="w-full h-auto rounded-sm"
            />
          </div>

          {/* Template 2 (Center - Slightly larger in the design) */}
          <div className="w-1/3 max-w-[360px] cursor-pointer hover:-translate-y-2 transition-all z-10">
            <img 
              src={template2}
              alt="Template 2" 
              className="w-full h-auto rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            />
          </div>

          {/* Template 3 (Right) */}
          <div className="w-1/3 max-w-[320px] cursor-pointer opacity-80 hover:opacity-100 hover:-translate-y-2 transition-all">
            <img 
              src={template3}
              alt="Template 3" 
              className="w-full h-auto rounded-sm"
            />
          </div>

        </div>

      </div>
    </div>
  )
}

export default ResumePage