import React from 'react';

const ResumeSnapshot = () => {
    return (
        <div className='border border-white rounded-md'>
            <h1>Resume Snapshot</h1>

            2 new certifications added this semester

            <EditResumeBtn />
        </div>
    );
};


const EditResumeBtn = () => {
    return (
        <button className="ml-4 bg-white text-black rounded-full border border-white px-4 py-2 hover:bg-gray-200 transition">
            Edit Resume
        </button>
    )
}


export default ResumeSnapshot;