import React, { useEffect, useState, type JSX } from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION
import MonthYearSelector from './MonthYearSelector';

interface Props {
    month: number;
    year: number;
    day: number;
    onDateChange: (newMonth: number, newYear: number) => void;
}

const SecondaryCalendar = ({ month, year, day, onDateChange }: Props) => {
    const [date, setDate] = useState<Date>(new Date(year, month, 1));

    useEffect(() => {
        setDate(new Date(year, month, 1));
    }, [month, year, day]);

    const handleDateChange = (newMonth: number, newYear: number) => {
        const newDate = new Date(newYear, newMonth, 1);
        setDate(newDate);
        onDateChange(newDate.getMonth(), newDate.getFullYear());
    }

    const goToPreviousMonth = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        setDate(newDate);
        onDateChange(newDate.getMonth(), newDate.getFullYear());
    };

    const goToNextMonth = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setDate(newDate);
        onDateChange(newDate.getMonth(), newDate.getFullYear());
    };

    const renderDays = () => {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const days: JSX.Element[] = [];
    
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }
    
        const today = new Date();
        const todayDate = today.getDate();
    
        for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
            const isToday = dayNumber === todayDate && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
            days.push(
                <div
                    key={dayNumber}
                    // CHANGED: Added hover:bg-[#00CEC8]/15 and hover:text-[#00CEC8] to the non-active days
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer 
                    ${isToday 
                        ? 'bg-[#00CEC8] text-black font-bold shadow-[0_0_10px_rgba(0,206,200,0.4)] hover:bg-[#00CEC8]/90' 
                        : 'text-white/80 hover:bg-[#00CEC8]/15 hover:text-[#00CEC8]'
                    }`}
                >
                    {dayNumber}
                </div>
            );
        }
        return days;
    };

    return (
        // --- CONVERTED TO MOTION.DIV WITH SLIDE-IN FROM RIGHT ANIMATION ---
        <motion.div 
            initial={{ opacity: 0, x: 100 }} // Starts invisible and 100px to the right
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="bg-[#111111] text-white p-5 rounded-2xl border-[1.5px] border-white/20 shadow-lg"
        >
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-white text-lg">
                    {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </span>
                <div className="flex gap-4 text-white/50">
                    <button onClick={goToPreviousMonth} className="hover:text-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button onClick={goToNextMonth} className="hover:text-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                 {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                     <span key={d} className="text-white/40 text-xs font-bold">{d}</span>
                 ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {renderDays()}
            </div>
        </motion.div>
    );
};

export default SecondaryCalendar;