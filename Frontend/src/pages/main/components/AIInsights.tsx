import React from 'react';
import ProgressBar from './ProgressBar';


interface AIInsightsProps {
    insights: any[]
}


const AIInsights = ({insights}: AIInsightsProps) => {
    return (
        <div className='border border-white rounded-md p-4'>
            <h1>AI Insights</h1>
            {insights.map(is => <Insight insight={is.insight} subject={is.subject} mastery={is.mastery}/>)}
        </div>
    );
};


interface InsightProps {
    insight: string,
    subject: string,
    mastery: number
}


const Insight = ({insight, subject, mastery}: InsightProps) => {
    return (
        <h1>
            <h2>{insight}</h2>
            <h1>{subject}</h1>
            <ProgressBar title={"Mastery"} percentage={mastery}/>
        </h1>
    )
}


export default AIInsights;