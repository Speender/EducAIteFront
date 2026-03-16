import React from 'react';


interface Props {
    date: string,
    task: string
}


const Deadline = ({ date, task }: Props) => {
    return (
        <div>
            📅 {checkDate(date)} - {task}
        </div>
    );
};


const checkDate = (dateString: string) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    const tomorrow = new Date(today);

    today.setHours(0, 0, 0, 0);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (inputDate.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        return inputDate.toLocaleDateString('en-US', options);
    }
};


export default Deadline;