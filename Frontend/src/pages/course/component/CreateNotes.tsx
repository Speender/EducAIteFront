import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/educAIte-logo.svg'
import { motion } from 'framer-motion' // <-- IMPORT FRAMER MOTION

const CreateNotes = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const editorRef = useRef<HTMLDivElement>(null);
  
  // --- NEW: Refs and State for Image Upload ---
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

  // --- NEW: Function to open file picker and save cursor position ---
  const triggerImageUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    // Save the exact spot where the cursor is blinking before opening the folder
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
    // Open the folder window
    fileInputRef.current?.click();
  };

  // --- NEW: Function to handle the selected image ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      // Inject the image with Tailwind classes so it looks gorgeous
      const imageHtml = `<br/><img src="${base64Image}" alt="Note Image" class="max-w-full rounded-2xl border border-white/10 shadow-lg my-4" /><br/>`;
      
      // Put the cursor back exactly where it was before the folder opened
      if (savedRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedRange);
      } else {
        editorRef.current?.focus();
      }
      
      // Inject the image into the editor
      document.execCommand('insertHTML', false, imageHtml);
    };
    
    // Read the file instantly in the browser
    reader.readAsDataURL(file);

    // Reset the input so they can upload the exact same image again if needed
    e.target.value = '';
  };

  const handleSave = () => {
    // 1. Create the new file object
    const newFile = {
      name: title.trim() === "" ? "Untitled Note" : title,
      icon: "notes",
      size: "1 kb", // Mock size
      dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // 2. Get any previously saved custom files, or start an empty array
    const savedFiles = JSON.parse(localStorage.getItem('custom_course_files') || '[]');
    
    // 3. Add the new file to the beginning of the array and save back to storage
    localStorage.setItem('custom_course_files', JSON.stringify([newFile, ...savedFiles]));

    // 4. Navigate back to the course page
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex flex-col">
      
      {/* GLOBAL NAVBAR */}
      {/* --- CONVERTED TO MOTION.HEADER WITH SLIDE-DOWN FROM TOP ANIMATION --- */}
      <motion.header 
        initial={{ opacity: 0, y: -100 }} // Starts invisible and 100px above
        animate={{ opacity: 1, y: 0 }}    // Slides down to its original position (0)
        transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
        className="flex items-center justify-between px-8 py-6 lg:px-16 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <img src={logo} alt="educAIte" className="h-8 lg:h-10" />
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="text-white/40 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave} 
            className="bg-white text-black px-10 py-2.5 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            Save Note
          </button>
        </div>
      </motion.header>

      {/* MAIN CONTENT AREA */}
      <main className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* TEXT EDITOR AREA */}
        {/* --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM LEFT ANIMATION --- */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
          animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          className="flex-1 p-8 lg:p-20 overflow-y-auto custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto">
            
            <p className="text-[#00CEC8] text-xl font-medium mb-6">
              Database Management System (DBSYS 1)
            </p>

            {/* INTEGRATED TOOLBAR */}
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
              <div className="flex items-center gap-6 text-white/50">
                
                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }} className="hover:text-white font-bold text-xl transition-colors">B</button>
                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }} className="hover:text-white italic text-xl font-serif transition-colors">I</button>
                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('underline'); }} className="hover:text-white underline text-xl transition-colors">U</button>
                
                <div className="w-[1px] h-6 bg-white/10 mx-2" /> 

                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }} className="hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  Bullet
                </button>
                
                <button onMouseDown={(e) => { e.preventDefault(); handleFormat('insertCheckbox'); }} className="hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="9 11 12 14 22 4"/></svg>
                  Check
                </button>

                {/* --- CHANGED: Summation Button --- */}
                <button 
                  onMouseDown={(e) => { e.preventDefault(); handleFormat('insertText', 'Σ'); }} 
                  className="hover:text-white flex items-center gap-2 text-sm font-bold transition-colors text-lg"
                >
                  Σ <span className="text-sm">Summation</span>
                </button>

                {/* --- CHANGED: Image Button (Triggers hidden file input) --- */}
                <button 
                  onMouseDown={triggerImageUpload} 
                  className="hover:text-white flex items-center gap-2 text-sm font-bold transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Image
                </button>

                {/* --- NEW: Hidden File Input --- */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3">
                <button className="bg-white text-black px-5 py-2 rounded-full font-bold flex items-center gap-2 text-sm hover:bg-gray-200 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                  Summarize
                </button>
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 text-sm hover:bg-gray-200 transition-all">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                   Save
                </button>
              </div>
            </div>

            {/* INPUTS */}
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-6xl font-medium w-full outline-none mb-10 placeholder:text-white/10 tracking-tight"
              placeholder="Untitled"
            />
            
            <div 
              ref={editorRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              data-placeholder="Start typing your notes..."
              className="bg-transparent w-full h-[50vh] outline-none text-xl leading-relaxed font-light overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-white/5 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_li]:mb-1"
            />
            
          </div>
        </motion.div>

        {/* SIDEBAR */}
        {/* --- CONVERTED TO MOTION.ASIDE WITH SLIDE-UP FROM BOTTOM ANIMATION --- */}
        <motion.aside 
          initial={{ opacity: 0, y: 100 }} // Starts invisible and 100px below
          animate={{ opacity: 1, y: 0 }}    // Slides up into its original position (0)
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
          className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-10 bg-[#050505]/50 flex-shrink-0"
        >
          <p className="text-[#00CEC8] text-[11px] font-bold uppercase tracking-[0.2em] mb-10">Note Settings</p>
          
          <div className="space-y-10">
            <div>
              <label className="block text-white/40 text-[10px] font-bold uppercase mb-3">Save to Folder</label>
              <select className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-[#00CEC8] transition-all text-sm appearance-none">
                <option>General Notes</option>
                <option>Programming Languages</option>
                <option>HCI Project</option>
              </select>
            </div>

            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">AI Summary</p>
                <div className="w-10 h-5 bg-[#00CEC8] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">Automatically generate a summary using educAIte.</p>
            </div>

            <div className="pt-10 border-t border-white/5">
              <p className="text-white/20 text-[10px] italic font-medium">Last synced: Just now</p>
            </div>
          </div>
        </motion.aside>
      </main>
    </div>
  )
}

export default CreateNotes;