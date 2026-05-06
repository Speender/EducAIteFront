import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom'; 

import seePass from '../../../../assets/see-pass.svg';
import hidePass from '../../../../assets/hide-pass.svg';
import { useToast } from '@/components/ToastProvider';
import { loginRequestSchema, type LoginRequest } from '@/features/auth/api/dto';
import { useLoginMutation } from '@/features/auth/api/hooks';
import { getErrorMessage } from '@/lib/api/errors';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      studentIdNumber: '',
      password: '',
    },
  });

  const handleLogin = handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);

    if (!rememberMe) {
      sessionStorage.setItem('educaite.login.transient', 'true');
    }

    showSuccess('Logged in successfully.');
    navigate('/main', { replace: true });
  });

  return (
    <div className="w-full max-w-[420px] md:max-w-[520px] bg-[#111111] text-white rounded-3xl border border-white/10 p-12 shadow-[0_8px_30px_rgba(0,0,0,0.5)] mx-auto">
      <h2 className="text-[1.75rem] font-bold text-white text-center mb-10 tracking-tight">
        Login
      </h2>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div className="w-full">
          <input
            type="text"
            placeholder="School id"
            {...register('studentIdNumber')}
            className="w-full px-4 py-3.5 border border-white/20 rounded-xl text-[0.95rem] text-white bg-black outline-none transition-all placeholder:text-white/40 focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)]"
            required
          />
          {errors.studentIdNumber ? <p className="mt-2 text-xs text-rose-300">{errors.studentIdNumber.message}</p> : null}
        </div>

        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
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
          {errors.password ? <p className="mt-2 text-xs text-rose-300">{errors.password.message}</p> : null}
        </div>

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

        {loginMutation.isError ? (
          <p className="text-sm text-rose-300">{getErrorMessage(loginMutation.error)}</p>
        ) : null}

        <button 
          type="submit" 
          disabled={loginMutation.isPending}
          className="w-full py-4 mt-2 bg-white text-black rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Login'}
        </button>

        <div className="text-center mt-2">
          <Link 
            to="/forgot" 
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

