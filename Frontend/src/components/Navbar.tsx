import React from 'react'
import { NavLink, useLocation } from 'react-router-dom' // Added useLocation
import { motion } from 'framer-motion' // <-- IMPORT FRAMER MOTION
import settingIcon from '../assets/setting-navbar.svg'

const Navbar = () => {
  const location = useLocation(); // Get current path

  const navItems = [
    { name: 'Home', path: '/main' }, 
    { name: 'Courses', path: '/courses' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Tracker', path: '/tracker' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Resume', path: '/resume' },
  ]

  // Helper to determine if the Flashcards tab should be lit up
  const isFlashcardRoute = (path: string, itemName: string) => {
    if (itemName === 'Flashcards') {
      const flashcardRelatedPaths = [
        '/flashcards', 
        '/cards', 
        '/create-card', 
        '/learn', 
        '/code-learn', 
        '/code-challenge', 
        '/performance'
      ];
      return flashcardRelatedPaths.some(p => location.pathname.startsWith(p));
    }
    return location.pathname.startsWith(path);
  };

  return (
    // --- CONVERTED TO MOTION.HEADER WITH SLIDE-DOWN ANIMATION ---
    <motion.header 
      initial={{ opacity: 0, y: -50 }} // Starts transparent and 50px higher
      animate={{ opacity: 1, y: 0 }}   // Slides down to its natural position
      transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s drop
      className="flex justify-center pt-8 fixed w-full z-50 pointer-events-none"
    >
      <nav className="flex items-center bg-black/50 backdrop-blur-md border-[1.5px] border-white/20 px-8 py-3 rounded-full gap-8 shadow-[0_8px_30px_rgba(255,255,255,0.15)] pointer-events-auto">
        
        {navItems.map((item) => {
          // Calculate active state manually to include the floating root routes
          const active = isFlashcardRoute(item.path, item.name);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`relative group text-sm transition-all pb-1 ${
                active ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
              
              {/* Animated Underline */}
              <span 
                className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  active 
                    ? 'w-full bg-[#00CEC8] shadow-[0_0_10px_rgba(0,206,200,0.8)]' 
                    : 'w-0 bg-white/20 group-hover:w-full'
                }`} 
              />
            </NavLink>
          );
        })}

        {/* --- SETTING ICON CONTAINER --- */}
        <NavLink 
          to="/settings" 
          className={({ isActive }) =>
            `-ml-2 -mt-1 relative group flex items-center justify-center transition-all pb-1 -ml-4 mt-0.5`
          }
        >
          {({ isActive }) => (
            <>
              <img 
                src={settingIcon} 
                alt="Settings" 
                className={`w-5 h-5 brightness-0 invert transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                }`} 
              />
              <span 
                className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-full bg-[#00CEC8] shadow-[0_0_10px_rgba(0,206,200,0.8)]' 
                    : 'w-0 bg-white/20 group-hover:w-full'
                }`} 
              />
            </>
          )}
        </NavLink>
        
      </nav>
    </motion.header>
  )
}

export default Navbar