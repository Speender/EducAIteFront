import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CertificateResumeBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const CertificateResumeBuilder = ({ onBack, onNext }: CertificateResumeBuilderProps) => {
  // State for certificate selection
  const [selectedId, setSelectedId] = useState<number>(6);
  
  // NEW STATE: Controls the visibility of the Final Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Mock data for the certificates
  const certificates = [
    { id: 1, alt: "Certificate 1" },
    { id: 2, alt: "Certificate 2" },
    { id: 3, alt: "Certificate 3" },
    { id: 4, alt: "Certificate 4" },
    { id: 5, alt: "Certificate 5" },
    { id: 6, alt: "Certificate 6" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-8 lg:px-16 font-sans overflow-x-hidden relative">
      
      {/* --- PROGRESS BAR --- */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
        animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20, 
          duration: 0.6 
        }} 
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="bg-[#00CEC8]/20 px-3 py-1.5 rounded-md flex items-center justify-center">
              <span className="text-[#00CEC8] font-bold text-xs">100%</span>
            </div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Your resume score</p>
          </div>
        </div>
      </motion.div>

      {/* --- MAIN CONTENT: CERTIFICATE PICKER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }} // Starts invisible and 40px below
        animate={{ opacity: 1, y: 0 }}    // Slides up to original position
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 lg:p-10"
      >
        
        {/* Header Area */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium text-white/90">
            Pick a certificate that you want to include in your resume
          </h2>
          <button onClick={onBack} className="text-[#00CEC8] text-sm font-bold hover:underline transition-all">
            Go Back
          </button>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {certificates.map((cert, index) => {
            const isSelected = selectedId === cert.id;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }} // Staggered entrance
                whileHover={{ y: -5 }} // Subtle lift on hover
                onClick={() => setSelectedId(cert.id)}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                  isSelected 
                    ? 'border-[3px] border-[#00CEC8] shadow-[0_0_15px_rgba(0,206,200,0.2)]' 
                    : 'border-[3px] border-transparent hover:border-white/10'
                }`}
              >
                <img 
                  src="/api/placeholder/400/280" 
                  alt={cert.alt} 
                  className="w-full h-auto object-cover bg-white"
                />

                {/* Selected State Overlay */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
                    >
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#00CEC8] rounded-full p-2 shadow-lg"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-8 w-8 text-black" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Action Area */}
        <div className="flex justify-end">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreviewModal(true)}
            className="bg-[#00CEC8] text-black font-bold text-lg py-4 px-10 rounded-2xl shadow-[0_4px_20px_rgba(0,206,200,0.3)]"
          >
            Add to Resume
          </motion.button>
        </div>
      </motion.div>

      {/* ========================================= */}
      {/* === FINAL PREVIEW MODAL OVERLAY === */}
      {/* ========================================= */}
      <AnimatePresence>
        {showPreviewModal && (
          /* --- BACKDROP FADE-IN --- */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-md"
          >
            
            {/* --- MODAL POP-UP ANIMATION --- */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
            >
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#0A0A0A]">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Final Resume Preview</h3>
                  <p className="text-white/40 text-sm mt-1">Review your generated resume before exporting.</p>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Modal Body - Scrollbar hidden but scrolling enabled */}
              <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-black/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Simulated A4 Paper */}
                <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-12 text-black flex flex-col gap-6 relative">
                  
                  {/* Skeleton content */}
                  <div className="border-b-2 border-black/20 pb-6 mb-2">
                    <div className="h-10 bg-black/10 w-1/3 rounded-md mb-4" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-black/5 w-24 rounded" />
                      <div className="h-4 bg-black/5 w-32 rounded" />
                      <div className="h-4 bg-black/5 w-24 rounded" />
                    </div>
                  </div>

                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-6 bg-black/10 w-1/4 rounded mb-4" />
                      <div className="h-3 bg-black/5 w-full rounded" />
                      <div className="h-3 bg-black/5 w-full rounded" />
                      <div className="h-3 bg-black/5 w-3/4 rounded" />
                    </div>
                  ))}

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

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex justify-end items-center gap-4 bg-[#0A0A0A]">
                <button 
                  onClick={() => setShowPreviewModal(false)} 
                  className="px-6 py-3 rounded-xl font-bold text-white hover:bg-white/5 transition-all"
                >
                  Keep Editing
                </button>
                
                <button 
                  className="px-6 py-3 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Save to Profile
                </button>
                
                <button 
                  onClick={onNext} 
                  className="bg-[#00CEC8] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#00b5b0] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,206,200,0.3)] flex items-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Export PDF
                </button>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CertificateResumeBuilder;