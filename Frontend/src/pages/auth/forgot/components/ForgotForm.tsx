import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

const ForgotForm = () => {
  const navigate = useNavigate();
  
  // Form States
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Handle 60-second cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if on cooldown
    if (cooldown > 0) return;

    // Reset states
    setStatus('idle');
    setErrorMessage('');

    // Validation
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Simulate API Call
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setCooldown(60); // Start 60-second cooldown
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 30 }} // Starts transparent, smaller, and slightly lower
      animate={{ opacity: 1, scale: 1, y: 0 }}    // Pops into its normal state
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }} // 0.2s delay so it loads right after the hero text
      className="w-full max-w-[420px] md:max-w-[520px] bg-[#111111] text-white rounded-3xl border border-white/10 p-12 shadow-[0_8px_30px_rgba(0,0,0,0.5)] mx-auto"
    >
      {/* Sleek Dark Card from reference image */}
    
        
        <h2 className="text-3xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-white/60 text-center text-sm mb-8">
          Enter your email to reset your password
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          
          {/* Email Input - Styled like reference image */}
          <div className="relative">
            <label htmlFor="email" className="sr-only">Email or School ID</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle'); // clear error on type
              }}
              placeholder="School id or Email"
              className={`w-full bg-white text-black placeholder:text-gray-500 font-medium px-6 py-4 rounded-full outline-none transition-all ${
                status === 'error' ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#00CEC8] shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]'
              }`}
              aria-label="Email Address or School ID"
              disabled={status === 'loading' || cooldown > 0}
            />
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <p className="text-red-500 text-sm font-medium px-4 -mt-2 animate-in fade-in slide-in-from-top-1">
              {errorMessage}
            </p>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Reset link sent! Please check your inbox.
            </div>
          )}

          {/* Submit Button - with glowing shadow */}
          <button
            type="submit"
            disabled={status === 'loading' || cooldown > 0}
            className="w-full bg-white text-black font-bold text-lg px-6 py-4 rounded-full mt-2 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] disabled:hover:scale-100 disabled:active:scale-100"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : cooldown > 0 ? (
              `Try again in ${cooldown}s`
            ) : (
              'Send Reset Link'
            )}
          </button>

        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            Return to Login
          </button>
        </div>
    </motion.div>
  );
};

export default ForgotForm;  