import React from 'react';
import { motion } from 'framer-motion';

interface DeleteProps {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteProps> = ({ title, onClose, onConfirm }) => (
  /* --- BACKDROP FADE-IN --- */
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    onClick={onClose}
  >
    {/* --- MODAL CONTENT POP-UP --- */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
      className="bg-[#0A0A0A] border border-red-500/20 w-full max-w-sm rounded-2xl lg:rounded-[32px] p-6 lg:p-8 text-center shadow-2xl"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
        <span className="text-xl lg:text-2xl">⚠️</span>
      </div>
      
      <h2 className="text-lg lg:text-xl font-bold mb-2 text-white">Delete this item?</h2>
      <p className="text-white/50 mb-6 lg:mb-8 break-words text-xs lg:text-sm px-2 lg:px-4">
        "{title}" will be gone forever.
      </p>
      
      <div className="flex flex-col gap-2 lg:gap-3">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm} 
          className="w-full py-3 lg:py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-all shadow-lg shadow-red-500/20 text-sm lg:text-base"
        >
          Yes, Delete
        </motion.button>
        
        <button 
          onClick={onClose} 
          className="w-full py-3 lg:py-4 text-white/40 hover:text-white transition-all font-semibold text-sm lg:text-base"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);