import React from 'react';
import ThreedotsModal from './ThreedotsModal';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

interface DeckCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
  showMenu?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DeckCard({ title, subtitle, onClick, showMenu, onEdit, onDelete }: DeckCardProps) {
  return (
    /* --- CONVERTED TO MOTION.DIV WITH SLIDE-UP & HOVER ANIMATION --- */
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className="relative h-52 bg-black border border-white/20 rounded-[32px] cursor-pointer group hover:border-[#00CEC8]/50 transition-all flex flex-col"
    >
      <div className="relative flex-1 border-b border-white/20 rounded-b-[32px] p-8 pb-6 flex flex-col justify-center">
        
        {showMenu && (
          <div className="absolute top-6 right-6 z-30">
            {/* Note: If ThreedotsModal has its own internal onClick, 
               ensure it also uses e.stopPropagation() to prevent 
               the card's onClick from firing.
            */}
            <ThreedotsModal>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="w-full text-left px-5 py-3 text-sm text-white/70 hover:bg-white/10 transition-colors"
              >
                ✏️ Edit Name
              </button>
              <div className="h-[1px] w-full bg-white/5" />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
              >
                🗑️ Delete Deck
              </button>
            </ThreedotsModal>
          </div>
        )}

        <h3 className={`text-[22px] font-bold text-white leading-[1.2] ${showMenu ? 'pr-10' : ''}`}>
          {title}
        </h3>
      </div>

      <div className="h-14 flex items-center px-8">
        <p className="text-[15px] text-white/50 font-medium">{subtitle}</p>
      </div>
    </motion.div>
  );
}