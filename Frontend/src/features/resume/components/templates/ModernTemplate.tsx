import { type ResumeReviewResponseDto } from "../../api/dto";
import { Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Award } from "lucide-react";

interface TemplateProps {
  data: Partial<ResumeReviewResponseDto>;
}

const ModernTemplate = ({ data }: TemplateProps) => {
  const { personalDetails, summary, education, employmentHistory, certificates } = data;

  return (
    <div className="bg-white text-black w-[794px] min-h-[1123px] shadow-2xl flex font-sans">
      {/* SIDEBAR (30%) */}
      <aside className="w-[30%] bg-[#0A0A0A] text-white p-8 flex flex-col gap-10">
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold tracking-tighter leading-tight uppercase">
             {personalDetails?.firstName || "YOUR"}<br />
             <span className="text-[#00CEC8]">{personalDetails?.lastName || "NAME"}</span>
          </h1>
          
          <div className="space-y-3 text-[11px] text-white/70">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-white/5 border border-white/10">
                <Mail className="w-3 h-3 text-[#00CEC8]" />
              </div>
              <span className="truncate">{personalDetails?.email || "email@example.com"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-white/5 border border-white/10">
                <Phone className="w-3 h-3 text-[#00CEC8]" />
              </div>
              <span>{personalDetails?.phoneNumber || "+0 (000) 000-0000"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-white/5 border border-white/10">
                <MapPin className="w-3 h-3 text-[#00CEC8]" />
              </div>
              <span className="truncate">{personalDetails?.city || "City"}, {personalDetails?.provinceState || "State"}</span>
            </div>
            {personalDetails?.linkedInUrl && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-white/5 border border-white/10">
                  <Linkedin className="w-3 h-3 text-[#00CEC8]" />
                </div>
                <span>LinkedIn Profile</span>
              </div>
            )}
          </div>
        </div>

        {/* CERTIFICATES IN SIDEBAR */}
        <section className="space-y-4">
           <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00CEC8] flex items-center gap-2">
             <Award className="w-3.5 h-3.5" />
             Awards
           </h3>
           <div className="space-y-4">
             {certificates && certificates.length > 0 ? (
               certificates.map((cert, i) => (
                 <div key={i} className="space-y-0.5">
                   <h4 className="text-[12px] font-bold text-white">{cert.achievementName}</h4>
                   <p className="text-[10px] text-white/50">{cert.institution}</p>
                 </div>
               ))
             ) : (
               <p className="text-[10px] text-white/20 italic">No awards listed.</p>
             )}
           </div>
        </section>
      </aside>

      {/* MAIN CONTENT (70%) */}
      <main className="flex-1 p-10 space-y-10">
        {/* SUMMARY */}
        <section className="space-y-3">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#00CEC8] pb-1 border-b border-black/5">
            Profile
          </h3>
          <p className="text-[12.5px] leading-relaxed text-black/80 whitespace-pre-wrap">
            {summary?.summaryText || "Enter your summary to see it reflected here..."}
          </p>
        </section>

        {/* EXPERIENCE */}
        <section className="space-y-6">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#00CEC8] pb-1 border-b border-black/5 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Experience
          </h3>
          <div className="space-y-8">
            {employmentHistory && employmentHistory.length > 0 ? (
              employmentHistory.map((job, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-black/5 space-y-2">
                   <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#00CEC8]" />
                   <div className="flex justify-between items-start">
                     <h4 className="text-[14px] font-bold text-black uppercase tracking-tight">{job.positionTitle}</h4>
                     <span className="text-[10px] font-bold text-black/30 bg-black/5 px-2 py-0.5 rounded uppercase">
                       {job.startDate} — {job.isCurrent ? "Present" : job.endDate}
                     </span>
                   </div>
                   <p className="text-[12px] font-semibold text-[#00CEC8]">{job.companyName}</p>
                   {job.responsibilities && (
                     <ul className="list-disc list-outside ml-4 text-[12px] text-black/70 space-y-1">
                       {job.responsibilities.map((res, j) => (
                         <li key={j}>{res}</li>
                       ))}
                     </ul>
                   )}
                </div>
              ))
            ) : (
              <p className="text-xs text-black/20 italic">No experience listed yet.</p>
            )}
          </div>
        </section>

        {/* EDUCATION */}
        <section className="space-y-6">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#00CEC8] pb-1 border-b border-black/5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education
          </h3>
          <div className="space-y-6">
            {education && education.length > 0 ? (
              education.map((edu, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[14px] font-bold text-black">{edu.degree}</h4>
                    <span className="text-[10px] font-mono text-black/40">
                      {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <p className="text-[13px] text-black/70 italic">{edu.schoolName}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-black/20 italic">No education listed yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ModernTemplate;
