import { type ResumeReviewResponseDto } from "../../api/dto";
import { normalizeDateOnly } from "../../lib/date";

interface TemplateProps {
  data: Partial<ResumeReviewResponseDto>;
}

const HarvardTemplate = ({ data }: TemplateProps) => {
  const personalDetails = data.personalDetails;
  const education = data.education ?? [];
  const employmentHistory = data.employmentHistory ?? [];
  const leadershipActivities = data.leadershipActivities ?? [];
  const summary = data.summary?.summaryText?.trim();
  const certificates = data.awardsAndCertifications ?? data.certificates ?? [];
  const skillsAndInterests = data.skillsAndInterests ?? {
    technicalSkills: [],
    languages: [],
    interests: [],
  };

  const headerName = [personalDetails?.firstName, personalDetails?.lastName].filter(Boolean).join(" ");
  const headerAddress = [
    personalDetails?.addressLine1,
    [personalDetails?.city, personalDetails?.provinceState, personalDetails?.postalCode].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join("   |   ");
  const contactLine = [headerAddress, personalDetails?.email, personalDetails?.phoneNumber].filter(Boolean).join("   |   ");

  const technicalSkills = skillsAndInterests.technicalSkills.map((item) => item.trim()).filter(Boolean);
  const languages = skillsAndInterests.languages.map((item) => item.trim()).filter(Boolean);
  const interests = skillsAndInterests.interests.map((item) => item.trim()).filter(Boolean);

  return (
    <div
      className="min-h-[1123px] w-[794px] bg-white px-12 py-10 text-black shadow-2xl"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {(headerName || contactLine) ? (
        <header className="mb-4 border-b border-black pb-2 text-center">
          {headerName ? <h1 className="mb-1 text-[28px] leading-none font-normal">{headerName}</h1> : null}
          {contactLine ? <p className="text-[14px] leading-snug">{contactLine}</p> : null}
        </header>
      ) : null}

      {summary ? (
        <section className="mb-4">
          <SectionHeading title="SUMMARY" />
          <p className="text-[13px] leading-[1.3]">{summary}</p>
        </section>
      ) : null}

      <section className="mb-5">
        <SectionHeading title="EDUCATION" />
        {education.length > 0 ? (
          <div className="space-y-3">
            {education.map((edu, index) => {
              const location = buildLocation(edu.location, personalDetails?.city, personalDetails?.provinceState);
              const dateRange = formatDateRange(edu.startDate, edu.endDate, edu.isCurrent);

              return (
                <article key={edu.educationSqid || index}>
                  <div className="flex items-baseline justify-between gap-5">
                    <h3 className="text-[13px] font-bold uppercase">{edu.schoolName}</h3>
                    {location ? <p className="text-[13px]">{location}</p> : null}
                  </div>
                  <div className="flex items-baseline justify-between gap-5 text-[13px] italic">
                    <p>
                      {edu.degree}
                      {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                    </p>
                    {dateRange ? <p>{dateRange}</p> : null}
                  </div>
                  {edu.description ? <p className="text-[13px] leading-[1.3]">{edu.description}</p> : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </section>

      <section className="mb-5">
        <SectionHeading title="EXPERIENCE" />
        {employmentHistory.length > 0 ? (
          <div className="space-y-4">
            {employmentHistory.map((job, index) => {
              const dateRange = formatDateRange(job.startDate, job.endDate, job.isCurrent);

              return (
                <article key={job.employmentSqid || index}>
                  <div className="flex items-baseline justify-between gap-5">
                    <h3 className="text-[13px] font-bold uppercase">{job.companyName}</h3>
                    {job.location ? <p className="text-[13px]">{job.location}</p> : null}
                  </div>
                  <div className="flex items-baseline justify-between gap-5 text-[13px] italic">
                    <p>{job.positionTitle}</p>
                    {dateRange ? <p>{dateRange}</p> : null}
                  </div>
                  {job.responsibilities && job.responsibilities.filter(Boolean).length > 0 ? (
                    <ul className="list-disc pl-5 text-[13px] leading-[1.28]">
                      {job.responsibilities.filter(Boolean).map((responsibility, responsibilityIndex) => (
                        <li key={responsibilityIndex}>{responsibility}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </section>

      {leadershipActivities.length > 0 ? (
        <section className="mb-5">
          <SectionHeading title="LEADERSHIP & ACTIVITIES" />
          <div className="space-y-4">
            {leadershipActivities.map((activity, index) => {
              const dateRange = formatDateRange(activity.startDate, activity.endDate, activity.isCurrent);

              return (
                <article key={activity.leadershipActivitySqid || index}>
                  <div className="flex items-baseline justify-between gap-5">
                    <h3 className="text-[13px] font-bold uppercase">{activity.organizationName}</h3>
                    {activity.location ? <p className="text-[13px]">{activity.location}</p> : null}
                  </div>
                  <div className="flex items-baseline justify-between gap-5 text-[13px] italic">
                    <p>{activity.roleTitle}</p>
                    {dateRange ? <p>{dateRange}</p> : null}
                  </div>
                  {activity.highlights && activity.highlights.filter(Boolean).length > 0 ? (
                    <ul className="list-disc pl-5 text-[13px] leading-[1.28]">
                      {activity.highlights.filter(Boolean).map((highlight, highlightIndex) => (
                        <li key={highlightIndex}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {certificates.length > 0 ? (
        <section className="mb-5">
          <SectionHeading title="AWARDS & CERTIFICATIONS" />
          <ul className="list-disc pl-5 text-[13px] leading-[1.3]">
            {certificates.map((certificate, index) => (
              <li key={certificate.certificationSqid || index}>
                <span className="font-bold">{certificate.achievementName}</span>
                {certificate.institution ? `, ${certificate.institution}` : ""}
                {certificate.issuedDate ? ` (${formatMonthYear(certificate.issuedDate)})` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <SectionHeading title="SKILLS & INTERESTS" />
        {technicalSkills.length > 0 || languages.length > 0 || interests.length > 0 ? (
          <div className="space-y-0.5 text-[13px] leading-[1.3]">
            {technicalSkills.length > 0 ? <p><span className="font-bold">Technical:</span> {technicalSkills.join(", ")}</p> : null}
            {languages.length > 0 ? <p><span className="font-bold">Language:</span> {languages.join(", ")}</p> : null}
            {interests.length > 0 ? <p><span className="font-bold">Interests:</span> {interests.join(", ")}</p> : null}
          </div>
        ) : null}
      </section>
    </div>
  );
};

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-1 border-b border-black text-[14px] font-bold uppercase leading-none tracking-wide">
      {title}
    </h2>
  );
}

function buildLocation(location?: string | null, city?: string, provinceState?: string) {
  if (location) {
    return location;
  }

  return [city, provinceState].filter(Boolean).join(", ");
}

function formatDateRange(startDate?: string | null, endDate?: string | null, isCurrent?: boolean) {
  const start = formatMonthYear(startDate);
  const end = isCurrent ? "Present" : formatMonthYear(endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || "";
}

function formatMonthYear(rawDate?: string | null) {
  const normalized = normalizeDateOnly(rawDate);
  if (!normalized) {
    return "";
  }

  const [year, month] = normalized.split("-");
  const monthIndex = Number.parseInt(month, 10) - 1;
  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return "";
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${monthNames[monthIndex]} ${year}`;
}

export default HarvardTemplate;
