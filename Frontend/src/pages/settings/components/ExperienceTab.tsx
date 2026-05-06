import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useProfileExperience,
  useAddProfileExperience,
  useUpdateProfileExperience,
  useDeleteProfileExperience,
} from "@/features/student-profile/api/hooks";
import { employmentHistorySchema, type CreateEmploymentHistoryRequestDto, type UpdateEmploymentHistoryRequestDto } from "@/features/resume/api/dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil, Briefcase, Calendar, X, Loader2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ToastProvider";

const ExperienceTab = () => {
  const { showSuccess } = useToast();
  const { data: experience = [], isLoading } = useProfileExperience();
  const { mutate: addExp, isPending: isAddingMut } = useAddProfileExperience();
  const { mutate: updateExp, isPending: isUpdatingMut } = useUpdateProfileExperience();
  const { mutate: deleteExp, isPending: isDeletingMut } = useDeleteProfileExperience();

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
           <h2 className="text-3xl font-black tracking-tighter uppercase">Professional Journey</h2>
           <p className="text-white/70 font-medium">Document your work history, internships, and professional impact</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-[#00CEC8] text-black font-black uppercase tracking-tight px-8 h-12 rounded-xl hover:bg-[#00CEC8]/90 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Experience
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isAdding && (
          <ExperienceEntryForm
            orderIndex={experience.length}
            onSave={(data: CreateEmploymentHistoryRequestDto) => {
              addExp(data, {
                onSuccess: () => {
                  showSuccess("Experience added!");
                  setIsAdding(false);
                }
              });
            }}
            onCancel={() => setIsAdding(false)}
            isPending={isAddingMut}
          />
        )}

        {experience.length > 0 ? (
          experience.map((job: any) => (
            <div key={job.employmentSqid}>
               {editingId === job.employmentSqid ? (
                 <ExperienceEntryForm
                   initialData={job}
                   onSave={(data: UpdateEmploymentHistoryRequestDto) => {
                     updateExp({
                       employmentSqid: job.employmentSqid,
                       payload: data,
                     }, {
                       onSuccess: () => {
                         showSuccess("Experience updated!");
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
                             <Briefcase className="w-8 h-8" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Experience</span>
                       </div>
                       <div className="flex-1 p-8">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-xl font-bold text-white mb-1">{job.positionTitle}</h4>
                                <div className="flex items-center gap-2 text-[#00CEC8] font-bold text-sm tracking-tight">
                                   <span>{job.companyName}</span>
                                   <span className="text-white/50">•</span>
                                   <span className="flex items-center gap-1 font-medium text-white/70"><MapPin className="w-3 h-3" />{job.location}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/80 uppercase">
                                      <Calendar className="w-3 h-3 text-[#00CEC8]" />
                                      {job.startDate} — {job.isCurrent ? "Present" : job.endDate}
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-10 h-10 rounded-xl hover:bg-[#00CEC8]/10 hover:text-[#00CEC8] text-white/50"
                                  onClick={() => setEditingId(job.employmentSqid)}
                                  disabled={isUpdatingMut}
                                >
                                   <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-white/50"
                                  onClick={() => {
                                    deleteExp(job.employmentSqid, {
                                      onSuccess: () => showSuccess("Experience deleted!"),
                                    });
                                  }}
                                  disabled={isDeletingMut}
                                >
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                          </div>
                          
                          {job.responsibilities && job.responsibilities.length > 0 && (
                            <ul className="mt-8 space-y-3">
                               {job.responsibilities.map((res: string, i: number) => (
                                 <li key={i} className="text-sm text-white/70 flex gap-3 leading-relaxed max-w-3xl">
                                    <span className="text-[#00CEC8] font-bold">/</span>
                                    {res}
                                 </li>
                               ))}
                            </ul>
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
               <Briefcase className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-xl font-bold text-white/70">No work history yet</h3>
            <p className="text-sm text-white/50 mt-2 max-w-xs">Showcase your professional background and contributions.</p>
            <Button 
               variant="link" 
               className="mt-6 text-[#00CEC8] font-bold uppercase tracking-widest text-[10px]"
               onClick={() => setIsAdding(true)}
            >
               + Add your first role
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ExperienceEntryForm = ({ onSave, onCancel, isPending, initialData, orderIndex = 0 }: any) => {
  const { register, control, handleSubmit, watch } = useForm({
    resolver: zodResolver(employmentHistorySchema),
    defaultValues: initialData || {
      isCurrent: false,
      responsibilities: [""],
      orderIndex,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "responsibilities" as never,
  });

  const isCurrent = watch("isCurrent");

  return (
    <Card className="bg-[#0A0A0A] border-[#00CEC8]/30 shadow-[0_0_50px_rgba(0,206,200,0.1)] rounded-3xl overflow-hidden">
      <CardHeader className="p-8 border-b border-white/5 bg-[#00CEC8]/5">
         <CardTitle className="text-xl font-black uppercase tracking-tighter">Add Experience</CardTitle>
         <CardDescription>Detail your role and achievements</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Company Name</Label>
            <Input {...register("companyName")} placeholder="e.g. Google" className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8]" />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Position Title</Label>
            <Input {...register("positionTitle")} placeholder="e.g. Software Engineer" className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8]" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Location</Label>
          <Input {...register("location")} placeholder="e.g. Remote or Mountain View, CA" className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8]" />
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
              className="bg-white/5 border-white/10 h-14 px-5 text-white placeholder:text-white/40 focus:border-[#00CEC8] disabled:opacity-20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
          <input
            type="checkbox"
            id="isCurrentEmp"
            {...register("isCurrent")}
            className="w-5 h-5 rounded-lg border-white/20 bg-white/5 text-[#00CEC8] focus:ring-[#00CEC8] cursor-pointer"
          />
          <Label htmlFor="isCurrentEmp" className="text-xs font-bold text-white/80 cursor-pointer">I currently work here</Label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/80">Responsibilities & Impact</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append("")}
              className="h-8 text-[10px] font-black uppercase tracking-wider text-[#00CEC8] hover:bg-[#00CEC8]/5 rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Key Achievement
            </Button>
          </div>
          
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 group animate-in slide-in-from-left-2 duration-300">
                <div className="flex-1 relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00CEC8] font-black opacity-40">/</div>
                   <Input
                     {...register(`responsibilities.${index}` as never)}
                     placeholder="Improved system performance by 20%..."
                     className="bg-white/5 border-white/10 h-12 pl-8 pr-5 text-white placeholder:text-white/40 focus:border-[#00CEC8] rounded-xl text-sm"
                   />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-12 w-12 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
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
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Experience"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceTab;
