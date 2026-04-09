import React from 'react';

import SettingsHeader from './components/SettingsHeader';
import ProfileForm from './components/ProfileForm';
import SchoolSecurityForm from './components/SchoolSecurityForm';
import Logo from '../../components/Logo';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden antialiased pb-16 md:pb-20 lg:pb-24">
      <Logo />
      
      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pt-36 lg:pt-32 pb-16 md:pb-24 relative z-10 flex flex-col items-center">
        
        {/* Header (Title, Tabs) */}
        <div className="w-full mb-8 md:mb-12">
          <SettingsHeader />
        </div>

        {/* Forms Sections */}
        <div className="w-full flex flex-col gap-10 md:gap-16">
          <ProfileForm />
          <SchoolSecurityForm />
        </div>

      </main>
    </div>
  );
};

export default SettingsPage;