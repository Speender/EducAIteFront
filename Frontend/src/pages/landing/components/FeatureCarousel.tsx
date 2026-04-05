import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import CircularGallery from '../../../components/CircularGallery'; 
import EarthImage from '../../../assets/earthbg.svg';

const carouselItems = [
  { image: 'https://picsum.photos/seed/educaite1/800/600', text: 'Smart Analytics' },
  { image: 'https://picsum.photos/seed/educaite2/800/600', text: 'AI Flashcards' },
  { image: 'https://picsum.photos/seed/educaite3/800/600', text: 'Progress Tracking' },
  { image: 'https://picsum.photos/seed/educaite4/800/600', text: 'Resume Builder' },
  { image: 'https://picsum.photos/seed/educaite5/800/600', text: 'AI Study Buddy' },
];

const FeatureCarousel = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Responsive Transforms: Smaller slide-in distance for mobile to prevent layout jumping
  const headerX = useTransform(scrollYProgress, [0, 0.3], ["-50%", "0%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Parallax adjustments
  const galleryY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const earthY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <div 
      ref={containerRef} 
      id="features" 
      className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-black antialiased"
    >
      
      {/* --- EARTH BACKGROUND (Responsive Height) --- */}
      <motion.div 
        style={{ y: earthY, backgroundImage: `url(${EarthImage})` }}
        className="absolute bottom-0 left-0 w-full h-[35vh] sm:h-[45vh] md:h-[55vh] bg-cover bg-[center_top] z-30 pointer-events-none"
      />

      {/* --- HEADER TEXT BOX (Responsive Padding and Positioning) --- */}
      <motion.div 
        style={{ x: headerX, opacity: headerOpacity }}
        className="absolute top-0 left-0 bg-black pt-[6vh] md:pt-[12vh] pb-[4vh] md:pb-[6vh] px-[6vw] md:px-[10vw] rounded-br-[10vw] md:rounded-br-[6vw] z-40 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] pointer-events-auto border-b border-r border-white/5"
      >
        <h2 className="text-[24px] sm:text-[32px] md:text-[44px] font-bold mb-2 md:mb-4 tracking-tighter leading-tight text-white">
          Get to know educ<span className="text-[#00CEC8]">AI</span>te
        </h2>
        <p className="text-white/70 text-sm sm:text-base md:text-xl font-medium leading-relaxed max-w-[280px] sm:max-w-none">
          Discover the capabilities and efficiency we offer.
        </p>
      </motion.div>

      {/* --- 3D CIRCULAR GALLERY (Responsive Scale) --- */}
      <motion.div 
        style={{ y: galleryY }}
        className="absolute inset-0 z-20 flex items-center justify-center pt-[10vh] md:pt-[15vh]"
      >
        <div className="w-full h-[60vh] md:h-full">
            <CircularGallery 
              items={carouselItems} 
              bend={window.innerWidth < 768 ? 1.5 : 3} 
              textColor="#ffffff" 
              borderRadius={0.05}
              font={window.innerWidth < 768 ? "bold 18px sans-serif" : "bold 32px sans-serif"}
            />
        </div>
      </motion.div>

    </div>
  );
};

export default FeatureCarousel;