import React from 'react';
import { motion } from 'framer-motion'; 

interface Props {
    events: any[]
}

const UpcomingEvents = ({ events }: Props) => {
    const sortedEvents = [...events]
        .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }}    
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="bg-[#111111] border-[1.5px] border-white/20 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-lg flex-1 min-w-0 flex flex-col"
        >
            <h3 className="text-xs lg:text-lg font-bold text-white mb-3 lg:mb-6 truncate">Upcoming</h3>
            
            <div className="flex flex-col gap-2 lg:gap-4 overflow-y-auto no-scrollbar">
                {sortedEvents.length === 0 ? (
                    <p className="text-white/40 text-[9px] lg:text-sm italic">No upcoming events.</p>
                ) : (
                    sortedEvents.map((event, index) => (
                        <div key={index} className="flex items-start gap-2 lg:gap-4 pb-2 lg:pb-4 border-b border-white/10 last:border-0 last:pb-0">
                            <svg className="mt-0.5 lg:mt-1 text-[#00CEC8] shrink-0 w-3 h-3 lg:w-4 lg:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                            <div className="flex flex-col min-w-0">
                                <span className="text-white/50 font-medium text-[8px] lg:text-[0.8rem] mb-0.5 truncate">{convertDate(event.date)}</span>
                                <span className="text-white/90 font-bold text-[10px] lg:text-sm truncate">{event.title}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

function convertDate(dateStr: string) {
    const inputDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === today.getTime()) return 'Today';
    if (inputDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default UpcomingEvents;