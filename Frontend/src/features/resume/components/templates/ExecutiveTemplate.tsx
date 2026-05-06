import { type ResumeReviewResponseDto } from "../../api/dto";

interface TemplateProps {
  data: Partial<ResumeReviewResponseDto>;
}

const ExecutiveTemplate = ({ data }: TemplateProps) => {
  const { personalDetails, summary, education, employmentHistory, certificates } = data;

  return (
    <div className="bg-white text-black w-[794px] min-h-[1123px] shadow-2xl p-14 font-sans">
      {/* HEADER SECTION - Left Aligned */}
      <header className="flex justify-between items-end border-b-4 border-black pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">
            {personalDetails?.firstName || "YOUR"} {personalDetails?.lastName || "NAME"}
          </h1>
          <p className="text-[13px] font-bold text-black/60 uppercase tracking-widest italic">
            {employmentHistory?.[0]?.positionTitle || "Professional Professional"}
          </p>
        </div>
        <div className="text-right text-[11px] font-medium space-y-0.5">
          <p>{personalDetails?.email || "email@example.com"}</p>
          <p>{personalDetails?.phoneNumber || "(000) 000-0000"}</p>
          <p>{personalDetails?.city || "City"}, {personalDetails?.provinceState || "State"}</p>
          {personalDetails?.linkedInUrl && <p className="font-bold underline italic">LinkedIn</p>}
        </div>
      </header>

      <div className="space-y-10">
        {/* SUMMARY - High Impact */}
        {summary?.summaryText && (
          <section className="bg-black/5 p-6 border-l-4 border-black">
            <h3 className="text-[14px] font-black uppercase tracking-widest mb-3">Executive Summary</h3>
            <p className="text-[13px] leading-relaxed text-black/90 font-medium">
              {summary.summaryText}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        <section>
          <h3 className="text-[14px] font-black uppercase tracking-widest mb-6 flex items-center gap-3">
             Work Experience
             <div className="flex-1 h-px bg-black/10" />
          </h3>
          <div className="space-y-8">
            {employmentHistory && employmentHistory.length > 0 ? (
              employmentHistory.map((job, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[16px] font-black text-black">{job.companyName}</h4>
                    <span className="text-[11px] font-bold text-black/40 uppercase">
                      {job.startDate} — {job.isCurrent ? "Present" : job.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline -mt-1">
                    <span className="text-[13px] font-bold text-black/70 italic">{job.positionTitle}</span>
                    <span className="text-[11px] font-medium text-black/50">{job.location}</span>
                  </div>
                  {job.responsibilities && (
                    <ul className="grid grid-cols-1 gap-1.5 text-[12px] text-black/80">
                      {job.responsibilities.map((res, j) => (
                        <li key={j} className="flex gap-2">
                           <span className="text-black font-bold">/</span>
                           {res}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-black/20 italic">No experience listed.</p>
            )}
          </div>
        </section>

        {/* EDUCATION */}
        <section>
          <h3 className="text-[14px] font-black uppercase tracking-widest mb-6 flex items-center gap-3">
             Education
             <div className="flex-1 h-px bg-black/10" />
          </h3>
          <div className="space-y-6">
            {education && education.length > 0 ? (
              education.map((edu, i) => (
                <div key={i} className="space-y-1">
                   <div className="flex justify-between items-baseline">
                    <h4 className="text-[15px] font-black text-black">{edu.schoolName}</h4>
                    <span className="text-[11px] font-bold text-black/40 uppercase">
                      {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <p className="text-[13px] font-bold text-black/60 italic">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-black/20 italic">No education listed.</p>
            )}
          </div>
        </section>

        {/* CERTIFICATES */}
        {certificates && certificates.length > 0 && (
          <section>
            <h3 className="text-[14px] font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              Certifications & Awards
              <div className="flex-1 h-px bg-black/10" />
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {certificates.map((cert, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-black" />
                   <span className="text-[12px] font-bold">{cert.achievementName}</span>
                   <span className="text-[11px] text-black/50">({cert.institution})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
