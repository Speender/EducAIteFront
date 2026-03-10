import React from 'react';


interface Props {
    percentage: number
}


const CircularProgressBar = ({ percentage }: Props) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex justify-center items-center">
            <svg width="120" height="120">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-blue-500 transition-all duration-500 ease-in-out"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="absolute text-2xl font-bold text-blue-500">
                {percentage}%
            </div>
        </div>
    );
};

export default CircularProgressBar;