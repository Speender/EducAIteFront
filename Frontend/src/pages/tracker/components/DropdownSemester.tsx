import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
    selections: string[],
    currentSelection: string,
    onSelectChange: (value: string) => void
}

const DropdownSemester = ({ selections, currentSelection, onSelectChange }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: string) => {
        onSelectChange(item);
        setIsOpen(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full lg:w-72 z-50" 
            ref={dropdownRef}
        >
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center bg-[#111111] text-white text-xs lg:text-sm font-medium border-[1.5px] px-4 lg:px-5 py-3 lg:py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-white/5 ${
                    isOpen ? 'border-[#00CEC8] shadow-[0_0_0_3px_rgba(0,206,200,0.15)]' : 'border-white/20'
                }`}
            >
                <span className="truncate">{currentSelection}</span>
                
                <svg 
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-white/50 transition-transform duration-300 w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ml-2 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                >
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-[#111111] border-[1.5px] border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="max-h-56 lg:max-h-64 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {selections.map((item, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => handleSelect(item)}
                                    className={`w-full text-left px-4 lg:px-5 py-2.5 lg:py-3 text-xs lg:text-sm transition-colors ${
                                        item === currentSelection 
                                            ? 'bg-[#00CEC8]/10 text-[#00CEC8] font-bold' 
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
}

export default DropdownSemester;