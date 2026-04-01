import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION
import robotImg from '../../../../assets/robot.svg';

const LoginHero: React.FC = () => {
  return (
    // --- ADDED MOTION.DIV WITH SLIDE-IN ANIMATION ---
    <motion.div 
      initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
      animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
      transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
      className="flex-1 w-full max-w-[400px] text-center md:text-left mx-auto md:mx-0"
    >
      <h1 className="text-[2.4rem] font-bold text-white tracking-tight leading-tight mb-3.5">
        Welcome Back...
      </h1>
      <p className="text-base text-white/70 leading-relaxed mb-10">
        Your <span className="text-[#00CEC8] font-semibold">AI</span>-powered workspace is ready to
        <br className="hidden md:block" />continue your progress
      </p>
      
      <div className="flex justify-center md:justify-start mt-5 relative">
        <img 
          src={robotImg} 
          alt="AI Robot" 
          className="w-[200px] h-auto drop-shadow-[0_8px_24px_rgba(0,206,200,0.15)] animate-float" 
        />
      </div>

      {/* Inline animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </motion.div>
  );
};

export default LoginHero;