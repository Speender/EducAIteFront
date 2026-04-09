import React, { useRef } from 'react';
import { motion } from 'framer-motion';

import pdfIcon from '../../../assets/pdf-logo.svg'; 
import wordIcon from '../../../assets/word-logo.svg'; 
import pptIcon from '../../../assets/ppt-logo.svg';

interface ImportModalProps {
  onClose: () => void;
}

export function ImportModal({ onClose }: ImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("File selected:", files[0].name);
    }
  };

  return (
    /* --- BACKDROP ANIMATION --- */
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* --- MODAL CONTENT --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="bg-[#050505] w-full max-w-[600px] rounded-[24px] lg:rounded-[32px] border border-white/10 p-6 lg:p-10 relative shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 lg:top-8 lg:right-8 text-white/40 hover:text-white transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lg:w-6 lg:h-6">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-white text-xl lg:text-2xl font-bold text-center mb-6 lg:mb-10">Import file</h2>

        {/* Drag & Drop Zone */}
        <div 
          onClick={handleDivClick}
          className="border-2 border-dashed border-white/10 rounded-[20px] lg:rounded-[24px] p-6 lg:p-12 flex flex-col items-center gap-6 lg:gap-8 mb-6 lg:mb-8 group hover:border-[#00CEC8]/40 hover:bg-white/[0.02] transition-all cursor-pointer"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
            accept=".pdf,.doc,.docx,.ppt,.pptx" 
          />
  
          {/* File Type Icons */}
          <div className="flex gap-4 lg:gap-8 items-center">
            <img src={pdfIcon} alt="PDF" className="w-10 h-10 lg:w-14 lg:h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
            <img src={wordIcon} alt="Word" className="w-10 h-10 lg:w-14 lg:h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
            <img src={pptIcon} alt="PowerPoint" className="w-10 h-10 lg:w-14 lg:h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
          </div>
        
          <div className="text-center">
            <p className="text-white text-lg lg:text-xl font-semibold px-2">Drag and drop files here or choose files</p>
            <p className="text-white/40 text-xs lg:text-sm mt-2">PDF, WORD, PowerPoint and more</p>
          </div>
        </div>

        {/* Input Field Section */}
        <div className="flex gap-2 lg:gap-3 mb-8 lg:mb-10 h-12 lg:h-14">
          <div className="w-12 lg:w-16 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-white/40 shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lg:w-[22px] lg:h-[22px]">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Paste URL (Youtube, PDF, Web)"
            className="flex-1 bg-white rounded-xl lg:rounded-2xl px-4 lg:px-6 text-black placeholder:text-gray-400 focus:outline-none font-semibold text-sm lg:text-base shadow-inner min-w-0"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-white text-black font-extrabold px-12 lg:px-20 py-3.5 lg:py-4 rounded-full shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all text-xs lg:text-sm uppercase tracking-wider"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ImportModal;