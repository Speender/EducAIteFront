import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

interface Props {
    month: number;
    year: number;
    onDateChange: (newMonth: number, newYear: number) => void;
}

const MonthYearSelector = ({ month, year, onDateChange }: Props) => {
    const inputValue = `${year}-${String(month + 1).padStart(2, '0')}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) return; 
        
        const [selectedYear, selectedMonth] = val.split('-');
        onDateChange(parseInt(selectedMonth) - 1, parseInt(selectedYear));
    };

    return (
        // --- CONVERTED TO MOTION.DIV WITH SLIDE-IN ANIMATION ---
        <motion.div 
            initial={{ opacity: 0, x: -50 }} // Starts invisible and 50px to the left
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="relative inline-flex items-center group cursor-pointer mb-2"
        >
            
            {/* Visual Display */}
            <div className="flex items-center gap-3 text-3xl font-bold text-white/90 group-hover:text-white transition-colors">
                <span>{months[month]} {year}</span>
                
                {/* Filled Dropdown Triangle */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover:text-white/80 transition-colors mt-1.5">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </div>

            {/* Invisible Trigger */}
            <input
                type="month"
                value={inputValue}
                onChange={handleChange}
                // THIS IS THE FIX: Forces the calendar to pop up when clicking anywhere on the element
                //todo: fix for firefox/safari
                onClick={(e) => {
                    if ('showPicker' in HTMLInputElement.prototype) {
                        try {
                            e.currentTarget.showPicker();
                        } catch (err) {
                            // Fallback for very old browsers
                        }
                    }
                }}
                style={{ colorScheme: 'dark' }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
        </motion.div>
    );
};

export default MonthYearSelector;