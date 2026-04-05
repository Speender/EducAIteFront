import React, { useState } from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

// Simplified Input Field Component
const InputField: React.FC<{ label: string; placeholder: string; type?: string }> = 
({ label, placeholder, type = 'text' }) => (
  <div className="w-full">
    <label className="text-sm text-white/70 mb-2 block font-medium">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-5 py-4 border-[1.5px] border-white/20 rounded-xl text-[1rem] text-white bg-black outline-none transition-all placeholder:text-white/30 focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)]"
    />
  </div>
);

const ProfileForm: React.FC = () => {
  return (
    // --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM RIGHT ANIMATION ---
    <motion.div 
      initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
      animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
      transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
      className="w-full border-t-[1.5px] border-white/10 pt-10 pb-12 mb-10 relative z-10 flex flex-col md:flex-row gap-10"
    >
      
      {/* --- FORM SECTION --- */}
      <div className="flex-1 flex flex-col md:flex-row gap-10">
        
        {/* Title and Description */}
        <div className="md:w-1/4">
          <h2 className="text-2xl font-bold text-white mb-2.5 tracking-tight">
            Profile
          </h2>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs">
            Set your account details
          </p>
        </div>

        {/* --- FORM FIELDS GRID --- */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="First Name" placeholder="" />
            <InputField label="Middle Name" placeholder="" />
            <InputField label="Last Name" placeholder="" />
            <InputField label="Phone" placeholder="" type="tel" />
            <InputField label="Email" placeholder="" type="email" />
            
            {/* Empty space filler for odd number of fields */}
            <div></div> 
        </div>

      </div>

      {/* --- AVATAR SECTION (Right Side) --- */}
      <div className="md:w-1/4 flex flex-col items-center justify-center gap-6 p-6 border border-white/10 rounded-3xl bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        
        {/* Replicated Avatar Visuals (replace with actual face asset later) */}
        <div className="relative w-36 h-36 rounded-full bg-[#E9D5FF] border-[6px] border-[#C084FC] flex items-center justify-center">
            {/* Placeholder Face */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black/80"></div>
                <div className="w-20 h-5 rounded-full bg-black/80"></div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-3 w-full">
            <button className="flex-1 bg-black border border-white/20 text-white rounded-xl py-3 px-4 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                Edit Profile
            </button>
            <button 
                className="flex items-center justify-center border border-red-500/20 text-red-400 bg-red-950/20 rounded-xl p-3 transition-all hover:bg-red-950/40 hover:border-red-500/40 hover:scale-105 active:scale-95"
                title="Delete Account"
            >
                {/* Trash Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2M10 11v6M14 11v6"/>
                </svg>
            </button>
        </div>

      </div>

    </motion.div>
  );
};

export default ProfileForm;