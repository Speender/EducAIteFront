import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    name: string,
    semester: string
}

const Header = ({ name, semester }: Props) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="flex flex-col min-w-0 items-center lg:items-start text-center lg:text-left w-full"
        >
            <h1 className="text-3xl lg:text-[2.75rem] font-bold tracking-tight text-white mb-1 lg:mb-2">
                Hey, <span className="text-[#00CEC8]">{name}</span> 👋
            </h1>
            <h2 className="text-white/50 text-sm lg:text-lg font-medium">
                Here's your current grade in <span className="text-white font-semibold block sm:inline mt-1 sm:mt-0">{semester}</span>
            </h2>
        </motion.div>
    )
}

export default Header;