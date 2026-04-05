import React, { useRef } from 'react'
import { motion } from 'framer-motion'

import pdfIcon from '../../../assets/pdf-logo.svg' 
import wordIcon from '../../../assets/word-logo.svg'
import pptIcon from '../../../assets/ppt-logo.svg'

interface ImportFileModalProps {
  onClose: () => void;
}

const ImportFileModal = ({ onClose }: ImportFileModalProps) => {
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        className="bg-[#050505] w-full max-w-[600px] rounded-[24px] md:rounded-[32px] border border-white/10 p-6 md:p-10 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[95vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button: Adjusted positioning for mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-8 text-white/40 hover:text-white transition-colors p-2"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <h2 className="text-white text-lg md:text-xl font-bold text-center mb-6 md:mb-10 mt-2 md:mt-0">Import file</h2>

        {/* Drag & Drop Zone: Scaled padding and gaps */}
        <div 
            onClick={handleDivClick}
            className="border-2 border-dashed border-white/10 rounded-[20px] md:rounded-[24px] p-8 md:p-12 flex flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8 group hover:border-[#00CEC8]/40 transition-all cursor-pointer bg-white/[0.02]"
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".pdf,.doc,.docx,.ppt,.pptx" 
            />
  
            <div className="flex gap-4 md:gap-6 items-center">
                <img src={pdfIcon} alt="PDF" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                <img src={wordIcon} alt="Word" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                <img src={pptIcon} alt="PowerPoint" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
        
            <div className="text-center px-2">
                <p className="text-white text-base md:text-lg font-medium leading-tight">Drag and drop files here or choose files</p>
                <p className="text-white/40 text-[10px] md:text-xs mt-2 uppercase tracking-wide">PDF, WORD, PowerPoint and more</p>
            </div>
        </div>

        {/* Input Field Section */}
        <div className="flex gap-2 mb-8 md:mb-10 h-12 md:h-14">
          <div className="w-14 md:w-20 shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/20">
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Paste Youtube, PDF or web URL"
            className="flex-1 w-full bg-white border border-white/10 rounded-xl px-4 md:px-6 text-sm md:text-base text-black placeholder:text-gray-400 focus:outline-none font-medium truncate"
          />
        </div>

        {/* Action Button: Full width on mobile, auto width on larger screens */}
        <div className="flex justify-center">
          <button className="w-full sm:w-auto bg-white text-black font-bold px-12 md:px-16 py-3.5 md:py-4 rounded-full text-sm md:text-base shadow-[0_10px_30px_rgba(255,255,255,0.2)] active:scale-95 sm:hover:scale-105 transition-transform">
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImportFileModal