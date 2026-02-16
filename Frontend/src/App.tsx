import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Main from './pages/main'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Course from './pages/course'
import Analytics from './pages/analytics'
import Flashcards from './pages/flashcards'
import Tracker from './pages/tracker'
import Calendar from './pages/calendar'
import Resume from './pages/resume'
import Settings from './pages/settings'

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <nav>
          <Link to="/">Home</Link> |
          <Link to="/course">Course</Link> |
          <Link to="/flashcards">Flashcards</Link> |
          <Link to="/analytics">Analytics</Link> |
          <Link to="/tracker">Tracker</Link> |
          <Link to="/calendar">Calendar</Link> |
          <Link to="/resume">Resume</Link> |
          <Link to="/settings">Settings</Link> |
          <Link to="/login">Login</Link> |
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course" element={<Course />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
