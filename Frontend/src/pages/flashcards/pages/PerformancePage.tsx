import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/educAIte-logo.svg';
import { motion } from 'framer-motion';

import AImpatin from '../../../assets/robot.svg';
import MagicBento from '../../../components/MagicBento'; 


export function PerformancePage() {
  const navigate = useNavigate();
  
  // Mock Data
  const quizResult = {
    totalResponses: 2,
    highestScore: 100,
    lowestScore: 72,
    mediumScore: 87.5,
    finalScore: 72,
    insight: "Your performance shows solid understanding. Focus on the areas where mistakes were frequent; with targeted practice, you can significantly improve."
  };

  // --- SVG Gauge Calculations ---
  const radius = 90; 
  const cx = 110;
  const cy = 110;
  const circumference = Math.PI * radius; 
  const dashoffset = circumference * (1 - quizResult.finalScore / 100);
  const angleInRadians = (quizResult.finalScore / 100) * Math.PI;
  const thumbX = cx - radius * Math.cos(angleInRadians);
  const thumbY = cy - radius * Math.sin(angleInRadians);

  return (
    <div className="min-h-screen bg-black px-4 lg:px-8 pt-24 pb-24 lg:pt-10 lg:pb-20 text-white font-sans antialiased relative overflow-x-hidden">
      
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-8 lg:mb-12 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md shadow-lg z-20 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <img src={logo} alt="educAIte" className="h-8 lg:h-9 opacity-90 z-20" />
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto relative z-10">
        
        {/* TITLE */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="mb-8 lg:mb-10 flex flex-col items-center text-center"
        >
          <h1 className="text-3xl lg:text-[42px] font-semibold text-white tracking-tight">
            Overall <span className="text-[#00CEC8]">Performance</span>
          </h1>
          <div className="h-[2px] w-16 lg:w-20 bg-[#00CEC8]/60 mx-auto mt-3 rounded-full"></div>
        </motion.div>

        {/* MAGIC BENTO GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[160px] lg:auto-rows-[180px]">
          
          {/* GAUGE CHART (Tall) */}
          <motion.div
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="col-span-2 lg:col-span-1 row-span-2 h-full"
          >
            <MagicBento className="h-full w-full bg-[#0A0A0A] border border-white/5 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 flex flex-col items-center justify-between group hover:border-[#00CEC8]/30 transition-colors">
              <h2 className="text-sm lg:text-[16px] font-bold text-white/60 uppercase tracking-widest text-center">Final Score</h2>
              
              <div className="relative w-[220px] h-[110px] flex-shrink-0 mt-6 lg:mt-8 pointer-events-none">
                <svg viewBox="0 0 220 120" className="w-full h-full overflow-visible">
                  <path d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 210 ${cy}`} fill="none" stroke="#222" strokeWidth="16" strokeLinecap="round" />
                  <path 
                    d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 210 ${cy}`} 
                    fill="none" stroke="#00CEC8" strokeWidth="16" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={dashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                  <circle cx={thumbX} cy={thumbY} r="8" fill="#00CEC8" stroke="#0A0A0A" strokeWidth="4" />
                </svg>
                <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center">
                  <span className="text-[40px] lg:text-[48px] font-black text-[#00CEC8] leading-none drop-shadow-[0_0_15px_rgba(0,206,200,0.3)]">
                    {quizResult.finalScore}%
                  </span>
                </div>
              </div>
              <div className="mt-8 w-full z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    navigate('/cards');  
                  }} 
                  className="rounded-full bg-white/5 border border-white/10 px-8 py-3 text-white font-bold text-xs lg:text-[13px] hover:bg-white hover:text-black hover:scale-105 transition-all w-full tracking-wide"
                >
                  Back to lesson
                </button>
              </div>
            </MagicBento>
          </motion.div>

          {/*. MASTERY PIE CHART (Large) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}  
            animate={{ opacity: 1, y: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="col-span-2 lg:col-span-2 row-span-3 lg:row-span-2 h-full"
          >
            <MagicBento className="h-full w-full bg-[#0A0A0A] border border-white/5 rounded-[24px] lg:rounded-[32px] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 overflow-hidden relative group hover:border-blue-500/30 transition-colors">
              <div className="flex-1 z-20 pointer-events-none w-full flex flex-col items-center lg:items-start text-center lg:text-left">
                <h2 className="text-sm lg:text-[16px] font-bold text-white/60 uppercase tracking-widest mb-6 lg:mb-10">Knowledge Mastery</h2>
                <div className="flex flex-col gap-4 lg:gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#00CEC8] shadow-[0_0_10px_#00CEC8]"></div>
                    <span className="text-lg lg:text-[20px] font-medium text-white/90">Mastered</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#2563EB] shadow-[0_0_10px_#2563EB]"></div>
                    <span className="text-lg lg:text-[20px] font-medium text-white/90">Almost</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#1D4ED8] shadow-[0_0_10px_#1D4ED8]"></div>
                    <span className="text-lg lg:text-[20px] font-medium text-white/90">Unfamiliar</span>
                  </div>
                </div>
              </div>

              {/* Premium Donut Chart */}
              <div className="relative flex items-center justify-center w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] z-20 pointer-events-none shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#00CEC8] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div 
                  className="w-full h-full rounded-full relative flex items-center justify-center shadow-2xl"
                  style={{ background: 'conic-gradient(from 230deg, #1D4ED8 0% 15%, #2563EB 15% 35%, #00CEC8 35% 100%)' }}
                >
                  <div className="w-[65%] h-[65%] bg-[#0A0A0A] rounded-full shadow-inner flex items-center justify-center">
                    <span className="text-white/40 font-bold tracking-widest text-xs lg:text-sm uppercase">Stats</span>
                  </div>
                </div>
              </div>
            </MagicBento>
          </motion.div>

          {/* AI INSIGHTS (Short on Mobile, Tall on Laptop) */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}  
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="col-span-2 lg:col-span-1 row-span-1 lg:row-span-2 h-full"
          >
            <MagicBento className="h-full w-full bg-[#0A0A0A] border border-white/5 rounded-[24px] lg:rounded-[32px] p-5 lg:p-8 flex flex-col justify-center relative overflow-hidden group hover:border-[#00CEC8]/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00CEC8]/10 blur-[50px] rounded-full z-0 pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-3 lg:mb-6 z-20 pointer-events-none">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8] shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lg:w-5 lg:h-5"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                </div>
                <h3 className="text-xs lg:text-[16px] font-bold text-[#00CEC8] uppercase tracking-widest">AI Insight</h3>
              </div>
              
              <p className="text-[13px] lg:text-[15px] leading-[1.5] lg:leading-[1.8] text-white/70 font-medium z-20 pointer-events-none">
                {quizResult.insight}
              </p>
            </MagicBento>
          </motion.div>

          {/* TOTAL RESPONSES (Square) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="col-span-1 row-span-1 h-full"
          >
            <MagicBento className="h-full w-full bg-[#0A0A0A] border border-white/5 rounded-[20px] lg:rounded-[32px] p-5 lg:p-8 flex flex-col justify-end group hover:border-white/20 transition-colors z-20">
                <p className="text-[10px] lg:text-[13px] font-bold text-white/40 uppercase tracking-widest mb-1 lg:mb-2 pointer-events-none">Total Responses</p>
                <p className="text-[32px] lg:text-[48px] font-black text-white leading-none pointer-events-none">{quizResult.totalResponses}</p>
            </MagicBento>
          </motion.div>

          {/* HIGHEST SCORE */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="col-span-1 row-span-1 h-full"
          >
            <MagicBento className="h-full w-full bg-[#0A0A0A] border border-white/5 rounded-[20px] lg:rounded-[32px] p-5 lg:p-8 flex flex-col justify-end group hover:border-[#00CEC8]/30 transition-colors z-20">
                <p className="text-[10px] lg:text-[13px] font-bold text-[#00CEC8]/60 uppercase tracking-widest mb-1 lg:mb-2 pointer-events-none">Highest</p>
                <p className="text-[32px] lg:text-[48px] font-black text-[#00CEC8] leading-none pointer-events-none">{quizResult.highestScore}<span className="text-lg lg:text-[24px]">%</span></p>
            </MagicBento>
          </motion.div>

          {/* LOWEST SCORE */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="col-span-1 row-span-1 h-full"
          >
            <MagicBento className="h-full w-full bg-[#0A0A0A] border border-white/5 rounded-[20px] lg:rounded-[32px] p-5 lg:p-8 flex flex-col justify-end group hover:border-red-500/30 transition-colors z-20">
                <p className="text-[10px] lg:text-[13px] font-bold text-red-400/60 uppercase tracking-widest mb-1 lg:mb-2 pointer-events-none">Lowest</p>
                <p className="text-[32px] lg:text-[48px] font-black text-red-400 leading-none pointer-events-none">{quizResult.lowestScore}<span className="text-lg lg:text-[24px]">%</span></p>
            </MagicBento>
          </motion.div>

          {/* MEDIUM SCORE */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 row-span-1 h-full"
          >
            <MagicBento className="h-full w-full bg-[#0A0A0A] border border-white/5 rounded-[20px] lg:rounded-[32px] p-5 lg:p-8 flex flex-col justify-end group hover:border-blue-400/30 transition-colors z-20">
                <p className="text-[10px] lg:text-[13px] font-bold text-blue-400/60 uppercase tracking-widest mb-1 lg:mb-2 pointer-events-none">Medium</p>
                <p className="text-[32px] lg:text-[48px] font-black text-blue-400 leading-none pointer-events-none">{quizResult.mediumScore}<span className="text-lg lg:text-[24px]">%</span></p>
            </MagicBento>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default PerformancePage;