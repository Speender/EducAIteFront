import React from 'react';
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION

interface Props {
    events: any[]
}

const UpcomingEvents = ({ events }: Props) => {
    // Sort events to show upcoming first and limit to next 4 for UI neatness
    const sortedEvents = [...events]
        .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4);

    return (
        // --- CONVERTED TO MOTION.DIV WITH SLIDE-UP ANIMATION ---
        <motion.div 
            initial={{ opacity: 0, y: 50 }} // Starts invisible and 50px below
            animate={{ opacity: 1, y: 0 }}    // Slides up into its original position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth 0.6s slide
            className="bg-[#111111] border-[1.5px] border-white/20 rounded-2xl p-6 shadow-lg flex-1"
        >
            <h3 className="text-lg font-bold text-white mb-6">Upcoming Events</h3>
            
            <div className="flex flex-col gap-4">
                {sortedEvents.length === 0 ? (
                    <p className="text-white/40 text-sm italic">No upcoming events.</p>
                ) : (
                    sortedEvents.map((event, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                            <svg className="mt-0.5 text-[#00CEC8] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                            <div className="flex flex-col text-sm">
                                <span className="text-white/50 font-medium text-[0.8rem] mb-0.5">{convertDate(event.date)}</span>
                                <span className="text-white/90 font-bold">{event.title}</span>
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