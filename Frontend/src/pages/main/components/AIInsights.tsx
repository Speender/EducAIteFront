import React from 'react';
import ProgressBar from './ProgressBar';


interface AIInsightsProps {
    insights: any[]
}


const AIInsights = ({ insights }: AIInsightsProps) => {
    return (
        <div className="bg-black border border-white rounded-3xl p-8 shadow-xl h-full">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-xl font-bold text-white">
                    <span className="text-[#00CEC8]">AI</span> Insights
                </h1>
            </div>

            <div className="space-y-6">
                {insights.map((is, index) => (
                    <Insight
                        key={index}
                        insight={is.insight}
                        subject={is.subject}
                        mastery={is.mastery}
                    />
                ))}
            </div>
        </div>
    );
};


interface InsightProps {
    insight: string,
    subject: string,
    mastery: number
}


const Insight = ({ insight, subject, mastery }: InsightProps) => {
    return (
        <div className="group border-b border-white/5 pb-6 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-white text-lg font-semibold leading-snug group-hover:text-[#00CEC8] transition-colors">
                        {insight}
                    </h2>
                    <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
                        {subject}
                    </span>
                </div>
                <span className="text-[#00CEC8] text-sm font-mono font-bold">
                    {mastery}%
                </span>
            </div>

            {/* Use progressbar component */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                    className="bg-[#00CEC8] h-full rounded-full transition-all duration-1000"
                    style={{ width: `${mastery}%` }}
                />
            </div>
        </div>
    );
}


export default AIInsights;