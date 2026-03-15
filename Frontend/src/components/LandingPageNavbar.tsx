import React from 'react';
import { NavLink } from 'react-router-dom';

const LandingPageNavbar = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="flex justify-center pt-8 fixed w-full z-50 pointer-events-none">
      
      <nav className="flex items-center bg-black/50 backdrop-blur-md border-[1.5px] border-white/20 px-12 py-4 rounded-full gap-10 shadow-[0_8px_30px_rgba(255,255,255,0.15)] pointer-events-auto">
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `text-[15px] transition-colors ${
                isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {item.name} 
          </NavLink>
        ))}
        
      </nav>
    </header>
  );
};

export default LandingPageNavbar;