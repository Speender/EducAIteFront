import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    number: '',
    school: '',
    schoolId: '',
    password: '',
    email: '',
  });

  // Reusable component for form inputs with "Required *" label
  const FormField: React.FC<{ label: string; name: keyof typeof formData; placeholder: string; type?: string }> = 
    ({ label, name, placeholder, type = 'text' }) => (
    <div className="w-full">
      <label className="text-xs text-white/50 mb-1.5 block">
        {label} <span className="text-[#00CEC8]">*</span>
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className="w-full px-5 py-4 border border-white/20 rounded-xl text-[0.95rem] text-white bg-black outline-none transition-all placeholder:text-white/30 focus:border-[#00CEC8] focus:shadow-[0_0_0_3px_rgba(0,206,200,0.08)]"
        required
      />
    </div>
  );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 30 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }}    
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }} 
      className="w-full max-w-[500px] md:max-w-[560px] bg-[#111111] text-white rounded-3xl border border-white/10 p-12 shadow-[0_8px_30px_rgba(0,0,0,0.5)] mx-auto order-1 md:order-2"
    >
      <h2 className="text-[1.75rem] font-bold text-white text-center mb-10 tracking-tight">
        Registration
      </h2>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        
        {/* Name Fields in a grid */}
        <div className="grid grid-cols-2 gap-5">
          <FormField label="First name" name="firstName" placeholder="First name" />
          <FormField label="Middle name" name="middleName" placeholder="Middle name" />
          <FormField label="Last name" name="lastName" placeholder="Last name" />
          <FormField label="Number" name="number" placeholder="Number" type="tel" />
        </div>

        {/* Full-width fields */}
        <FormField label="School" name="school" placeholder="School" />

        {/* School ID and Password grid */}
        <div className="grid grid-cols-2 gap-5">
          <FormField label="School id" name="schoolId" placeholder="School id" />
          <FormField label="Password" name="password" placeholder="Password" type="password" />
        </div>

        {/* Email field */}
        <FormField label="Email" name="email" placeholder="Email" type="email" />

        {/* --- WHITE BUTTON WITH GLOW --- */}
        <button 
          type="submit" 
          className="w-full py-4 mt-4 bg-white text-black rounded-xl text-lg font-bold transition-all shadow-[0_6px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)] active:translate-y-0 hover:-translate-y-[1px]"
        >
          Register
        </button>
      </form>
    </motion.div>
  );
};

export default RegisterForm;