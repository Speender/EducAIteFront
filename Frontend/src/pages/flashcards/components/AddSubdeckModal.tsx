import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

interface AddSubdeckModalProps {
  onClose: () => void;
  onSubmit: (title: string, color?: string, picture?: File) => void;
  parentDeckName?: string;
}

const colors = [
  '#F28E82', '#9965F2', '#8EF2DF', '#87B376', '#6094F2', '#D1F257', '#F24EB1'
];

export function AddSubdeckModal({ onClose, onSubmit, parentDeckName = "Database Management System" }: AddSubdeckModalProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<string | undefined>();
  const [picture, setPicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPicture(event.target.files[0]);
    }
  };

  const triggerFileSelectPopup = () => {
    fileInputRef.current?.click();
  };

  return (
    /* --- BACKDROP FADE-IN --- */
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
    >
      {/* --- MODAL POP-UP ANIMATION --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="w-full max-w-[480px] rounded-[32px] bg-[#050505] p-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative"
      >

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header & Parent Deck Pill */}
        <div className="text-center mb-10">
          <h2 className="text-[26px] font-bold text-white mb-3">Add subdeck</h2>
          {parentDeckName && (
            <div className="inline-flex items-center justify-center border border-white/20 rounded-full px-5 py-1.5 text-[11px] font-medium text-white/80 tracking-wide">
              {parentDeckName}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Subdeck Name Input */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Deck name</label>
            <input
              id="deck-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent rounded-full border border-white/30 px-5 py-3 text-base outline-none focus:border-[#00CEC8] transition-colors text-white"
              autoFocus
            />
          </div>

          {/* Color Picker */}
          <div>
            <p className="mb-4 text-sm font-medium text-white/90">Choose a color</p>
            <div className="flex flex-wrap gap-4">
              {colors.map((item) => (
                <button
                  key={item}
                  onClick={() => setColor(item)}
                  className={`h-10 w-10 rounded-full transition-all ${
                    color === item 
                      ? 'scale-110 border-4 border-white' 
                      : 'border border-white/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: item }}
                />
              ))}
            </div>
          </div>

          <div className="text-white/40 text-center text-sm font-medium my-4">or</div>

          {/* Picture Picker */}
          <div>
            <p className="mb-4 text-sm font-medium text-white/90">Choose a picture</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={triggerFileSelectPopup}
                className="h-16 w-16 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group overflow-hidden"
              >
                {picture ? (
                  <img src={URL.createObjectURL(picture)} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </button>
              {picture && (
                <span className="text-sm text-white/70 truncate max-w-[200px]">{picture.name}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => {
              if (title.trim()) {
                onSubmit(title, color, picture || undefined);
                onClose(); 
              }
            }}
            className={`w-full rounded-full py-4 font-bold text-sm transition-all bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4 ${
              !title.trim() ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Add deck
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddSubdeckModal;