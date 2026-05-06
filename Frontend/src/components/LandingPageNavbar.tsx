import React, { useState } from 'react';

const LandingPageNavbar = () => {
  // State to track which link is currently clicked so it turns white and bold
  const [activeItem, setActiveItem] = useState('Home');

  const navItems = [
    { name: 'Home', path: '#home' },
    { name: 'Features', path: '#features' },
    { name: 'About', path: '#about' },
    { name: 'Contact', path: '#contact' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string, name: string) => {
    e.preventDefault(); // Prevent default instant jump
    setActiveItem(name);
    
    // If Home, scroll to the absolute top of the page
    if (path === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Find the component with the matching ID and scroll to it
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="flex justify-center pt-8 fixed w-full z-[100] pointer-events-none">
      <nav className="flex items-center bg-black/50 backdrop-blur-md border-[1.5px] border-white/20 px-12 py-4 rounded-full gap-10 shadow-[0_10px_40px_rgba(255,255,255,0.4)] pointer-events-auto">
        
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            onClick={(e) => handleScroll(e, item.path, item.name)}
            className={`text-[15px] transition-colors cursor-pointer rounded-full px-1.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEC8]/60 ${
              activeItem === item.name ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.name}
          </a>
        ))}
        
      </nav>
    </header>
  );
};

export default LandingPageNavbar;
