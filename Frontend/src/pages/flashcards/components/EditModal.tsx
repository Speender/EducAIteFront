import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EditModalProps {
  title: string;          
  label: string;          
  initialValue: string;   
  onClose: () => void;
  onSave: (newValue: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ 
  title, 
  label, 
  initialValue, 
  onClose, 
  onSave 
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    /* --- BACKDROP FADE-IN --- */
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      {/* --- MODAL CONTENT POP-UP --- */ }
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-3xl lg:rounded-[40px] p-6 lg:p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <h2 className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 text-white">{title}</h2>
        <p className="text-white/40 text-[10px] lg:text-sm mb-6 lg:mb-8 uppercase tracking-widest font-bold">{label}</p>
        
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSave(value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl px-5 lg:px-6 py-3.5 lg:py-4 text-white text-base lg:text-lg outline-none focus:border-[#00CEC8]/50 transition-all mb-8 lg:mb-10"
          placeholder="Type here..."
        />

        <div className="flex gap-3 lg:gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 lg:px-6 py-3 lg:py-4 rounded-full border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-all font-semibold text-sm lg:text-base"
          >
            Cancel
          </button>
          <motion.button 
            whileHover={value.trim() ? { scale: 1.05 } : {}}
            whileTap={value.trim() ? { scale: 0.95 } : {}}
            onClick={() => onSave(value)}
            disabled={!value.trim()}
            className="flex-1 px-4 lg:px-6 py-3 lg:py-4 rounded-full bg-[#00CEC8] text-black font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,206,200,0.2)] text-sm lg:text-base"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};