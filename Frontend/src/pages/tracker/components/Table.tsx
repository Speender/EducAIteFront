import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

interface Props {
    data: any[]
}

const Table = ({ data }: Props) => {
    // SAFE MATH: Prevent dividing by zero if a semester has 0 courses
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
        // --- CONVERTED TO MOTION.DIV WITH SLIDE-UP ANIMATION ---
        <motion.div 
            initial={{ opacity: 0, y: 50 }} // Starts invisible and 50px below
            animate={{ opacity: 1, y: 0 }}    // Slides up into its original position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="w-full overflow-x-auto bg-[#111111] rounded-3xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        >
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-wider">Units</th>
                        <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-wider">Midterm Grade</th>
                        <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-wider">Final Grade</th>
                        <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-wider text-[#00CEC8]">GWA</th>
                        <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-wider">Final Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {!hasData ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-white/40 italic">
                                No courses registered for this semester yet.
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-5 text-white/90 font-medium">{item.course}</td>
                                <td className="px-6 py-5 text-white/70">{item.units}</td>
                                <td className="px-6 py-5 text-white/70">{item.midtermGrade.toFixed(1)}</td>
                                <td className="px-6 py-5 text-white/70">{item.finalGrade.toFixed(1)}</td>
                                <td className="px-6 py-5 text-white font-bold">{((item.midtermGrade + item.finalGrade) * 0.5).toFixed(2)}</td>
                                <td className="px-6 py-5 text-white/70">{item.finalRemarks || "-"}</td>
                            </tr>
                        ))
                    )}
                    
                    {/* TOTALS ROW */}
                    {hasData && (
                        <tr className="bg-[#00CEC8]/10 border-t border-[#00CEC8]/30">
                            <td className="px-6 py-5 font-bold text-[#00CEC8] uppercase text-sm tracking-wider">Averages</td>
                            <td className="px-6 py-5 font-bold text-white">{totalUnits}</td>
                            <td className="px-6 py-5 font-bold text-white">{midtermAvg}</td>
                            <td className="px-6 py-5 font-bold text-white">{finalAvg}</td>
                            <td className="px-6 py-5 font-extrabold text-[#00CEC8] text-lg">{gwaAvg}</td>
                            <td className="px-6 py-5 font-bold text-yellow-400 tracking-wide">{potentialHonor}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </motion.div>
    );
};

export default Table;