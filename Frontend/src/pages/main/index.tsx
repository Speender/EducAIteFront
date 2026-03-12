import React from 'react'
import Header from './components/Header'
import Search from './components/Search'
import WeeklyPerformance from './components/WeeklyPerformance'
import Flashcards from './components/Flashcards'
import UpcomingTasks from './components/UpcomingTasks'
import ResumeSnapshot from './components/ResumeSnapshot'
import AIInsights from './components/AIInsights'


//all data here
const name: string = "Christian"

const weeklyPerformance = {
    goalAchieved: 84,
    improvement: 12
}

const flashCards = {
    finished: 12,
    total: 20,
    streak: 5
}

const upcomingTasks = [
    {
        taskType: "Deadline",
        date: "2026-3-10",
        task: "Eldroid Midterm"
    },
    {
        taskType: "Deadline",
        date: "2026-4-10",
        task: "Proglan Midterm"
    },
    {
        taskType: "Deadline",
        date: "2026-3-11",
        task: "Softeng Submission"
    },
]

const resumeCertsCount = 3


const aiInsights = [
    {
        insight: "Strength",
        subject: "Programming Language",
        mastery: 90
    },
    {
        insight: "Weakness",
        subject: "Fundamentals of AI",
        mastery: 20
    },
    {
        insight: "Weakness",
        subject: "Android Jetpack Compose",
        mastery: 50
    },
]


const Main: React.FC = () => (
    <div className="flex flex-col items-center">
        <div className="text-center mb-4">
            <Header name={name} />
        </div>
        <div className="mb-6">
            <Search />
        </div>
        <div className="flex gap-4">
            <div className="flex gap-4 flex-col flex-grow">
                <WeeklyPerformance
                    goalAchieved={weeklyPerformance.goalAchieved}
                    improvement={weeklyPerformance.improvement}
                />
                <Flashcards
                    finished={flashCards.finished}
                    total={flashCards.total}
                    streak={flashCards.streak}
                />
            </div>
            <div className="flex gap-4 flex-col flex-grow">
                <UpcomingTasks tasks={upcomingTasks} />
                <ResumeSnapshot resumeCount={resumeCertsCount} />
            </div>
            <div className="flex flex-col flex-grow">
                <AIInsights insights={aiInsights} />
            </div>
        </div>
    </div>
);

export default Main
