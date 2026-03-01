import React from 'react';
import ProgressBar from './ProgressBar';

const Flashcards = () => {
    return (
        <div className='border border-white rounded-md'>
            <h1>Flashcards Today</h1>
            <h1>12 of 20 completed</h1>
            <ProgressBar percentage={60}/>
            <p>Keep your 5-day streak</p>
        </div>
    );
};

export default Flashcards;