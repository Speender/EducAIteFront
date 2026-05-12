import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  FileText,
  LineChart,
  RefreshCw,
} from 'lucide-react';

import type {
  StudentDashboardInsightDto,
  StudentDashboardResponseDto,
} from '@/features/dashboard/api/dto';
import { getErrorMessage } from '@/lib/api/errors';

interface BentoCardsProps {
  dashboard?: StudentDashboardResponseDto;
  error?: unknown;
  isError?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
}

const emptyDashboard: StudentDashboardResponseDto = {
  student: {
    firstName: 'Student',
  },
  weeklyPerformance: {
    goalPercent: 0,
    deltaFromLastWeekPercent: 0,
    label: '0% Weekly Goal Achieved',
  },
  upcomingTasks: {
    deadlineCountThisWeek: 0,
    items: [],
  },
  aiInsights: {
    strength: null,
    weakness: null,
    hasSufficientData: null,
    insufficientData: null,
    isInsufficientData: null,
    status: null,
    message: null,
    reason: null,
  },
  flashcardsToday: {
    completedCount: 0,
    targetCount: 20,
    completionPercent: 0,
    streakDays: 0,
  },
  resumeSnapshot: {
    resumeSqid: null,
    newCertificationsThisSemester: 0,
  },
  generatedAtUtc: '',
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, Math.round(value)));
const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const insufficientInsightStatuses = new Set([
  'insufficient',
  'insufficientdata',
  'insufficient_data',
  'nodata',
  'no_data',
  'notenoughdata',
  'not_enough_data',
  'unavailable',
]);

function isInsufficientSignal(status?: string | null) {
  return status ? insufficientInsightStatuses.has(status.trim().toLowerCase().replace(/[\s-]+/g, '_')) : false;
}

function hasInsufficientInsightsSignal(aiInsights: StudentDashboardResponseDto['aiInsights']) {
  return aiInsights.hasSufficientData === false ||
    aiInsights.insufficientData === true ||
    aiInsights.isInsufficientData === true ||
    isInsufficientSignal(aiInsights.status);
}

function isInsightUnavailable(
  insight: StudentDashboardInsightDto | null,
  aiInsights: StudentDashboardResponseDto['aiInsights'],
) {
  if (!insight) {
    return true;
  }

  return hasInsufficientInsightsSignal(aiInsights) ||
    insight.hasSufficientData === false ||
    insight.insufficientData === true ||
    insight.isInsufficientData === true ||
    isInsufficientSignal(insight.status) ||
    !insight.title.trim() ||
    typeof insight.masteryPercent !== 'number';
}

function getInsightUnavailableMessage(
  insight: StudentDashboardInsightDto | null,
  aiInsights: StudentDashboardResponseDto['aiInsights'],
) {
  return insight?.message?.trim() ||
    insight?.reason?.trim() ||
    aiInsights.message?.trim() ||
    aiInsights.reason?.trim() ||
    'Complete a few reviews to unlock a reliable AI insight.';
}

const InsightBlock: React.FC<{
  insight: StudentDashboardInsightDto | null;
  aiInsights: StudentDashboardResponseDto['aiInsights'];
  label: string;
  isLoading?: boolean;
}> = ({ insight, aiInsights, label, isLoading = false }) => {
  const isUnavailable = !isLoading && isInsightUnavailable(insight, aiInsights);
  const masteryPercent = typeof insight?.masteryPercent === 'number'
    ? clampPercent(insight.masteryPercent)
    : null;

  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wider text-white/50">{label}</p>
      <p className="mb-4 min-h-[3.5rem] text-2xl font-bold leading-tight text-white">
        {isLoading ? 'Loading...' : isUnavailable ? 'Not enough activity yet' : insight?.title}
      </p>
      {isUnavailable ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-white/55">
          {getInsightUnavailableMessage(insight, aiInsights)}
        </div>
      ) : (
        <>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-[#4A6792]" style={{ width: `${masteryPercent ?? 0}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-white/40">
        <span>Mastery</span>
        <span>{masteryPercent}%</span>
      </div>
        </>
      )}
    </div>
  );
};

const BentoCards: React.FC<BentoCardsProps> = ({
  dashboard,
  error,
  isError = false,
  isLoading = false,
  onRetry,
}) => {
  const navigate = useNavigate();
  const data = dashboard ?? emptyDashboard;
  const weeklyPercent = clampPercent(data.weeklyPerformance.goalPercent);
  const weeklyDelta = Math.round(data.weeklyPerformance.deltaFromLastWeekPercent);
  const flashcardPercent = clampPercent(data.flashcardsToday.completionPercent);
  const certificationCount = data.resumeSnapshot.newCertificationsThisSemester;

  if (isError) {
    return (
      <div className="relative z-10 w-full max-w-[1200px] rounded-3xl border border-red-400/30 bg-black p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Dashboard could not load</p>
            <p className="mt-1 max-w-2xl text-sm text-white/60">{getErrorMessage(error)}</p>
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-105 active:scale-95"
            type="button"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] relative z-10">
      <div className="bg-black border border-white/20 rounded-3xl p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#00CEC8] text-lg font-medium">Weekly Performance</span>
          <BarChart3 size={20} className="text-[#00CEC8]" />
        </div>
        <div className="flex items-center gap-6">
          <div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#00CEC8 0deg, #00CEC8 ${weeklyPercent * 3.6}deg, #111111 ${
                weeklyPercent * 3.6
              }deg, #111111 360deg)`,
            }}
          >
            <div className="absolute inset-[6px] rounded-full bg-black" />
            <span className="relative text-xl font-bold text-white">
              {isLoading ? '...' : `${weeklyPercent}%`}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{isLoading ? 'Loading performance' : data.weeklyPerformance.label}</p>
            <p className="text-xs text-white/50">
              {weeklyDelta === 0 ? 'No weekly change yet' : 'Changed '}
              {weeklyDelta !== 0 && (
                <span className="font-bold text-white">{Math.abs(weeklyDelta)}%</span>
              )}
              {weeklyDelta !== 0 && ' since last week'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black border border-white/20 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#00CEC8] text-lg font-medium">Upcoming Tasks</span>
            <CalendarDays size={20} className="text-[#00CEC8]" />
          </div>
          <button
            onClick={() => navigate('/calendar')}
            className="bg-white text-black rounded-lg px-3 py-1 text-[10px] font-bold hover:scale-105 active:scale-95 transition-transform"
            type="button"
          >
            Open Calendar
          </button>
        </div>
        <p className="text-white mb-4">
          {isLoading ? (
            'Loading deadlines'
          ) : (
            <>
              You have <span className="font-bold">{data.upcomingTasks.deadlineCountThisWeek}</span>{' '}
              {pluralize(data.upcomingTasks.deadlineCountThisWeek, 'deadline')} this week
            </>
          )}
        </p>
        <div className="space-y-3 text-xs">
          {data.upcomingTasks.items.length > 0 ? (
            data.upcomingTasks.items.map((item) => (
              <div key={item.sqid} className="flex min-w-0 items-center gap-2 text-white/70">
                <span className="font-bold text-white">{item.dueLabel}</span>
                <span>-</span>
                <span className="min-w-0 truncate">{item.title}</span>
              </div>
            ))
          ) : (
            <div className="text-white/60">
              {isLoading ? 'Checking your calendar...' : 'No deadlines this week'}
            </div>
          )}
        </div>
      </div>

      <div className="lg:row-span-2 bg-black border border-white/20 rounded-3xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[#00CEC8] text-lg font-medium">AI Insights</span>
          <LineChart size={20} className="text-[#00CEC8]" />
        </div>
        <div className="space-y-10">
          <InsightBlock insight={data.aiInsights.strength} aiInsights={data.aiInsights} isLoading={isLoading} label="Strength" />
          <InsightBlock insight={data.aiInsights.weakness} aiInsights={data.aiInsights} isLoading={isLoading} label="Weakness" />
        </div>
      </div>

      <div className="bg-black border border-white/20 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#00CEC8] text-lg font-medium">Flashcards Today</span>
          <BookOpenCheck size={20} className="text-[#00CEC8]" />
        </div>
        <div className="text-xl text-white font-bold mb-4">
          <span className="text-white">{isLoading ? '...' : data.flashcardsToday.completedCount}</span>{' '}
          <span className="text-white/60 font-normal">of {data.flashcardsToday.targetCount} completed</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-[#4A6792]" style={{ width: `${flashcardPercent}%` }}></div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-white/60">
            {data.flashcardsToday.streakDays > 0
              ? `Keep your ${data.flashcardsToday.streakDays}-day streak`
              : 'Start a streak today'}
          </p>
          <span className="text-xs text-white font-bold">{flashcardPercent}%</span>
        </div>
      </div>

      <div className="bg-black border border-white/20 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#00CEC8] text-lg font-medium">Resume Snapshot</span>
          <FileText size={20} className="text-[#00CEC8]" />
        </div>
        <p className="text-white text-lg mb-6">
          <span className="font-bold">{isLoading ? '...' : certificationCount}</span>{' '}
          new {pluralize(certificationCount, 'certification')} added this semester
        </p>
        <button
          onClick={() => navigate('/resume')}
          className="bg-white text-black rounded-lg px-4 py-1.5 text-xs font-bold hover:scale-105 active:scale-95 transition-transform"
          type="button"
        >
          {data.resumeSnapshot.resumeSqid ? 'Edit Resume' : 'Create Resume'}
        </button>
      </div>

    </div>
  );
};

export default BentoCards;
