import React, { useState, type ChangeEvent } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: { title: string, date: string, eventType: string }) => void;
}

const AddEventDialog = ({ isOpen, onClose, onSave }: Props) => {
    const [title, setTitle] = useState<string>('');
    const [date, setDate] = useState<string>(dateToStr(new Date()))
    const [eventType, setEventType] = useState<string>('event');

    if (!isOpen) return null;

    const handleSave = (): void => {
        if (!title.trim()) return;
        onSave({ title, date, eventType });
        onClose();
        setTitle('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div 
                className="relative w-full max-w-md bg-[#111111] border-[1.5px] border-white/20 p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
                role="dialog"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Add New Event</h2>

                <div className="space-y-5">
                    
                    {/* Title Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-white/70 font-medium">Event Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Database Exam"
                            className="w-full bg-black border-[1.5px] border-white/20 text-white px-5 py-4 rounded-xl focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)] outline-none transition-all placeholder:text-white/30 text-sm"
                        />
                    </div>

                    {/* Date Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-white/70 font-medium">Date</label>
                        <input
                            type="date"
                            value={date}
                            style={{ colorScheme: 'dark' }}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-black border-[1.5px] border-white/20 text-white px-5 py-4 rounded-xl focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)] outline-none transition-all text-sm cursor-pointer"
                        />
                    </div>

                    {/* Event Type Toggle */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-white/70 font-medium">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                                <input type="radio" name="type" checked={eventType === 'event'} onChange={() => setEventType('event')} className="accent-[#00CEC8] w-4 h-4"/>
                                Event
                            </label>
                            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                                <input type="radio" name="type" checked={eventType === 'note'} onChange={() => setEventType('note')} className="accent-[#00CEC8] w-4 h-4"/>
                                Note
                            </label>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!title.trim()}
                        className="w-full bg-white text-black font-bold text-[1rem] py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default AddEventDialog;