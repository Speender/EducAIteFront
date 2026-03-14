import React from 'react';


interface Props {
    events: any[],
    month: number,
    year: number
}


const MainCalendar = ({ events, month, year }: Props) => {
    const currentMonth = month
    const currentYear = year

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const items = events.map(item => {
        const [year, month, day] = item.date.split('-');
        return {
            ...item,
            day: Number(day),
            month: Number(month) - 1, //month is zero based - january = 0
            year: Number(year)
        };
    });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    return (
        <div className="bg-black rounded-2xl shadow-md border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-700 bg-gray-800">
                {weekDays.map(day => (
                    <div key={day} className="py-4 text-center text-xs font-bold text-white uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[130px]">
                {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} className="border-r border-b border-gray-700 bg-gray-800" />
                ))}

                {days.map(day => (
                    <div key={day} className="border-r border-b border-gray-700 p-2 hover:bg-gray-700 transition-colors group cursor-pointer relative">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {day}
                        </span>

                        <div className="mt-1 space-y-1.5 overflow-y-auto max-h-[90px] no-scrollbar">
                            {items
                                .filter(item => item.day === day && item.month === currentMonth && item.year === currentYear)
                                .map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-[11px] px-2 py-1 rounded-md font-semibold border shadow-sm truncate transition-transform hover:scale-[1.02] ${item.eventType === 'note'
                                            ? 'bg-orange-600 text-white border-orange-300'
                                            : 'bg-green-600 text-white border-green-300'
                                            }`}
                                    >
                                        {item.title}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default MainCalendar;