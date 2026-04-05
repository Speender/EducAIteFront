import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import Stack from './../../../components/Stack';
import EarthImage from '../../../assets/earthbg.svg'; 

const images = [
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format"
];

const Developers = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] 
  });

  // --- RESPONSIVE TRANSFORM ADJUSTMENTS ---
  const headerX = useTransform(scrollYProgress, [0, 0.4], ["-60%", "0%"]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const stackY = useTransform(scrollYProgress, [0, 1], [isMobile ? 80 : 150, isMobile ? -80 : -150]);
  const earthY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div 
      ref={containerRef} 
      id="about" 
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent antialiased pt-[25vh] md:pt-[20vh] pb-[10vh]"
    >
      
      {/* --- EARTH BACKGROUND --- */}
      <motion.div 
        style={{ y: earthY, backgroundImage: `url(${EarthImage})` }}
        className="absolute bottom-0 left-0 w-full h-[40vh] md:h-[55vh] bg-cover bg-[center_top] z-0 pointer-events-none"
      />

      {/* --- HEADER TEXT BOX --- */}
      <motion.div 
        style={{ x: headerX }}
        className="absolute top-0 left-0 bg-black pt-[8vh] md:pt-[12vh] pb-[4vh] md:pb-[6vh] px-[8vw] md:px-[10vw] rounded-br-[12vw] md:rounded-br-[6vw] z-30 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] border-b border-r border-white/5"
      >
        <h2 className="text-[26px] sm:text-[32px] md:text-[44px] font-bold mb-2 md:mb-4 tracking-tighter leading-tight text-white max-w-[280px] sm:max-w-md md:max-w-2xl">
          Meet the Innovators and Developers
        </h2>
        <p className="text-white/70 text-sm sm:text-base md:text-xl font-medium leading-relaxed">
          Discover the brains and builder of educ<span className="text-[#00CEC8]">AI</span>te
        </p>
      </motion.div>

      {/* --- INTERACTIVE STACK CONTAINER --- */}
      <motion.div 
        style={{ y: stackY }}
        className="relative z-20 w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] md:w-[450px] md:h-[550px] mt-[5vh] md:mt-[10vh]"
      >
        <Stack
          randomRotation={false}
          sensitivity={150} 
          sendToBackOnClick={true}
          cards={images.map((src, i) => (
            <img 
              key={i} 
              src={src} 
              alt={`developer-${i + 1}`} 
              className="w-full h-full object-cover rounded-[24px] md:rounded-[32px] shadow-2xl pointer-events-none"
            />
          ))}
        />
      </motion.div>
    </div>
  );
};

export default Developers;