import React, { useState } from 'react';

interface CreateFolderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

const CreateFolder = ({ isOpen, onClose, onCreate }: CreateFolderProps) => {
  const [folderName, setFolderName] = useState("");

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 transition-all duration-300"
      onClick={onClose} 
    >
      {/* Modal Box */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#050505] border border-white/20 rounded-[32px] w-full max-w-md p-8 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200"
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
                  onCreate(folderName);
                  setFolderName(""); // Clear the input
                }
              }}
              className="bg-white text-black font-bold text-sm px-24 py-3.5 rounded-full shadow-[0_10px_40px_-10px_rgba(255,255,255,0.7)] hover:shadow-[0_15px_50px_-10px_rgba(255,255,255,0.9)] hover:scale-105 transition-all duration-300"
           >
             Create
           </button>
        </div>

      </div>
    </div>
  );
};

export default CreateFolder;