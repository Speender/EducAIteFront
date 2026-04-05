import React from 'react'
import { NavLink, useLocation } from 'react-router-dom' 
import { motion } from 'framer-motion' 
import settingIcon from '../assets/setting-navbar.svg'

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/main' }, 
    { name: 'Courses', path: '/courses' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Tracker', path: '/tracker' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Resume', path: '/resume' },
  ]

  const isFlashcardRoute = (path: string, itemName: string) => {
    if (itemName === 'Flashcards') {
      const flashcardRelatedPaths = ['/flashcards', '/cards', '/create-card', '/learn', '/code-learn', '/code-challenge', '/performance'];
      return flashcardRelatedPaths.some(p => location.pathname.startsWith(p));
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }} 
      /* Adjusted padding for mobile screens */
      className="flex justify-center pt-20 md:pt-8 fixed w-full z-50 pointer-events-none px-4"
    >
      <nav className="
        flex items-center 
        bg-black/60 backdrop-blur-xl 
        border-[1.5px] border-white/20 
        px-6 md:px-8 py-3 
        rounded-full gap-6 md:gap-8 
        shadow-[0_8px_30px_rgba(0,0,0,0.5)] 
        pointer-events-auto
        /* Mobile horizontal scroll logic */
        max-w-full overflow-x-auto no-scrollbar
      ">
        
        {navItems.map((item) => {
          const active = isFlashcardRoute(item.path, item.name);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              /* whitespace-nowrap prevents text wrapping during scroll */
              className={`relative group text-xs md:text-sm transition-all pb-1 whitespace-nowrap ${
                active ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
              
              <motion.span 
                layoutId="underline" /* Framer Motion magic for smooth underline sliding */
                className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  active 
                    ? 'w-full bg-[#00CEC8] shadow-[0_0_10px_rgba(0,206,200,0.8)]' 
                    : 'w-0 bg-white/20 group-hover:w-full'
                }`} 
              />
            </NavLink>
          );
        })}

        <NavLink 
          to="/settings" 
          className="relative group flex items-center justify-center transition-all pb-1 shrink-0"
        >
          {({ isActive }) => (
            <>
              <img 
                src={settingIcon} 
                alt="Settings" 
                className={`w-4 h-4 md:w-5 md:h-5 brightness-0 invert transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
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

export default Navbar;