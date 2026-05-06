import type { ChartData, ChartOptions } from 'chart.js'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

import type { StudentAnalyticsDashboardResponseDto } from '@/features/student-performance/api/dto'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface BestPerformingCourseProps {
  items: StudentAnalyticsDashboardResponseDto['bestPerformingCourse']['items'];
}

const BestPerformingCourse = ({ items }: BestPerformingCourseProps) => {
  const chartData: ChartData<'bar'> = {
    labels: items.map((item) => item.courseName),
    datasets: [
      {
        label: 'Overall Performance Score (%)',
        data: items.map((item) => item.overallPerformanceScore),
        backgroundColor: ['#2563eb', '#ec4899', '#eab308', '#22c55e', '#00CEC8', '#ffffff'],
        borderRadius: 15,
        barThickness: 40,
      },
    ],
  }

  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', stepSize: 25 },
      },
      y: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.8)', font: { size: 13 } },
      },
    },
  }

  return (
    <div className="mt-8 w-full rounded-[32px] border border-white/20 bg-black p-8">
      <div className="mb-8">
        <h2 className="mb-1 text-3xl font-bold">
          Best Performing <span className="text-[#00CEC8]">Courses</span>
        </h2>
        <p className="text-lg text-white/60">Ranked by overall performance score</p>
      </div>
      {items.length > 0 ? (
        <div className="h-[300px] w-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-white/60">
          Course rankings will appear after your first synced summary refresh.
        </div>
      )}
    </div>
  )
}

export default BestPerformingCourse
