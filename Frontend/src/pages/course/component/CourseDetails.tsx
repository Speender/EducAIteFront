import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { courses } from '../../../data/courses'
import logo from '../../../assets/educAIte-logo.svg'
import ImportFileModal from './ImportFileModal'
import CreateMenu from './CreateMenu'
import FileActionMenu from './FileActionMenu'

const CourseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Overlay States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  
  const [activeMenuFile, setActiveMenuFile] = useState<string | null>(null);

  const selectedCourse = courses.find(course => course.id === id);

  // --- DYNAMIC STATE (CHANGED: Now loads from localStorage!) ---
  const [files, setFiles] = useState(() => {
    // 1. Grab any custom files we saved from CreateNotes
    const savedFiles = JSON.parse(localStorage.getItem('custom_course_files') || '[]');
    
    // 2. Define your default hardcoded files
    const defaultFiles = [
      { name: "Course Image", icon: "folder", size: "10 mb", dateCreated: "Sept 7, 2025" },
      { name: "Chapter 1 Introduction", icon: "pdf", size: "163 kb", dateCreated: "Sept 7, 2025" },
      { name: "Syllabus", icon: "presentation", size: "102 mb", dateCreated: "Sept 7, 2025" },
      { name: "My notes", icon: "notes", size: "10 mb", dateCreated: "Sept 7, 2025" },
      { name: "Reference Materials", icon: "folder", size: "10 mb", dateCreated: "Sept 7, 2025" },
      { name: "Assignment 1", icon: "pdf", size: "2.4 mb", dateCreated: "Sept 7, 2025" },
      { name: "Lecture Video", icon: "folder", size: "450 mb", dateCreated: "Sept 7, 2025" },
    ];

    // 3. Combine them! Saved files go first so they appear at the top.
    return [...savedFiles, ...defaultFiles];
  });

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- FILTERED FILES (Derived State) ---
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FUNCTION: Add a new folder ---
  const handleAddFolder = (folderName: string) => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newFolder = {
      name: folderName,
      icon: "folder",
      size: "--", 
      dateCreated: today
    };
    
    setFiles(prevFiles => [newFolder, ...prevFiles]);
    setIsCreateMenuOpen(false); 
  };

  // --- FUNCTION: Delete a file/folder ---
  const handleDeleteFile = (fileNameToDelete: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileNameToDelete));
    setActiveMenuFile(null); // Close the menu after deleting
  };

  // Close menus on Scroll to keep UI clean
  useEffect(() => {
    const handleScroll = () => {
      setActiveMenuFile(null);
      setIsCreateMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Course not found</p>
        <button onClick={() => navigate('/courses')} className="ml-4 underline">Go back</button>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen bg-black text-white p-6 lg:px-16 lg:py-10 font-sans antialiased transition-all duration-500 ${isImportModalOpen ? 'blur-md' : ''}`}>
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/courses')}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <img src={logo} alt="educAIte" className="h-10" />
          </div>
        </div>

        {/* Dynamic Title Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16">
          {/* --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM LEFT ANIMATION --- */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}  
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
              <h1 className="text-5xl font-medium mb-4 tracking-tight">Files</h1>
              <h2 className="text-[#00CEC8] text-4xl font-semibold leading-tight">
                {selectedCourse.title}
              </h2>
              
              <div className="flex gap-4 mt-8">
                {/* IMPORT BUTTON */}
                <button 
                  onClick={() => setIsImportModalOpen(true)}
                  className="bg-white text-black font-normal px-10 py-3 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  Import file
                </button>

                {/* CREATE BUTTON WITH MENU */}
                <div className="relative">
                  <button 
                    onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                    className="bg-white text-black font-normal px-10 py-3 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    Create
                  </button>
                  {/* Linked to handleAddFolder */}
                  {isCreateMenuOpen && <CreateMenu onClose={() => setIsCreateMenuOpen(false)} onFolderCreated={handleAddFolder} />}
                </div>
              </div>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}   
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="w-full max-w-xl"
          >
            <p className="text-white text-xl font-medium mb-4">Search files</p>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search" 
                  className="w-full bg-black border border-white/20 rounded-full py-3 pl-12 pr-4 focus:border-[#00CEC8] outline-none transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <button className="bg-white text-black font-medium px-8 py-2 rounded-full hover:bg-gray-200 transition-colors">Search</button>
            </div>
            <p className="text-white/40 text-[11px] mt-3 ml-2 uppercase tracking-widest font-bold">Enter at least 2 characters to search</p>
          </motion.div>
        </div>

        {/* Files Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }}   
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          
          {/* Empty State when search finds nothing */}
          {filteredFiles.length === 0 && (
            <div className="col-span-full py-12 text-center text-white/40">
              <p className="text-lg">No files found matching "{searchQuery}"</p>
            </div>
          )}

          {/* Mapping over the filteredFiles state */}
          {filteredFiles.map((file, index) => (
            <div 
              key={`${file.name}-${index}`} 
              className="bg-[#050505] border border-white/10 rounded-[24px] p-6 hover:border-[#00CEC8]/100 transition-all group relative cursor-pointer"
            >
              {/* THREE DOTS ACTION MENU */}
              <div className="absolute top-4 right-4 z-30">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuFile(activeMenuFile === file.name ? null : file.name);
                  }}
                  className={`p-1 rounded-full transition-colors ${activeMenuFile === file.name ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>

                {activeMenuFile === file.name && (
                  <FileActionMenu 
                    onClose={() => setActiveMenuFile(null)}
                    onDownload={() => console.log('Download', file.name)}
                    onDelete={() => handleDeleteFile(file.name)}
                  />
                )}
              </div>

               <div className="flex flex-col items-center text-center pt-8 pb-10">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                     {file.icon === 'folder' && <svg width="60" height="60" viewBox="0 0 24 24" fill="white"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>}
                     {file.icon === 'pdf' && <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M10 13l-1 2H8l2-4h1l2 4h-1l-1-2z"/></svg>}
                     {file.icon === 'presentation' && <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="3" width="18" height="12" rx="2"/><path d="M12 15v3m-4 3h8m-7-13 3 3 3-3"/></svg>}
                     {file.icon === 'notes' && <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h12"/></svg>}
                  </div>
                  <p className="font-semibold text-lg leading-tight px-2">{file.name}</p>
               </div>
               
               <div className="space-y-1 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                 <p>Size: <span className="text-white/80">{file.size}</span></p>
                 <p>Last Created: <span className="text-white/80">{file.dateCreated}</span></p>
               </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal Overlay */}
      {isImportModalOpen && (
        <ImportFileModal onClose={() => setIsImportModalOpen(false)} />
      )}
    </>
  )
}

export default CourseDetails