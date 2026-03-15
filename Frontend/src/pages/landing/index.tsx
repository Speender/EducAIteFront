import React from 'react';
import LandingPageNavbar from '../../components/LandingPageNavbar';
import LandingPageContent from './components/LandingPage';
// 1. IMPORT THE NEW SECTION
import FeatureCarousel from './components/FeatureCarousel'; 

const LandingPage = () => {
  return (
    // 2. Changed h-screen (fixed) to min-h-screen (grows), and locked overflow-x only
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-x-hidden relative antialiased">
      
      {/* The Navigation Bar stays fixed at the top */}
      <LandingPageNavbar />

      {/* --- SECTION 1: HERO --- */}
      {/* We wrap the original content in an explicitly h-screen, relative container 
          so its absolute positioning logic still works flawlessly! */}
      <div className="relative w-full h-screen overflow-hidden">
        <LandingPageContent />
      </div>

      {/* --- SECTION 2: CAROUSEL --- */}
      {/* This sits right below the hero section, scrollable into view */}
      <FeatureCarousel />

    </div>
  );
};

export default LandingPage;