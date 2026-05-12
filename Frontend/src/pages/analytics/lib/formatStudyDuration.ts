export function formatStudyDuration(hours: number): string {
  const totalMinutes = Math.max(0, Math.round(hours * 60));

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes === 0 ? `${wholeHours}h` : `${wholeHours}h ${minutes}m`;
}
