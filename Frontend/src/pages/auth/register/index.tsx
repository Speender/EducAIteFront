import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../../assets/logo.svg'; 
import earthBg from '../../../assets/earthbg.svg';
import RegisterHero from './components/RegisterHero';
import RegisterForm from './components/RegisterForm';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileErrorMessage, setFileErrorMessage] = React.useState<string | undefined>();

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col antialiased">
      
      {/* --- PAGE HEADER --- */}
      <header className="relative z-50 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-[36px] h-[36px] border-[1.5px] border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all hover:bg-white/10"
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

        {/* --- SIGN UP -> LOGIN BUTTON --- */}
        <button 
          onClick={() => navigate('/login')} 
          className="bg-white text-black rounded-xl px-7 py-2.5 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          Login
        </button>
      </header>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto flex flex-col md:flex-row items-center md:items-start justify-center px-6 md:px-12 lg:px-20 pt-10 md:pt-20 gap-10 md:gap-16 lg:gap-20 relative z-10">
        <RegisterHero
          selectedFile={selectedFile}
          onFileChange={(file) => {
            setSelectedFile(file);
            setFileErrorMessage(undefined);
          }}
          errorMessage={fileErrorMessage}
        />
        <RegisterForm
          selectedFile={selectedFile}
          onMissingFile={setFileErrorMessage}
          onFileAccepted={() => setFileErrorMessage(undefined)}
        />
      </main>

      {/* --- EARTH BACKGROUND --- */}
      <div className="absolute -bottom-[10vh] left-0 right-0 w-full z-0 pointer-events-none opacity-[0.15]">
        <img 
          src={earthBg} 
          alt="" 
          aria-hidden="true" 
          className="w-full h-auto object-cover mask-image-t" 
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)',
            maskImage: 'linear-gradient(to bottom, transparent, black 40%)'
          }}
        />
      </div>

    </div>
  );
};

export default Register;
