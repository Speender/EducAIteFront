import { useState } from 'react'; // 1. Added useState
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/educAIte-logo.svg';
import AImpatin from '../../../assets/robot.svg';
import { QuizScoreModal } from '../components/QuizScoreModal'; // 2. Import the modal

export function CodeLearnPage() {
  const navigate = useNavigate();
  
  // 3. State to control modal
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black px-8 py-10 text-white font-sans antialiased flex flex-col relative overflow-hidden">
      
      {/* HEADER ROW */}
      <header className="flex items-center gap-6 mb-16 max-w-[1400px] mx-auto w-full z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="educAIte" className="h-7 opacity-90" />
      </header>

      <main className="flex-1 flex flex-col items-center w-full z-10 max-w-[1000px] mx-auto">
        
        {/* PAGE TITLE & SUBMIT BUTTON ROW */}
        <div className="w-full flex items-center justify-between mb-12">
          <div className="w-[120px]"></div> 
          
          <div className="text-center">
            <h1 className="text-[32px] md:text-[38px] font-medium tracking-wide text-white/90">
              Midterm exam for Database
            </h1>
            <div className="h-[2px] w-20 bg-[#00CEC8]/60 mx-auto mt-3 rounded-full"></div>
          </div>
          
          <div className="w-[120px] flex justify-end">
            {/* 4. UPDATED SUBMIT BUTTON */}
            <button 
              onClick={() => setIsScoreModalOpen(true)}
              className="bg-white text-black font-semibold text-[13px] px-7 py-2.5 rounded-full hover:scale-105 transition-all shadow-md uppercase tracking-wider"
            >
              Submit
            </button>
          </div>
        </div>

        {/* --- MAIN CODE FLASHCARD --- */}
        <div className="relative w-full rounded-[40px] bg-[#272365] px-10 py-20 md:px-16 md:py-24 flex flex-col items-center justify-center shadow-[0_0_70px_rgba(0,0,0,0.4)] border border-white/5 transition-all">
          <h2 className="text-2xl font-medium mb-8 text-white/60 tracking-widest uppercase">Code Section</h2>
          <p className="max-w-3xl text-[28px] md:text-[34px] leading-[1.4] font-normal text-center mb-14 text-white/95">
            Given a positive integer <span className="text-[#00CEC8] font-mono italic">millis</span>, write an asynchronous function that sleeps for millis milliseconds. It can resolve any value.
          </p>
          <div className="flex flex-col items-center gap-5">
            <p className="text-[13px] text-white/40 font-medium tracking-wide uppercase">Click to begin and explore</p>
            <button 
              onClick={() => navigate('/code-challenge')}
              className="rounded-full bg-white px-12 py-4 text-black font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all w-[260px]"
            >
              Get started
            </button>
          </div>
        </div>

        {/* NAVIGATION CONTROLS omitted for brevity - same as your previous code */}
        {/* ... */}
        
      </main>

      {/* 5. RENDER MODAL */}
      {isScoreModalOpen && (
        <QuizScoreModal 
            score={85} // Pass a number from 0-100 for the gauge
            message="You've mastered the Database Midterm! Your detailed performance breakdown is now ready for review."
            onClose={() => setIsScoreModalOpen(false)} 
        />
       )}

      {/* Floating Robot */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="w-14 h-14 rounded-full border border-white/10 bg-[#050505] flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 transition-all shadow-xl">
          <img src={AImpatin} alt="bot" className="w-8 h-8 opacity-80" />
        </div>
      </div>
      
    </div>
  );
}
