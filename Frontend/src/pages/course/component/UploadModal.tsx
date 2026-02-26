import React, { useState } from 'react'
import logo from '../../../assets/educAIte logo.svg'

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal = ({ onClose }: UploadModalProps) => {
  // Simple state for dropdowns. In a real app, these would come from the database
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semester, setSemester] = useState('1st Semester');

  return (
    // Backdrop - handles click-outside-to-close and blur
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 antialiased"
      onClick={onClose} // Close if they click the blurry part
    >
      {/* Modal Container */}
      {/* stopPropagation prevents clicks inside the box from closing the modal */}
      <div 
        className="bg-[#0a0a0a] w-full max-w-[650px] rounded-[32px] border border-white/10 p-10 relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* ================= HEADER Section ================= */}
        <div className="flex justify-between items-center mb-10">
          <img src={logo} alt="educAIte" className="h-6" />
          
          {/* Close button (X) */}
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
          {/* Academic Year Dropdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wide">Academic Year</label>
            <div className="relative">
              <select 
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[15px] text-white appearance-none cursor-pointer focus:border-[#00CEC8] focus:ring-1 focus:ring-[#00CEC8] outline-none transition-all"
              >
                <option>2023-2024</option>
                <option>2024-2025</option>
                <option>2025-2026</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Semester Dropdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wide">Semester</label>
            <div className="relative">
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[15px] text-white appearance-none cursor-pointer focus:border-[#00CEC8] focus:ring-1 focus:ring-[#00CEC8] outline-none transition-all"
              >
                <option>1st Semester</option>
                <option>2nd Semester</option>
                <option>Summer Term</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>


        {/* ================= UPLOAD AREA ================= */}
        <div className="border-2 border-dashed border-white/20 rounded-[32px] p-12 text-center flex flex-col items-center gap-6 hover:border-[#00CEC8]/50 hover:bg-[#00CEC8]/5 transition-all cursor-pointer group mb-12">
          {/* Large Cloud Icon */}
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#00CEC8] group-hover:scale-110 transition-transform duration-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15V3m0 0l-3.5 3.5M12 3l3.5 3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.3 16.5C21.4 15.6 22 14.4 22 13c0-2.8-2.7-5-6-5-0.3 0-0.6 0-0.9 0.1C14.3 5.7 11.8 4 9 4 4.6 4 1 7.1 1 11c0 2.2 1.2 4.1 3 5.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Instruction Text */}
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

      </div>
    </div>
  )
}

export default UploadModal