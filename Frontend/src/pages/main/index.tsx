import React from 'react'
import Header from './components/Header'
import Search from './components/Search'
import WeeklyPerformance from './components/WeeklyPerformance'
import Flashcards from './components/Flashcards'
import UpcomingTasks from './components/UpcomingTasks'
import ResumeSnapshot from './components/ResumeSnapshot'
import AIInsights from './components/AIInsights'

const Main: React.FC = () => (
	<div>
		<Header />
        <Search />
        <WeeklyPerformance />
        <Flashcards />
        <UpcomingTasks />
        <ResumeSnapshot />
        <AIInsights />
	</div>
)

export default Main
