import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION
import ForgotForm from './ForgotForm'; 
import robotImage from '../../../../assets/robot.svg'; 

const ForgotHeader = () => {
  return (
    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-[1300px] mx-auto flex-1 px-6 lg:px-12 gap-12 lg:gap-24 xl:gap-40 pb-20">
      
      {/* --- LEFT SIDE: Welcome Text & Mascot (Now with slide-in animation!) --- */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
        animate={{ opacity: 1, x: 0 }}    // Slides into its original position (0)
        transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
        // Kept your original layout classes here so it doesn't break the grid!
        className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg shrink-0 pt-10 lg:pt-0"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          No Worries...
        </h1>
        <p className="text-lg text-white/80 mb-12 lg:pr-8">
          Our <span className="text-[#00CEC8] font-bold">Forgot Password</span> tool securely verifies your identity to restore your access instantly.
        </p>
        
        {/* Floating Robot Image */}
        <div className="animate-[bounce_4s_infinite] drop-shadow-[0_0_30px_rgba(0,206,200,0.15)] ml-0 lg:ml-12">
          <img src={robotImage} alt="AI Assistant" className="w-48 lg:w-[280px] object-contain" />
        </div>
      </motion.div>

      {/* Right Side: Embedded Form Component */}
      <div className="w-full flex justify-center lg:justify-start">
        <ForgotForm />
      </div>

    </div>
  );
};

export default ForgotHeader;