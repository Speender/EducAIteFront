import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo.svg'
import background from '../../../assets/earthbg.svg'
import robot from '../../../assets/robot.svg'

const Login: React.FC = () => {
  const [schoolId, setSchoolId] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ schoolId, password, rememberMe })
  }

  return (
    <div className="login-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="logo-group">
            <img src={logo} alt="educAIte logo" className="logo-icon" />
            <span className="logo-text">
              educ<span className="logo-highlight">AI</span>te
            </span>
          </div>
        </div>
        <button className="signup-btn">Sign up</button>
      </nav>

      {/* Main content */}
      <main className="main-content">
        {/* Left side */}
        <div className="left-section">
          <h1 className="welcome-heading">Welcome Back...</h1>
          <p className="welcome-subtext">
            Your <span className="ai-highlight">AI</span>-powered workspace is ready to
            <br />continue your progress
          </p>
          <div className="robot-container">
            <img src={robot} alt="AI Robot" className="robot-img" />
          </div>
        </div>

        {/* Right side - Login card */}
        <div className="login-card">
          <h2 className="card-title">Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="School id"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="remember-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-checkbox"
                />
                <span>Remember me</span>
              </label>
            </div>
            <button type="submit" className="login-btn">Login</button>
            <p className="forgot-password">
              <a href="#">Forgot password?</a>
            </p>
          </form>
        </div>
      </main>

      {/* Earth background */}
      <div className="earth-bg">
        <img src={background} alt="" aria-hidden="true" />
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          position: relative;
          z-index: 10;
          background: rgba(248, 249, 250, 0.95);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #d1d5db;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          border-color: #9ca3af;
          background: #f3f4f6;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          letter-spacing: -0.02em;
        }

        .logo-highlight {
          color: #2563eb;
        }

        .signup-btn {
          background: #111827;
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .signup-btn:hover {
          background: #374151;
        }

        .main-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 48px 80px 0 80px;
          position: relative;
          z-index: 5;
          gap: 40px;
        }

        .left-section {
          flex: 1;
          max-width: 400px;
        }

        .welcome-heading {
          font-size: 2.4rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: 14px;
        }

        .welcome-subtext {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .ai-highlight {
          color: #2563eb;
          font-weight: 600;
        }

        .robot-container {
          margin-top: 20px;
        }

        .robot-img {
          width: 200px;
          height: auto;
          filter: drop-shadow(0 8px 24px rgba(37, 99, 235, 0.15));
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .login-card {
          width: 420px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 40px 40px 48px 40px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: -0.02em;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          width: 100%;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.95rem;
          color: #1f2937;
          background: white;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .form-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .remember-row {
          display: flex;
          align-items: center;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: #4b5563;
          cursor: pointer;
        }

        .remember-checkbox {
          width: 15px;
          height: 15px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          background: #111827;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          margin-top: 4px;
        }

        .login-btn:hover {
          background: #1f2937;
          transform: translateY(-1px);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .forgot-password {
          text-align: center;
          margin-top: 4px;
        }

        .forgot-password a {
          font-size: 0.875rem;
          color: #4b5563;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password a:hover {
          color: #2563eb;
        }

        .earth-bg {
          position: absolute;
          bottom: -60px;
          left: 0;
          right: 0;
          z-index: 1;
          pointer-events: none;
        }

        .earth-bg img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        @media (max-width: 900px) {
          .main-content {
            flex-direction: column;
            align-items: center;
            padding: 32px 24px 0;
          }

          .left-section {
            text-align: center;
            max-width: 100%;
          }

          .robot-container {
            display: flex;
            justify-content: center;
          }

          .login-card {
            width: 100%;
            max-width: 420px;
          }
        }
      `}</style>
    </div>
  )
}

export default Login