import React, { useState } from 'react'
import MainCalendar from './components/MainCalendar';
import UpcomingEvents from './components/UpcomingEvents';
import AddEvent from './components/AddEvent';
import Search from './components/Search';
import SecondaryCalendar from './components/SecondaryCalendar';
import AddEventDialog from './components/AddEventDialog';
import MonthYearSelector from './components/MonthYearSelector';


const events = [
    { date: '2026-3-05', eventType: 'note', title: 'Buy Tshirt' },
    { date: '2026-3-12', eventType: 'event', title: 'Midterm' },
    { date: '2026-03-12', eventType: 'note', title: 'Bring calculator' },
    { date: '2026-03-12', eventType: 'note', title: 'Bring calculator' },
    { date: '2026-03-12', eventType: 'note', title: 'Bring calculator' },
    { date: '2026-03-12', eventType: 'note', title: 'Bring calculator' },
    { date: '2026-03-12', eventType: 'note', title: 'Bring calculator' },
    { date: '2026-3-18', eventType: 'event', title: 'Submit Infosec assignment' },
    { date: '2026-3-24', eventType: 'note', title: 'Group study' },
    { date: '2026-3-28', eventType: 'event', title: 'Intrams' },
]


const Calendar: React.FC = () => {
    const today = new Date();
    const [currentMonth, setMonth] = useState(today.getMonth()); //month is zero based - january = 0
    const currentDay = today.getDate()
    const [currentYear, setYear] = useState(today.getFullYear());
    const handleDateChange = (newMonth: number, newYear: number) => {
        setMonth(newMonth)
        setYear(newYear)
    }

    const handleDialogClose = () => {

    }

    const handleEventSave = () => {

    }

    return (
        <div>
            <h1>Calendar</h1>
            <Search />
            <MonthYearSelector month={currentMonth} year={currentYear} onDateChange={handleDateChange}/>
            <MainCalendar events={events} month={currentMonth} year={currentYear} />
            <AddEvent />
            <SecondaryCalendar month={currentMonth} day={currentDay} year={currentYear} onDateChange={handleDateChange} />
            <UpcomingEvents events={events} />
            <AddEventDialog isOpen={false} onClose={handleDialogClose} onSave={handleEventSave} />
        </div>
    )
};

export default Calendar
