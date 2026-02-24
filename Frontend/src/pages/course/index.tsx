import React from 'react'
import CourseCard from './CourseCard'
import { SemesterDropdown } from './component'
import logo from '../../assets/educAIte logo.svg' // Adjust path as needed

const CoursePage = () => {
  return (
    <div className="min-h-screen bg-black text-white p-12 font-sans">
      {/* Header Area */}
      <header className="flex justify-between items-start mb-20">
        <img src={logo} alt="educAlte" className="h-8" />
        <SemesterDropdown />
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Content */}
        <div className="lg:w-1/3 space-y-8">
          <h1 className="text-5xl font-bold leading-tight">
            Ace <span className="text-[#00CEC8]">The</span> Semester.<br />
            Learn Smarter.<br />
            Organize <span className="text-[#00CEC8]">Better</span>.
          </h1>
          <p className="text-white/60 leading-relaxed text-lg">
            Your current semester study load at a glance. Easily renew for the next term, 
            view your subjects, and dive into notes or flashcards — all in one place.
          </p>
          
          <div className="flex items-center gap-3 text-[#00CEC8] font-medium">
             <span className="p-2 bg-white/5 rounded-lg">📅</span>
             <p className="text-sm">Current Study Load: <span className="font-bold underline">3rd Year - 1st Semester</span></p>
          </div>

          <div className="pt-8 border-l border-white/20 pl-8">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Upload / Renew Study Load</p>
            <button className="bg-white text-black font-bold px-10 py-3 rounded-xl hover:bg-gray-200 transition-all">
              Upload
            </button>
            <p className="text-xs text-white/40 mt-4 italic">Ready for upload after semester ends.</p>
          </div>
        </div>

        {/* Right Scrollable Cards */}
        <div className="lg:w-2/3 flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          <CourseCard id="19174" title="Programming Languages" mastery={90} color="bg-purple-400" />
          <CourseCard id="19208" title="Human Computer Interaction" mastery={98} color="bg-green-500" />
          <CourseCard id="19158" title="Information Management" mastery={65} color="bg-[#00CEC8]" />
        </div>
      </div>
    </div>
  )
}

export default CoursePage