import React, { useState } from 'react'
import { motion } from 'framer-motion';

import MainCalendar from './components/MainCalendar';
import UpcomingEvents from './components/UpcomingEvents';
import AddEvent from './components/AddEvent';
import Search from './components/Search';
import SecondaryCalendar from './components/SecondaryCalendar';
import AddEventDialog from './components/AddEventDialog';
import MonthYearSelector from './components/MonthYearSelector';
import Logo from '../../components/Logo';


interface Event {
    date: string,
    eventType: string,
    title: string
}

const eventsData: Event[] = [
    { date: '2026-03-05', eventType: 'note', title: 'Buy Tshirt' },
    { date: '2026-03-12', eventType: 'event', title: 'Midterm' },
    { date: '2026-03-12', eventType: 'note', title: 'Bring calculator' },
    { date: '2026-03-18', eventType: 'event', title: 'Submit Infosec assignment' },
    { date: '2026-03-24', eventType: 'note', title: 'Group study' },
    { date: '2026-03-28', eventType: 'event', title: 'Intrams' },
]

const Calendar: React.FC = () => {
    const today = new Date();
    const [currentMonth, setMonth] = useState(today.getMonth());
    const currentDay = today.getDate()
    const [currentYear, setYear] = useState(today.getFullYear());
    
    const handleDateChange = (newMonth: number, newYear: number) => {
        setMonth(newMonth)
        setYear(newYear)
    }
    
    const [dialogVisibility, setDialogVisibility] = useState(false)
    const [events, updateEvents] = useState<any[]>(eventsData)

    const handleDialogClose = () => {
        setDialogVisibility(false)
    }

    const handleEventSave = (e: Event) => {
        updateEvents(
            [...events, {
                date: e.date,
                title: e.title,
                eventType: e.eventType
            }].sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
        )
    }

    const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

    const handleSearchResultClick = (dateString: string) => {
        const [y, m, d] = dateString.split('-').map(Number);

        setMonth(m - 1); 
        setYear(y);
        
        setHighlightedDate(dateString);
    
        setTimeout(() => {
            setHighlightedDate(null);
        }, 3000);
    };

    return (
        <div className="min-h-[100dvh] bg-black text-white font-sans antialiased pt-24 lg:pt-32 pb-16 lg:pb-12 px-4 lg:px-6 relative z-10 overflow-x-hidden">
            <Logo />
            <div className="max-w-[1400px] mx-auto">
                
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-10 gap-4 lg:gap-6 w-full">
                    <motion.h1
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        // RESPONSIVE FIX: Scaled text down to 3xl on mobile
                        className="text-3xl lg:text-[2.5rem] font-bold tracking-tight"
                    >
                        Calendar
                    </motion.h1>
                    
                    <div className="w-full lg:w-auto">
                        <Search 
                            events={events} 
                            onResultClick={handleSearchResultClick} 
                        />
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="flex flex-col xl:flex-row gap-8 lg:gap-10">

                    {/* Left Side: Main Grid */}
                    <div className="w-full xl:w-2/3 flex flex-col">
                        <div className="mb-4 lg:mb-6">
                            <MonthYearSelector
                                month={currentMonth}
                                year={currentYear}
                                onDateChange={handleDateChange}
                            />
                        </div>
                        <MainCalendar 
                            events={events} 
                            month={currentMonth} 
                            year={currentYear} 
                            highlightedDate={highlightedDate} 
                        />
                    </div>

                    {/* Right Side: Sidebar */}
                    <div className="w-full xl:w-1/3 shrink-0 flex flex-col gap-6 lg:gap-8 mt-4 xl:mt-0">
                        <div className="flex justify-center sm:justify-end w-full">
                            <AddEvent onClick={() => setDialogVisibility(true)} />
                        </div>
                        
                        <SecondaryCalendar
                            month={currentMonth}
                            day={currentDay}
                            year={currentYear}
                            onDateChange={handleDateChange}
                        />
                        
                        <UpcomingEvents events={events} />
                    </div>
                </div>

                <AddEventDialog
                    isOpen={dialogVisibility}
                    onClose={handleDialogClose}
                    onSave={handleEventSave}
                />
            </div>
        </div>
    );
};

export default Calendar;