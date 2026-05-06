interface SummaryCardsProps {
  trackedFlashcardsCount: number;
  totalStudyHours: number;
  trackedCoursesCount: number;
}

const SummaryCards = ({
  trackedFlashcardsCount,
  totalStudyHours,
  trackedCoursesCount,
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-2xl border border-white/20 p-6">
        <h3 className="mb-1 text-4xl font-bold text-[#00CEC8]">{trackedFlashcardsCount}</h3>
        <p className="text-lg text-white">Tracked Flashcards</p>
      </div>
      <div className="rounded-2xl border border-white/20 p-6">
        <h3 className="mb-1 text-4xl font-bold text-[#00CEC8]">{totalStudyHours.toFixed(1)}h</h3>
        <p className="text-lg text-white">Total Hours</p>
      </div>
      <div className="rounded-2xl border border-white/20 p-6">
        <h3 className="mb-1 text-4xl font-bold text-[#00CEC8]">{trackedCoursesCount}</h3>
        <p className="text-lg text-white">Subjects</p>
      </div>
    </div>
  )
}

export default SummaryCards
