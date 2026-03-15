import React from 'react';

// 1. IMPORT THE EARTH IMAGE directly
import EarthImage from '../../../assets/earthbg.svg';

const carouselItems = [
  { id: 1, bgColor: 'bg-[#FFADFA]', title: 'Magenta' },
  { id: 2, bgColor: 'bg-[#FFA5A5]', title: 'Coral' },
  { id: 3, bgColor: 'bg-[#82E6FF]', title: 'Cyan' },
  { id: 4, bgColor: 'bg-[#FFE282]', title: 'Yellow' },
];

const FeatureCarousel = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-black antialiased">
      
      {/* --- FULL PAGE ZOOMED EARTH BACKGROUND --- */}
      {/* inset-0 makes it fill the whole screen. 
          scale-[1.5] zooms it in by 150%. 
          opacity-40 keeps it subtle so it doesn't overpower your cards. */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 z-0 scale-[1.5] transition-transform duration-1000"
        style={{ 
          backgroundImage: `url(${EarthImage})` 
        }}
      />

      {/* --- HEADER TEXT BOX --- */}
      <div className="absolute top-0 left-0 bg-black pt-[12vh] pb-[6vh] px-[10vw] rounded-br-[6vw] z-30 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]">
        <h2 className="text-[32px] md:text-[44px] font-bold mb-4 tracking-tighter leading-tight">
          Get to know educ<span className="text-[#00CEC8]">AI</span>te
        </h2>
        <p className="text-white/70 text-base md:text-xl font-medium leading-relaxed">
          Discover the capabilities and efficiency we offer.
        </p>
      </div>

      {/* --- MASSIVE CAROUSEL CONTAINER --- */}
      <div className="relative z-20 w-full mt-[25vh] overflow-x-hidden">
        <div className="flex items-center gap-8 overflow-x-auto snap-x snap-mandatory px-[12.5vw] py-[5vh] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          {carouselItems.map((item) => (
            <div 
              key={item.id}
              className={`relative shrink-0 w-[75vw] max-w-[1200px] h-[55vh] min-h-[450px] rounded-[40px] snap-center shadow-2xl transition-transform duration-300 hover:scale-[1.02] cursor-pointer ${item.bgColor}`}
            >
              {/* <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-[40px]" /> */}
            </div>
          ))}

          {/* Spacer */}
          <div className="shrink-0 w-[5vw]"></div>
          
        </div>
      </div>

    </div>
  );
};

export default FeatureCarousel;