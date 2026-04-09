import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    data: any[]
}

const Table = ({ data }: Props) => {
    const hasData = data && data.length > 0;
    const len = hasData ? data.length : 1; 

    const totalUnits = (data.reduce((acc, item) => acc + item.units, 0)).toFixed(0);
    const midtermAvg = (data.reduce((acc, item) => acc + item.midtermGrade, 0) / len).toFixed(2);
    const finalAvg = (data.reduce((acc, item) => acc + item.finalGrade, 0) / len).toFixed(2);
    const gwaAvg = (data.reduce((acc, item) => acc + ((item.midtermGrade + item.finalGrade) * 0.5), 0) / len).toFixed(2);
    
    let potentialHonor = "";
    if(hasData) {
        if(parseFloat(gwaAvg) <= 1.1) {
            potentialHonor = "SUMMA CUM LAUDE"
        } else if(parseFloat(gwaAvg) <= 1.25) {
            potentialHonor = "MAGNA CUM LAUDE"
        } else if(parseFloat(gwaAvg) <= 1.35) {
            potentialHonor = "CUM LAUDE"
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="w-full bg-[#111111] rounded-xl lg:rounded-3xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden"
        >
            <table className="w-full text-left border-collapse table-fixed lg:table-auto">
                <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="w-[28%] lg:w-auto px-2 py-3 lg:px-6 lg:py-5 text-[9px] sm:text-[10px] lg:text-xs font-bold text-white/40 uppercase tracking-tighter lg:tracking-wider leading-tight">Course</th>
                        <th className="w-[12%] lg:w-auto px-1 py-3 lg:px-6 lg:py-5 text-[8px] sm:text-[10px] lg:text-xs font-bold text-white/40 uppercase tracking-tighter lg:tracking-wider text-center lg:text-left">Units</th>
                        <th className="w-[15%] lg:w-auto px-1 py-3 lg:px-6 lg:py-5 text-[8px] sm:text-[10px] lg:text-xs font-bold text-white/40 uppercase tracking-tighter lg:tracking-wider text-center lg:text-left">Midterm <span className="hidden lg:inline">Grade</span></th>
                        <th className="w-[15%] lg:w-auto px-1 py-3 lg:px-6 lg:py-5 text-[8px] sm:text-[10px] lg:text-xs font-bold text-white/40 uppercase tracking-tighter lg:tracking-wider text-center lg:text-left">Final <span className="hidden lg:inline">Grade</span></th>
                        <th className="w-[12%] lg:w-auto px-1 py-3 lg:px-6 lg:py-5 text-[8px] sm:text-[10px] lg:text-xs font-bold text-white/40 uppercase tracking-tighter lg:tracking-wider text-[#00CEC8] text-center lg:text-left">GWA</th>
                        <th className="w-[18%] lg:w-auto px-1 py-3 lg:px-6 lg:py-5 text-[8px] sm:text-[10px] lg:text-xs font-bold text-white/40 uppercase tracking-tighter lg:tracking-wider text-center lg:text-left">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {!hasData ? (
                        <tr>
                            <td colSpan={6} className="px-2 py-8 lg:px-6 lg:py-12 text-center text-white/40 italic text-[10px] lg:text-base">
                                No courses registered for this semester yet.
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-2 py-3 lg:px-6 lg:py-5 text-[10px] sm:text-xs lg:text-base text-white/90 font-medium break-words leading-tight">{item.course}</td>
                                <td className="px-1 py-3 lg:px-6 lg:py-5 text-[10px] sm:text-xs lg:text-base text-white/70 text-center lg:text-left">{item.units}</td>
                                <td className="px-1 py-3 lg:px-6 lg:py-5 text-[10px] sm:text-xs lg:text-base text-white/70 text-center lg:text-left">{item.midtermGrade.toFixed(1)}</td>
                                <td className="px-1 py-3 lg:px-6 lg:py-5 text-[10px] sm:text-xs lg:text-base text-white/70 text-center lg:text-left">{item.finalGrade.toFixed(1)}</td>
                                <td className="px-1 py-3 lg:px-6 lg:py-5 text-[10px] sm:text-xs lg:text-base text-white font-bold text-center lg:text-left">{((item.midtermGrade + item.finalGrade) * 0.5).toFixed(2)}</td>
                                <td className="px-1 py-3 lg:px-6 lg:py-5 text-[10px] sm:text-xs lg:text-base text-white/70 text-center lg:text-left">{item.finalRemarks || "-"}</td>
                            </tr>
                        ))
                    )}
                    
                    {/* TOTALS ROW */}
                    {hasData && (
                        <tr className="bg-[#00CEC8]/10 border-t border-[#00CEC8]/30">
                            <td className="px-2 py-3 lg:px-6 lg:py-5 font-bold text-[#00CEC8] uppercase text-[9px] sm:text-[10px] lg:text-sm tracking-tighter lg:tracking-wider leading-tight">Avg</td>
                            <td className="px-1 py-3 lg:px-6 lg:py-5 font-bold text-white text-[10px] sm:text-xs lg:text-base text-center lg:text-left">{totalUnits}</td>
                            <td className="px-1 py-3 lg:px-6 lg:py-5 font-bold text-white text-[10px] sm:text-xs lg:text-base text-center lg:text-left">{midtermAvg}</td>
                            <td className="px-1 py-3 lg:px-6 lg:py-5 font-bold text-white text-[10px] sm:text-xs lg:text-base text-center lg:text-left">{finalAvg}</td>
                            <td className="px-1 py-3 lg:px-6 lg:py-5 font-extrabold text-[#00CEC8] text-[11px] sm:text-xs lg:text-lg text-center lg:text-left">{gwaAvg}</td>
                            <td className="px-1 py-3 lg:px-6 lg:py-5 font-bold text-yellow-400 tracking-tighter lg:tracking-wide text-[8px] sm:text-[9px] lg:text-sm text-center lg:text-left leading-tight break-words">{potentialHonor}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </motion.div>
    );
};

export default Table;