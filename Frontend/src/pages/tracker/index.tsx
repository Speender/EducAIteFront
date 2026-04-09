import React, { useState } from 'react'
import Header from './components/Header'
import DropdownSemester from './components/DropdownSemester'
import Table from './components/Table'
import Logo from '../../components/Logo';

//stud name
const name: string = "Christian"

//Semester selections:
const Semester = Object.freeze({
    FIRST_YEAR_FIRST_SEM: "1st year - First semester",
    FIRST_YEAR_SECOND_SEM: "1st year - Second semester",
    SECOND_YEAR_FIRST_SEM: "2nd year - First semester",
    SECOND_YEAR_SECOND_SEM: "2nd year - Second semester",
    THIRD_YEAR_FIRST_SEM: "3rd year - First semester",
    THIRD_YEAR_SECOND_SEM: "3rd year - Second semester",
    FOURTH_YEAR_FIRST_SEM: "4th year - First semester",
    FOURTH_YEAR_SECOND_SEM: "4th year - Second semester",
})

const data = [
    {
        semester: Semester.FIRST_YEAR_FIRST_SEM,
        courses: [
            { course: 'ENTREP', units: 3, midtermGrade: 1.2, finalGrade: 1.1 },
            { course: 'PE 1', units: 3, midtermGrade: 1.1, finalGrade: 1.2 },
            { course: 'ENGL 1', units: 4, midtermGrade: 1.1, finalGrade: 1.0 },
            { course: 'PHILO', units: 4, midtermGrade: 1.1, finalGrade: 1.0 }
        ]
    },
    {
        semester: Semester.FIRST_YEAR_SECOND_SEM,
        courses: [
            { course: 'COMPUTING', units: 3, midtermGrade: 1.2, finalGrade: 1.2 },
            { course: 'PE 2', units: 3, midtermGrade: 1.5, finalGrade: 1.75 },
            { course: 'NSTP 2', units: 4, midtermGrade: 2.5, finalGrade: 1.2 },
            { course: 'DIFF CALC', units: 4, midtermGrade: 2.1, finalGrade: 2.1 }
        ]
    },
    {
        semester: Semester.SECOND_YEAR_FIRST_SEM,
        courses: [
            { course: 'INTRO TO PROGRAMMING', units: 3, midtermGrade: 1.5, finalGrade: 1.5 },
            { course: 'PE 3', units: 3, midtermGrade: 1.1, finalGrade: 1.1 },
            { course: 'RIZAL', units: 4, midtermGrade: 2.3, finalGrade: 2.5 },
            { course: 'DATABASE', units: 4, midtermGrade: 2.1, finalGrade: 2.0 }
        ]
    },
    {
        semester: Semester.SECOND_YEAR_SECOND_SEM,
        courses: [
            { course: 'LIT', units: 3, midtermGrade: 2.2, finalGrade: 1.8 },
            { course: 'PE 4', units: 3, midtermGrade: 1.9, finalGrade: 2.1 },
            { course: 'HIST 1', units: 4, midtermGrade: 1.5, finalGrade: 1.5 },
            { course: 'HUM', units: 4, midtermGrade: 2.1, finalGrade: 1.2 }
        ]
    },
    { semester: Semester.THIRD_YEAR_FIRST_SEM, courses: [] },
    { semester: Semester.THIRD_YEAR_SECOND_SEM, courses: [] },
    { semester: Semester.FOURTH_YEAR_FIRST_SEM, courses: [] },
    { semester: Semester.FOURTH_YEAR_SECOND_SEM, courses: [] }
];

const Tracker: React.FC = () => {
    const [currentSem, setCurrentSem] = useState<string>(Semester.FIRST_YEAR_FIRST_SEM);

    const handleSemSelection = (value: string) => {
        setCurrentSem(value);
    }

    return (
        <div className="min-h-[100dvh] bg-black text-white font-sans antialiased pt-36 lg:pt-32 pb-16 lg:pb-24 px-4 lg:px-8 relative z-10 overflow-x-hidden">
            <Logo />
            <div className="max-w-[1280px] mx-auto">
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8 mb-8 lg:mb-12 w-full">
                    <div className="w-full lg:w-auto">
                        <Header name={name} semester={currentSem} />
                    </div>

                    <div className="shrink-0 relative z-20 w-full lg:w-auto">
                        <DropdownSemester
                            selections={Object.values(Semester)}
                            currentSelection={currentSem} 
                            onSelectChange={handleSemSelection}
                        />
                    </div>
                </div>

                <div className="w-full pb-6">
                    <Table data={data.filter(s => s.semester === currentSem)[0]?.courses || []} />
                </div>
                
            </div>
        </div>
    );
}

export default Tracker;