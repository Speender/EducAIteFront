import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  studentCourseSqid: string;
  edpCode: string;
  courseName: string;
  units: number;
  overallPerformanceScore: number | null;
}

function getProgressTone(score: number | null) {
  if (score === null) {
    return {
      badge: 'bg-white/10 text-white/80',
      bar: 'bg-white/30',
      label: 'No progress yet',
      width: 18,
    };
  }

  if (score >= 80) {
    return {
      badge: 'bg-[#00CEC8]/20 text-[#7df8f3]',
      bar: 'bg-[#00CEC8]',
      label: 'Strong momentum',
      width: score,
    };
  }

  if (score >= 60) {
    return {
      badge: 'bg-[#4A6792]/30 text-[#b4c9ee]',
      bar: 'bg-[#4A6792]',
      label: 'Steady progress',
      width: score,
    };
  }

  return {
    badge: 'bg-amber-500/15 text-amber-200',
    bar: 'bg-amber-400',
    label: 'Needs reinforcement',
    width: Math.max(score, 12),
  };
}

const CourseCard = ({
  studentCourseSqid,
  edpCode,
  courseName,
  units,
  overallPerformanceScore,
}: CourseCardProps) => {
  const navigate = useNavigate();
  const progressTone = getProgressTone(overallPerformanceScore);

  return (
    <div
      onClick={() => navigate(`/courses/${studentCourseSqid}`)}
      className="group relative flex h-[480px] min-w-[340px] max-w-[340px] cursor-pointer select-none flex-col rounded-[32px] border border-white/20 bg-[#050505] p-6 shadow-[0_35px_40px_-15px_rgba(255,255,255,0.15)] transition-all duration-300 hover:border-[#00CEC8]/100"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className={`rounded-full px-4 py-1.5 text-[11px] font-bold ${progressTone.badge}`}>
          {edpCode}
        </span>
        <button className="text-white/50 transition-colors group-hover:text-[#00CEC8]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Course</p>
        <h3 className="line-clamp-3 min-h-[7.5rem] text-3xl font-bold leading-tight text-white">
          {courseName}
        </h3>
      </div>

      <div className="mb-8 mt-10 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Units</p>
          <p className="text-lg font-bold text-white">{units.toFixed(1)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
            <span>Progress</span>
            <span>{overallPerformanceScore === null ? '--' : `${overallPerformanceScore.toFixed(0)}%`}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressTone.bar}`}
              style={{ width: `${progressTone.width}%` }}
            />
          </div>
          <p className="pt-2 text-sm text-white/65">{progressTone.label}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
