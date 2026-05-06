import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ChartData, ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

interface ChartMetricItem {
  label: string;
  sublabel?: string;
  value: number;
}

interface CourseFilterOption {
  value: string;
  label: string;
  meta?: string;
}

interface Props {
  titleHighlight: string;
  titleRest: string;
  subtitleLabel: string;
  subtitleValue: string;
  items: ChartMetricItem[];
  insight: string;
  courseFilter?: {
    value: string;
    options: CourseFilterOption[];
    onChange: (value: string) => void;
  };
  scopeLabel?: string;
  isRefreshing?: boolean;
  emptyStateMessage?: string;
}

const MultiLineChartCard = ({
  titleHighlight,
  titleRest,
  subtitleLabel,
  subtitleValue,
  items,
  insight,
  courseFilter,
  scopeLabel,
  isRefreshing = false,
  emptyStateMessage,
}: Props) => {
  const prefersReducedMotion = useReducedMotion()
  const chartData: ChartData<'line'> = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        label: `${titleHighlight} ${titleRest}`,
        data: items.map((item) => item.value),
        borderColor: '#00CEC8',
        backgroundColor: 'rgba(0, 206, 200, 0.12)',
        borderWidth: 3,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: prefersReducedMotion
      ? false
      : {
          duration: 380,
          easing: 'easeOutQuart',
        },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        titleColor: '#00CEC8',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          display: false,
        },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          display: false,
        },
        border: {
          dash: [5, 5],
        },
        ticks: {
          stepSize: 25,
          color: 'rgba(255, 255, 255, 0.5)',
          padding: 10,
        },
      },
    },
  }

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.25, 1, 0.5, 1] }}
      className="mt-8 w-full rounded-[32px] border border-white/20 bg-black p-8"
    >
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h2 className="mb-1 text-3xl font-bold">
            <span className="text-[#00CEC8]">{titleHighlight}</span> {titleRest}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-lg text-white/60">
              {subtitleLabel} <span className="ml-1 font-bold text-white">{subtitleValue}</span>
            </p>
            <span className="rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#79f1a0]">
              Persisted backend metric
            </span>
            {scopeLabel ? (
              <span className="max-w-full truncate rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/55" title={scopeLabel}>
                {scopeLabel}
              </span>
            ) : null}
            {isRefreshing ? (
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                Refreshing insight...
              </span>
            ) : null}
          </div>
        </div>

        {courseFilter ? (
          <label className="relative block xl:min-w-[250px]">
            <span className="sr-only">Filter {titleHighlight} {titleRest} by course</span>
            <select
              value={courseFilter.value}
              onChange={(event) => courseFilter.onChange(event.target.value)}
              className="h-11 w-full appearance-none rounded-full border border-white/15 bg-[#050505] px-4 pr-12 text-sm font-semibold text-white outline-none transition hover:border-white/25 focus:border-[#00CEC8]"
            >
              {courseFilter.options.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#050505] text-white">
                  {option.meta ? `${option.label} | ${option.meta}` : option.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </label>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${titleHighlight}-${titleRest}-${courseFilter?.value ?? 'all'}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.26, ease: [0.25, 1, 0.5, 1] }}
        >
          {items.length > 0 ? (
            <>
              <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
                {items.slice(0, 6).map((item) => (
                  <div key={`${item.label}-${item.sublabel}`} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="truncate text-sm font-medium text-white" title={item.label}>{item.label}</p>
                    <p className="mt-1 truncate text-xs text-white/50" title={item.sublabel || 'Course metric'}>
                      {item.sublabel || 'Course metric'}
                    </p>
                    <p className="mt-3 text-lg font-bold text-[#00CEC8]">{item.value.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
              <div className="relative h-[400px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-white/60">
              {emptyStateMessage || 'No metrics are available for this chart yet.'}
            </div>
          )}

          <div className="mt-12 flex flex-col gap-3 rounded-2xl bg-[#005e5d] p-6 md:flex-row md:items-center md:gap-4">
            <span className="whitespace-nowrap text-lg font-bold text-white">AI Insight:</span>
            <span className="text-sm text-white/90">{insight}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

export default MultiLineChartCard
