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

const SchoolSecurityForm: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }} 
      animate={{ opacity: 1, x: 0 }}    
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className="w-full relative z-10"
    >
      
      {/* --- SCHOOL SECTION --- */}
      <div className="border-t-[1.5px] border-white/10 pt-8 md:pt-10 pb-10 md:pb-12 mb-8 md:mb-10 flex flex-col md:flex-row gap-6 md:gap-10">
        
        {/* Title and Description */}
        <div className="md:w-1/4 mb-2 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 md:mb-2.5 tracking-tight">
            School
          </h2>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-xs">
            Set your school details
          </p>
        </div>

        {/* --- FORM FIELDS GRID --- */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <InputField label="School" placeholder="" />
            <InputField label="Department" placeholder="" />
            <InputField label="Course" placeholder="" />
        </div>

      </div>

      {/* --- SEPARATOR LINE --- */}
      <div className="w-full border-t border-white/10 mb-8 md:mb-10"></div>

      {/* --- LOGIN AND SECURITY SECTION --- */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 pb-10">
        
        {/* Title and Description */}
        <div className="md:w-1/4 mb-2 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 md:mb-2.5 tracking-tight">
            Login and Security
          </h2>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-xs">
            Update your account security details
          </p>
        </div>

        {/* --- FORM FIELDS GRID --- */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-end">
            <InputField label="Username" placeholder="" />
            
            <div className="w-full flex flex-col justify-end mt-2 md:mt-0">
                <label className="text-sm text-white/70 mb-2 block font-medium">
                  Password
                </label>
                <button 
                  className="w-full bg-white text-black rounded-xl py-4 px-10 text-[1rem] font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:translate-y-0 hover:-translate-y-[1px]"
                >
                    Set Password
                </button>
            </div>
        </div>

      </div>

    </motion.div>
  );
};

export default SchoolSecurityForm;