import React from 'react'
import robotIcon from '../../../assets/EducaiteRobot.svg'

interface FirstResumeBuilderProps {
  onBack: () => void;
  onNext: () => void; 
}

const FirstResumeBuilder = ({ onBack, onNext }: FirstResumeBuilderProps) => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* 10% PROGRESS BAR SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-[#00CEC8]/20 px-3 py-1 rounded-md">
            <span className="text-[#00CEC8] font-bold text-xs">10%</span>
          </div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Your resume score</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* LEFT SIDE: FORM FIELDS */}
        <div className="flex-1 space-y-8">
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

              {/* Address (Full Width - from new image) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-3">Address</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

              {/* NEW FIELDS FROM IMAGE_3.PNG */}

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

              {/* Nationality Row (Single column in 2-col grid) */}
              <div>
                <label className="block text-sm font-semibold mb-3">Nationality</label>
                <input type="text" className="w-full bg-[#111] border border-white/5 rounded-xl p-4 outline-none focus:border-[#00CEC8]/50" />
              </div>

            </div>
          </section>

          {/* NEXT STEP BUTTON */}
          <button 
            onClick={onNext} 
            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:scale-[1.01] transition-transform text-lg shadow-xl shadow-white/5"
          >
            Next: Education
          </button>
        </div>

        {/* RIGHT SIDE: LIVE PREVIEW (Paper feel) */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
          <div className="sticky top-32">
            <div className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl shadow-white/5 overflow-hidden">
              <div className="p-10 text-black flex flex-col gap-4">
                <div className="h-6 bg-black/10 w-1/2 rounded mb-4" />
                <div className="space-y-2">
                   <div className="h-2 bg-black/5 w-full rounded" />
                   <div className="h-2 bg-black/5 w-full rounded" />
                   <div className="h-2 bg-black/5 w-2/3 rounded" />
                </div>
              </div>
            </div>
            <p className="text-center text-white/20 mt-4 text-xs font-bold uppercase tracking-widest">Live Preview</p>
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

export default FirstResumeBuilder;