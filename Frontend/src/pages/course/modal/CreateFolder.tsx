import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateFolderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

const CreateFolder = ({ isOpen, onClose, onCreate }: CreateFolderProps) => {
  const [folderName, setFolderName] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={onClose} 
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#050505] border border-white/20 rounded-[24px] md:rounded-[32px] w-full max-w-md p-6 md:p-8 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            
            {/* Close 'X' Button: Adjusted positioning and added a larger touch target (p-2) for mobile */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/60 hover:text-white transition-colors p-2"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Title: Scaled text down slightly on mobile */}
            <h3 className="text-lg md:text-xl font-medium text-white text-center mb-6 md:mb-8 mt-2 md:mt-0 tracking-wide">
              Create new folder
            </h3>

            {/* Input Field: Scaled padding and text sizes */}
            <input 
              type="text" 
              placeholder="Folder name" 
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full bg-white text-black placeholder:text-gray-400 font-medium rounded-full px-5 py-3.5 md:px-6 md:py-4 outline-none text-sm md:text-[15px] mb-8 md:mb-12 shadow-inner"
              autoFocus
            />

            {/* Submit Button with Glow */}
            <div className="flex justify-center mb-2">
               <button 
                  onClick={() => {
                    if (folderName.trim()) {
                      onCreate(folderName);
                      setFolderName(""); 
                    }
                  }}
                  className="w-full sm:w-auto bg-white text-black font-bold text-sm px-10 sm:px-24 py-3 md:py-3.5 rounded-full shadow-[0_10px_40px_-10px_rgba(255,255,255,0.7)] hover:shadow-[0_15px_50px_-10px_rgba(255,255,255,0.9)] active:scale-95 sm:hover:scale-105 transition-all duration-300"
               >
                 Create
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateFolder;