import React from 'react'
import { motion } from 'framer-motion' 

const SummaryCards = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }}    
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 w-full"
    >
      
      {/* Card 1 */}
      <div className="border border-white/20 rounded-2xl p-4 lg:p-6 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <h3 className="text-[#00CEC8] text-3xl lg:text-4xl font-bold mb-1 group-hover:drop-shadow-[0_0_10px_rgba(0,206,200,0.8)] transition-all">
          125
        </h3>
        <p className="text-white/80 group-hover:text-white text-base lg:text-lg transition-colors font-medium">
          Total Sessions
        </p>
      </div>
      
      {/* Card 2 */}
      <div className="border border-white/20 rounded-2xl p-4 lg:p-6 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <h3 className="text-[#00CEC8] text-3xl lg:text-4xl font-bold mb-1 group-hover:drop-shadow-[0_0_10px_rgba(0,206,200,0.8)] transition-all">
          100h
        </h3>
        <p className="text-white/80 group-hover:text-white text-base lg:text-lg transition-colors font-medium">
          Total Hours
        </p>
      </div>
      
      {/* Card 3 */}
      <div className="border border-white/20 rounded-2xl p-4 lg:p-6 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <h3 className="text-[#00CEC8] text-3xl lg:text-4xl font-bold mb-1 group-hover:drop-shadow-[0_0_10px_rgba(0,206,200,0.8)] transition-all">
          6
        </h3>
        <p className="text-white/80 group-hover:text-white text-base lg:text-lg transition-colors font-medium">
          Subjects
        </p>
      </div>
    </motion.div>
  )
}

export default SummaryCards