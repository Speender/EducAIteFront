import React from 'react';


interface Props {
    resumeCount: number
}


const ResumeSnapshot = ({ resumeCount }: Props) => {
    return (
        <div className="bg-black border border-white rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[160px]">
            <div>
                <h2 className="text-xl font-bold text-white"><span className="text-[#00CEC8]">Resume</span> Snapshot</h2>
                <p className="text-white text-lg leading-tight">
                    <span className="text-[#00CEC8] font-bold">{resumeCount}</span> new certifications added this semester
                </p>
            </div>

            <div className="mt-6">
                <EditResumeBtn /> {/* Ensure this uses: bg-white text-black text-[10px] font-bold px-8 py-3 rounded-full */}
            </div>
        </div>
    );
};


//route to resume page
const EditResumeBtn = () => {
    return (
        <button className="ml-4 bg-white text-black rounded-full border border-white px-4 py-2 hover:bg-gray-200 transition">
            Edit Resume
        </button>
    )
}


export default ResumeSnapshot;