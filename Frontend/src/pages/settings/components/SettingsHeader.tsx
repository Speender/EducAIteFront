import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION
import settingIcon from '../../../assets/setting-navbar.svg'; // Check asset path

const SettingsHeader: React.FC = () => {
  return (
    // --- CONVERTED TO MOTION.DIV WITH SLIDE-IN ANIMATION ---
    <motion.div 
      initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
      animate={{ opacity: 1, x: 0 }}    // Slides smoothly into its original position
      transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
      className="flex flex-col w-full mb-12 relative z-10"
    >
      
      {/* Title and Description */}
      <h1 className="text-[3.5rem] font-bold text-white leading-tight tracking-tight mb-3">
        Settings
      </h1>
      <p className="text-xl text-white/70 font-medium mb-10">
        Manage your account settings and preferences
      </p>

      {/* Tab Button(s) - Only 'Account' is visible and selected */}
      <button 
        className="self-start flex items-center gap-2.5 bg-[#111111] border-[1.5px] border-white/20 text-white rounded-xl px-7 py-3 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-white/40"
      >
        <img 
          src={settingIcon} 
          alt="" 
          aria-hidden="true" 
          className="w-5 h-5 brightness-0 invert opacity-80" 
        />
        Account
      </button>

    </motion.div>
  );
};

export default SettingsHeader;