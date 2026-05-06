import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/components/ToastProvider';
import { useRegisterWithStudyLoadMutation } from '@/features/onboarding/api/hooks';
import {
  registerWithStudyLoadFormSchema,
  type RegisterWithStudyLoadFormInput,
  type RegisterWithStudyLoadFormValues,
} from '@/features/onboarding/api/dto';
import { getErrorMessage } from '@/lib/api/errors';

interface RegisterFormProps {
  selectedFile: File | null;
  onMissingFile: (message: string) => void;
  onFileAccepted: () => void;
}

const inputClassName =
  'w-full px-5 py-4 border border-white/20 rounded-xl text-[0.95rem] text-white bg-black outline-none transition-all placeholder:text-white/30 focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)]';

const RegisterForm: React.FC<RegisterFormProps> = ({ selectedFile, onMissingFile, onFileAccepted }) => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const registerMutation = useRegisterWithStudyLoadMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterWithStudyLoadFormInput, undefined, RegisterWithStudyLoadFormValues>({
    resolver: zodResolver(registerWithStudyLoadFormSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      studentIdNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      expiresInMinutes: 60,
    },
  });

  const handleRegister = handleSubmit(async (values) => {
    if (!selectedFile) {
      onMissingFile('A studyload PDF is required before you can register.');
      return;
    }

    onFileAccepted();

    await registerMutation.mutateAsync({
      values,
      studyLoadDocument: selectedFile,
    });

    showSuccess('Account created successfully.');
    navigate('/main', {
      replace: true,
    });
  });

  return (
    <div className="w-full max-w-[500px] md:max-w-[560px] bg-[#111111] text-white rounded-3xl border border-white/10 p-12 shadow-[0_8px_30px_rgba(0,0,0,0.5)] mx-auto order-1 md:order-2">
      <h2 className="text-[1.75rem] font-bold text-white text-center mb-10 tracking-tight">
        Registration
      </h2>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <FormField
            label="First name"
            placeholder="First name"
            error={errors.firstName?.message}
            input={<input {...register('firstName')} className={inputClassName} placeholder="First name" />}
          />
          <FormField
            label="Middle name"
            optional
            placeholder="Middle name"
            error={errors.middleName?.message}
            input={<input {...register('middleName')} className={inputClassName} placeholder="Middle name" />}
          />
          <FormField
            label="Last name"
            placeholder="Last name"
            error={errors.lastName?.message}
            input={<input {...register('lastName')} className={inputClassName} placeholder="Last name" />}
          />
          <FormField
            label="School ID"
            placeholder="2024-00001"
            error={errors.studentIdNumber?.message}
            input={<input {...register('studentIdNumber')} className={inputClassName} placeholder="2024-00001" />}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <FormField
            label="Email"
            placeholder="you@school.edu"
            error={errors.email?.message}
            input={<input {...register('email')} type="email" className={inputClassName} placeholder="you@school.edu" />}
          />
          <FormField
            label="Link expiry (minutes)"
            placeholder="60"
            error={errors.expiresInMinutes?.message}
            input={<input {...register('expiresInMinutes', { valueAsNumber: true })} type="number" min={1} max={1440} className={inputClassName} placeholder="60" />}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <FormField
            label="Password"
            placeholder="Password"
            error={errors.password?.message}
            input={<input {...register('password')} type="password" className={inputClassName} placeholder="Password" />}
          />
          <FormField
            label="Confirm password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            input={<input {...register('confirmPassword')} type="password" className={inputClassName} placeholder="Confirm password" />}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white/60">
          Your course, semester, and studyload courses will be parsed from the uploaded PDF during onboarding.
        </div>

        {registerMutation.isError ? (
          <p className="text-sm text-rose-300">{getErrorMessage(registerMutation.error)}</p>
        ) : null}

        <button 
          type="submit" 
          disabled={registerMutation.isPending}
          className="w-full py-4 mt-4 bg-white text-black rounded-xl text-lg font-bold transition-all shadow-[0_6px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)] active:translate-y-0 hover:-translate-y-[1px]"
        >
          {registerMutation.isPending ? 'Creating your account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

interface FormFieldProps {
  label: string;
  placeholder: string;
  input: React.ReactNode;
  error?: string;
  optional?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, input, error, optional = false }) => (
  <div className="w-full">
    <label className="text-xs text-white/50 mb-1.5 block">
      {label} <span className="text-[#00CEC8]">{optional ? 'Optional' : '*'}</span>
    </label>
    {input}
    {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
  </div>
);
