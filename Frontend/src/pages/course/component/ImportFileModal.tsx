import React, { useRef } from 'react'
import { motion } from 'framer-motion' // <-- IMPORT FRAMER MOTION
import pdfIcon from '../../../assets/pdf-logo.svg' 
import wordIcon from '../../../assets/word-logo.svg'
import pptIcon from '../../../assets/ppt-logo.svg'

interface ImportFileModalProps {
  onClose: () => void;
}

const ImportFileModal = ({ onClose }: ImportFileModalProps) => {
  // Create a reference to attach to our hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger the click on the hidden input
  const handleDivClick = () => {
      fileInputRef.current?.click();
  };

  // Function to handle what happens when a file is actually selected
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
          console.log("File selected:", files[0].name);
          // You can eventually add your upload logic here!
      }
  };

  return (
    // --- ANIMATED OVERLAY: Fades in smoothly ---
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4"
      onClick={onClose} // Closes when clicking background
    >
      {/* --- ANIMATED MODAL WINDOW: Scales up with a satisfying spring bounce --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 400 
        }}
        className="bg-[#050505] w-full max-w-[600px] rounded-[32px] border border-white/10 p-10 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking modal content
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 text-white/40 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <h2 className="text-white text-xl font-bold text-center mb-10">Import file</h2>

        {/* Drag & Drop Zone */}
        <div 
            onClick={handleDivClick}
            className="border-2 border-dashed border-white/10 rounded-[24px] p-12 flex flex-col items-center gap-6 mb-8 group hover:border-[#00CEC8]/40 transition-all cursor-pointer bg-white/[0.02]"
        >
            {/* --- THE HIDDEN FILE INPUT --- */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple // Remove this if you only want them to select one file at a time
                accept=".pdf,.doc,.docx,.ppt,.pptx" // Optional: restrict file types
            />
  
            {/* REPLACED PLACEHOLDERS WITH ACTUAL ASSET IMAGES */}
            <div className="flex gap-6 items-center">
                <img src={pdfIcon} alt="PDF" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                <img src={wordIcon} alt="Word" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                <img src={pptIcon} alt="PowerPoint" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
        
            <div className="text-center">
                <p className="text-white text-lg font-medium">Drag and drop files here or choose files</p>
                <p className="text-white/40 text-xs mt-1">PDF, WORD, PowerPoint and more</p>
            </div>
        </div>

        {/* Input Field Section */}
        <div className="flex gap-2 mb-10 h-14">
          <div className="w-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <input 
            type="text" 
            placeholder="Paste Youtube, PDF or web URL"
            className="flex-1 bg-white border border-white/10 rounded-xl px-6 text-black placeholder:text-gray-400 focus:outline-none font-medium"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button className="bg-white text-black font-bold px-16 py-4 rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform">
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImportFileModal