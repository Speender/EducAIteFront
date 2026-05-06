import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentStudentQuery } from "@/features/auth/api/hooks";
import { useUpdateProfile, updateProfileRequestSchema, type UpdateProfileRequest } from "@/features/student-profile/api/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UserCircle } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

const ProfileTab: React.FC = () => {
  const { showSuccess } = useToast();
  const { data: student, isLoading: isLoadingStudent } = useCurrentStudentQuery();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileRequestSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        middleName: student.middleName || "",
        lastName: student.lastName,
        phoneNumber: student.phoneNumber || "",
      });
    }
  }, [student, reset]);

  const onSubmit = (data: UpdateProfileRequest) => {
    updateProfile(data, {
      onSuccess: () => {
        showSuccess("Profile updated successfully!");
      }
    });
  };

  if (isLoadingStudent) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#00CEC8]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* --- FORM SECTION --- */}
      <div className="flex-1 space-y-8">
        <Card className="bg-[#0A0A0A] border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8]">
                  <UserCircle className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Basic Information</CardTitle>
                  <CardDescription className="text-white/70">Keep your personal details up to date</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-white/80 font-bold uppercase tracking-widest text-[10px]">First Name</Label>
                  <Input 
                    id="firstName" 
                    {...register("firstName")} 
                    className="bg-white/5 border-white/10 h-14 px-5 text-base text-white placeholder:text-white/40 focus:border-[#00CEC8]/50 focus:ring-1 focus:ring-[#00CEC8]/50 transition-all"
                  />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="middleName" className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Middle Name (Optional)</Label>
                  <Input 
                    id="middleName" 
                    {...register("middleName")} 
                    className="bg-white/5 border-white/10 h-14 px-5 text-base text-white placeholder:text-white/40 focus:border-[#00CEC8]/50 focus:ring-1 focus:ring-[#00CEC8]/50 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Last Name</Label>
                  <Input 
                    id="lastName" 
                    {...register("lastName")} 
                    className="bg-white/5 border-white/10 h-14 px-5 text-base text-white placeholder:text-white/40 focus:border-[#00CEC8]/50 focus:ring-1 focus:ring-[#00CEC8]/50 transition-all"
                  />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phoneNumber" className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    type="tel"
                    {...register("phoneNumber")} 
                    className="bg-white/5 border-white/10 h-14 px-5 text-base text-white placeholder:text-white/40 focus:border-[#00CEC8]/50 focus:ring-1 focus:ring-[#00CEC8]/50 transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-2 opacity-50">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Email (Locked)</Label>
                  <Input 
                    value={student?.email || ""} 
                    disabled 
                    className="bg-white/5 border-white/5 h-14 px-5 text-base text-white/60 italic cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isUpdating || !isDirty}
                  className="bg-white text-black font-black uppercase tracking-tighter px-10 h-14 rounded-2xl hover:bg-white/90 disabled:opacity-20 transition-all"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* --- SIDE INFO / AVATAR --- */}
      <div className="lg:w-1/3 space-y-6">
         <Card className="bg-[#0A0A0A] border-white/10 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center gap-6">
               <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00CEC8] to-[#008E8A] p-1 animate-in zoom-in duration-700">
                     <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border-4 border-black">
                        <UserCircle className="w-20 h-20 text-white/10" />
                     </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                     <p className="text-[10px] font-black uppercase text-white">Change</p>
                  </div>
               </div>
               
               <div>
                  <h3 className="text-xl font-bold text-white">{student?.firstName} {student?.lastName}</h3>
                  <p className="text-sm text-white/70 font-mono mt-1 uppercase tracking-widest">{student?.studentIdNumber}</p>
               </div>

               <div className="w-full grid grid-cols-2 gap-2 mt-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                     <p className="text-[10px] uppercase font-black text-white/50 mb-1">Program</p>
                     <p className="text-xs font-bold text-[#00CEC8]">{student?.program || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                     <p className="text-[10px] uppercase font-black text-white/50 mb-1">Semester</p>
                     <p className="text-xs font-bold text-[#00CEC8]">{student?.semester || "1"}nd</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="p-6 rounded-2xl border border-[#00CEC8]/10 bg-[#00CEC8]/5">
            <p className="text-xs text-[#00CEC8]/80 leading-relaxed italic">
               Note: Certain fields like Email and Student ID are verified records and cannot be changed here. Contact administration if you need to update them.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ProfileTab;
