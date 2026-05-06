import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useProfileEducation,
  useAddProfileEducation,
  useUpdateProfileEducation,
  useDeleteProfileEducation,
} from "@/features/student-profile/api/hooks";
import { educationSchema, type CreateEducationRequestDto, type UpdateEducationRequestDto } from "@/features/resume/api/dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Pencil, GraduationCap, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ToastProvider";

const EducationTab = () => {
  const { showSuccess } = useToast();
  const { data: education = [], isLoading } = useProfileEducation();
  const { mutate: addEdu, isPending: isAddingMut } = useAddProfileEducation();
  const { mutate: updateEdu, isPending: isUpdatingMut } = useUpdateProfileEducation();
  const { mutate: deleteEdu, isPending: isDeletingMut } = useDeleteProfileEducation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#00CEC8]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black tracking-tighter uppercase">Academic Journey</h2>
           <p className="text-white/70 font-medium">Manage your degrees, certifications, and educational milestones</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-[#00CEC8] text-black font-black uppercase tracking-tight px-8 h-12 rounded-xl hover:bg-[#00CEC8]/90 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Achievement
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isAdding && (
          <EducationEntryForm
            mode="create"
            orderIndex={education.length}
            onSave={(data: CreateEducationRequestDto) => {
              addEdu(data, {
                onSuccess: () => {
                  showSuccess("Education added!");
                  setIsAdding(false);
                }
              });
            }}
            onCancel={() => setIsAdding(false)}
            isPending={isAddingMut}
          />
        )}

        {education.length > 0 ? (
          education.map((edu: any) => (
            <div key={edu.educationSqid}>
               {editingId === edu.educationSqid ? (
                 <EducationEntryForm
                   mode="edit"
                   initialData={edu}
                   onSave={(data: UpdateEducationRequestDto) => {
                     updateEdu({
                       educationSqid: edu.educationSqid,
                       payload: data,
                     }, {
                       onSuccess: () => {
                         showSuccess("Education updated!");
                         setEditingId(null);
                       },
                     });
                   }}
                   onCancel={() => setEditingId(null)}
                   isPending={isUpdatingMut}
                 />
               ) : (
               <Card className="bg-[#0A0A0A] border-white/10 hover:border-[#00CEC8]/30 transition-all group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                       <div className="md:w-48 bg-white/[0.02] border-r border-white/5 p-8 flex flex-col items-center justify-center text-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-[#00CEC8]/10 flex items-center justify-center text-[#00CEC8]">
                             <GraduationCap className="w-8 h-8" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Verified</span>
                       </div>
                       <div className="flex-1 p-8">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-xl font-bold text-white mb-1">{edu.degree}</h4>
                                <p className="text-[#00CEC8] font-bold text-sm tracking-tight">{edu.schoolName}</p>
                                <div className="flex items-center gap-3 mt-4">
                                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/80 uppercase">
                                      <Calendar className="w-3 h-3 text-[#00CEC8]" />
                                      {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-10 h-10 rounded-xl hover:bg-[#00CEC8]/10 hover:text-[#00CEC8] text-white/50"
                                  onClick={() => setEditingId(edu.educationSqid)}
                                  disabled={isUpdatingMut}
                                >
                                   <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-white/50"
                                  onClick={() => {
                                    deleteEdu(edu.educationSqid, {
                                      onSuccess: () => showSuccess("Education deleted!"),
                                    });
                                  }}
                                  disabled={isDeletingMut}
                                >
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                          </div>
                          {edu.description && (
                             <p className="mt-6 text-sm text-white/70 leading-relaxed max-w-2xl border-l-2 border-white/5 pl-6 italic">
                                {edu.description}
                             </p>
                          )}
                       </div>
                    </div>
                  </CardContent>
               </Card>
               )}
            </div>
          ))
        ) : !isAdding && (
          <div className="py-24 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center bg-white/[0.01]">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.02] flex items-center justify-center mb-6">
               <GraduationCap className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-xl font-bold text-white/70">No academic records yet</h3>
            <p className="text-sm text-white/50 mt-2 max-w-xs">Start building your profile by adding your educational background.</p>
            <Button 
               variant="link" 
               className="mt-6 text-[#00CEC8] font-bold uppercase tracking-widest text-[10px]"
               onClick={() => setIsAdding(true)}
            >
               + Add your first entry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const EducationEntryForm = ({ onSave, onCancel, isPending, initialData, orderIndex = 0 }: any) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || {
      isCurrent: false,
      orderIndex,
    },
  });

  const isCurrent = watch("isCurrent");

  return (
    <Card className="bg-[#0A0A0A] border-[#00CEC8]/30 shadow-[0_0_50px_rgba(0,206,200,0.1)] rounded-3xl overflow-hidden">
      <CardHeader className="p-8 border-b border-white/5 bg-[#00CEC8]/5">
         <CardTitle className="text-xl font-black uppercase tracking-tighter">Add Education</CardTitle>
         <CardDescription>Enter details about your school or degree</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">School Name</Label>
            <Input {...register("schoolName")} placeholder="e.g. Harvard University" className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8]" />
            {errors.schoolName && <p className="text-xs text-red-500">{(errors.schoolName as any).message}</p>}
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Degree / Certificate</Label>
            <Input {...register("degree")} placeholder="e.g. Bachelor of Science" className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8]" />
            {errors.degree && <p className="text-xs text-red-500">{(errors.degree as any).message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Start Date</Label>
            <Input {...register("startDate")} placeholder="MM/YYYY" className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8]" />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">End Date</Label>
            <Input
              {...register("endDate")}
              disabled={isCurrent}
              placeholder={isCurrent ? "Present" : "MM/YYYY"}
              className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8] disabled:opacity-20 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
          <input
            type="checkbox"
            id="isCurrent"
            {...register("isCurrent")}
            className="w-5 h-5 rounded-lg border-white/20 bg-white/5 text-[#00CEC8] focus:ring-[#00CEC8] cursor-pointer"
          />
          <Label htmlFor="isCurrent" className="text-xs font-bold text-white/80 cursor-pointer">I am currently studying here</Label>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Description (Optional)</Label>
            <Textarea 
              {...register("description")} 
              placeholder="Tell us about your studies, honors, or activities..."
            className="bg-white/5 border-white/10 min-h-[120px] p-5 text-white placeholder:text-white/40 focus:border-[#00CEC8] rounded-2xl" 
            />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button variant="ghost" onClick={onCancel} className="h-14 px-8 rounded-2xl text-white/70 font-bold hover:text-white uppercase tracking-widest text-[10px]">
            Discard
          </Button>
          <Button 
            disabled={isPending}
            onClick={handleSubmit(onSave)} 
            className="bg-white text-black h-14 px-10 rounded-2xl font-black uppercase tracking-tighter hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Achievement"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationTab;
