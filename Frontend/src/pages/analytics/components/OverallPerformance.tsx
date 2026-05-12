import type { StudentAnalyticsDashboardResponseDto } from '@/features/student-performance/api/dto'

import { formatStudyDuration } from '../lib/formatStudyDuration'

interface OverallPerformanceProps {
  overallPerformance: StudentAnalyticsDashboardResponseDto['overallPerformance'];
  totalStudyHours: number;
}

const OverallPerformance = ({ overallPerformance, totalStudyHours }: OverallPerformanceProps) => {
  const progressItems = [
    { label: 'Overall mastery', value: overallPerformance.overallPerformanceScore },
    { label: 'Flashcard accuracy', value: overallPerformance.flashcardAccuracyRate },
    { label: 'Retention', value: overallPerformance.learningRetentionRate },
    { label: 'Confidence', value: overallPerformance.confidenceScore },
  ]

  return (
    <div className="flex flex-col rounded-[32px] border border-white/20 p-6">
      <h3 className="mb-6 text-sm font-bold">
        <span className="text-[#00CEC8]">Overall</span> Performance
      </h3>

      <div className="mb-10 space-y-4 text-xs text-white/80">
        <div className="flex items-center justify-between">
          <span>Total Mastery:</span>
          <span className="text-sm font-bold text-white">{formatPercent(overallPerformance.overallPerformanceScore)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Study Time:</span>
          <span className="text-sm font-bold text-white">{formatStudyDuration(totalStudyHours)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Flashcard Accuracy:</span>
          <span className="text-sm font-bold text-white">{formatPercent(overallPerformance.flashcardAccuracyRate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tracked Flashcards:</span>
          <span className="text-sm font-bold text-white">{overallPerformance.trackedFlashcardsCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Mastered Flashcards:</span>
          <span className="text-sm font-bold text-[#00CEC8]">{overallPerformance.masteredFlashcardsCount}</span>
        </div>
      </div>

      <h3 className="mb-4 text-xs font-bold text-[#00CEC8]">Progressive Overview:</h3>

      <div className="mb-10 space-y-4">
        {progressItems.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-[10px] font-medium">
              <span>{item.label}</span>
              <span>{formatPercent(item.value)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${Math.max(0, Math.min(item.value, 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-2 text-xs font-bold text-[#00CEC8]">AI Insight:</h3>
      <p className="mb-8 pr-4 text-[10px] leading-relaxed text-white/70">
        {overallPerformance.aiInsight || 'Your AI summary will appear here once enough performance signal has been collected.'}
      </p>

      <div className="mt-auto flex flex-col items-start space-y-2">
        <span className="rounded-md bg-white/10 px-3 py-1.5 text-[10px] font-bold">
          Risk: {overallPerformance.riskLevel}
        </span>
        <span className="rounded-md bg-white/10 px-3 py-1.5 text-[10px] font-bold">
          AI Status: {overallPerformance.aiStatus}
        </span>
        {overallPerformance.improvementSuggestion ? (
          <span className="rounded-md bg-[#00CEC8]/10 px-3 py-1.5 text-[10px] font-bold text-[#8af8f4]">
            Next step: {overallPerformance.improvementSuggestion}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default OverallPerformance

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
