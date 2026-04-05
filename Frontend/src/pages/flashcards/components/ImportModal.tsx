import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Adjust these paths based on your actual folder structure
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
      {/* --- MODAL CONTENT POP-UP ANIMATION --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="bg-[#050505] w-full max-w-[600px] rounded-[32px] border border-white/10 p-10 relative shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-white text-2xl font-bold text-center mb-10">Import file</h2>

        {/* Drag & Drop Zone */}
        <div 
          onClick={handleDivClick}
          className="border-2 border-dashed border-white/10 rounded-[24px] p-12 flex flex-col items-center gap-8 mb-8 group hover:border-[#00CEC8]/40 hover:bg-white/[0.02] transition-all cursor-pointer"
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
          <div className="flex gap-8 items-center">
            <img src={pdfIcon} alt="PDF" className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
            <img src={wordIcon} alt="Word" className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
            <img src={pptIcon} alt="PowerPoint" className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
          </div>
        
          <div className="text-center">
            <p className="text-white text-xl font-semibold">Drag and drop files here or choose files</p>
            <p className="text-white/40 text-sm mt-2">PDF, WORD, PowerPoint and more</p>
          </div>
        </div>

        {/* Input Field Section */}
        <div className="flex gap-3 mb-10 h-14">
          <div className="w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Paste Youtube, PDF or web URL"
            className="flex-1 bg-white rounded-2xl px-6 text-black placeholder:text-gray-400 focus:outline-none font-semibold text-base shadow-inner"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button 
            onClick={onClose}
            className="bg-white text-black font-extrabold px-20 py-4 rounded-full shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ImportModal;