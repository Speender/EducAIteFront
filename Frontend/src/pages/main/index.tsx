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

const resumeCerts = [
    {
        title: "Cert 1"
    },
    {
        title: "Cert 1"
    },
    {
        title: "Cert 1"
    }
]


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
	<div>
		<Header name={name}/>
        <Search />
        <WeeklyPerformance goalAchieved={weeklyPerformance.goalAchieved} improvement={weeklyPerformance.improvement}/>
        <Flashcards finished={flashCards.finished} total={flashCards.total} streak={flashCards.streak} />
        <UpcomingTasks tasks={upcomingTasks} />
        <ResumeSnapshot resumeCount={resumeCerts.length} />
        <AIInsights insights={aiInsights} />
	</div>
)

export default Main
