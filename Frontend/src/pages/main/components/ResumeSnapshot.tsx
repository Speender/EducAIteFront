import React from 'react';


interface Props {
    resumeCount: number
}


const ResumeSnapshot = ({resumeCount}: Props) => {
    return (
        <div className='border border-white rounded-md p-4'>
            <h1>Resume Snapshot</h1>

            {resumeCount} new certifications added this semester

            <EditResumeBtn />
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