import React from 'react';
import robotImg from '../../../../assets/robot.svg';
import pdfIcon from '../../../../assets/PDF-Register.svg';

interface RegisterHeroProps {
  selectedFile: File | null;
  isParsing: boolean;
  isReviewed: boolean;
  onFileChange: (file: File | null) => void;
  errorMessage?: string;
}

const RegisterHero: React.FC<RegisterHeroProps> = ({
  selectedFile,
  isParsing,
  isReviewed,
  onFileChange,
  errorMessage,
}) => {
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const nextFile = input.files?.[0] ?? null;
    onFileChange(nextFile);
    input.value = "";
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center md:items-start max-w-[500px] text-center md:text-left mx-auto md:mx-0 order-2 md:order-1 relative">
      
      {/* Waving robot */}
      <img 
        src={robotImg} 
        alt="AI Robot" 
        className="w-[180px] h-auto drop-shadow-[0_8px_24px_rgba(0,206,200,0.15)] animate-float z-20 mb-[-30px]" 
      />

      {/* --- DRAG & DROP UPLOAD BOX --- */}
      <div className="w-full bg-[#111111] border-2 border-dashed border-white/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center relative z-10 transition-colors hover:border-[#00CEC8]">
        
        {/* PDF Icon and Upload Arrow */}
        <div className="relative mb-8">
          <img src={pdfIcon} alt="PDF file" className="w-20 h-auto" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          </div>
        </div>

        {/* Text Instructions */}
        <h2 className="text-[1.75rem] font-bold text-white tracking-tight mb-6">
          Drag & Drop
        </h2>
        <p className="text-sm text-white/80 leading-relaxed mb-1">
          Your study load Or Browse to upload
        </p>
        <p className="text-sm text-[#00CEC8] font-medium">
          Only PDF files with max size of 15MB.
        </p>

        {selectedFile ? (
          <div className="mt-6 rounded-2xl border border-[#00CEC8]/30 bg-[#00CEC8]/10 px-4 py-3 text-sm text-white/90">
            <p className="font-semibold text-[#7ef7f3]">
              {isParsing ? 'Parsing studyload...' : isReviewed ? 'Studyload reviewed' : 'Studyload ready'}
            </p>
            <p className="mt-1 break-all text-white/70">{selectedFile.name}</p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
            Upload your studyload PDF to finish registration.
          </div>
        )}

        {errorMessage ? (
          <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>
        ) : null}
        
        {/* Secondary description */}
        <p className="text-xs text-white/40 leading-relaxed mt-10 max-w-sm">
          Upload your study load and let our AI automatically scan and extract your subjects for faster registration.
        </p>

        {/* Hidden File Input */}
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileSelection}
          disabled={isParsing}
        />
      </div>

      {/* Inline animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default RegisterHero;
