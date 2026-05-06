import React from 'react';
import Navbar from '../../components/Navbar'; 
import Logo from '../../components/Logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, GraduationCap, Briefcase, Award, ShieldCheck } from "lucide-react";

import ProfileTab from './components/ProfileTab';
import EducationTab from './components/EducationTab';
import ExperienceTab from './components/ExperienceTab';
import CertificatesTab from './components/CertificatesTab';
import SecurityTab from './components/SecurityTab';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white/90 font-sans relative overflow-x-hidden antialiased pb-32">
      <Logo />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 relative z-10">
        <div className="flex flex-col mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Settings
          </h1>
          <p className="text-white/70 text-lg font-medium">
            Manage your academic and professional profile
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full space-y-10">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-auto flex-wrap md:flex-nowrap backdrop-blur-md">
            <TabsTrigger 
              value="profile" 
              className="flex-1 py-3 px-6 rounded-xl text-white/70 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black font-bold transition-all gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="education" 
              className="flex-1 py-3 px-6 rounded-xl text-white/70 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black font-bold transition-all gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Education
            </TabsTrigger>
            <TabsTrigger 
              value="experience" 
              className="flex-1 py-3 px-6 rounded-xl text-white/70 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black font-bold transition-all gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="certificates" 
              className="flex-1 py-3 px-6 rounded-xl text-white/70 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black font-bold transition-all gap-2"
            >
              <Award className="w-4 h-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex-1 py-3 px-6 rounded-xl text-white/70 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black font-bold transition-all gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="education">
              <EducationTab />
            </TabsContent>
            <TabsContent value="experience">
              <ExperienceTab />
            </TabsContent>
            <TabsContent value="certificates">
              <CertificatesTab />
            </TabsContent>
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
