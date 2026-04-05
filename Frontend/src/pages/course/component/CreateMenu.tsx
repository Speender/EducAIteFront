import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CreateFolder from '../modal/CreateFolder'

interface CreateMenuProps {
  onClose: () => void;
  onFolderCreated: (folderName: string) => void;
}

const CreateMenu: React.FC<CreateMenuProps> = ({ onClose, onFolderCreated }) => {
  const navigate = useNavigate();
  const [showFolderModal, setShowFolderModal] = useState(false);

  const handleNotesClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onClose();           
    navigate('/create-notes'); 
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      
      <div 
        className="absolute top-full mt-2 left-0 w-[240px] bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-[100]"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Files/Folder Option - HOVER EFFECTS UPDATED */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowFolderModal(true); 
          }}
          className="w-full flex items-center gap-4 p-4 hover:bg-[#00CEC8]/10 transition-colors border-b border-white/5 group text-left"
        >
          <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm group-hover:text-[#00CEC8]">Files</p>
            <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Create folder</p>
          </div>
        </button>

        {/* Notes Option - The Trigger */}
        <button 
          onClick={handleNotesClick}
          className="w-full flex items-center gap-4 p-4 hover:bg-[#00CEC8]/10 transition-colors group text-left"
        >
          <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M4 6h16M4 12h16M4 18h12"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm group-hover:text-[#00CEC8]">Notes</p>
            <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Create notes</p>
          </div>
        </button>
      </div>

      {/* Add the Modal Component */}
      <CreateFolder 
        isOpen={showFolderModal} 
        onClose={() => setShowFolderModal(false)}
        onCreate={(folderName) => {
          onFolderCreated(folderName); 
          setShowFolderModal(false); 
          onClose(); 
        }}
      />
    </>
  )
}

export default CreateMenu