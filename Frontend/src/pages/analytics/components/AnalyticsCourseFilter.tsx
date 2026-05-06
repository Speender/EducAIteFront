interface CourseFilterOption {
  value: string
  label: string
  meta?: string
}

interface AnalyticsCourseFilterProps {
  value: string
  options: CourseFilterOption[]
  onChange: (value: string) => void
}

const AnalyticsCourseFilter = ({ value, options, onChange }: AnalyticsCourseFilterProps) => {
  const activeOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <div className="rounded-[32px] border border-white/20 bg-black p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#00CEC8]">Course Scope</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">Filter analytics by course</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
            Switch between all enrolled subjects or isolate a single course. The retention and performance charts update together.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 lg:items-end">
          <div className="rounded-full border border-[#00CEC8]/20 bg-[#00CEC8]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#90f7f2]">
            {activeOption?.label ?? 'All Courses'}
          </div>

          <label className="relative block min-w-[260px]">
            <span className="sr-only">Filter analytics by course</span>
            <select
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="h-12 w-full appearance-none rounded-full border border-white/15 bg-[#050505] px-5 pr-12 text-sm font-semibold text-white outline-none transition hover:border-white/25 focus:border-[#00CEC8]"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#050505] text-white">
                  {option.meta ? `${option.label} • ${option.meta}` : option.label}
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
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCourseFilter
