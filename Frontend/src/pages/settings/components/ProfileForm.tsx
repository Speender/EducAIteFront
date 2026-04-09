import React from 'react';
import { motion } from 'framer-motion'; 

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
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }}    
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full border-t-[1.5px] border-white/10 pt-8 md:pt-10 pb-10 md:pb-12 mb-8 md:mb-10 relative z-10 flex flex-col-reverse md:flex-row gap-8 md:gap-10"
    >
      
      {/* --- FORM SECTION --- */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10">
        
        {/* Title and Description */}
        <div className="md:w-1/4 mb-2 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 md:mb-2.5 tracking-tight">
            Profile
          </h2>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-xs">
            Set your account details
          </p>
        </div>

        {/* --- FORM FIELDS GRID --- */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <InputField label="First Name" placeholder="" />
            <InputField label="Middle Name" placeholder="" />
            <InputField label="Last Name" placeholder="" />
            <InputField label="Phone" placeholder="" type="tel" />
            <InputField label="Email" placeholder="" type="email" />
            <div className="hidden md:block"></div> 
        </div>

      </div>

      {/* --- AVATAR SECTION --- */}
      <div className="w-full md:w-1/4 flex flex-col items-center justify-center gap-6 p-6 border border-white/10 rounded-3xl bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        
        <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#E9D5FF] border-[6px] border-[#C084FC] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-black/80"></div>
                <div className="w-16 h-4 md:w-20 md:h-5 rounded-full bg-black/80"></div>
            </div>
        </div>

        <div className="flex flex-row items-center gap-3 w-full">
            <button className="flex-1 bg-black border border-white/20 text-white rounded-xl py-3 px-4 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                Edit Profile
            </button>
            <button 
                className="flex items-center justify-center border border-red-500/20 text-red-400 bg-red-950/20 rounded-xl p-3 transition-all hover:bg-red-950/40 hover:border-red-500/40 hover:scale-105 active:scale-95"
                title="Delete Account"
            >
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