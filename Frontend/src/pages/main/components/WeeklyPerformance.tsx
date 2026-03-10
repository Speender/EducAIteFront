import React from 'react';
import CircularProgressBar from './CircularProgressBar';


interface Props {
    goalAchieved: number,
    improvement: number
}


const WeeklyPerformance = ({goalAchieved, improvement}: Props) => {
    return (
        <div className='border border-white rounded-md'>
            <h1>Weekly Performance 📊</h1>
            <CircularProgressBar percentage={goalAchieved}/>
            <div>
                {goalAchieved}% Weekly Goal Achieved
            </div>
            <div>
                You've improved {improvement}% since last week
            </div>
        </div>
    );
};

export default WeeklyPerformance;