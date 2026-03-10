import React from 'react';
import ProgressBar from './ProgressBar';


const AIInsights = () => {
    return (
        <div className='border border-white rounded-md'>
            <h1>AI Insights</h1>

            <Insight />
            <Insight />
        </div>
    );
};


const Insight = () => {
    return (
        <h1>
            <h2>Strength</h2>
            <h1>Programming Languages</h1>

            <ProgressBar title={"Mastery"} percentage={80}/>
        </h1>
    )
}


export default AIInsights;