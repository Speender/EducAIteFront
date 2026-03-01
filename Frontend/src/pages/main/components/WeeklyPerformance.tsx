import React from 'react';
import CircularProgressBar from './CircularProgressBar';

const WeeklyPerformance = () => {
    return (
        <div className='border border-white rounded-md'>
            <h1>Weekly Performance 📊</h1>
            <CircularProgressBar percentage={85}/>
        </div>
    );
};

export default WeeklyPerformance;