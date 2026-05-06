import type { ReactNode } from "react";
import { Mail, MapPin, Phone, Linkedin, Globe, Briefcase, GraduationCap, Award, Trophy, Wrench } from "lucide-react";
import type { ResumeReviewResponseDto } from "../api/dto";
import { useResumeStore } from "../hooks/useResumeStore";
import { buildNormalizedPreviewData, normalizeTemplateCode, resolveTemplateDefinition, type ResumeSectionId } from "../lib/templateRuntime";
import HarvardTemplate from "./templates/HarvardTemplate";

interface ResumePreviewProps {
  data: Partial<ResumeReviewResponseDto>;
}

const ResumePreview = ({ data }: ResumePreviewProps) => {
  const selectedTemplateCode = useResumeStore((state) => state.selectedTemplateCode);
  const selectedAccentColor = useResumeStore((state) => state.selectedAccentColor);
  const templateCode = normalizeTemplateCode(selectedTemplateCode || data.template?.code || "harvard_classic");
  const renderConfigJson = null;

  const normalized = buildNormalizedPreviewData(data, templateCode, renderConfigJson);
  const { definition } = resolveTemplateDefinition(templateCode, renderConfigJson);

  const accentColor = templateCode === "harvard_classic" ? "#000000" : selectedAccentColor;

  if (templateCode === "harvard_classic") {
    return <HarvardTemplate data={data} />;
  }

  if (definition.layout === "sidebar") {
    return <SidebarTemplate data={normalized} accentColor={accentColor} density={definition.density} />;
  }

  if (definition.layout === "academic") {
    return <ExecutiveTemplate data={normalized} accentColor={accentColor} density={definition.density} />;
  }

  return <ClassicTemplate data={normalized} accentColor={accentColor} density={definition.density} />;
};

function ClassicTemplate({
  data,
  accentColor,
  density,
}: {
  data: ReturnType<typeof buildNormalizedPreviewData>;
  accentColor: string;
  density: "compact" | "comfortable";
}) {
  const hasHeader = Boolean(data.personalDetails?.firstName || data.personalDetails?.lastName || data.personalDetails?.email || data.personalDetails?.phoneNumber || buildLocationLine(data) || data.targetRole);

  return (
    <div className="bg-white text-black w-198.5 min-h-280.75 shadow-2xl px-12 py-10 font-serif">
      {hasHeader ? (
        <header className="mb-6 border-b border-black/15 pb-4 text-center">
          {(data.personalDetails?.firstName || data.personalDetails?.lastName) ? (
            <h1 className="text-3xl font-bold uppercase tracking-wide">
              {[data.personalDetails?.firstName, data.personalDetails?.lastName].filter(Boolean).join(" ")}
            </h1>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-black/75">
            {buildLocationLine(data) && <span>{buildLocationLine(data)}</span>}
            {data.personalDetails?.phoneNumber && <span>{data.personalDetails.phoneNumber}</span>}
            {data.personalDetails?.email && <span>{data.personalDetails.email}</span>}
            {data.targetRole && <span>{data.targetRole}</span>}
          </div>
        </header>
      ) : null}

      <div className={density === "compact" ? "space-y-4" : "space-y-6"}>
        {data.sections.map((section) => (
          <SectionBlock key={section.id} id={section.id} title={section.title} data={data} accentColor={accentColor} density={density} />
        ))}
      </div>
    </div>
  );
}

function SidebarTemplate({
  data,
  accentColor,
  density,
}: {
  data: ReturnType<typeof buildNormalizedPreviewData>;
  accentColor: string;
  density: "compact" | "comfortable";
}) {
  const hasName = Boolean(data.personalDetails?.firstName || data.personalDetails?.lastName);

  return (
    <div className="bg-white text-black flex w-198.5 min-h-280.75 shadow-2xl font-sans">
      <aside className="w-[30%] bg-[#0A0A0A] px-7 py-8 text-white">
        <div className="space-y-5">
          {(hasName || data.targetRole) ? (
          <div>
            {hasName ? (
              <h1 className="text-2xl font-black uppercase tracking-tight leading-tight">
                {data.personalDetails?.firstName}
                {data.personalDetails?.firstName && data.personalDetails?.lastName ? <br /> : null}
                <span style={{ color: accentColor }}>{data.personalDetails?.lastName}</span>
              </h1>
            ) : null}
            {data.targetRole && <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/50">{data.targetRole}</p>}
          </div>
          ) : null}

          <div className="space-y-3 text-[11px] text-white/75">
            {data.personalDetails?.email && <ContactRow icon={<Mail className="w-3 h-3" style={{ color: accentColor }} />} label={data.personalDetails.email} />}
            {data.personalDetails?.phoneNumber && <ContactRow icon={<Phone className="w-3 h-3" style={{ color: accentColor }} />} label={data.personalDetails.phoneNumber} />}
            {buildLocationLine(data) && <ContactRow icon={<MapPin className="w-3 h-3" style={{ color: accentColor }} />} label={buildLocationLine(data)} />}
            {data.personalDetails?.linkedInUrl && <ContactRow icon={<Linkedin className="w-3 h-3" style={{ color: accentColor }} />} label="LinkedIn Profile" />}
            {data.personalDetails?.portfolioUrl && <ContactRow icon={<Globe className="w-3 h-3" style={{ color: accentColor }} />} label="Portfolio" />}
          </div>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">
        <div className={density === "compact" ? "space-y-5" : "space-y-7"}>
          {data.sections.map((section) => (
            <SectionBlock key={section.id} id={section.id} title={section.title} data={data} accentColor={accentColor} density={density} />
          ))}
        </div>
      </main>
    </div>
  );
}

function ExecutiveTemplate({
  data,
  accentColor,
  density,
}: {
  data: ReturnType<typeof buildNormalizedPreviewData>;
  accentColor: string;
  density: "compact" | "comfortable";
}) {
  const hasHeader = Boolean(data.personalDetails?.firstName || data.personalDetails?.lastName || data.targetRole || data.employmentHistory[0]?.positionTitle || data.personalDetails?.email || data.personalDetails?.phoneNumber || buildLocationLine(data));

  return (
    <div className="bg-white text-black w-198.5 min-h-280.75 shadow-2xl px-14 py-12 font-sans">
      {hasHeader ? <header className="mb-8 flex items-end justify-between border-b-4 border-black pb-5">
        <div>
          {(data.personalDetails?.firstName || data.personalDetails?.lastName) ? (
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
              {[data.personalDetails?.firstName, data.personalDetails?.lastName].filter(Boolean).join(" ")}
            </h1>
          ) : null}
          {(data.targetRole || data.employmentHistory[0]?.positionTitle) ? (
            <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.2em] italic" style={{ color: accentColor }}>
              {data.targetRole || data.employmentHistory[0]?.positionTitle}
            </p>
          ) : null}
        </div>
        <div className="space-y-1 text-right text-[11px] text-black/70">
          {data.personalDetails?.email && <p>{data.personalDetails.email}</p>}
          {data.personalDetails?.phoneNumber && <p>{data.personalDetails.phoneNumber}</p>}
          {buildLocationLine(data) && <p>{buildLocationLine(data)}</p>}
        </div>
      </header> : null}

      <div className={density === "compact" ? "space-y-6" : "space-y-8"}>
        {data.sections.map((section) => (
          <SectionBlock key={section.id} id={section.id} title={section.title} data={data} accentColor={accentColor} density={density} />
        ))}
      </div>
    </div>
  );
}

function SectionBlock({
  id,
  title,
  data,
  accentColor,
  density,
}: {
  id: ResumeSectionId;
  title: string;
  data: ReturnType<typeof buildNormalizedPreviewData>;
  accentColor: string;
  density: "compact" | "comfortable";
}) {
  const isBaseSection = id === "summary" || id === "education" || id === "experience" || id === "skills";

  if (id === "summary" && (data.summary?.summaryText || isBaseSection)) {
    return (
      <section>
        <SectionHeading title={title} accentColor={accentColor} icon={<Briefcase className="w-4 h-4" />} />
        {data.summary?.summaryText ? (
          <p className={`text-black/85 ${density === "compact" ? "text-[11.5px] leading-relaxed" : "text-[12.5px] leading-relaxed"}`}>
            {data.summary.summaryText}
          </p>
        ) : null}
      </section>
    );
  }

  if (id === "education") {
    return (
      <section>
        <SectionHeading title={title} accentColor={accentColor} icon={<GraduationCap className="w-4 h-4" />} />
        {data.education.length > 0 ? <div className={density === "compact" ? "space-y-3" : "space-y-4"}>
          {data.education.map((education, index) => (
              <div key={education.educationSqid || index} className="space-y-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="text-[13px] font-bold text-black">{education.schoolName}</h4>
                  <span className="text-[10px] text-black/40">
                    {education.startDate} - {education.isCurrent ? "Present" : education.endDate}
                  </span>
                </div>
                <p className="text-[11.5px] italic text-black/75">
                  {education.degree}
                  {education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ""}
                </p>
                {education.description && <p className="text-[11px] text-black/70">{education.description}</p>}
              </div>
          ))}
        </div> : null}
      </section>
    );
  }

  if (id === "experience") {
    return (
      <section>
        <SectionHeading title={title} accentColor={accentColor} icon={<Briefcase className="w-4 h-4" />} />
        {data.employmentHistory.length > 0 ? <div className={density === "compact" ? "space-y-4" : "space-y-5"}>
          {data.employmentHistory.map((employment, index) => (
              <div key={employment.employmentSqid || index} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h4 className="text-[13px] font-bold text-black">{employment.positionTitle}</h4>
                    <p className="text-[11.5px] text-black/70">
                      {employment.companyName}
                      {employment.location ? ` · ${employment.location}` : ""}
                    </p>
                  </div>
                  <span className="text-[10px] text-black/40">
                    {employment.startDate} - {employment.isCurrent ? "Present" : employment.endDate}
                  </span>
                </div>
                {employment.responsibilities && employment.responsibilities.length > 0 ? (
                  <ul className="ml-4 list-disc space-y-1 text-[11px] text-black/80">
                    {employment.responsibilities.map((responsibility, responsibilityIndex) => (
                      <li key={responsibilityIndex}>{responsibility}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
          ))}
        </div> : null}
      </section>
    );
  }

  if (id === "certificates" && data.certificates.length > 0) {
    return (
      <section>
        <SectionHeading title={title} accentColor={accentColor} icon={<Award className="w-4 h-4" />} />
        <ul className="ml-4 list-disc space-y-1 text-[11px] text-black/80">
          {data.certificates.map((certificate, index) => (
            <li key={certificate.certificationSqid || index}>
              <span className="font-semibold">{certificate.achievementName}</span> - {certificate.institution}
              {certificate.issuedDate ? ` (${certificate.issuedDate})` : ""}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (id === "leadership" && data.leadershipActivities.length > 0) {
    return (
      <section>
        <SectionHeading title={title} accentColor={accentColor} icon={<Trophy className="w-4 h-4" />} />
        <div className={density === "compact" ? "space-y-4" : "space-y-5"}>
          {data.leadershipActivities.map((activity, index) => (
              <div key={activity.leadershipActivitySqid || index} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h4 className="text-[13px] font-bold text-black">{activity.roleTitle}</h4>
                    <p className="text-[11.5px] text-black/70">
                      {activity.organizationName}
                      {activity.location ? ` · ${activity.location}` : ""}
                    </p>
                  </div>
                  <span className="text-[10px] text-black/40">
                    {activity.startDate} - {activity.isCurrent ? "Present" : activity.endDate}
                  </span>
                </div>
                {activity.highlights && activity.highlights.length > 0 ? (
                  <ul className="ml-4 list-disc space-y-1 text-[11px] text-black/80">
                    {activity.highlights.filter(Boolean).map((highlight, highlightIndex) => (
                      <li key={highlightIndex}>{highlight}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
          ))}
        </div>
      </section>
    );
  }

  if (id === "skills") {
    const skills = data.skillsAndInterests;
    const hasContent =
      skills.technicalSkills.filter(Boolean).length > 0 ||
      skills.languages.filter(Boolean).length > 0 ||
      skills.interests.filter(Boolean).length > 0;

    return (
      <section>
        <SectionHeading title={title} accentColor={accentColor} icon={<Wrench className="w-4 h-4" />} />
        {hasContent ? <div className="space-y-1 text-[11px] text-black/80">
          {skills.technicalSkills.filter(Boolean).length > 0 && (
            <p><span className="font-semibold">Technical:</span> {skills.technicalSkills.filter(Boolean).join(", ")}</p>
          )}
          {skills.languages.filter(Boolean).length > 0 && (
            <p><span className="font-semibold">Languages:</span> {skills.languages.filter(Boolean).join(", ")}</p>
          )}
          {skills.interests.filter(Boolean).length > 0 && (
            <p><span className="font-semibold">Interests:</span> {skills.interests.filter(Boolean).join(", ")}</p>
          )}
        </div> : null}
      </section>
    );
  }

  return null;
}

function SectionHeading({
  title,
  accentColor,
  icon,
}: {
  title: string;
  accentColor: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-2 border-b border-black/10 pb-1 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
      {icon}
      <span>{title}</span>
    </div>
  );
}

function ContactRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded border border-white/10 bg-white/5 p-1.5">{icon}</div>
      <span className="truncate">{label}</span>
    </div>
  );
}

function buildLocationLine(data: ReturnType<typeof buildNormalizedPreviewData>) {
  const parts = [
    data.personalDetails?.addressLine1,
    data.personalDetails?.city,
    data.personalDetails?.provinceState,
    data.personalDetails?.country,
  ].filter(Boolean);

  return parts.join(", ");
}

export default ResumePreview;
