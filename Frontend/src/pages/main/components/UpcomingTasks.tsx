import React from 'react';
import Deadline from './Deadline';


interface Props {
    tasks: any[]
}


const UpcomingTasks = ({ tasks }: Props) => {
    return (
        <div className="bg-black border border-white rounded-3xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white"><span className="text-[#00CEC8]">Upcoming</span> Tasks</h2>
                    <p className="text-white/40 text-sm mt-1">You have {tasks.length} deadlines this week</p>
                </div>
                <OpenCalendarBtn /> {/* Ensure this button uses the w-12 h-12 rounded-full border-white/20 style */}
            </div>

            <div className="space-y-3">
                {tasks.map(task => (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-[#00CEC8]/30 transition-colors">
                        <Deadline date={task.date} task={task.task} />
                    </div>
                ))}
            </div>
        </div>
    );
};



//route to calendar page
const OpenCalendarBtn = () => {
    return (
        <button className="ml-4 bg-white text-black rounded-full border border-white px-4 py-2 hover:bg-gray-200 transition">
            Open Calendar
        </button>
    )
}


export default UpcomingTasks;