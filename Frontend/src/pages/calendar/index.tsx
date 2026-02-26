import React from 'react'


const Calendar: React.FC = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const items = [
        { day: 5, type: 'note', title: 'Buy Tshirt' },
        { day: 12, type: 'event', title: 'Midterm' },
        { day: 12, type: 'note', title: 'Bring calculator' },
        { day: 18, type: 'event', title: 'Submit Infosec assignment' },
        { day: 24, type: 'note', title: 'Group study' },
        { day: 28, type: 'event', title: 'Intrams' },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">October 2026</h1>
                    <p className="text-gray-500 text-sm font-medium">Academic Year 2026-27</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button className="p-2 hover:bg-white rounded-md transition-all text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button className="p-2 hover:bg-white rounded-md transition-all text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>

                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        Add New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {weekDays.map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-[130px]">
                    {[...Array(3)].map((_, i) => (
                        <div key={`empty-${i}`} className="border-r border-b border-gray-100 bg-gray-50/30" />
                    ))}

                    {days.map(day => (
                        <div key={day} className="border-r border-b border-gray-100 p-2 hover:bg-indigo-50/30 transition-colors group cursor-pointer relative">
                            <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                                {day}
                            </span>

                            <div className="mt-1 space-y-1.5 overflow-y-auto max-h-[90px] no-scrollbar">
                                {items
                                    .filter(item => item.day === day)
                                    .map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-[11px] px-2 py-1 rounded-md font-semibold border shadow-sm truncate transition-transform hover:scale-[1.02] ${item.type === 'note'
                                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                    : 'bg-green-50 text-green-700 border-green-200'
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

            <div className="mt-8 flex gap-8 justify-center items-center bg-white py-3 px-6 rounded-full w-fit mx-auto shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded shadow-inner bg-orange-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">My Notes</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded shadow-inner bg-green-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Events</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar
