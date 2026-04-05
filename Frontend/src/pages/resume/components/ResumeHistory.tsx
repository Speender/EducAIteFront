import React from 'react'
import { motion } from 'framer-motion';

interface ResumeHistoryProps {
  onBack: () => void;
}

const ResumeHistory = ({ onBack }: ResumeHistoryProps) => {
  // Mock data for resume history entries
  const resumeHistoryList = [
    {
      id: 1,
      name: 'Software Engineer Resume 1',
      subText: 'Modern Template | Last edited 2 days ago',
      created: 'Created: Jan 15, 2026',
      lastEdited: 'Last Edited: Jan 17, 2026',
      status: 'Generated',
      icon: PaperIcon
    },
    {
      id: 2,
      name: 'Product Designer CV',
      subText: 'Elegant Template | In progress',
      created: 'Created: Jan 10, 2026',
      lastEdited: 'Last Edited: Jan 16, 2026',
      status: 'In Progress',
      icon: PaperIcon
    },
    {
      id: 3,
      name: 'Data Analyst Resume (v2)',
      subText: 'Creative Template | Downloaded',
      created: 'Created: Jan 08, 2026',
      lastEdited: 'Last Edited: Jan 15, 2026',
      status: 'Downloaded',
      icon: PaperIcon
    },
    {
      id: 4,
      name: 'Creative Director Portfolio CV',
      subText: 'Creative Template | Generated',
      created: 'Created: Dec 20, 2025',
      lastEdited: 'Last Edited: Dec 22, 2025',
      status: 'Generated',
      icon: PaperIcon
    },
    {
        id: 5,
        name: 'UI/UX Researcher Resume',
        subText: 'Professional Template | In progress',
        created: 'Created: Dec 15, 2025',
        lastEdited: 'Last Edited: Dec 19, 2025',
        status: 'In Progress',
        icon: PaperIcon
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-8 lg:px-16 font-sans overflow-x-hidden relative">
      
      {/* --- GO BACK ACTION --- */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} // Starts invisible and 50px to the left
        animate={{ opacity: 1, x: 0 }}    // Slides into original position
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto mb-6"
      >
        <button 
          onClick={onBack} 
          className="text-[#00CEC8] text-sm font-bold hover:underline flex items-center gap-2 group"
        >
          {/* Added a small motion span for the arrow to move on hover */}
          <motion.span 
            className="inline-block"
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            &larr;
          </motion.span> 
          Go Back
        </button>
      </motion.div>

      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
        animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1], // Premium "expo" ease-out
        }}
        className="max-w-7xl mx-auto mb-12 flex flex-col items-center text-center"
      >
        <motion.h1 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl font-bold tracking-tight text-white mb-2"
        >
          Resume History
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white/40 text-lg max-w-2xl"
        >
          Review and manage your generated resumes.
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -60 }} // Starts invisible and 60px to the left
        animate={{ opacity: 1, x: 0 }}    // Slides into original position
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1] // Custom "Quart" ease-out for a smooth landing
        }}
        className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-5 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-inner"
      >
        
        {/* Left side: Filters */}
        <div className="flex items-center gap-6 text-sm">
            <button className="text-white/60 hover:text-white transition-colors flex items-center gap-2.5">
                Sort by: All <span className="text-[10px]">▼</span>
            </button>
            <span className="text-white/20">|</span>
            <p className="text-white/60">Show: <span className="text-white font-semibold ml-1">10</span></p>
        </div>

        {/* Right side: Search */}
        <div className="w-full md:w-80 relative flex items-center">
            <span className="absolute left-4 text-white/20 z-10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </span>
            <motion.input 
                whileFocus={{ scale: 1.02 }} // Subtly grows when focused
                type="text" 
                placeholder="Search..." 
                className="w-full h-12 bg-black border border-white/5 rounded-xl px-12 outline-none focus:border-[#00CEC8]/50 placeholder:text-white/10 transition-all text-sm text-white" 
            />
        </div>
      </motion.div>

      {/* --- HISTORY LIST TABLE --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1], // Premium smooth deceleration
        }}
        className="max-w-7xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.8)]"
      >
        <table className="w-full border-collapse">
            <thead className="border-b border-white/10">
                <tr>
                    <th className="text-left text-xs font-bold uppercase tracking-widest text-white/40 px-10 py-6">Resume Name</th>
                    <th className="text-left text-xs font-bold uppercase tracking-widest text-white/40 px-6 py-6">Dates</th>
                    <th className="text-left text-xs font-bold uppercase tracking-widest text-white/40 px-6 py-6">Status</th>
                    <th className="text-right text-xs font-bold uppercase tracking-widest text-white/40 px-10 py-6">Actions</th>
                </tr>
            </thead>
            <tbody>
                {resumeHistoryList.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 last:border-b-0 group hover:bg-white/[0.01] transition-colors">
                        
                        <td className="px-10 py-7 flex items-center gap-4">
                            <entry.icon />
                            <div>
                                <h4 className="text-lg font-bold text-white group-hover:text-[#00CEC8] transition-colors">{entry.name}</h4>
                                <p className="text-white/40 text-sm mt-1">{entry.subText}</p>
                            </div>
                        </td>

                        <td className="px-6 py-7 text-sm">
                            <p className="text-white">{entry.created}</p>
                            <p className="text-white/40 mt-1">{entry.lastEdited}</p>
                        </td>

                        <td className="px-6 py-7">
                            <StatusPill status={entry.status} />
                        </td>

                        <td className="px-10 py-7 text-right">
                           <div className="flex justify-end gap-5">
                             <ActionIcon icon={EyeIcon} label="View" />
                             <ActionIcon icon={PencilIcon} label="Edit" />
                             <ActionIcon icon={DownloadIcon} label="Download" />
                             <ActionIcon icon={TrashIcon} label="Delete" color="text-red-500" />
                           </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </motion.div>

      {/* --- PAGINATION ANIMATED FROM BELOW WITH DELAY --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }} // Appears slightly after the table
        className="max-w-7xl mx-auto px-10 py-10 flex items-center justify-between text-sm"
      >
          <p className="text-white/40">Showing <span className="text-white font-medium">1-10</span> of <span className="text-white font-medium">25</span> resumes</p>
          <div className="flex items-center gap-1.5">
              <button className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">←</button>
              <button className="w-10 h-10 bg-[#00CEC8] rounded-full text-black font-bold">1</button>
              <button className="w-10 h-10 border border-white/10 rounded-full text-white hover:bg-white/5 transition-all">2</button>
              <button className="w-10 h-10 border border-white/10 rounded-full text-white hover:bg-white/5 transition-all">3</button>
              <span className="text-white/20 px-1">...</span>
              <button className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">→</button>
          </div>
      </motion.div>
    </div>
  )
}

// --- Status Pill Helper Component ---
const StatusPill = ({ status }: { status: string }) => {
  const isGenerated = status === 'Generated';
  
  return (
    <div className={`px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
        isGenerated 
          ? 'bg-[#00CEC8]/10 text-[#00CEC8]' 
          : 'bg-white/5 text-white/40'
    }`}>
      {isGenerated && <span className="text-sm">✓</span>}
      {status}
    </div>
  );
};

// --- Action Icon Helper Component ---
interface ActionIconProps { icon: React.FC; label: string; color?: string; }
const ActionIcon = ({ icon: Icon, label, color }: ActionIconProps) => (
  <button title={label} className={`${color || 'text-white/20'} hover:text-white hover:scale-110 transition-all`}>
    <Icon />
  </button>
);

// --- Simple Icon Components (SVGs) ---
const PaperIcon = () => (
    <div className="w-12 h-12 flex-shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/20 group-hover:text-[#00CEC8] group-hover:border-[#00CEC8]/30 group-hover:bg-[#00CEC8]/5 transition-all">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    </div>
);
const EyeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const PencilIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const TrashIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default ResumeHistory