import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'

import LandingPage from './pages/landing/LandingPage'
import Main from './pages/main'
import CoursePage from './pages/course'
import CourseDetails from './pages/course/component/CourseDetails'
import AnalyticsPage from './pages/analytics'
import FlashcardsPage from './pages/flashcards'
import TrackerPage from './pages/tracker'
import ResumePage from './pages/resume'
import SettingsPage from './pages/settings'
import CreateNotes from './pages/course/component/CreateNotes'
import Login from './pages/auth/login'
import Register from './pages/auth/register'

function AppContent() {
  const location = useLocation()

  const hideNavbar =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/auth')

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {!hideNavbar && <Navbar />}

      <main>
        <Routes>
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/" element={<Main />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/create-notes" element={<CreateNotes />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/settings" element={<SettingsPage />} />

        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* optional */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App