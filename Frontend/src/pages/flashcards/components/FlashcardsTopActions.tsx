import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImportModal } from './ImportModal';
import { ExportModal } from './ExportModal'; // 1. Import the new modal

export function FlashcardsTopActions() {
  const navigate = useNavigate();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // 2. State for Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4 justify-end mb-4">
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          className={`flex items-center gap-2 border text-sm font-bold px-6 py-2.5 rounded-full transition-all ${
            isAddMenuOpen ? 'border-white bg-white/10 text-white' : 'border-white/20 text-white hover:bg-white/10'
          }`}
        >
          Add
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-300 ${isAddMenuOpen ? 'rotate-180' : ''}`}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {isAddMenuOpen && (
          <div className="absolute top-full right-0 mt-3 w-[280px] bg-black border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-40 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Create Button */}
            <button 
              onClick={() => { 
                navigate('/create-card'); // Updated from '/learn'
                setIsAddMenuOpen(false); 
              }} 
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/10 transition-colors border-b border-white/10 group"
            >
              <div className="text-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-[17px] group-hover:text-[#00CEC8] transition-colors">
                  Create
                </div>
                <div className="text-white/40 text-[13px] font-medium mt-0.5">
                  Write your cards
                </div>
              </div>
            </button>
            {/* Import Button */}
            <button onClick={() => { setIsAddMenuOpen(false); setIsImportModalOpen(true); }} className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/10 transition-colors border-b border-white/10 group">
              <div className="text-white"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></div>
              <div>
                <div className="text-white font-semibold text-[17px] group-hover:text-[#00CEC8]">Import</div>
                <div className="text-white/40 text-[13px] font-medium mt-0.5">Insert file (PDF, word, etc.)</div>
              </div>
            </button>

            {/* --- 3. UPDATED EXPORT BUTTON --- */}
            <button 
              onClick={() => {
                setIsAddMenuOpen(false);
                setIsExportModalOpen(true); // Open the Export Modal
              }}
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/10 transition-colors group"
            >
              <div className="text-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-[17px] group-hover:text-[#00CEC8]">Export</div>
                <div className="text-white/40 text-[13px] font-medium mt-0.5">Print file (PDF, word, etc.)</div>
              </div>
            </button>

          </div>
        )}
      </div>

      <button onClick={() => navigate('/learn')} className="bg-white text-black text-sm font-bold px-10 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform">
        Learn
      </button>

      {/* 4. MODALS */}
      {isImportModalOpen && <ImportModal onClose={() => setIsImportModalOpen(false)} />}
      
      {isExportModalOpen && (
        <ExportModal 
          fileName="Database_MS_Flashcards.pdf" 
          onClose={() => setIsExportModalOpen(false)} 
          onExport={() => console.log("Exporting...")}
        />
      )}
      
    </div>
  );
}
