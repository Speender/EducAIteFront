import React from 'react'

const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border border-white/20 rounded-2xl p-6">
        <h3 className="text-[#00CEC8] text-4xl font-bold mb-1">125</h3>
        <p className="text-white text-lg">Total Sessions</p>
      </div>
      <div className="border border-white/20 rounded-2xl p-6">
        <h3 className="text-[#00CEC8] text-4xl font-bold mb-1">100h</h3>
        <p className="text-white text-lg">Total Hours</p>
      </div>
      <div className="border border-white/20 rounded-2xl p-6">
        <h3 className="text-[#00CEC8] text-4xl font-bold mb-1">6</h3>
        <p className="text-white text-lg">Subjects</p>
      </div>
    </div>
  )
}

export default SummaryCards