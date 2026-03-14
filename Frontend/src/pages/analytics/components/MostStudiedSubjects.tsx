import React from 'react'

const MostStudiedSubjects = () => {
  return (
    <div className="border border-white/20 rounded-[32px] p-8 flex-1">
      <h2 className="text-2xl mb-8">
        This Month's Most Studied <span className="text-[#00CEC8]">Subjects</span>
      </h2>
      
      <div className="space-y-6">
        {/* Progress Bars */}
        {[85, 75, 35, 65, 80, 60].map((percentage, index) => (
          <div key={index}>
            <p className="mb-2 text-sm">Human Computer Interaction</p>
            <div className="h-3.5 bg-[#cfd8dc] rounded-full overflow-hidden">
              <div className="h-full bg-[#00796B] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MostStudiedSubjects