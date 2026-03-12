import React from 'react';


interface Props {
    events: any[]
}


const UpcomingEvents = ({ events }: Props) => {
    return (
        <div className="bg-black text-white border border-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index} className="flex items-center mb-2 border-b">
                        <span>📅 {convertDate(event.date)} | {event.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


function convertDate(dateStr: string) {
    const inputDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (inputDate.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        return inputDate.toLocaleDateString('en-US', options);
    }
}


export default UpcomingEvents;