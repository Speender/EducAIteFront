import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

interface CreateFolderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

const CreateFolder = ({ isOpen, onClose, onCreate }: CreateFolderProps) => {
  const [folderName, setFolderName] = useState("");

  // Notice we removed the `if (!isOpen) return null;` from here
  // so AnimatePresence can control the mounting/unmounting!

  return (
    <AnimatePresence>
      {isOpen && (
        // --- ANIMATED OVERLAY: Fades in smoothly ---
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={onClose} 
        >
          {/* --- ANIMATED MODAL BOX: Scales up with a satisfying spring bounce --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#050505] border border-white/20 rounded-[32px] w-full max-w-md p-8 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            
            {/* Close 'X' Button */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Title */}
            <h3 className="text-xl font-medium text-white text-center mb-8 mt-2 tracking-wide">
              Create new folder
            </h3>

            {/* Input Field */}
            <input 
              type="text" 
              placeholder="Folder name" 
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full bg-white text-black placeholder:text-gray-400 font-medium rounded-full px-6 py-4 outline-none text-[15px] mb-12 shadow-inner"
              autoFocus
            />

            {/* Submit Button with Glow */}
            <div className="flex justify-center mb-2">
               <button 
                  onClick={() => {
                    if (folderName.trim()) {
                      onCreate(folderName); // Triggers the chain reaction
                      setFolderName(""); 
                    }
                  }}
                  className="bg-white text-black font-bold text-sm px-24 py-3.5 rounded-full shadow-[0_10px_40px_-10px_rgba(255,255,255,0.7)] hover:shadow-[0_15px_50px_-10px_rgba(255,255,255,0.9)] hover:scale-105 transition-all duration-300"
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