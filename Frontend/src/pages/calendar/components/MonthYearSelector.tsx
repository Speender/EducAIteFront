import React, { useEffect, useState, type JSX } from 'react';


const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


interface Props {
    month: number;
    year: number;
    onDateChange: (newMonth: number, newYear: number) => void;
}


const MonthYearSelector = ({ month, year, onDateChange }: Props) => {
    const [date, setDate] = useState<Date>(new Date(year, month, 1));

    useEffect(() => {
        setDate(new Date(year, month, 1));
    }, [month, year]);


    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(e.target.value);
        setDate(new Date(date.getFullYear(), newMonth, 1));
        onDateChange(newMonth, date.getFullYear());
    };


    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value);
        setDate(new Date(newYear, date.getMonth(), 1));
        onDateChange(date.getMonth(), newYear);
    };


    return (
        <div className="flex items-center mb-2">
            <div>
                <select onChange={handleMonthChange} value={date.getMonth()}>
                    {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>
                <select onChange={handleYearChange} value={date.getFullYear()}>
                    {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={date.getFullYear() - 5 + i}>{date.getFullYear() - 5 + i}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MonthYearSelector;