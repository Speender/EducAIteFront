import type { ChartData, ChartOptions } from 'chart.js'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

import type { StudentAnalyticsDashboardResponseDto } from '@/features/student-performance/api/dto'

import { formatStudyDuration } from '../lib/formatStudyDuration'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface LearningTrendAnalysisProps {
  items: StudentAnalyticsDashboardResponseDto['learningTrendAnalysis']['items'];
}

const LearningTrendAnalysis = ({ items }: LearningTrendAnalysisProps) => {
  const chartData: ChartData<'bar'> = {
    labels: items.map((item) => item.courseName),
    datasets: [
      {
        label: 'Study Time',
        data: items.map((item) => item.studyTimeHours),
        backgroundColor: '#00CEC8',
        borderRadius: 25,
        barThickness: 48,
      },
    ],
  }

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#00CEC8',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => `Study time: ${formatStudyDuration(Number(context.parsed.y ?? 0))}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: (value) => formatStudyDuration(Number(value)),
        },
      },
    },
  }

  return (
    <div className="mt-8 w-full rounded-[32px] border border-white/20 bg-black p-8">
      <div className="mb-8">
        <h2 className="mb-1 text-3xl font-bold">
          Learning <span className="text-[#00CEC8]">Trend Analysis</span>
        </h2>
        <p className="text-lg text-white/60">Study time synced per course</p>
      </div>
      {items.length > 0 ? (
        <div className="h-[300px] w-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-white/60">
          No study-time data has been synced yet.
        </div>
      )}
    </div>
  )
}

export default LearningTrendAnalysis
