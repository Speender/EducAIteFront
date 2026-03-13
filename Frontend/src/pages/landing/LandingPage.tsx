import React from 'react';

import LandingPageNavbar from '../../components/LandingPageNavbar';
import RobotImage from './../../assets/robot.svg';
import EarthImage from './../../assets/earthbg.svg';

import LightbulbIcon from './../../assets/lg-lightbulb.svg';
import CalculatorIcon from './../../assets/lg-calculator.svg';
import BooksIcon from './../../assets/lg-books.svg';
import BeakersIcon from './../../assets/lg-chemist.svg';
import GraduationCapIcon from './../../assets/lg-gradhat.svg';
import CalendarIcon from './../../assets/lg-calendar.svg';
import AtomIcon from './../../assets/lg-atom.svg';
import LaptopIcon from './../../assets/lg-laptop.svg';

const LandingPage = () => {
  return (
    <div className="h-screen w-full bg-black text-white font-sans overflow-hidden relative antialiased">
      
      {/* --- NAVIGATION BAR --- */}
      <LandingPageNavbar />

      {/* --- HERO TEXT SECTION --- */}
      {/* Nudged up slightly (top-[12vh]) so it is completely clear of the robot */}
      <div className="absolute top-[12vh] left-0 w-full flex flex-col items-center text-center px-4 z-50 pointer-events-none">
        <h1 className="text-[56px] font-bold tracking-tight mb-4 leading-tight">
          Empower your learning with <span className="text-[#00CEC8]">AI</span>
        </h1>
        <p className="text-white/80 text-lg max-w-3xl font-medium">
          Transform your notes, track your growth and learn smarter with the power of AI - where technology meets education.
        </p>
      </div>

      {/* --- THE SCENE CONTAINTER --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        
        {/* 1. Central Robot (z-20: Behind the Earth) */}
        {/* Pushed down to bottom-[18vh] to sink it behind the horizon */}
        <div className="absolute bottom-[18vh] left-1/2 -translate-x-1/2 w-[420px] z-20">
          <img 
            src={RobotImage} 
            alt="AI Robot" 
            className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
          />
        </div>

        {/* 2. Earth Background (z-30: In front of the Robot) */}
        {/* Increased height to 55vh so it covers more of the screen and overlaps the robot */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[55vh] bg-cover bg-[center_top] z-30"
          style={{ 
            backgroundImage: `url(${EarthImage})`,
            // If your Earth image has a harsh top edge instead of a transparent one, 
            // uncomment the mask below to smoothly fade the top of the Earth into the black background:
            // WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
          }}
        />

        {/* --- 3. LEFT SIDE ICONS --- */}
        <img 
          src={LightbulbIcon} 
          alt="Lightbulb" 
          className="absolute top-[28vh] left-[8vw] w-[140px] drop-shadow-2xl z-20" 
        />
        <img 
          src={BooksIcon} 
          alt="Books" 
          className="absolute top-[36vh] left-[28vw] w-[100px] z-10" 
        />
        <img 
          src={CalculatorIcon} 
          alt="Calculator" 
          className="absolute top-[48vh] left-[18vw] w-[110px] drop-shadow-2xl z-20" 
        />
        {/* Bottom icons need z-40 so the Earth doesn't hide them */}
        <img 
          src={BeakersIcon} 
          alt="Beakers" 
          className="absolute bottom-[25vh] left-[8vw] w-[90px] drop-shadow-xl z-40" 
        />

        {/* --- 4. RIGHT SIDE ICONS --- */}
        <img 
          src={GraduationCapIcon} 
          alt="Graduation Cap" 
          className="absolute top-[26vh] right-[5vw] w-[200px] drop-shadow-2xl z-20" 
        />
        <img 
          src={CalendarIcon} 
          alt="Calendar" 
          className="absolute top-[42vh] right-[24vw] w-[90px] z-10" 
        />
        {/* Bottom icons need z-40 so the Earth doesn't hide them */}
        <img 
          src={AtomIcon} 
          alt="Atom" 
          className="absolute bottom-[35vh] right-[30vw] w-[100px] z-40" 
        />
        <img 
          src={LaptopIcon} 
          alt="Laptop" 
          className="absolute bottom-[28vh] right-[10vw] w-[130px] drop-shadow-2xl z-40" 
        />
      </div>

      {/* --- CTA BUTTONS --- */}
      {/* z-50 ensures the buttons are always clickable above the Earth */}
      <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full max-w-[280px]">
        
        {/* Login Button */}
        <button className="w-full bg-white text-black font-semibold text-[15px] py-3.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform pointer-events-auto">
          Login
        </button>
        
        {/* Register Button */}
        <button className="w-full bg-black border border-white/20 text-white font-semibold text-[15px] py-3.5 rounded-full hover:bg-white/10 transition-colors pointer-events-auto">
          Register
        </button>

      </div>

    </div>
  );
};

export default LandingPage;