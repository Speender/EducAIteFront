import React from 'react';
import Deadline from './Deadline';


interface Props {
    tasks: any[]
}


const UpcomingTasks = ({tasks}: Props) => {
    return (
        <div className='border border-white rounded-md p-4'>
            <h1>Upcoming Tasks 📅</h1>
            <OpenCalendarBtn />

            You have {tasks.length} deadlines this week

            {tasks.map(task => <Deadline date={task.date} task={task.task}/>)}
        </div>
    );
};



//route to calendar page
const OpenCalendarBtn = () => {
    return (
        <button className="ml-4 bg-white text-black rounded-full border border-white px-4 py-2 hover:bg-gray-200 transition">
            Open Calendar
        </button>
    )
}


export default UpcomingTasks;