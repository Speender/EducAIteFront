import React, { useState } from 'react'
import { motion } from 'framer-motion';

interface Skill {
  id: number;
  name: string;
  level: string;
}

interface ThirdResumeBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const ThirdResumeBuilder = ({ onBack, onNext }: ThirdResumeBuilderProps) => {
  const [skills, setSkills] = useState<Skill[]>([
    { id: Date.now(), name: '', level: 'Novice' }
  ]);

  const addSkill = () => {
    setSkills([...skills, { id: Date.now(), name: '', level: 'Novice' }]);
  };

  const deleteSkill = (id: number) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-36 lg:pt-24 pb-10 px-4 md:px-8 lg:px-16 font-sans overflow-x-hidden">
      
      {/* PROGRESS BAR SECTION */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }} 
        animate={{ opacity: 1, x: 0 }}    
        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.6 }} 
        className="max-w-7xl mx-auto mb-6 lg:mb-8"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-3 lg:p-4 flex items-center gap-3 lg:gap-4 shadow-lg">
          <div className="bg-[#00CEC8]/20 px-2.5 py-1 lg:px-3 lg:py-1 rounded-md">
            <span className="text-[#00CEC8] font-bold text-[10px] lg:text-xs">50%</span>
          </div>
          <p className="text-white/40 text-[10px] lg:text-xs font-medium uppercase tracking-wider">Your resume score</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* LEFT SIDE: SKILLS FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7, ease: "easeOut" }} 
          className="flex-1 space-y-6 lg:space-y-8"
        >
          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl lg:rounded-3xl p-5 md:p-6 lg:p-8">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Skills</h2>
              <button onClick={onBack} className="text-[#00CEC8] text-xs lg:text-sm font-bold hover:underline">
                Go Back
              </button>
            </div>
            <p className="text-white/40 text-xs lg:text-sm mb-6 lg:mb-8">
              Listing both technical and soft skills creates a well-balanced professional profile.
            </p>

            {/* MAP THROUGH SKILLS STATE */}
            {skills.map((skill) => (
              <div key={skill.id} className="border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6 relative group bg-[#0A0A0A]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base lg:text-lg font-bold text-white">
                    {skill.name || "(Not Specified)"}
                  </span>
                  <div className="flex gap-3 lg:gap-4">
                    <button className="text-white/20 hover:text-white transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteSkill(skill.id)}
                      className="text-white/20 hover:text-red-500 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-white/40 text-xs lg:text-sm mb-4 lg:mb-6 uppercase tracking-tighter font-semibold">{skill.level}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs font-semibold mb-2 lg:mb-3 text-white">Skill</label>
                    <input 
                      type="text" 
                      placeholder="e.g. JavaScript"
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = skills.map(s => s.id === skill.id ? {...s, name: e.target.value} : s);
                        setSkills(newSkills);
                      }}
                      className="w-full bg-[#333333] border border-transparent rounded-xl p-3.5 lg:p-4 outline-none focus:border-[#00CEC8]/50 text-white text-sm lg:text-base" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 lg:mb-3 text-white">
                      Level - <span className="text-[#EE828B]">{skill.level}</span>
                    </label>
                    <div className="relative w-full h-[45px] lg:h-[52px] bg-[#3B3B3B] rounded-full flex items-center px-1">
                        <div className="w-1/4 h-[43px] lg:h-[50px] bg-[#EE828B] rounded-full cursor-pointer ml-[25%] shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* ADD ACTION */}
            <button 
              onClick={addSkill}
              className="flex items-center gap-2 text-[#00CEC8] font-bold text-xs lg:text-sm hover:opacity-80 transition-all mb-2 lg:mb-4"
            >
              <span className="text-lg lg:text-xl">+</span> Add one more skill
            </button>
          </section>

          {/* DESKTOP BUTTON ONLY */}
          <button 
            onClick={onNext}
            className="hidden lg:block w-full bg-white text-black font-bold py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:scale-[1.01] transition-transform text-base lg:text-lg shadow-xl shadow-white/5"
          >
            Next: Employment History
          </button>
        </motion.div>

        {/* RIGHT SIDE: LIVE PREVIEW */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} 
          animate={{ opacity: 1, y: 0 }}    
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full lg:w-[450px] flex-shrink-0"
        >
          <div className="sticky top-24 lg:top-32">
            <div className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl shadow-white/5 overflow-hidden">
              <div className="p-6 lg:p-10 text-black flex flex-col gap-3 lg:gap-4">
                <div className="h-5 lg:h-6 bg-black/10 w-1/2 rounded mb-2 lg:mb-4" />
                <div className="space-y-3 lg:space-y-4">
                    {skills.map((_, index) => (
                      <div key={index} className="flex justify-between items-center">
                         <div className="h-1.5 lg:h-2 bg-black/20 w-1/4 rounded" />
                         <div className="h-1 lg:h-1.5 bg-black/10 w-1/2 rounded-full" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <p className="text-center text-white/20 mt-4 text-[10px] lg:text-xs font-bold uppercase tracking-widest">Live Preview</p>
          </div>

          <button 
            onClick={onNext}
            className="block lg:hidden w-full bg-white text-black font-bold py-4 rounded-xl mt-8 hover:scale-[1.01] active:scale-95 transition-all text-base shadow-xl shadow-white/5"
          >
            Next: Employment History
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default ThirdResumeBuilder;