import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import logo from '../../../assets/educAIte-logo.svg'


const CreateNotes = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const editorRef = useRef<HTMLDivElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const handleFormat = (command: string, value?: string) => {
    if (command === 'insertCheckbox') {
      const checkboxHtml = `<div class="my-1">&#8203;<input type="checkbox" contenteditable="false" class="inline-block w-4 h-4 mr-2 align-middle accent-[#00CEC8] cursor-pointer select-none" />&nbsp;</div>`;
      document.execCommand('insertHTML', false, checkboxHtml);
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.current?.focus(); 
  };

  const triggerImageUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      const imageHtml = `<br/><img src="${base64Image}" alt="Note Image" class="max-w-full rounded-2xl border border-white/10 shadow-lg my-4" /><br/>`;
      
      if (savedRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedRange);
      } else {
        editorRef.current?.focus();
      }
      
      document.execCommand('insertHTML', false, imageHtml);
    };
    
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    const newFile = {
      name: title.trim() === "" ? "Untitled Note" : title,
      icon: "notes",
      size: "1 kb",
      dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const savedFiles = JSON.parse(localStorage.getItem('custom_course_files') || '[]');
    localStorage.setItem('custom_course_files', JSON.stringify([newFile, ...savedFiles]));
    navigate(-1);
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-black text-white font-sans antialiased flex flex-col">
      
      {/* GLOBAL NAVBAR */}
      <motion.header 
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.6, ease: "easeOut" }} 
        className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 lg:px-16 border-b border-white/10 bg-black/50 backdrop-blur-md z-50 shrink-0"
      >
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <img src={logo} alt="educAIte" className="h-6 md:h-8 lg:h-10 hidden sm:block" />
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="text-white/40 hover:text-white text-xs md:text-sm font-bold uppercase tracking-widest transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave} 
            className="bg-white text-black px-5 md:px-10 py-2 md:py-2.5 rounded-full text-sm md:text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 md:hover:scale-105 transition-transform shrink-0"
          >
            Save Note
          </button>
        </div>
      </motion.header>

      {/* MAIN CONTENT AREA */}
      <main className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        
        {/* TEXT EDITOR AREA - SCROLLBAR KILLED, PUSHED LOWER */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="flex-1 px-5 pt-8 sm:px-8 sm:pt-12 lg:px-16 lg:pt-16 xl:px-20 pb-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10"
        >
          <div className="max-w-4xl mx-auto">
            
            {/* PUSHED TITLE LOWER */}
            <p className="text-[#00CEC8] text-sm md:text-xl font-medium mb-4 md:mb-6 mt-8 md:mt-10">
              Database Management System (DBSYS 1)
            </p>

            {/* INTEGRATED TOOLBAR */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 md:mb-10 border-b border-white/5 pb-6 gap-6">
              
              <div className="flex flex-wrap items-center gap-x-5 gap-y-4 text-white/50 w-full xl:w-auto">
                
                <div className="flex items-center gap-4">
                  <button onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }} className="hover:text-white font-bold text-lg md:text-xl transition-colors">B</button>
                  <button onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }} className="hover:text-white italic text-lg md:text-xl font-serif transition-colors">I</button>
                  <button onMouseDown={(e) => { e.preventDefault(); handleFormat('underline'); }} className="hover:text-white underline text-lg md:text-xl transition-colors">U</button>
                </div>
                
                <div className="hidden sm:block w-[1px] h-6 bg-white/10 mx-1" /> 

                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }} className="hover:text-white flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold transition-colors shrink-0">
                  <svg className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  Bullet
                </button>
                
                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('insertCheckbox'); }} className="hover:text-white flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold transition-colors shrink-0">
                  <svg className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="9 11 12 14 22 4"/></svg>
                  Check
                </button>

                <button 
                  onMouseDown={(e) => { e.preventDefault(); handleFormat('insertText', 'Σ'); }} 
                  className="hover:text-white flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold transition-colors md:text-lg shrink-0"
                >
                  Σ <span className="text-xs md:text-sm">Summation</span>
                </button>

                <button 
                  onMouseDown={triggerImageUpload} 
                  className="hover:text-white flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold transition-colors shrink-0"
                >
                  <svg className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Image
                </button>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

              </div>

              {/* ACTIONS - SCROLLBAR KILLED */}
              <div className="flex items-center gap-2 md:gap-3 w-full xl:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 xl:pb-0">
                <button className="bg-white text-black px-4 md:px-5 py-2 rounded-full font-bold flex items-center gap-2 text-xs md:text-sm hover:bg-gray-200 active:scale-95 transition-all shrink-0">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                  Summarize
                </button>
                <button className="bg-white text-black px-5 md:px-6 py-2 rounded-full font-bold flex items-center gap-2 text-xs md:text-sm hover:bg-gray-200 active:scale-95 transition-all shrink-0">
                   <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                   Save
                </button>
              </div>
            </div>

            {/* INPUTS */}
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-4xl md:text-5xl lg:text-6xl font-medium w-full outline-none mb-6 md:mb-10 placeholder:text-white/10 tracking-tight"
              placeholder="Untitled"
            />
            
            <div 
              ref={editorRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              data-placeholder="Start typing your notes..."
              className="bg-transparent w-full min-h-[50vh] outline-none text-lg md:text-xl leading-relaxed font-light pb-20 empty:before:content-[attr(data-placeholder)] empty:before:text-white/5 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_li]:mb-1"
            />
            
          </div>
        </motion.div>

        {/* SIDEBAR - SCROLLBAR KILLED */}
        <motion.aside 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-6 md:p-8 lg:p-10 bg-[#050505]/50 flex-shrink-0 z-20 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <p className="text-[#00CEC8] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-10">Note Settings</p>
          
          <div className="space-y-8 md:space-y-10">
            <div>
              <label className="block text-white/40 text-[10px] font-bold uppercase mb-2 md:mb-3">Save to Folder</label>
              <select className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-[#00CEC8] transition-all text-xs md:text-sm appearance-none">
                <option>General Notes</option>
                <option>Programming Languages</option>
                <option>HCI Project</option>
              </select>
            </div>

            <div className="p-4 md:p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm font-bold text-white">AI Summary</p>
                <div className="w-9 h-5 md:w-10 bg-[#00CEC8] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">Automatically generate a summary using educAIte.</p>
            </div>

            <div className="pt-6 md:pt-10 border-t border-white/5">
              <p className="text-white/20 text-[10px] italic font-medium">Last synced: Just now</p>
            </div>
          </div>
        </motion.aside>
      </main>
    </div>
  )
}

export default CreateNotes;