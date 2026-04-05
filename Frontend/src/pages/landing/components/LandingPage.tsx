import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

import RobotImage from '../../../assets/robot.svg';
import EarthImage from '../../../assets/earthbg.svg';

import LightbulbIcon from '../../../assets/lg-lightbulb.svg';
import CalculatorIcon from '../../../assets/lg-calculator.svg';
import BooksIcon from '../../../assets/lg-books.svg';
import BeakersIcon from '../../../assets/lg-chemist.svg';
import GraduationCapIcon from '../../../assets/lg-gradhat.svg';
import CalendarIcon from '../../../assets/lg-calendar.svg';
import AtomIcon from '../../../assets/lg-atom.svg';
import LaptopIcon from '../../../assets/lg-laptop.svg';

const LandingPageContent = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // --- SCROLL PARALLAX SPEEDS ---
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const earthY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const robotY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  // Adjusted horizontal movement to be less aggressive on mobile
  const moveLeftFast = useTransform(scrollYProgress, [0, 1], ["0vw", "-40vw"]);
  const moveLeftSlow = useTransform(scrollYProgress, [0, 1], ["0vw", "-20vw"]);
  const moveRightFast = useTransform(scrollYProgress, [0, 1], ["0vw", "40vw"]);
  const moveRightSlow = useTransform(scrollYProgress, [0, 1], ["0vw", "20vw"]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* --- HERO TEXT SECTION --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ y: textY, opacity: opacityOut }}
        className="absolute top-[10vh] md:top-[12vh] left-0 w-full flex flex-col items-center text-center px-6 z-50 pointer-events-none"
      >
        <h1 className="text-[32px] sm:text-[42px] md:text-[56px] font-bold tracking-tight mb-4 leading-[1.1] max-w-4xl">
          Empower your learning with <span className="text-[#00CEC8]">AI</span>
        </h1>
        <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl font-medium leading-relaxed">
          Transform your notes, track your growth and learn smarter with the power of AI - where technology meets education.
        </p>
      </motion.div>

      {/* --- THE SCENE CONTAINER --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        
        {/* Central Robot */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ y: robotY }}
          className="absolute bottom-[15vh] md:bottom-[18vh] left-1/2 -translate-x-1/2 w-[280px] sm:w-[350px] md:w-[420px] z-20"
        >
          <img 
            src={RobotImage} 
            alt="AI Robot" 
            className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
          />
        </motion.div>

        {/* Earth Background */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1.5 }}
          style={{ y: earthY, backgroundImage: `url(${EarthImage})` }}
          className="absolute bottom-0 left-0 w-full h-[40vh] sm:h-[50vh] md:h-[55vh] bg-cover bg-[center_top] z-30"
        />

        {/* --- LEFT SIDE ICONS (Hidden on very small screens, scaled on others) --- */}
        <div className="hidden sm:block">
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ x: moveLeftFast }} src={LightbulbIcon} className="absolute top-[25vh] left-[5vw] w-[80px] md:w-[140px] drop-shadow-2xl z-20" />
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }} style={{ x: moveLeftSlow }} src={BooksIcon} className="absolute top-[35vh] left-[20vw] w-[60px] md:w-[100px] z-10" />
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }} style={{ x: moveLeftFast }} src={CalculatorIcon} className="absolute top-[50vh] left-[12vw] w-[70px] md:w-[110px] drop-shadow-2xl z-20" />
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} style={{ x: moveLeftSlow }} src={BeakersIcon} className="absolute bottom-[20vh] left-[5vw] w-[60px] md:w-[90px] drop-shadow-xl z-40" />
        </div>

        {/* --- RIGHT SIDE ICONS --- */}
        <div className="hidden sm:block">
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ x: moveRightFast }} src={GraduationCapIcon} className="absolute top-[24vh] right-[4vw] w-[120px] md:w-[200px] drop-shadow-2xl z-20" />
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }} style={{ x: moveRightSlow }} src={CalendarIcon} className="absolute top-[40vh] right-[18vw] w-[60px] md:w-[90px] z-10" />
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }} style={{ x: moveRightSlow }} src={AtomIcon} className="absolute bottom-[30vh] right-[25vw] w-[65px] md:w-[100px] z-40" />
            <motion.img initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} style={{ x: moveRightFast }} src={LaptopIcon} className="absolute bottom-[22vh] right-[6vw] w-[90px] md:w-[130px] drop-shadow-2xl z-40" />
        </div>
      </div>

      {/* --- CTA BUTTONS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        style={{ y: textY, opacity: opacityOut }}
        className="absolute bottom-[5vh] md:bottom-[8vh] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-[85%] max-w-[280px]"
      >
        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-white text-black font-semibold text-[15px] py-3 md:py-3.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 lg:hover:scale-105 transition-all pointer-events-auto"
        >
          Login
        </button>
        
        <button 
          onClick={() => navigate('/register')}
          className="w-full bg-black border border-white/20 text-white font-semibold text-[15px] py-3 md:py-3.5 rounded-full lg:hover:bg-white/10 active:scale-95 transition-all pointer-events-auto"
        >
          Register
        </button>
      </motion.div>
      
    </div>
  );
};

export default LandingPageContent;