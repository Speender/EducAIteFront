import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion' // <-- IMPORT FRAMER MOTION
import logo from '../../../assets/educAIte-logo.svg'

interface UploadModalProps {
  onClose: () => void;
}

// ================= CUSTOM DROPDOWN COMPONENT =================
const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string, 
  options: string[], 
  value: string, 
  onChange: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-white/50 uppercase tracking-wide">{label}</label>
      
      <div className="relative w-full z-50" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center bg-[#111111] text-white text-[15px] font-medium border-[1.5px] px-5 py-4 rounded-2xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-white/5 ${
            isOpen ? 'border-[#00CEC8] shadow-[0_0_0_3px_rgba(0,206,200,0.15)]' : 'border-white/10'
          }`}
        >
          <span className="truncate">{value}</span>
          <svg 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full bg-[#111111] border-[1.5px] border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
            <ul className="max-h-64 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {options.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                      item === value 
                        ? 'bg-[#00CEC8]/10 text-[#00CEC8] font-bold' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


// ================= MAIN MODAL COMPONENT =================
const UploadModal = ({ onClose }: UploadModalProps) => {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semester, setSemester] = useState('1st Semester');

  const academicYearOptions = ['2023-2024', '2024-2025', '2025-2026'];
  const semesterOptions = ['1st Semester', '2nd Semester', 'Summer Term'];

  return (
    // --- ANIMATED OVERLAY: Fades in smoothly ---
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 antialiased"
      onClick={onClose} 
    >
      {/* --- ANIMATED MODAL WINDOW: Scales up with a satisfying spring bounce --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 400 
        }}
        className="bg-[#0a0a0a] w-full max-w-[650px] rounded-[32px] border border-white/10 p-10 relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* ================= HEADER Section ================= */}
        <div className="flex justify-between items-center mb-10">
          <img src={logo} alt="educAIte" className="h-6" />
          
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-2 -mr-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ================= DROPDOWNS Section ================= */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <CustomDropdown 
            label="Academic Year"
            options={academicYearOptions}
            value={academicYear}
            onChange={setAcademicYear}
          />

          <CustomDropdown 
            label="Semester"
            options={semesterOptions}
            value={semester}
            onChange={setSemester}
          />
        </div>

        {/* ================= UPLOAD AREA ================= */}
        <div className="border-2 border-dashed border-white/20 rounded-[32px] p-12 text-center flex flex-col items-center gap-6 hover:border-[#00CEC8]/50 hover:bg-[#00CEC8]/5 transition-all cursor-pointer group mb-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#00CEC8] group-hover:scale-110 transition-transform duration-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15V3m0 0l-3.5 3.5M12 3l3.5 3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.3 16.5C21.4 15.6 22 14.4 22 13c0-2.8-2.7-5-6-5-0.3 0-0.6 0-0.9 0.1C14.3 5.7 11.8 4 9 4 4.6 4 1 7.1 1 11c0 2.2 1.2 4.1 3 5.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="space-y-1">
            <p className="text-white text-lg font-medium">Select a <span className="text-[#00CEC8]">PDF</span> file to upload</p>
            <p className="text-white/60 text-[15px]">or drag and drop it here</p>
          </div>

          <p className="text-white/40 text-[11px] uppercase tracking-wider font-bold mt-2">Max File Size: 10MB</p>
        </div>

        {/* ================= FOOTER BUTTONS ================= */}
        <div className="flex justify-center items-center gap-4">
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white text-sm font-semibold px-10 py-3.5 rounded-full transition-colors"
          >
            Cancel
          </button>
          
          <button className="bg-white text-black text-sm font-bold px-12 py-3.5 rounded-full hover:bg-gray-200 transition-all flex items-center gap-2.5 shadow-md">
            <span>Upload</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

      </motion.div>
    </motion.div>
  )
}

export default UploadModal