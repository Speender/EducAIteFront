import React from 'react'
import robotIcon from '../../../assets/robot.svg';

interface FourthResumeBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const FourthResumeBuilder = ({ onBack, onNext }: FourthResumeBuilderProps) => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* --- PROGRESS BAR (Updated to 25% matching your image) --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-[#00CEC8]/20 px-3 py-1 rounded-md">
            <span className="text-[#00CEC8] font-bold text-xs">25%</span>
          </div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Your resume score</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* LEFT SIDE: PROFESSIONAL SUMMARY SECTION */}
        <div className="flex-1 space-y-8">
          <section className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Professional Summary</h2>
              
              <button onClick={onBack} className="text-[#00CEC8] text-sm font-bold hover:underline transition-all">
                Go Back
              </button>
            </div>
            
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Start your summary with a strong statement that reflects your career goal and expertise.
            </p>

            {/* --- PROFESSIONAL SUMMARY TEXTAREA --- */}
            {/* The background color is set to #2A2A2A to match the solid flat gray in your image */}
            <textarea 
              className="w-full h-[320px] bg-[#2A2A2A] rounded-2xl p-6 outline-none focus:ring-1 focus:ring-[#00CEC8]/50 text-white text-sm resize-none transition-all placeholder:text-white/20"
              placeholder="Enter your professional summary here..."
            />
          </section>

          {/* NEXT STEP BUTTON */}
          <button 
            onClick={onNext}
            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:scale-[1.01] transition-transform text-lg shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Next: Employment History
          </button>
        </div>

        {/* RIGHT SIDE: LIVE PREVIEW */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
          <div className="sticky top-32">
            <div className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl shadow-white/5 overflow-hidden transition-all duration-500 hover:shadow-white/10">
              <div className="p-10 text-black flex flex-col gap-4">
                <div className="h-6 bg-black/10 w-1/2 rounded mb-6" />
                
                {/* Visualizing a text block for the summary */}
                <div className="space-y-2 mt-4">
                   <div className="h-2 bg-black/5 w-full rounded" />
                   <div className="h-2 bg-black/5 w-full rounded" />
                   <div className="h-2 bg-black/5 w-5/6 rounded" />
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

export default FourthResumeBuilder