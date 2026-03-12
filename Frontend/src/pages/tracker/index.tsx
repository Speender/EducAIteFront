import React, { useState } from 'react'
import Header from './components/Header'
import DropdownSemester from './components/DropdownSemester'
import Table from './components/Table'


//all data here
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

//grades from 1st year-1st sem to 2nd year-2nd sem only
const data = [
    {
        semester: Semester.FIRST_YEAR_FIRST_SEM,
        courses: [
            {
                course: 'ENTREP',
                units: 3,
                midtermGrade: 1.2,
                finalGrade: 1.1
            },
            {
                course: 'PE 1',
                units: 3,
                midtermGrade: 1.1,
                finalGrade: 1.2
            },
            {
                course: 'ENGL 1',
                units: 4,
                midtermGrade: 1.1,
                finalGrade: 1.0
            },
            {
                course: 'PHILO',
                units: 4,
                midtermGrade: 1.1,
                finalGrade: 1.0
            }
        ]
    },
    {
        semester: Semester.FIRST_YEAR_SECOND_SEM,
        courses: [
            {
                course: 'COMPUTING',
                units: 3,
                midtermGrade: 1.2,
                finalGrade: 1.2
            },
            {
                course: 'PE 2',
                units: 3,
                midtermGrade: 1.5,
                finalGrade: 1.75
            },
            {
                course: 'NSTP 2',
                units: 4,
                midtermGrade: 2.5,
                finalGrade: 1.2
            },
            {
                course: 'DIFF CALC',
                units: 4,
                midtermGrade: 2.1,
                finalGrade: 2.1
            }
        ]
    },
    {
        semester: Semester.SECOND_YEAR_FIRST_SEM,
        courses: [
            {
                course: 'INTRO TO PROGRAMMING',
                units: 3,
                midtermGrade: 1.5,
                finalGrade: 1.5
            },
            {
                course: 'PE 3',
                units: 3,
                midtermGrade: 1.1,
                finalGrade: 1.1
            },
            {
                course: 'RIZAL',
                units: 4,
                midtermGrade: 2.3,
                finalGrade: 2.5
            },
            {
                course: 'DATABASE',
                units: 4,
                midtermGrade: 2.1,
                finalGrade: 2.0
            }
        ]
    },
    {
        semester: Semester.SECOND_YEAR_SECOND_SEM,
        courses: [
            {
                course: 'LIT',
                units: 3,
                midtermGrade: 2.2,
                finalGrade: 1.8
            },
            {
                course: 'PE 4',
                units: 3,
                midtermGrade: 1.9,
                finalGrade: 2.1
            },
            {
                course: 'HIST 1',
                units: 4,
                midtermGrade: 1.5,
                finalGrade: 1.5
            },
            {
                course: 'HUM',
                units: 4,
                midtermGrade: 2.1,
                finalGrade: 1.2
            }
        ]
    },
    {
        semester: Semester.THIRD_YEAR_FIRST_SEM,
        courses: [
        ]
    },
    {
        semester: Semester.THIRD_YEAR_SECOND_SEM,
        courses: [
        ]
    },
    {
        semester: Semester.FOURTH_YEAR_FIRST_SEM,
        courses: [
        ]
    },
    {
        semester: Semester.FOURTH_YEAR_SECOND_SEM,
        courses: [
        ]
    }
];


const Tracker: React.FC = () => {
    const [currentSem, setCurrentSem] = useState<string>(Semester.FIRST_YEAR_FIRST_SEM);

    const handleSemSelection = (value: string) => {
        setCurrentSem(value);
    }

    return (
        <div>
            <div className='flex flex-row justify-between items-center mb-4'>
                <Header name={name} semester={currentSem} />
                <DropdownSemester selections={Object.values(Semester)} onSelectChange={handleSemSelection} />
            </div>
            <div className="mt-4">
                <Table data={data.filter(s => s.semester === currentSem)[0].courses} />
            </div>
        </div>
    );
}


export default Tracker