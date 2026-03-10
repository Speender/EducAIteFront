import React from 'react';
import Deadline from './Deadline';

const UpcomingTasks = () => {
    return (
        <div className='border border-white rounded-md'>
            <h1>Upcoming Tasks 📅</h1>
            <OpenCalendarBtn />

            You have two deadlines this week

            <Deadline />
            <Deadline />
        </div>
    );
};


const OpenCalendarBtn = () => {
    return (
        <button className="ml-4 bg-white text-black rounded-full border border-white px-4 py-2 hover:bg-gray-200 transition">
            Open Calendar
        </button>
    )
}

export default UpcomingTasks;