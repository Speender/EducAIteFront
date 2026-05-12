import type { StudentAnalyticsDashboardResponseDto } from '@/features/student-performance/api/dto'

import { formatStudyDuration } from '../lib/formatStudyDuration'

interface MostStudiedSubjectsProps {
  items: StudentAnalyticsDashboardResponseDto['learningTrendAnalysis']['items'];
}

const MostStudiedSubjects = ({ items }: MostStudiedSubjectsProps) => {
  const topSubjects = items.slice(0, 5)
  const maxHours = topSubjects.reduce((highest, item) => Math.max(highest, item.studyTimeHours), 0)

  return (
    <div className="flex-1 rounded-[32px] border border-white/20 p-8">
      <h2 className="mb-8 text-2xl">
        This Month&apos;s Most Studied <span className="text-[#00CEC8]">Subjects</span>
      </h2>

      {topSubjects.length > 0 ? (
        <div className="space-y-6">
          {topSubjects.map((item) => {
            const percentage = maxHours > 0 ? (item.studyTimeHours / maxHours) * 100 : 0

            return (
              <div key={item.studentCourseSqid}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <p>{item.courseName}</p>
                  <span className="text-white/60">{formatStudyDuration(item.studyTimeHours)}</span>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full bg-[#cfd8dc]">
                  <div className="h-full rounded-full bg-[#00796B] transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-white/60">Your course study-time distribution will appear here after synced sessions are available.</p>
      )}
    </div>
  )
}

export default MostStudiedSubjects
