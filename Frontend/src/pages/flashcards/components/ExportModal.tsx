import React from 'react';
import { motion } from 'framer-motion'; 

import pdfIcon from '../../../assets/pdf-logo.svg'; 
import wordIcon from '../../../assets/word-logo.svg';

interface ExportModalProps {
  fileName?: string;
  onClose: () => void;
  onExport?: () => void;
}

export function ExportModal({ fileName = "Database_Management_System_Cards", onClose, onExport }: ExportModalProps) {
  return (
    /* --- BACKDROP FADE-IN --- */
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
      onClick={onClose} 
    >
      {/* --- MODAL CONTENT POP-UP --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="w-full max-w-[500px] rounded-[24px] lg:rounded-[32px] bg-[#050505] p-6 lg:p-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 lg:top-8 lg:right-8 text-white/40 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-xl lg:text-2xl font-bold text-white text-center mb-6 lg:mb-8">Export file</h2>

        <div className="space-y-6 lg:space-y-8 flex flex-col items-center">
          
          {/* Visual representation of the file */}
          <div className="flex items-center gap-3 lg:gap-4 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full">
            <div className="flex gap-1.5 lg:gap-2 shrink-0">
                <img src={pdfIcon} alt="PDF" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                <img src={wordIcon} alt="Word" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-white font-medium text-sm lg:text-base truncate">{fileName}</div>
              <div className="text-white/30 text-[10px] lg:text-xs">Ready to download</div>
            </div>
          </div>

          <p className="text-white/50 text-center text-xs lg:text-sm px-2 lg:px-6">
            Choose your preferred format and save your flashcards for offline study or printing.
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              if (onExport) onExport();
              onClose();
            }}
            className="w-full rounded-full bg-white py-3.5 lg:py-4 font-extrabold text-black hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all uppercase tracking-widest text-xs lg:text-sm"
          >
            Download Now
          </button>
        </div>
        
      </motion.div>
    </motion.div>
  );
}

export default ExportModal;