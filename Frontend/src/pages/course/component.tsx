import React from 'react'

export const SemesterDropdown = () => {
  return (
    <div className="relative inline-block">
      <select className="appearance-none bg-black border border-white/20 text-white text-sm rounded-xl px-6 py-3 pr-12 focus:outline-none focus:border-white/40 cursor-pointer">
        <option>3rd Year - First Semester</option>
        <option>3rd Year - Second Semester</option>
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    </div>
  )
}