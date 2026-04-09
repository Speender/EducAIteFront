import React from 'react';
import { motion } from 'framer-motion'; 

interface Props {
    onClick: () => void
}

const AddEvent = ({onClick}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}  
            transition={{ duration: 0.6, ease: "easeOut" }}
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