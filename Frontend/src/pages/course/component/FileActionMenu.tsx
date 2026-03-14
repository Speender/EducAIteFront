import React from 'react'

interface FileActionMenuProps {
  onClose: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

const FileActionMenu = ({ onClose, onDownload, onDelete }: FileActionMenuProps) => {
  return (
    <>
      {/* Invisible backdrop to close the menu when clicking outside */}
      <div className="fixed inset-0 z-[110]" onClick={onClose} />
      
      <div 
        className="absolute top-10 right-0 w-[220px] bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-[120] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Download Option */}
        <button 
          onClick={() => { onDownload(); onClose(); }}
          className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 group text-left"
        >
          <div className="text-white/60 group-hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Download</p>
            <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Download your file</p>
          </div>
        </button>

        {/* Delete Option */}
        <button 
          onClick={() => { onDelete(); onClose(); }}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-500/10 transition-colors group text-left"
        >
          <div className="text-white/60 group-hover:text-red-500 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm group-hover:text-red-500 transition-colors">Delete</p>
            <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Delete the file</p>
          </div>
        </button>
      </div>
    </>
  )
}

export default FileActionMenu