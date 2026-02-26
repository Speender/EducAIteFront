import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar' 

import CoursePage from './pages/course/index' 
import AnalyticsPage from './pages/analytics/index'
import ResumePage from './pages/resume/index'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white font-sans antialiased">
        
        {/* Your clean, reusable Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main>
          <Routes>
            <Route path="/course" element={<CoursePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            
            {/* Placeholders for your other pages */}
            <Route path="/" element={<div className="pt-32 text-center text-white">Home Page Content</div>} />
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  )
}

export default App