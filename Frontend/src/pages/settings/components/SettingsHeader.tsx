import React from 'react';
import { motion } from 'framer-motion';

import settingIcon from '../../../assets/setting-navbar.svg';

const SettingsHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }} 
      animate={{ opacity: 1, x: 0 }}    
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className="flex flex-col w-full mb-8 md:mb-12 relative z-10"
    >
      {/* --- TITLE AND DESCRIPTION --- */}
      <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-tight tracking-tight mb-2 md:mb-3">
        Settings
      </h1>
      <p className="text-base md:text-lg lg:text-xl text-white/70 font-medium mb-8 md:mb-10">
        Manage your account settings and preferences
      </p>

      {/* Tab Button(s) */}
      <button 
        className="self-start flex items-center gap-2.5 bg-[#111111] border-[1.5px] border-white/20 text-white rounded-xl px-6 md:px-7 py-2.5 md:py-3 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-white/40"
      >
        <img 
          src={settingIcon} 
          alt="" 
          aria-hidden="true" 
          className="w-4 h-4 md:w-5 md:h-5 brightness-0 invert opacity-80" 
        />
        Account
      </button>

    </motion.div>
  );
};

export default SettingsHeader;