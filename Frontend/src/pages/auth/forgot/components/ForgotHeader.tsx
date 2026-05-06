import { useNavigate } from 'react-router-dom';
import Logo from '../../../../components/Logo'

const ForgotHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-20 flex justify-between items-center w-full p-6 lg:px-12">
      <Logo />
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/login')}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors bg-black/50 backdrop-blur-md"
          aria-label="Go back to login"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>
      
      <button 
        onClick={() => navigate('/register')}
        className="bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      >
        Sign up
      </button>
    </div>
  );
};

export default ForgotHeader;
