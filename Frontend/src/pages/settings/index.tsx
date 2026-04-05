import React from 'react';

import SettingsHeader from './components/SettingsHeader';
import ProfileForm from './components/ProfileForm';
import SchoolSecurityForm from './components/SchoolSecurityForm';
import Logo from '../../components/Logo';
 

const SettingsPage: React.FC = () => {
  return (
    // PURE BLACK BACKGROUND - No Earth background, noBlur effect
    <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden antialiased pb-20">
      <Logo />
      {/* 2. Main Content Wrapper */}
      <main className="max-w-[1280px] mx-auto px-6 pt-32 pb-24 relative z-10 flex flex-col items-center">
        
        {/* Header (Title, Tabs) */}
        <SettingsHeader />

        {/* Forms Sections */}
        <ProfileForm />
        <SchoolSecurityForm />

        {/* 3. Floating Robot Avatar (Reuse) */}
      </main>

    </div>
  );
};

export default SettingsPage;