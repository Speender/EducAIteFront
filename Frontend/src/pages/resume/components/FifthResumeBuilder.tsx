import React from 'react'
import robotIcon from '../../../assets/robot.svg';

interface FifthResumeBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const FifthResumeBuilder = ({ onBack, onNext }: FifthResumeBuilderProps) => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* --- PROGRESS BAR (Updated to 25%) --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="bg-[#00CEC8]/20 px-3 py-1.5 rounded-md flex items-center justify-center">
              <span className="text-[#00CEC8] font-bold text-xs">25%</span>
            </div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Your resume score</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* LEFT SIDE: WORK EXPERIENCE FORM */}
        <div className="flex-1 space-y-8">
          <section className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold">Work Experience</h2>
              <button onClick={onBack} className="text-[#00CEC8] text-sm font-bold hover:underline">
                Go Back
              </button>
            </div>
            <p className="text-white/40 text-sm mb-8">
              Adding relevant coursework can improve how well your resume matches job descriptions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Job title / Internship (Half Width to match image) */}
              <div>
                <label className="block text-sm font-semibold mb-3">Job title / Internship</label>
                <input 
                  type="text" 
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50 transition-all text-sm" 
                />
              </div>
              
              {/* Employer (Half Width to match image) */}
              <div>
                <label className="block text-sm font-semibold mb-3">Employer</label>
                <input 
                  type="text" 
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50 transition-all text-sm" 
                />
              </div>

              {/* Date Row */}
              <div>
                <label className="block text-sm font-semibold mb-3">Start & End Date</label>
                <div className="flex gap-2">
                   <input type="text" placeholder="MM/YYYY" className="w-1/2 bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50 text-sm placeholder:text-white/10" />
                   <input type="text" placeholder="MM/YYYY" className="w-1/2 bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50 text-sm placeholder:text-white/10" />
                </div>
              </div>
              
              {/* City */}
              <div>
                <label className="block text-sm font-semibold mb-3">City</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50 text-sm" />
              </div>

              {/* Description (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-3">Description</label>
                <textarea 
                  rows={8}
                  className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50 transition-all resize-none text-sm" 
                />
              </div>
            </div>

            {/* ADD ONE MORE EXPERIENCE BUTTON */}
            <button className="flex items-center gap-2 text-[#00CEC8] font-bold text-sm hover:opacity-80 transition-all mt-6">
              <span className="text-xl">+</span> Add one more experience
            </button>
          </section>

          {/* NEXT STEP BUTTON (Updated Text) */}
          <button 
            onClick={onNext}
            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:scale-[1.01] transition-transform text-lg shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Next: Review
          </button>
        </div>

        {/* RIGHT SIDE: LIVE PREVIEW */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
          <div className="sticky top-32">
            <div className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl shadow-white/5 overflow-hidden transition-all duration-500 hover:shadow-white/10">
              <div className="p-10 text-black flex flex-col gap-4">
                <div className="h-6 bg-black/10 w-1/2 rounded mb-6" />
                <div className="flex gap-2 mb-10">
                  <div className="h-5 bg-[#00CEC8]/20 w-20 rounded-full border border-[#00CEC8]/30" />
                  <div className="h-5 bg-black/5 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                   <div className="h-2 bg-black/5 w-full rounded" />
                   <div className="h-2 bg-black/5 w-5/6 rounded" />
                   <div className="h-2 bg-[#00CEC8]/10 w-full rounded mt-8" />
                   <div className="h-2 bg-black/5 w-4/6 rounded" />
                </div>
              </div>
            </div>
            <p className="text-center text-white/20 mt-5 text-xs font-bold uppercase tracking-widest font-sans">Live Preview</p>
          </div>
        </div>
      </div>

      {/* STICKY ROBOT CHATBOT */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <div className="w-14 h-14 bg-[#111] border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group">
          <img src={robotIcon} alt="assistant" className="w-9 h-9 group-hover:rotate-12 transition-transform" />
        </div>
      </div>
    </div>
  )
}

export default FifthResumeBuilder