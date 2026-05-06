import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Key, UserCheck, Smartphone } from "lucide-react";

const SecurityTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
         <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Login & Security</h2>
         <p className="text-white/70 font-medium text-lg">Manage your account authentication and protection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- PASSWORD SECTION --- */}
        <Card className="bg-[#0A0A0A] border-white/10 shadow-xl overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                  <Key className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold">Password</CardTitle>
                  <CardDescription>Update your login credentials</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Current Password</Label>
              <Input type="password" className="bg-white/5 border-white/10 h-14 text-white placeholder:text-white/40" />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">New Password</Label>
              <Input type="password" className="bg-white/5 border-white/10 h-14 text-white placeholder:text-white/40" />
            </div>
            <Button className="w-full bg-white text-black font-black uppercase tracking-tighter h-14 rounded-2xl hover:bg-white/90">
               Update Password
            </Button>
          </CardContent>
        </Card>

        {/* --- 2FA / AUTH SECTION --- */}
        <Card className="bg-[#0A0A0A] border-white/10 shadow-xl overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8]">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold">Two-Factor Auth</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center py-12 gap-6">
             <Smartphone className="w-16 h-16 text-white/10" />
             <div className="space-y-2">
                <p className="font-bold text-white text-lg">Not yet configured</p>
                <p className="text-sm text-white/70 max-w-[240px]">Protect your account with mobile-based authentication codes.</p>
             </div>
             <Button variant="outline" className="border-[#00CEC8]/20 text-[#00CEC8] font-bold h-12 px-8 rounded-xl hover:bg-[#00CEC8]/5">
                Enable 2FA
             </Button>
          </CardContent>
        </Card>

        {/* --- ACTIVE SESSIONS --- */}
        <Card className="bg-[#0A0A0A] border-white/10 shadow-xl overflow-hidden lg:col-span-2">
           <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-xl font-bold">Active Sessions</CardTitle>
              <CardDescription>Devices currently logged into your account</CardDescription>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                 <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <UserCheck className="w-5 h-5 text-[#00CEC8]" />
                       <div>
                          <p className="font-bold text-white text-sm">Chrome on Windows (Current)</p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">IP: 192.168.1.1 • Last Active: Now</p>
                       </div>
                    </div>
                    <Button variant="ghost" className="text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10">Log out</Button>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityTab;
