import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo.svg'
import background from '../../../assets/earthbg.svg'
import robot from '../../../assets/robot.svg'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    number: '',
    school: '',
    schoolId: '',
    password: '',
    email: '',
  })

  const [fileName, setFileName] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Register Data:', formData)
    console.log('Uploaded File:', fileName)
  }

  const validateFile = (file: File) => {
    const isPdf = file.type === 'application/pdf'
    const isValidSize = file.size <= 15 * 1024 * 1024

    if (!isPdf) {
      alert('Only PDF files are allowed.')
      return false
    }

    if (!isValidSize) {
      alert('File size must be 15MB or less.')
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setFileName(file.name)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && validateFile(file)) {
      setFileName(file.name)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  return (
    <div className="register-page">
      <nav className="register-navbar">
        <div className="nav-left">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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

        <button className="login-btn-nav" onClick={() => navigate('/login')}>
          Login
        </button>
      </nav>

      <main className="register-main">
        <section className="upload-section">
          <p className="required-label">Required *</p>

          <div
            className={`upload-box ${dragActive ? 'drag-active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden-input"
            />

            <div className="pdf-icon">
              <svg
                width="95"
                height="95"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M38 4H18C15.7909 4 14 5.79086 14 8V56C14 58.2091 15.7909 60 18 60H46C48.2091 60 50 58.2091 50 56V16L38 4Z"
                  stroke="#5CA3FF"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M38 4V16H50"
                  stroke="#5CA3FF"
                  strokeWidth="2.5"
                  fill="none"
                />
                <rect
                  x="18"
                  y="20"
                  width="28"
                  height="12"
                  rx="2"
                  fill="#5CA3FF"
                  opacity="0.15"
                />
                <text
                  x="32"
                  y="29"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#5CA3FF"
                  fontWeight="700"
                >
                  PDF
                </text>
                <path
                  d="M46 42L52 36M52 36L58 42M52 36V54"
                  stroke="#5CA3FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="upload-title">Drag & Drop</h2>
            <p className="upload-subtitle">
              Your study load Or Browse to upload
            </p>
            <p className="upload-note">Only PDF files with max size of 15MB.</p>
            <p className="upload-desc">
              Upload your study load and let our AI automatically scan and
              extract your subjects for faster registration.
            </p>

            {fileName && <p className="file-name">Uploaded: {fileName}</p>}
          </div>
        </section>

        <section className="form-wrapper">
          <img src={robot} alt="robot" className="robot-image" />

          <div className="register-card">
            <h1 className="register-title">Registration</h1>

            <form className="register-form" onSubmit={handleRegister}>
              <div className="two-col">
                <div className="field-group">
                  <label>Required *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Required *</label>
                  <input
                    type="text"
                    name="middleName"
                    placeholder="Middle name"
                    value={formData.middleName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="two-col">
                <div className="field-group">
                  <label>Required *</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Required *</label>
                  <input
                    type="text"
                    name="number"
                    placeholder="Number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="field-group full">
                <label>Required *</label>
                <input
                  type="text"
                  name="school"
                  placeholder="School"
                  value={formData.school}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="two-col">
                <div className="field-group">
                  <label>Required *</label>
                  <input
                    type="text"
                    name="schoolId"
                    placeholder="School id"
                    value={formData.schoolId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Required *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="field-group full">
                <label>Required *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="register-btn">
                Register
              </button>
            </form>
          </div>
        </section>
      </main>

      <div className="earth-bg">
        <img src={background} alt="" aria-hidden="true" />
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          background: #f4f4f4;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .register-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 26px;
          position: relative;
          z-index: 10;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .back-btn {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid #8e8e8e;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #1f2937;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-icon {
          width: 28px;
          height: 28px;
        }

        .logo-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
        }

        .logo-highlight {
          color: #2f6df6;
        }

        .login-btn-nav {
          border: none;
          background: #000;
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
        }

        .register-main {
          position: relative;
          z-index: 5;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 36px;
          padding: 24px 28px 0;
        }

        .upload-section {
          width: 430px;
          position: relative;
          margin-top: 56px;
        }

        .required-label {
          color: #ff7a7a;
          font-size: 0.8rem;
          margin-bottom: 10px;
        }

        .upload-box {
          width: 100%;
          min-height: 360px;
          border: 1.8px dashed #7f7f7f;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 28px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .upload-box:hover,
        .upload-box.drag-active {
          border-color: #4f8cff;
          background: rgba(255, 255, 255, 0.6);
        }

        .hidden-input {
          display: none;
        }

        .pdf-icon {
          margin-bottom: 18px;
        }

        .upload-title {
          font-size: 2rem;
          color: #151515;
          font-weight: 500;
          margin-bottom: 22px;
        }

        .upload-subtitle {
          font-size: 0.95rem;
          color: #333;
          margin-bottom: 6px;
        }

        .upload-note {
          font-size: 0.95rem;
          color: #2f46ff;
          font-weight: 500;
          margin-bottom: 28px;
        }

        .upload-desc {
          font-size: 0.82rem;
          color: black;
          max-width: 320px;
          line-height: 1.5;
        }

        .file-name {
          margin-top: 18px;
          font-size: 0.9rem;
          color: #2563eb;
          font-weight: 600;
          word-break: break-word;
        }

        .form-wrapper {
          position: relative;
          width: 430px;
        }

        .robot-image {
          position: absolute;
          top: -18px;
          left: -85px;
          width: 92px;
          z-index: 6;
        }

        .register-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid #b8b8b8;
          border-radius: 18px;
          padding: 34px 22px 28px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .register-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: #161616;
          margin-bottom: 26px;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-group label {
          font-size: 0.65rem;
          color: #ff7a7a;
          margin-left: 2px;
        }

        .field-group input {
          width: 100%;
          height: 30px;
          border: 1px solid #9a9a9a;
          border-radius: 10px;
          padding: 0 12px;
          font-size: 0.85rem;
          outline: none;
          background: rgba(255, 255, 255, 0.8);
        }

        .field-group input:focus {
          border-color: #2f6df6;
          box-shadow: 0 0 0 2px rgba(47, 109, 246, 0.08);
        }

        .full {
          width: 100%;
        }

        .register-btn {
          width: 82%;
          margin: 28px auto 0;
          height: 36px;
          border: none;
          border-radius: 14px;
          background: #000;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.28);
        }

        .earth-bg {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -100px;
          z-index: 1;
          pointer-events: none;
        }

        .earth-bg img {
          width: 100%;
          display: block;
        }

        @media (max-width: 1100px) {
          .register-main {
            flex-direction: column;
            align-items: center;
            padding-bottom: 80px;
          }

          .upload-section,
          .form-wrapper {
            width: 100%;
            max-width: 430px;
          }

          .robot-image {
            left: -20px;
            top: -40px;
          }
        }

        @media (max-width: 600px) {
          .register-navbar {
            padding: 16px;
          }

          .register-main {
            padding: 16px;
            gap: 24px;
          }

          .two-col {
            grid-template-columns: 1fr;
          }

          .register-title {
            font-size: 1.6rem;
          }

          .upload-title {
            font-size: 1.6rem;
          }

          .login-btn-nav {
            padding: 10px 18px;
          }
        }
      `}</style>
    </div>
  )
}

export default Register