import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

interface Props {
    onClick: () => void
}

const AddEvent = ({onClick}: Props) => {
    return (
        // --- WRAPPER: Handles the slide-in animation without breaking Tailwind hovers ---
        <motion.div
            initial={{ opacity: 0, x: 50 }} // Starts invisible and 50px to the right
            animate={{ opacity: 1, x: 0 }}    // Slides into its original position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
        >
            <button
                className="bg-white text-black font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-transform"
                onClick={onClick}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                </svg>
                Add event
            </button>
        </motion.div>
    );
};

export default AddEvent;