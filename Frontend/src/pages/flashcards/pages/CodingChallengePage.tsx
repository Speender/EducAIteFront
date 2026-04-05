import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizScoreModal } from '../components/QuizScoreModal'; 
import logo from '../../../assets/educAIte-logo.svg';
import AImpatin from '../../../assets/robot.svg';
import { motion } from 'framer-motion';

export function CodeChallengePage() {
  const navigate = useNavigate();

  // State to control modal
  const [showScoreModal, setShowScoreModal] = useState(false);

  // The code inside the editor
  const [code, setCode] = useState(`// Imports
import mongoose, { Schema } from 'mongoose'

// Collection name
export const collection = 'Product'

// Schema
const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  
  description: {
    type: String
  }
}, {timestamps: true})

// Model
export default mongoose.model(collection, schema, collection)`);

  const lineNumbers = Array.from({ length: 33 }, (_, i) => i + 1);

  return (
    <div className="h-screen bg-black px-8 pt-10 pb-6 text-white font-sans antialiased flex flex-col overflow-hidden relative">

      <header className="flex items-center justify-between mb-8 shrink-0 max-w-[1600px] mx-auto w-full z-20">
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <img src={logo} alt="educAIte" className="h-10 w-auto" />
        </div>
        
        {/* Top Right Actions (Placeholder to balance header, just like LearnPage) */}
        <div className="w-[120px]"></div>
      </header>

      {/* MAIN WORKSPACE GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 min-h-0 pb-4 max-w-[1600px] mx-auto w-full">
        {/* --- CONVERTED TO MOTION.SECTION WITH SLIDE-IN FROM LEFT ANIMATION --- */}
        <motion.section 
          initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
          animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          className="bg-[#0A0A0A] border border-white/10 rounded-[24px] flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="flex items-end justify-between px-4 pt-3 border-b border-white/5 shrink-0 bg-[#050505]">
            <div className="bg-[#1A1A1A] border border-white/10 border-b-0 rounded-t-xl px-5 py-3 flex items-center gap-2 text-sm font-medium text-[#00CEC8]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              Code Editor
            </div>
            
            <button className="bg-white/5 text-white border border-white/10 font-bold text-[13px] px-6 py-2 rounded-full mb-2 hover:bg-white/10 transition-colors flex items-center gap-2">
              Run
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden bg-[#0A0A0A]">
            <div className="w-12 pt-4 pb-4 flex flex-col items-center text-white/30 font-mono text-[14px] leading-[1.6] shrink-0 select-none bg-[#050505] border-r border-white/5">
              {lineNumbers.map(num => (
                <div key={num}>{num}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="flex-1 w-full bg-transparent text-[#E2E8F0] font-mono text-[14px] leading-[1.6] p-4 outline-none resize-none whitespace-pre focus:ring-inset focus:ring-1 focus:ring-[#00CEC8]/30 transition-all"
            />
          </div>
        </motion.section>

        {/* =========================================
            RIGHT PANELS 
            ========================================= */}
        <section className="flex flex-col gap-6 min-h-0">
          
          {/* TOP RIGHT: DESCRIPTION */}
          {/* --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM RIGHT AND HIDDEN SCROLLBAR --- */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="flex-[3] bg-[#0A0A0A] border border-white/10 rounded-[24px] flex flex-col overflow-hidden shadow-2xl"
          >
            
            {/* Tabs */}
            <div className="flex items-end px-4 pt-3 border-b border-white/5 shrink-0 gap-2 bg-[#050505]">
              <div className="bg-[#1A1A1A] border border-white/10 border-b-0 rounded-t-xl px-5 py-3 flex items-center gap-2 text-sm font-medium text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Description
              </div>
              <button className="text-white/40 hover:text-white transition-colors px-5 py-3 flex items-center gap-2 text-sm font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Solution
              </button>
            </div>

            {/* Content (Scrollbar hidden via Tailwind arbitrary variants) */}
            <div className="p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <h2 className="text-3xl font-bold mb-6 text-white">Mongoose</h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                Given a positive integer <span className="text-[#00CEC8] bg-[#00CEC8]/10 px-1.5 py-0.5 rounded font-mono">millis</span>, write an asynchronous function that sleeps for millis milliseconds. It can resolve any value.
              </p>
              <p className="text-white/70 text-[15px] leading-relaxed mb-8">
                Note that minor deviation from <span className="text-[#00CEC8] bg-[#00CEC8]/10 px-1.5 py-0.5 rounded font-mono">millis</span> in the actual sleep duration is acceptable.
              </p>
              
              {/* Example Block */}
              <div className="mb-4 text-white font-bold tracking-wide">Example 1:</div>
              <div className="border border-white/10 bg-[#111] rounded-[16px] p-5 font-mono text-[13px] leading-relaxed text-white/60 mb-6 shadow-inner">
                <span className="text-white font-semibold">Input:</span> millis = 100<br/>
                <span className="text-white font-semibold">Output:</span> 100<br/>
                <span className="text-white font-semibold">Explanation:</span> It should return a promise that resolves after 100ms.<br/>
                <br/>
                <span className="text-[#00CEC8]">let</span> t = Date.now();<br/>
                <span className="text-[#e2b93d]">sleep</span>(100).then(() ={'>'} {'{'}<br/>
                &nbsp;&nbsp;console.log(Date.now() - t); <span className="text-green-400/70">// 100</span><br/>
                {'}'});
              </div>
            </div>
          </motion.div>

          {/* BOTTOM RIGHT: TEST CASES */}
          {/* --- CONVERTED TO MOTION.DIV WITH SLIDE-UP FROM BOTTOM ANIMATION --- */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} // Starts invisible and 50px below
            animate={{ opacity: 1, y: 0 }}    // Slides up into its original position (0)
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="flex-[2] bg-[#0A0A0A] border border-white/10 rounded-[24px] flex flex-col overflow-hidden shadow-2xl"
          >
            
            <div className="flex items-end justify-between px-4 pt-3 border-b border-white/5 shrink-0 bg-[#050505]">
              <div className="bg-[#1A1A1A] border border-white/10 border-b-0 rounded-t-xl px-5 py-3 flex items-center gap-2 text-sm font-medium text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                Test Cases
              </div>
              
              <button 
                onClick={() => setShowScoreModal(true)}
                className="bg-[#00CEC8] text-black font-bold text-[13px] px-8 py-2 rounded-full mb-2 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,206,200,0.4)] active:scale-95 uppercase tracking-widest"
              >
                Submit
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="font-sans font-bold text-white/80 mb-2 text-sm">Case {num}</div>
                  <div className="text-[#00CEC8] font-mono text-[13px]">x = 121</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* RENDER THE MODAL ON TOP OF EVERYTHING */}
      {showScoreModal && (
        <QuizScoreModal 
          score={72} 
          message="This is a promising score that shows you're on the right track, but leveling up your logic and code mastery will push your performance even higher."
          onClose={() => setShowScoreModal(false)}
        />
      )}
      
    </div>
  );
}

export default CodeChallengePage;