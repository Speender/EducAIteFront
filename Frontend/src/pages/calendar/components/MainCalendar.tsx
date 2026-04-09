import React from 'react';
import { motion } from 'framer-motion'; 

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
    
    const weekDaysMobile = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const weekDaysLaptop = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const items = events.map(item => {
        const [y, m, d] = item.date.split('-');
        return {
            ...item,
            day: Number(d),
            month: Number(m) - 1,
            year: Number(y)
        };
    });

    let firstDayOfMonth = new Date(year, month, 1).getDay() - 1;
    if (firstDayOfMonth === -1) firstDayOfMonth = 6; 

    return (
        <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="bg-[#111111] rounded-xl lg:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-[1.5px] border-white/20 overflow-hidden w-full"
        >
            <div className="grid grid-cols-7 border-b-[1.5px] border-white/20 bg-black/50">
                {weekDaysLaptop.map((day, i) => (
                    <div key={day} className={`py-2 lg:py-4 text-center text-[10px] lg:text-[0.8rem] font-bold text-white/50 uppercase tracking-widest ${i < 6 ? 'border-r-[1.5px] border-white/20' : ''}`}>
                        <span className="lg:hidden">{weekDaysMobile[i]}</span>
                        <span className="hidden lg:inline">{day}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[85px] sm:auto-rows-[100px] lg:auto-rows-[140px]">
                {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} className="border-r-[1.5px] border-b-[1.5px] border-white/20 bg-[#1A1A1A]/50" />
                ))}

                {days.map(day => {
                    const isHighlighted = hYear === year && hMonth === month && hDay === day;

                    return (
                        <div key={day} 
                            className={`border-r-[1.5px] border-b-[1.5px] border-white/20 p-1 lg:p-2 transition-all group cursor-pointer relative flex flex-col overflow-hidden
                             ${isHighlighted ? 'bg-[#00CEC8]/20 ring-1 lg:ring-2 ring-inset ring-[#00CEC8] z-10' : 'hover:bg-[#00CEC8]/10'}`}>

                            <span className={`text-xs lg:text-sm font-bold transition-colors p-1 text-right lg:text-left
                                ${isHighlighted ? 'text-[#00CEC8]' : 'text-white/80 group-hover:text-[#00CEC8]'}`}>
                                {day}
                            </span>

                            <div className="mt-0.5 lg:mt-1 space-y-1 lg:space-y-1.5 overflow-y-auto max-h-[60px] sm:max-h-[70px] lg:max-h-[90px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {items
                                    .filter(item => item.day === day && item.month === month && item.year === year)
                                    .map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-[8px] sm:text-[9px] lg:text-[11px] px-1 lg:px-2 py-0.5 lg:py-1.5 rounded-sm lg:rounded-md font-bold border truncate transition-transform hover:scale-[1.02] 
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