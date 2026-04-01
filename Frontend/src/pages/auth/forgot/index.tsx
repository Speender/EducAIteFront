import React from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotHeader from './components/ForgotHeader';
import earthBg from '../../../assets/earthbg.svg'; 
import logoIcon from '../../../assets/logo.svg';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col">
      
      {/* Background Image (Earth/Space) with Gradient Fade */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[60vh] bg-cover bg-center bg-no-repeat opacity-60 pointer-events-none"
        style={{ 
          backgroundImage: `url(${earthBg})`,
          maskImage: 'linear-gradient(to bottom, transparent, black 40%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)'
        }}
      />

      {/* --- EXCHANGED TOP NAVIGATION AREA --- */}
      <header className="relative z-50 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-[40px] h-[40px] border-[1.5px] border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoIcon} alt="educAIte logo" className="w-[32px] h-[32px]" />
            <span className="text-[1.2rem] font-semibold text-white tracking-tight leading-tight">
              educ<span className="text-[#00CEC8] font-bold">AI</span>te
            </span>
          </div>
        </div>

        {/* --- SIGN UP BUTTON --- */}
        <button 
          onClick={() => navigate('/register')} 
          className="bg-white text-black rounded-xl px-7 py-2.5 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign up
        </button>
      </header>

      {/* --- EXCHANGED MAIN CONTENT AREA --- */}
      {/* This component now holds the text, robot, and form */}
      <ForgotHeader />

    </div>
  );
};

export default ForgotPasswordPage;