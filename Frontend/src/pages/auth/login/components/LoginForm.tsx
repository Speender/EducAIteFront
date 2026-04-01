import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { motion } from 'framer-motion'; // <-- IMPORT FRAMER MOTION
import seePass from '../../../../assets/see-pass.svg';
import hidePass from '../../../../assets/hide-pass.svg';

const LoginForm: React.FC = () => {
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ schoolId, password, rememberMe });
    navigate('/main'); 
  };

  return (
    // --- ADDED MOTION.DIV WITH POP-UP ANIMATION ---
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 30 }} // Starts transparent, smaller, and slightly lower
      animate={{ opacity: 1, scale: 1, y: 0 }}    // Pops into its normal state
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }} // 0.2s delay so it loads right after the hero text
      className="w-full max-w-[420px] md:max-w-[520px] bg-[#111111] text-white rounded-3xl border border-white/10 p-12 shadow-[0_8px_30px_rgba(0,0,0,0.5)] mx-auto"
    >
      <h2 className="text-[1.75rem] font-bold text-white text-center mb-10 tracking-tight">
        Login
      </h2>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        {/* School ID Input */}
        <div className="w-full">
          <input
            type="text"
            placeholder="School id"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            className="w-full px-4 py-3.5 border border-white/20 rounded-xl text-[0.95rem] text-white bg-black outline-none transition-all placeholder:text-white/40 focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)]"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 border border-white/20 rounded-xl text-[0.95rem] text-white bg-black outline-none transition-all placeholder:text-white/40 focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)]"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer filter invert"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={showPassword ? hidePass : seePass}
              alt="toggle password"
              className="w-[20px] h-[20px]"
            />
          </button>
        </div>

        {/* Remember Me */}
        <div className="flex items-center mt-[-4px]">
          <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-[16px] h-[16px] accent-[#00CEC8] cursor-pointer"
            />
            <span>Remember me</span>
          </label>
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          className="w-full py-4 mt-2 bg-white text-black rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          Login
        </button>

        {/* Forgot Password */}
        <div className="text-center mt-2">
          <Link 
            to="/forgot" 
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;