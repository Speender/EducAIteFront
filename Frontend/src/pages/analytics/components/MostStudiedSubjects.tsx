import React from 'react'
import { motion } from 'framer-motion' 

const MostStudiedSubjects = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}  
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col flex-1"
    >
      <div className="h-full border border-white/20 rounded-[32px] p-8 flex-1 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <h2 className="text-2xl mb-8 font-bold">
          This Month's Most Studied <span className="text-[#00CEC8]">Subjects</span>
        </h2>
        
        <div className="space-y-6">
          {/* Progress Bars */}
          {[85, 75, 35, 65, 80, 60].map((percentage, index) => (
            <div key={index}>
              <p className="mb-2 text-sm text-white/80 group-hover:text-white transition-colors">Human Computer Interaction</p>
              <div className="h-3.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00796B] group-hover:bg-[#00CEC8] rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default MostStudiedSubjects