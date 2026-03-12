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
        <div className='border border-white rounded-md p-4'>
            <h1>Flashcards Today</h1>
            <h1>{finished} of {total} completed</h1>
            <ProgressBar title={percentCompletion + "%"} percentage={percentCompletion} />
            <p>{streakMsg}</p>
        </div>
    );
};


export default Flashcards;