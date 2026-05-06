const ActivityHeatmap = () => {
  return (
    <div className="mt-6 w-full rounded-[32px] border border-white/20 p-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold">
          Activity <span className="text-[#00CEC8]">Heatmap</span>
        </h2>
        <p className="mt-4 text-white/60">
          This section is intentionally waiting for a dedicated activity-history endpoint. The rest of the dashboard is now backed by
          persisted student performance summaries instead of mock data.
        </p>
      </div>
    </div>
  )
}

export default ActivityHeatmap
