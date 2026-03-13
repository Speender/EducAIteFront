import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom'
import settingIcon from './assets/Setting Icon.svg'

import Main from './pages/main'
import Login from './pages/auth/login'

/* ... other imports ... */

// Layout for authenticated/app pages — has the navbar
const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-[#050505] text-white font-sans antialiased p-8">
    <header className="flex justify-center mb-12">
      <nav className="flex items-center bg-black border border-white/10 px-8 py-3 rounded-full shadow-[0_20px_50px_rgba(255,255,255,0.05)] gap-8">
        <NavLink to="/" className={({ isActive }) =>
          `text-sm transition-all pb-1 ${isActive ? 'text-white border-b-2 border-cyan-400 font-semibold' : 'text-gray-400 hover:text-white'}`
        }>
          Home
        </NavLink>

        <NavLink to="/course" className={({ isActive }) =>
          `text-sm transition-all pb-1 ${isActive ? 'text-white border-b-2 border-cyan-400 font-bold' : 'text-gray-400 hover:text-white'}`
        }>
          Courses
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) =>
          `text-sm transition-all pb-1 ${isActive ? 'text-white border-b-2 border-cyan-400 font-bold' : 'text-gray-400 hover:text-white'}`
        }>
          Analytics
        </NavLink>

        <NavLink to="/flashcards" className={({ isActive }) =>
          `text-sm transition-all pb-1 ${isActive ? 'text-white border-b-2 border-cyan-400 font-bold' : 'text-gray-400 hover:text-white'}`
        }>
          Flashcards
        </NavLink>

        <NavLink to="/tracker" className={({ isActive }) =>
          `text-sm transition-all pb-1 ${isActive ? 'text-white border-b-2 border-cyan-400 font-bold' : 'text-gray-400 hover:text-white'}`
        }>
          Tracker
        </NavLink>

        <NavLink to="/resume" className={({ isActive }) =>
          `text-sm transition-all pb-1 ${isActive ? 'text-white border-b-2 border-cyan-400 font-bold' : 'text-gray-400 hover:text-white'}`
        }>
          Resume
        </NavLink>

        <NavLink to="/settings" className="ml-4 flex items-center justify-center bg-transparent group">
          <img
            src={settingIcon}
            alt="Settings"
            className="w-5 h-5 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: 'transparent' }}
          />
        </NavLink>
      </nav>
    </header>

    <main className="max-w-5xl mx-auto">
      <Outlet /> {/* child routes render here */}
    </main>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login has NO navbar, NO wrapper — renders standalone */}
        <Route path="/login" element={<Login />} />

        {/* All other pages get the navbar via AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Main />} />
          {/* ... add other routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App