import React, { useEffect, useState, type JSX } from 'react';
import MonthYearSelector from './MonthYearSelector';


interface Props {
    month: number;
    year: number;
    day: number;
    onDateChange: (newMonth: number, newYear: number) => void;
}


const SecondaryCalendar = ({ month, year, day, onDateChange }: Props) => {
    const [date, setDate] = useState<Date>(new Date(year, month, 1));

    useEffect(() => {
        setDate(new Date(year, month, 1));
    }, [month, year, day]);


    const handleDateChange = (newMonth: number, newYear: number) => {
        const newDate = new Date(newYear, newMonth, 1);
        setDate(newDate);
        onDateChange(newDate.getMonth(), newDate.getFullYear());
    }

    const goToPreviousMonth = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        setDate(newDate);
        onDateChange(newDate.getMonth(), newDate.getFullYear());
    };

    const goToNextMonth = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setDate(newDate);
        onDateChange(newDate.getMonth(), newDate.getFullYear());
    };

    const renderDays = () => {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const days: JSX.Element[] = [];
    
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-12 h-12"></div>);
        }
    
        const today = new Date();
        const todayDate = today.getDate();
    
        for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
            days.push(
                <div
                    key={dayNumber}
                    className={`w-12 h-12 flex items-center justify-center rounded-full 
                    ${dayNumber === todayDate && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear() ? 'bg-white text-black' : ''}`}
                >
                    {dayNumber}
                </div>
            );
        }
        return days;
    };


    return (
        <div className="bg-black text-white p-4 rounded-lg border border-white">
            <div className="flex justify-between items-center mb-2">
                <MonthYearSelector month={month} year={year} onDateChange={handleDateChange} />
                <button onClick={goToPreviousMonth} className="text-white">{"<"}</button>
                <button onClick={goToNextMonth} className="text-white">{">"}</button>
            </div>
            <div className="grid grid-cols-7 gap-1 ml-4">
                {renderDays()}
            </div>
        </div>
    );
};

export default SecondaryCalendar;