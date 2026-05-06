interface CardOptionsModalProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CardOptionsModal({ onClose, onEdit, onDelete }: CardOptionsModalProps) {
  return (
    <>
      {/* Backdrop to close when clicking outside */}
      <div 
        className="fixed inset-0 z-[60]" 
        onClick={onClose} 
      />
      
      {/* The Menu Card */}
      <div className="absolute top-14 right-6 z-[70] w-56 overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col">
          <button 
            onClick={() => { onEdit(); onClose(); }}
            className="flex items-center gap-3 px-6 py-4 text-left text-[17px] font-medium text-white hover:bg-white/5 transition-colors"
          >
            <span>✏️</span> Edit card
          </button>
          
          <div className="h-[1px] w-full bg-white/5" />
          
          <button 
            onClick={() => { onDelete(); onClose(); }}
            className="flex items-center gap-3 px-6 py-4 text-left text-[17px] font-medium text-[#FF4B4B] hover:bg-red-500/5 transition-colors"
          >
            <span>🗑️</span> Delete card
          </button>
        </div>
      </div>
    </>
  );
}
