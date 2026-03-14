import React from 'react'

const AnalyticsHeader = () => {
  return (
    <div className="flex items-center w-full py-8 text-white bg-black">
      {/* Left Group: Date & Buttons */}
      <div className="flex items-center gap-6 shrink-0">
        {/* The Circle */}
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-3xl font-semibold shrink-0">
          4
        </div>
        
        {/* Date Text */}
        <div className="text-sm leading-tight text-white/90 shrink-0">
          <p>Tue,</p>
          <p>November</p>
        </div>

        {/* The Pill Button - added more horizontal padding */}
        <button className="bg-white text-black text-[10px] font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition whitespace-nowrap shrink-0">
          Show my Progress &rarr;
        </button>

        {/* Calendar Icon Button */}
        <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition shrink-0">
          <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* THE DISTANCE: ml-16 creates that specific gap between the buttons and greeting */}
      <div className="flex flex-col ml-16 min-w-0">
        <h1 className="text-4xl font-bold whitespace-nowrap">
          Hey, <span className="text-[#00CEC8]">Christian</span> 👋
        </h1>
        <p className="text-white/40 text-lg mt-1 whitespace-nowrap">
          Here's your performance summary this week!
        </p>
      </div>
    </div>
  )
}

export default AnalyticsHeader