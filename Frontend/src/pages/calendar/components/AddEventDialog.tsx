import React, { useState, type ChangeEvent } from 'react';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: { title: string, date: string, eventType: string }) => void;
}


const AddEventDialog = ({ isOpen, onClose, onSave }: Props) => {
    const [title, setTitle] = useState<string>('');
    const [date, setDate] = useState<string>(dateToStr(new Date()))
    const eventType = "event"

    if (!isOpen) return null;

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setDate(e.target.value)
    }

    const handleSave = (): void => {
        if (!title.trim()) return;
        onSave({ title, date, eventType });
        onClose();
        setTitle('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            {/* Dialog Container */}
            <div
                className="relative w-full max-w-md border border-white bg-black p-6 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                role="dialog"
                aria-modal="true"
            >

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <h2 className="text-2xl font-semibold text-white mb-8">Add event</h2>

                <div className="space-y-6">
                    {/* Title Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Event Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="E.g., Design Sync"
                            className="w-full bg-black border border-white/40 text-white p-3 rounded-lg focus:border-white focus:outline-none transition-all placeholder:text-gray-700"
                        />
                    </div>

                    {/* cleanup later */}
                    {/* Date select */}
                    <div className="flex flex-col">
                        {/* <button
                            type="button"
                            onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                            className="flex items-center justify-between w-full py-2 group hover:opacity-80 transition-opacity"
                        >
                            <span className="text-white font-medium">📅 {formatDate(new Date())}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-white transition-transform duration-300 ease-in-out ${isCalendarVisible ? 'rotate-180' : 'rotate-0'
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button> */}

                        {/* Conditional Calendar Component */}
                        {/* {isCalendarVisible && ( */}
                        {/* <div className="mt-2 border-t border-white/10 pt-4 animate-in fade-in slide-in-from-top-1 duration-200"> */}
                        <input
                            value={date}
                            type="date"
                            onChange={handleDateChange}
                        />
                        {/* </div> */}
                        {/* )} */}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!title.trim()}
                        className="w-full bg-white text-black font-bold py-4 px-4 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        Save Event
                    </button>
                </div>
            </div>
        </div>
    );
};


function dateToStr(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


export default AddEventDialog;