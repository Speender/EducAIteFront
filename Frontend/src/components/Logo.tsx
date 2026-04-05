import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/educAIte-logo.svg'; 

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="fixed top-6 left-6 md:top-10 md:left-12 z-[100] cursor-pointer hover:scale-105 transition-transform active:scale-95"
      onClick={() => navigate('/main')}
      title="Go to Dashboard"
    >
      <img src={logo} alt="educAIte" className="h-8 md:h-10 w-auto" />
    </div>
  );
};

export default Logo;