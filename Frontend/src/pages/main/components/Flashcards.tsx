import React from 'react';
import ProgressBar from './ProgressBar';


interface Props {
    finished: number,
    total: number,
    streak: number
}


const Flashcards = ({ finished, total, streak }: Props) => {
    const streakMsg = streak >= 2 ? `Keep your ${streak}-day streak` : ""
    const percentCompletion = (finished / total) * 100


    return (
        <div className="bg-black border border-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4"><span className="text-[#00CEC8]">Flashcards</span> Today</h2>
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-white">{finished}</span>
                <span className="text-white text-xl">/ {total} completed</span>
            </div>
            <div className="mb-4">
                <ProgressBar title={`${percentCompletion}%`} percentage={percentCompletion} />
            </div>
            <div className="flex items-center gap-2 text-[#00CEC8] text-sm font-medium">
                {streakMsg}
            </div>
        </div>
    );
};


export default Flashcards;