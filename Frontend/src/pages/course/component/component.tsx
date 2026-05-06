import { useEffect, useRef, useState } from 'react';

interface SemesterDropdownOption {
  label: string;
  value: string;
}

interface SemesterDropdownProps {
  options: SemesterDropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SemesterDropdown = ({
  options,
  value,
  onChange,
  disabled = false,
}: SemesterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSelection = options.find((option) => option.value === value)?.label ?? 'Select a study load';

  return (
    <div className="relative inline-block w-full md:w-80 z-50" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled || options.length === 0}
        onClick={() => setIsOpen((current) => !current)}
        className={`w-full flex justify-between items-center bg-[#111111] text-white text-sm font-medium border-[1.5px] px-5 py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEC8]/50 ${
          disabled || options.length === 0
            ? 'cursor-not-allowed border-white/10 text-white/40'
            : isOpen
              ? 'border-[#00CEC8] shadow-[0_0_0_3px_rgba(0,206,200,0.15)]'
              : 'border-white/20 hover:bg-white/5'
        }`}
      >
        <span className="truncate">{currentSelection}</span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && !disabled && options.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#111111] border-[1.5px] border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
          <ul className="max-h-64 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {options.map((item) => (
              <li key={item.value}>
                <button
                  onClick={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                    item.value === value
                      ? 'bg-[#00CEC8]/10 text-[#00CEC8] font-bold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
