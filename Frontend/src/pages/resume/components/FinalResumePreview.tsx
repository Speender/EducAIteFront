import React from 'react';

interface FinalResumePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onExport: () => void;
}

const FinalResumePreview = ({ isOpen, onClose, onSave, onExport }: FinalResumePreviewProps) => {
  // If the modal isn't open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-md transition-all duration-300">
      
      {/* Modal Container */}
      <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#0A0A0A]">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Final Resume Preview</h3>
            <p className="text-white/40 text-sm mt-1">Review your generated resume before exporting.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Modal Body - The Resume Paper (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-black/50">
          {/* Simulated A4 Paper */}
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-12 text-black flex flex-col gap-6 relative">
             
             {/* Skeleton layout representing the finalized resume */}
             <div className="border-b-2 border-black/20 pb-6 mb-2">
               <div className="h-10 bg-black/10 w-1/3 rounded-md mb-4" />
               <div className="flex gap-4">
                 <div className="h-4 bg-black/5 w-24 rounded" />
                 <div className="h-4 bg-black/5 w-32 rounded" />
                 <div className="h-4 bg-black/5 w-24 rounded" />
               </div>
             </div>

             {/* Sections */}
             {[...Array(4)].map((_, i) => (
               <div key={i} className="space-y-3">
                 <div className="h-6 bg-black/10 w-1/4 rounded mb-4" />
                 <div className="h-3 bg-black/5 w-full rounded" />
                 <div className="h-3 bg-black/5 w-full rounded" />
                 <div className="h-3 bg-black/5 w-3/4 rounded" />
               </div>
             ))}

             {/* Simulated Certificate Graphic at the bottom */}
             <div className="mt-auto border-t border-black/10 pt-6 flex gap-6 items-center">
                <div className="w-24 h-16 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15l-3 3-3-3V5a2 2 0 012-2h8a2 2 0 012 2v10l-3 3-3-3z"/></svg>
                </div>
                <div>
                  <div className="h-4 bg-black/10 w-48 rounded mb-2" />
                  <div className="h-3 bg-black/5 w-32 rounded" />
                </div>
             </div>

          </div>
        </div>

        {/* Modal Footer - Actions */}
        <div className="p-6 border-t border-white/10 flex justify-end items-center gap-4 bg-[#0A0A0A]">
          <button 
            onClick={onClose} 
            className="px-6 py-3 rounded-xl font-bold text-white hover:bg-white/5 transition-all"
          >
            Keep Editing
          </button>
          
          {/* Save Button */}
          <button 
            onClick={onSave}
            className="px-6 py-3 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save to Profile
          </button>
          
          {/* Export Button */}
          <button 
            onClick={onExport} 
            className="bg-[#00CEC8] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#00b5b0] hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(0,206,200,0.3)] flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export PDF
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default FinalResumePreview;