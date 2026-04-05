import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion'; // <-- Import Framer Motion
import BorderGlow from '../../../components/BorderGlow';
import AImpatin from '../../../assets/robot.svg'; 

interface QuizScoreModalProps {
  score: number;
  message: string;
  onClose: () => void;
}

export function QuizScoreModal({ score, message, onClose }: QuizScoreModalProps) {
  const navigate = useNavigate(); 

  // --- SVG Gauge Calculations ---
  const radius = 100;
  const cx = 110;
  const cy = 110;
  const circumference = Math.PI * radius; 
  const dashoffset = circumference * (1 - score / 100);
  const angleInRadians = (score / 100) * Math.PI;
  const thumbX = cx - radius * Math.cos(angleInRadians);
  const thumbY = cy - radius * Math.sin(angleInRadians);

  return (
    /* --- BACKDROP FADE --- */
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
    >
      
      {/* --- MODAL SCALE & POP ANIMATION --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
        className="w-full max-w-[550px] shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-[32px]"
      >
        <BorderGlow>
          
          <div className="w-full h-full rounded-[30px] bg-[#0A0A0A] p-12 text-center relative">
            
            <h2 className="text-[28px] font-bold text-white mb-10 mx-auto max-w-[400px] leading-[1.3]">
              Your score on the Technical Programming quiz
            </h2>
            
            <div className="relative w-[220px] h-[120px] mx-auto mb-10">
              <svg viewBox="0 0 220 120" className="w-full h-full overflow-visible">
                <path d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 210 ${cy}`} fill="none" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.1" />
                <path 
                  d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 210 ${cy}`} 
                  fill="none" stroke="#00CEC8" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={dashoffset}
                  className="transition-all duration-1000 ease-out delay-500" // Added delay to wait for modal pop
                />
                <circle cx={thumbX} cy={thumbY} r="10" fill="#00CEC8" stroke="#0A0A0A" strokeWidth="4" className="transition-all duration-1000 ease-out delay-500 shadow-lg" />
              </svg>

              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <span className="text-[40px] font-bold text-[#00CEC8] leading-none">
                  {score}%
                </span>
              </div>

              {/* Floating Bot Animation */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-16 drop-shadow-2xl"
              >
                <img src={AImpatin} alt="bot" className="w-20 h-20 object-contain drop-shadow-xl" />
              </motion.div>
            </div>

            <p className="mx-auto max-w-[440px] text-[17px] leading-[1.6] text-white/90 mb-10 font-medium">
              {message}
            </p>

            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#00CEC8" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onClose(); 
                navigate('/performance'); 
              }} 
              className="w-48 rounded-full bg-white px-8 py-3.5 text-black font-bold shadow-md transition-colors duration-300 uppercase tracking-wide shadow-[0_0_20px_rgba(0,206,200,0.1)] hover:shadow-[0_0_25px_rgba(0,206,200,0.4)]"
            >
              Confirm
            </motion.button>

          </div>
        </BorderGlow>
      </motion.div>
    </motion.div>
  );
}

export default QuizScoreModal;