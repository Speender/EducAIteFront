import React from 'react';
import CircularProgressBar from './CircularProgressBar';


interface Props {
    goalAchieved: number,
    improvement: number
}


const WeeklyPerformance = ({ goalAchieved, improvement }: Props) => {
    return (
        <div className="bg-black border border-white rounded-3xl p-6 shadow-xl text-center h-full">
            <h2 className="text-xl font-bold text-white"><span className="text-[#00CEC8]">Weekly</span> Performance</h2>

            <div className="flex items-center gap-6">
                {/* Circular Progress Side */}
                <div className="shrink-0 scale-90 origin-left">
                    <CircularProgressBar percentage={goalAchieved} />
                </div>

                {/* Data Side */}
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white leading-none">{goalAchieved}%</span>
                        <span className="text-white/60 text-[10px] uppercase font-semibold">Weekly Goal Achieved</span>
                    </div>

                    <div className="mt-2 py-1 px-2.5 rounded-md bg-[#00CEC8]/10 w-fit">
                        <p className="text-[#00CEC8] text-[11px] font-bold">
                            ↑ {improvement}% <span className="opacity-80 font-medium ml-1">vs last week</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyPerformance;