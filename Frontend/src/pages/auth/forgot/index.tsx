import ForgotHeader from './components/ForgotHeader';
import ForgotForm from './components/ForgotForm';

// Background assets
import robotImage from '../../../assets/robot.svg'; 
import earthBg from '../../../assets/earthbg.svg'; 

const ForgotPasswordPage = () => {
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

      {/* Embedded Top Navigation Component */}
      <ForgotHeader />

      {/* Main Content Area */}
      {/* CHANGED: Removed 'justify-between' and used 'justify-center' with a large gap (gap-24) to bring them closer without squishing */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-[1300px] mx-auto flex-1 px-6 lg:px-12 gap-12 lg:gap-24 xl:gap-40 pb-20">
        
        {/* Left Side: Welcome Text & Mascot */}
        {/* CHANGED: Added 'shrink-0' so this container is never allowed to be compressed by the form */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg shrink-0 pt-10 lg:pt-0">
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
        </div>

        {/* Right Side: Embedded Form Component */}
        {/* CHANGED: Removed the heavy margins. It now sits naturally based on the gap above. */}
        <div className="w-full flex justify-center lg:justify-start">
          <ForgotForm />
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
