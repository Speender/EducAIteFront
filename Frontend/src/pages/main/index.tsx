import React from 'react'
import Header from './components/Header'
import Search from './components/Search'
import WeeklyPerformance from './components/WeeklyPerformance'
import Flashcards from './components/Flashcards'

const Main: React.FC = () => (
	<div>
		<Header />
        <Search />
        <WeeklyPerformance />
        <Flashcards />
	</div>
)

export default Main
