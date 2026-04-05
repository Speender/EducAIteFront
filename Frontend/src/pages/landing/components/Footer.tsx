import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white shrink-0">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const Footer = () => {
  const footerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const xParallax = useTransform(smoothProgress, [0, 1], [isMobile ? -20 : -150, 0]);

  return (
    <footer 
      id="contact" 
      ref={footerRef}
      className="w-full bg-black text-white px-6 md:px-[10vw] py-16 md:py-24 relative overflow-hidden antialiased"
    >
      
      <motion.div style={{ x: xParallax }} className="w-full">
        
        {/* --- FEATURES GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          {[
            { title: "Note Taking", desc: "Organize academic thoughts with AI-enhanced formatting." },
            { title: "Grade Tracking", desc: "Visualize your journey with smart analytics." },
            { title: "Quiz Analysis", desc: "Test knowledge and find your learning gaps." },
            { title: "Open AI", desc: "Leverage AI to clarify complex topics instantly." }
          ].map((f, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <InfoIcon />
                <h3 className="font-bold text-lg">{f.title}</h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* --- FULL WIDTH FEATURE --- */}
        <div className="p-6 md:p-0 bg-white/5 md:bg-transparent rounded-2xl mb-16 border border-white/5 md:border-none">
          <div className="flex items-center gap-3 mb-3">
            <InfoIcon />
            <h3 className="font-bold text-lg md:text-xl">Resume Generator</h3>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-4xl">
            Our AI pulls from your academic achievements to generate a professional, industry-standard resume in seconds.
          </p>
        </div>

        <div className="w-full h-px bg-white/10 mb-16" />

        {/* --- LINKS & SOCIALS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
            <div className="text-2xl font-bold">
              educ<span className="text-[#00CEC8]">AI</span>te
            </div>
            <div className="flex gap-5 text-white/60">
                <div className="w-5 h-5 bg-white/10 rounded-full hover:bg-[#00CEC8] transition-colors" />
                <div className="w-5 h-5 bg-white/10 rounded-full hover:bg-[#00CEC8] transition-colors" />
                <div className="w-5 h-5 bg-white/10 rounded-full hover:bg-[#00CEC8] transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white/30 uppercase tracking-tighter text-xs mb-2">Explore</h4>
            {['UI Design', 'Prototyping', 'Systems'].map(l => <a key={l} className="hover:text-[#00CEC8] transition-colors cursor-pointer">{l}</a>)}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white/30 uppercase tracking-tighter text-xs mb-2">Resources</h4>
            {['Blog', 'Support', 'Developers'].map(l => <a key={l} className="hover:text-[#00CEC8] transition-colors cursor-pointer">{l}</a>)}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white/30 uppercase tracking-tighter text-xs mb-2">Company</h4>
            {['About', 'Careers', 'Privacy'].map(l => <a key={l} className="hover:text-[#00CEC8] transition-colors cursor-pointer">{l}</a>)}
          </div>
        </div>

        <div className="mt-20 text-center text-white/10 text-[10px] tracking-widest uppercase">
          © 2026 educAIte. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;