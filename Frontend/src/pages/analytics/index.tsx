import { useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../components/Logo'
import {
  useStudentAnalyticsDashboardQuery,
  useStudentCoursePerformanceQuery,
} from '@/features/student-performance/api/hooks'
import { getAuthSession } from '@/lib/api/auth'
import { getErrorMessage } from '@/lib/api/errors'
import ActivityHeatmap from './components/ActivityHeatmap'
import AnalyticsCourseFilter from './components/AnalyticsCourseFilter'
import AnalyticsHeader from './components/AnalyticsHeader'
import BestPerformingCourse from './components/BestPerformingCourse'
import LearningTrendAnalysis from './components/LearningTrendAnalysis'
import MostStudiedSubjects from './components/MostStudiedSubjects'
import MultiLineChartCard from './components/MultiLineChartCard'
import OverallPerformance from './components/OverallPerformance'
import SummaryCards from './components/SummaryCards'

type CourseFilterOption = {
  value: string
  label: string
  meta?: string
}

const AnalyticsPage = () => {
  const session = getAuthSession()
  const dashboardQuery = useStudentAnalyticsDashboardQuery()
  const [selectedCourseSqid, setSelectedCourseSqid] = useState('all')
  const selectedCoursePerformanceQuery = useStudentCoursePerformanceQuery(
    selectedCourseSqid === 'all' ? null : selectedCourseSqid,
  )

  if (!session) {
    return (
      <div className="min-h-screen bg-black px-8 py-32 text-white">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-[#111111] p-10 text-center">
          <h1 className="text-3xl font-bold">Sign in to load your analytics</h1>
          <p className="mt-4 text-white/60">
            Your dashboard now reads directly from the backend student performance summaries.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  if (dashboardQuery.isPending) {
    return (
      <div className="min-h-screen bg-black px-8 py-32 text-white">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <Logo />
          <div className="h-24 rounded-[32px] border border-white/10 bg-white/5 animate-pulse" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <div className="h-[520px] rounded-[32px] border border-white/10 bg-white/5 animate-pulse" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                <div className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                <div className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              </div>
              <div className="h-[320px] rounded-[32px] border border-white/10 bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (dashboardQuery.isError) {
    return (
      <div className="min-h-screen bg-black px-8 py-32 text-white">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-rose-400/20 bg-rose-950/20 p-10">
          <h1 className="text-3xl font-bold text-white">Dashboard unavailable</h1>
          <p className="mt-4 text-rose-100/80">{getErrorMessage(dashboardQuery.error)}</p>
        </div>
      </div>
    )
  }

  const dashboard = dashboardQuery.data
  const selectedCoursePerformance = selectedCoursePerformanceQuery.data
  const totalStudyHours = dashboard.learningTrendAnalysis.items.reduce(
    (sum, item) => sum + item.studyTimeHours,
    0,
  )
  const seen = new Set<string>()
  const courseFilterOptions: CourseFilterOption[] = [
    {
      value: 'all',
      label: 'All Courses',
    },
  ]

  for (const item of dashboard.learningRetentionRate.items) {
    if (seen.has(item.studentCourseSqid)) {
      continue
    }

    seen.add(item.studentCourseSqid)
    courseFilterOptions.push({
      value: item.studentCourseSqid,
      label: item.courseName,
      meta: item.edpCode,
    })
  }

  const selectedCourseOption =
    courseFilterOptions.find((option) => option.value === selectedCourseSqid) ?? courseFilterOptions[0]

  const selectedRetentionItem =
    dashboard.learningRetentionRate.items.find((item) => item.studentCourseSqid === selectedCourseSqid) ?? null
  const selectedPerformanceItem =
    dashboard.performanceSummaryRate.items.find((item) => item.studentCourseSqid === selectedCourseSqid) ?? null

  const learningRetentionItems =
    selectedCourseSqid === 'all'
      ? [
          {
            label: 'All Courses',
            sublabel: 'Aggregated',
            value: dashboard.overallPerformance.learningRetentionRate,
          },
          ...dashboard.learningRetentionRate.items.map((item) => ({
            label: item.courseName,
            sublabel: item.edpCode,
            value: item.learningRetentionRate,
          })),
        ]
      : selectedRetentionItem
        ? [
            {
              label: selectedRetentionItem.courseName,
              sublabel: selectedRetentionItem.edpCode,
              value: selectedRetentionItem.learningRetentionRate,
            },
            {
              label: 'All Courses',
              sublabel: 'Aggregate baseline',
              value: dashboard.overallPerformance.learningRetentionRate,
            },
          ]
        : []

  const performanceSummaryItems =
    selectedCourseSqid === 'all'
      ? [
          {
            label: 'All Courses',
            sublabel: 'Aggregated',
            value: dashboard.overallPerformance.overallPerformanceScore,
          },
          ...dashboard.performanceSummaryRate.items.map((item) => ({
            label: item.courseName,
            sublabel: item.edpCode,
            value: item.overallPerformanceScore,
          })),
        ]
      : selectedPerformanceItem
        ? [
            {
              label: selectedPerformanceItem.courseName,
              sublabel: selectedPerformanceItem.edpCode,
              value: selectedPerformanceItem.overallPerformanceScore,
            },
            {
              label: 'All Courses',
              sublabel: 'Aggregate baseline',
              value: dashboard.overallPerformance.overallPerformanceScore,
            },
          ]
        : []

  const learningRetentionSubtitleValue =
    selectedCourseSqid === 'all'
      ? `${dashboard.overallPerformance.learningRetentionRate.toFixed(1)}%`
      : `${(selectedRetentionItem?.learningRetentionRate ?? selectedCoursePerformance?.learningRetentionRate ?? 0).toFixed(1)}%`

  const performanceSummarySubtitleValue =
    selectedCourseSqid === 'all'
      ? `${dashboard.overallPerformance.overallPerformanceScore.toFixed(1)}%`
      : `${(selectedPerformanceItem?.overallPerformanceScore ?? selectedCoursePerformance?.overallPerformanceScore ?? 0).toFixed(1)}%`

  const scopedInsight =
    selectedCourseSqid === 'all'
      ? null
      : selectedCoursePerformance?.aiInsight ||
        (selectedRetentionItem
          ? `${selectedRetentionItem.courseName} is currently retaining ${selectedRetentionItem.learningRetentionRate.toFixed(1)}% of reviewed material.`
          : null)

  const scopedImprovementSuggestion =
    selectedCourseSqid === 'all'
      ? null
      : selectedCoursePerformance?.improvementSuggestion ||
        (selectedPerformanceItem
          ? `Focus the next review cycle on ${selectedPerformanceItem.courseName} to move the summary above ${selectedPerformanceItem.overallPerformanceScore.toFixed(1)}%.`
          : null)

  return (
    <div className="min-h-screen bg-black px-8 pb-20 pt-32 font-sans text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <Logo />
        <AnalyticsHeader studentFirstName={session.student.firstName} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <OverallPerformance
            overallPerformance={dashboard.overallPerformance}
            totalStudyHours={totalStudyHours}
          />

          <div className="flex flex-col gap-6">
            <SummaryCards
              trackedFlashcardsCount={dashboard.overallPerformance.trackedFlashcardsCount}
              totalStudyHours={totalStudyHours}
              trackedCoursesCount={dashboard.overallPerformance.trackedCoursesCount}
            />
            <MostStudiedSubjects items={dashboard.learningTrendAnalysis.items} />
          </div>
        </div>

        <ActivityHeatmap />
        <LearningTrendAnalysis items={dashboard.learningTrendAnalysis.items} />
        <BestPerformingCourse items={dashboard.bestPerformingCourse.items} />
        <AnalyticsCourseFilter
          value={selectedCourseSqid}
          options={courseFilterOptions}
          onChange={setSelectedCourseSqid}
        />

        <MultiLineChartCard
          titleHighlight="Learning Retention"
          titleRest="Rate"
          subtitleLabel={selectedCourseSqid === 'all' ? 'Overall Retention' : 'Selected Course Retention'}
          subtitleValue={learningRetentionSubtitleValue}
          items={learningRetentionItems}
          insight={
            scopedInsight ||
            dashboard.overallPerformance.aiInsight ||
            'Retention analytics will become more descriptive as more review history is collected.'
          }
          scopeLabel={
            selectedCourseSqid === 'all'
              ? 'All courses in the current dashboard'
              : `${selectedCourseOption?.label ?? 'Selected course'}${selectedCourseOption?.meta ? ` | ${selectedCourseOption.meta}` : ''}`
          }
          isRefreshing={selectedCourseSqid !== 'all' && selectedCoursePerformanceQuery.isFetching}
          emptyStateMessage="No retention metrics are available for the selected course yet."
        />

        <MultiLineChartCard
          titleHighlight="Performance Summary"
          titleRest="Rate"
          subtitleLabel={selectedCourseSqid === 'all' ? 'Overall Performance' : 'Selected Course Performance'}
          subtitleValue={performanceSummarySubtitleValue}
          items={performanceSummaryItems}
          insight={
            scopedImprovementSuggestion ||
            dashboard.overallPerformance.improvementSuggestion ||
            'Keep reviewing consistently so the summary can surface a sharper next step.'
          }
          scopeLabel={
            selectedCourseSqid === 'all'
              ? 'All courses in the current dashboard'
              : `${selectedCourseOption?.label ?? 'Selected course'}${selectedCourseOption?.meta ? ` | ${selectedCourseOption.meta}` : ''}`
          }
          isRefreshing={selectedCourseSqid !== 'all' && selectedCoursePerformanceQuery.isFetching}
          emptyStateMessage="No performance summary is available for the selected course yet."
        />
      </div>
    </div>
  )
}

export default AnalyticsPage
