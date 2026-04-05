import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

interface Props {
    events: any[],
    month: number,
    year: number,
    highlightedDate?: string | null
}

const MainCalendar = ({ events, month, year, highlightedDate }: Props) => {
    const highlightParts = highlightedDate ? highlightedDate.split('-').map(Number) : null;
    const hYear = highlightParts ? highlightParts[0] : null;
    const hMonth = highlightParts ? highlightParts[1] - 1 : null;
    const hDay = highlightParts ? highlightParts[2] : null;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const items = events.map(item => {
        const [y, m, d] = item.date.split('-');
        return {
            ...item,
            day: Number(d),
            month: Number(m) - 1,
            year: Number(y)
        };
    });

    // Start on Monday
    let firstDayOfMonth = new Date(year, month, 1).getDay() - 1;
    if (firstDayOfMonth === -1) firstDayOfMonth = 6; 

    return (
        // --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM LEFT ANIMATION ---
        <motion.div 
            initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
            animate={{ opacity: 1, x: 0 }}    // Slides smoothly into its original position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="bg-[#111111] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-[1.5px] border-white/20 overflow-hidden w-full"
        >
            <div className="grid grid-cols-7 border-b-[1.5px] border-white/20 bg-black/50">
                {weekDays.map((day, i) => (
                    <div key={day} className={`py-4 text-center text-[0.8rem] font-bold text-white/50 uppercase tracking-widest ${i < 6 ? 'border-r-[1.5px] border-white/20' : ''}`}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[120px] md:auto-rows-[140px]">
                {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} className="border-r-[1.5px] border-b-[1.5px] border-white/20 bg-[#1A1A1A]/50" />
                ))}

                {days.map(day => {
                    const isHighlighted = hYear === year && hMonth === month && hDay === day;

                    return (
                        <div key={day} 
                            className={`border-r-[1.5px] border-b-[1.5px] border-white/20 p-2 transition-all group cursor-pointer relative flex flex-col
                             ${isHighlighted ? 'bg-[#00CEC8]/20 ring-2 ring-inset ring-[#00CEC8] z-10' : 'hover:bg-[#00CEC8]/10'}`}>

                            <span className={`text-sm font-bold transition-colors p-1
                                ${isHighlighted ? 'text-[#00CEC8]' : 'text-white/80 group-hover:text-[#00CEC8]'}`}>
                                {day}
                            </span>

                            <div className="mt-1 space-y-1.5 overflow-y-auto max-h-[90px] no-scrollbar">
                                {items
                                    .filter(item => item.day === day && item.month === month && item.year === year)
                                    .map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-[10px] md:text-[11px] px-2 py-1.5 rounded-md font-bold border truncate transition-transform hover:scale-[1.02] 
                                            ${item.eventType === 'note' ? 'bg-white/10 text-white border-white/20' : 'bg-[#00CEC8]/15 text-[#00CEC8] border-[#00CEC8]/30'} 
                                            ${isHighlighted ? 'animate-pulse' : ''}`}
                                        >
                                            {item.title}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default MainCalendar;