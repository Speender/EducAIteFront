import React from 'react';


interface Props {
    title: string,
    percentage: number
}


const ProgressBar = ({ title, percentage }: Props) => {
    return (
        <div className="flex items-center w-full max-w-md">
            <div className="w-1/4 font-bold text-blue-500">{title}</div>
            <div className="w-3/4 bg-gray-200 rounded-full h-4 relative">
                <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;