import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import background from '../../assets/earthbg.svg'
import robot from '../../assets/robot.svg'

const features = [
  {
    title: 'AI-Assisted Course Picker',
    description:
      'Choose the right course path with AI guidance. educAIte helps you learn and study your subjects more effectively based on your needs.',
  },
  {
    title: 'Analytics AI Analyzer',
    description:
      'Analyze your school and educAIte performance. Get AI-powered insights on your strengths, weaknesses, and study habits.',
  },
  {
    title: 'AI Flashcards',
    description:
      'Generate flashcards automatically with AI or create them manually. Perfect for studying courses, quizzes, and exams.',
  },
  {
    title: 'Progress Tracker',
    description:
      'Track your progress with a GitHub-like box tracker. Stay motivated by seeing your consistency, growth, and study streaks.',
  },
  {
    title: 'Smart Calendar',
    description:
      'Manage quizzes, exams, and school activities in one place. AI reminders help you prepare early and study ahead.',
  },
  {
    title: 'AI Resume Creator',
    description:
      'Build resumes for your job or internship applications. AI helps you create polished resumes with multiple templates to choose from.',
  },
]

const Main: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <nav className="landing-navbar">
        <div className="logo-group">
          <img src={logo} alt="educAIte logo" className="logo-icon" />
          <span className="logo-text">
            educ<span className="logo-highlight">AI</span>te
          </span>
        </div>

        <div className="nav-actions">
          <button className="nav-login" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="nav-register" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-left">
          <p className="hero-badge">AI-powered academic assistant</p>

          <h1 className="hero-title">
            Study smarter with <span>educAIte</span>
          </h1>

          <p className="hero-description">
            educAIte helps students stay organized, improve performance, and
            study effectively with AI-powered tools for courses, analytics,
            flashcards, tracking, calendars, and resume building.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/register')}>
              Register using your study load
            </button>
            <button className="secondary-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>

          <p className="hero-subtext">
            Upload your study load and let AI help organize your academic
            journey from day one.
          </p>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <img src={robot} alt="AI assistant robot" className="hero-robot" />
            <h2>Your AI study partner</h2>
            <p>
              From choosing courses to preparing for exams and building resumes,
              educAIte supports your entire student journey.
            </p>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="section-header">
          <p className="section-tag">Features</p>
          <h2>Everything you need to succeed in school</h2>
          <p>
            Built to help students manage academics, stay motivated, and prepare
            for opportunities beyond the classroom.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2>Start your academic journey with AI</h2>
          <p>
            Register now using your study load and let educAIte organize your
            courses, study tools, and reminders for you.
          </p>
          <button className="primary-btn" onClick={() => navigate('/register')}>
            Get Started
          </button>
        </div>
      </section>

      <div className="earth-bg">
        <img src={background} alt="" aria-hidden="true" />
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .landing-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f5f6f8 0%, #eef1f5 100%);
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
          color: #0f172a;
        }

        .landing-navbar {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 42px;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
        }

        .logo-text {
          font-size: 1.9rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .logo-highlight {
          color: #2563eb;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .nav-login,
        .nav-register,
        .primary-btn,
        .secondary-btn {
          border: none;
          cursor: pointer;
          transition: 0.2s ease;
          font-weight: 600;
        }

        .nav-login {
          background: transparent;
          color: #0f172a;
          padding: 12px 20px;
          border-radius: 10px;
        }

        .nav-login:hover {
          background: rgba(15, 23, 42, 0.06);
        }

        .nav-register,
        .primary-btn {
          background: #0b132b;
          color: white;
          padding: 14px 22px;
          border-radius: 12px;
          box-shadow: 0 10px 24px rgba(11, 19, 43, 0.18);
        }

        .nav-register:hover,
        .primary-btn:hover {
          transform: translateY(-1px);
          background: #111c3d;
        }

        .secondary-btn {
          background: white;
          color: #0f172a;
          padding: 14px 22px;
          border-radius: 12px;
          border: 1px solid #dbe2ea;
        }

        .secondary-btn:hover {
          background: #f8fafc;
        }

        .hero-section {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          align-items: center;
          padding: 40px 42px 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-left {
          max-width: 720px;
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 4.2rem;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 20px;
          color: #0f172a;
        }

        .hero-title span {
          color: #2563eb;
        }

        .hero-description {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #475569;
          max-width: 660px;
          margin-bottom: 28px;
        }

        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .hero-subtext {
          font-size: 0.98rem;
          color: #64748b;
        }

        .hero-right {
          display: flex;
          justify-content: center;
        }

        .hero-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 28px;
          padding: 36px 32px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
        }

        .hero-robot {
          width: 180px;
          max-width: 100%;
          margin-bottom: 18px;
          filter: drop-shadow(0 12px 24px rgba(37, 99, 235, 0.18));
          animation: float 3s ease-in-out infinite;
        }

        .hero-card h2 {
          font-size: 1.7rem;
          margin-bottom: 12px;
          color: #0f172a;
        }

        .hero-card p {
          color: #475569;
          line-height: 1.7;
          font-size: 1rem;
        }

        .features-section {
          position: relative;
          z-index: 5;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 42px 80px;
        }

        .section-header {
          max-width: 760px;
          margin-bottom: 30px;
        }

        .section-tag {
          color: #2563eb;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .section-header h2 {
          font-size: 2.4rem;
          margin-bottom: 12px;
          color: #0f172a;
        }

        .section-header p {
          color: #64748b;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 22px;
          padding: 24px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.1);
        }

        .feature-card h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #0f172a;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.7;
          font-size: 0.96rem;
        }

        .cta-section {
          position: relative;
          z-index: 5;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 42px 120px;
        }

        .cta-card {
          background: linear-gradient(135deg, rgba(11, 19, 43, 0.95), rgba(37, 99, 235, 0.92));
          color: white;
          border-radius: 28px;
          padding: 40px 32px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(11, 19, 43, 0.22);
        }

        .cta-card h2 {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }

        .cta-card p {
          max-width: 760px;
          margin: 0 auto 22px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .cta-card .primary-btn {
          background: white;
          color: #0b132b;
          box-shadow: none;
        }

        .cta-card .primary-btn:hover {
          background: #f8fafc;
        }

        .earth-bg {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -120px;
          z-index: 1;
          pointer-events: none;
          opacity: 0.5;
        }

        .earth-bg img {
          width: 100%;
          display: block;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 1100px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-left {
            margin: 0 auto;
          }

          .hero-buttons {
            justify-content: center;
          }

          .section-header {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .landing-navbar,
          .hero-section,
          .features-section,
          .cta-section {
            padding-left: 20px;
            padding-right: 20px;
          }

          .landing-navbar {
            flex-direction: column;
            gap: 14px;
            align-items: flex-start;
          }

          .nav-actions {
            width: 100%;
          }

          .nav-login,
          .nav-register {
            flex: 1;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .section-header h2,
          .cta-card h2 {
            font-size: 1.8rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .hero-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default Main