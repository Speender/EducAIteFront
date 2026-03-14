import React from 'react'
import AnalyticsHeader from './components/AnalyticsHeader'
import OverallPerformance from './components/OverallPerformance'
import SummaryCards from './components/SummaryCards'
import MostStudiedSubjects from './components/MostStudiedSubjects'
import ActivityHeatmap from './components/ActivityHeatmap'
import LearningTrendAnalysis from './components/LearningTrendAnalysis'
import BestPerformingCourse from './components/BestPerformingCourse'
import MultiLineChartCard from './components/MultiLineChartCard'
import logo from '../../assets/educAIte-logo.svg'

const AnalyticsPage = () => {
  return (

    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-8 font-sans">

      {/* Logo placed on the top left */}
      <div className="absolute top-10 left-12">
        <img src={logo} alt="educAIte" className="h-10" />
      </div>
      
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        
        {/* Top Header */}
        <AnalyticsHeader />

        {/* Middle Two-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <OverallPerformance />
          
          <div className="flex flex-col gap-6">
            <SummaryCards />
            <MostStudiedSubjects />
          </div>
        </div>

        {/* Full-Width Charts */}
        <ActivityHeatmap />
        <LearningTrendAnalysis />
        <BestPerformingCourse />
        
        <MultiLineChartCard 
          titleHighlight="Learning Retention" 
          titleRest="Rate" 
          subtitleLabel="Flashcard Accuracy" 
          subtitleValue="%87" 
        />
        
        <MultiLineChartCard 
          titleHighlight="Performance Summary" 
          titleRest="Rate" 
          subtitleLabel="Overall Mastery" 
          subtitleValue="%87" 
        />

      </div>
    </div>
  )
}

export default AnalyticsPage