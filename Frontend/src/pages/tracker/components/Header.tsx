import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

interface Props {
    name: string,
    semester: string
}

const Header = ({ name, semester }: Props) => {
    return (
        // --- CONVERTED TO MOTION.DIV WITH SLIDE-IN ANIMATION ---
        <motion.div 
            initial={{ opacity: 0, x: -100 }} // Starts invisible and 100px to the left
            animate={{ opacity: 1, x: 0 }}    // Slides smoothly into its original position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="flex flex-col min-w-0"
        >
            <h1 className="text-4xl md:text-[2.75rem] font-bold tracking-tight text-white mb-2">
                Hey, <span className="text-[#00CEC8]">{name}</span> 👋
            </h1>
            <h2 className="text-white/50 text-lg font-medium">
                Here's your current grade in <span className="text-white font-semibold">{semester}</span>
            </h2>
        </motion.div>
    )
}

export default Header;