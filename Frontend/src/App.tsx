import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import EducAIteAssistantRobot from './components/EducAIteAssistantRobot'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastProvider } from './components/ToastProvider'
import { isAuthenticated } from './lib/api/auth'

import LandingPage from './pages/landing'
import Main from './pages/main'
import CoursePage from './pages/course'
import CourseDetails from './pages/course/component/CourseDetails'
import AnalyticsPage from './pages/analytics'
import FlashcardsPage from './pages/flashcards'
import TrackerPage from './pages/tracker'
import ResumePage from './pages/resume'
import CertificatesPage from './pages/certificates'
import SettingsPage from './pages/settings'
import CreateNotes from './pages/course/component/CreateNotes'
import NoteDetailsPage from './pages/notes/NoteDetailsPage'
import DocumentDetailsPage from './pages/documents/DocumentDetailsPage'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import ForgotPasswordPage from './pages/auth/forgot'
import Calender from './pages/calendar'
import NotFoundPage from './pages/not-found'

function RootRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/main" replace />
  }

  return <LandingPage />
}

function AppContent() {
  const location = useLocation()

  const hideNavbar =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot' ||
    location.pathname === '/not-found' ||
    location.pathname.startsWith('/auth') ||
    location.pathname.endsWith('/learn') ||
    location.pathname.endsWith('/session')

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {!hideNavbar && (
        <>
          <Navbar />
          <EducAIteAssistantRobot />
        </>
      )}
      <main>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/main" element={<Main />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/documents/:documentSqid" element={<DocumentDetailsPage />} />
            <Route path="/notes/:noteSqid" element={<NoteDetailsPage />} />
            <Route path="/create-notes" element={<CreateNotes />} />
            <Route path="/flashcards/*" element={<FlashcardsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/resume/:resumeSqid" element={<ResumePage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/calendar" element={<Calender />} />
          </Route>
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
