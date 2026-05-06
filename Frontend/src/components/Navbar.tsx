import { LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { clearAuthSession } from '@/lib/api/auth'

import settingIcon from '../assets/setting-navbar.svg'

const Navbar = () => {
  const navigate = useNavigate()

  const navItems = [
    { name: 'Home', path: '/main' }, 
    { name: 'Courses', path: '/courses' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Flashcards', path: '/flashcards/workspace' },
    { name: 'Tracker', path: '/tracker' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Resume', path: '/resume' },
    { name: 'Certificates', path: '/certificates' },
  ]

  function handleLogout() {
    clearAuthSession()
    navigate('/', { replace: true })
  }

  return (
    <header className="flex justify-center pt-8 w-full pointer-events-none">
      <nav className="flex items-center bg-black/50 backdrop-blur-md border-[1.5px] border-white/20 px-8 py-3 rounded-full gap-8 shadow-[0_8px_30px_rgba(255,255,255,0.15)] pointer-events-auto">
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative group text-sm transition-all pb-1 ${
                isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.name}
                
                {/* Animated Underline */}
                <span 
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'w-full bg-[#00CEC8] shadow-[0_0_10px_rgba(0,206,200,0.8)]' 
                      : 'w-0 bg-white/20 group-hover:w-full'
                  }`} 
                />
              </>
            )}
          </NavLink>
        ))}

        {/* --- SETTING ICON CONTAINER (UPDATED) --- */}
        <NavLink 
          to="/settings" 
          className={() =>
            `relative group flex items-center justify-center pb-1 transition-all`
          }
        >
          {({ isActive }) => (
            <>
              <img 
                src={settingIcon} 
                alt="Settings" 
                className={`w-5 h-5 brightness-0 invert transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                }`} 
              />
              
              {/* Animated Underline (Copied exactly from the text links) */}
              <span 
                className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-full bg-[#00CEC8] shadow-[0_0_10px_rgba(0,206,200,0.8)]' 
                    : 'w-0 bg-white/20 group-hover:w-full'
                }`} 
              />
            </>
          )}
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="relative group flex items-center justify-center pb-1 text-gray-400 transition-all hover:text-white"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" strokeWidth={2.1} />
          <span
            className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-white/20 transition-all duration-300 group-hover:w-full"
          />
        </button>
        
      </nav>
    </header>
  )
}

export default Navbar
