import React, { useEffect, useMemo, useRef, useState } from 'react';

import Logo from '../../components/Logo';
import { useCurrentStudentQuery } from '@/features/auth/api/hooks';
import { useStudentCourseGroupsQuery } from '@/features/student-courses/api/hooks';
import { getAuthSession } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/api/errors';

import CourseCard from './component/CourseCard';
import { SemesterDropdown } from './component/component';
import UploadModal from './component/UploadModal';

const CoursePage = () => {
  const session = getAuthSession();
  const currentStudentQuery = useCurrentStudentQuery();
  const studentSqid = currentStudentQuery.data?.sqid ?? session?.student.sqid ?? null;
  const courseGroupsQuery = useStudentCourseGroupsQuery(studentSqid);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);

  useEffect(() => {
    if (!courseGroupsQuery.data?.length) {
      return;
    }

    const hasSelectedGroup = courseGroupsQuery.data.some((group) => group.groupKey === selectedGroupKey);
    if (!selectedGroupKey || !hasSelectedGroup) {
      setSelectedGroupKey(courseGroupsQuery.data[0].groupKey);
    }
  }, [courseGroupsQuery.data, selectedGroupKey]);

  const selectedGroup = useMemo(
    () => courseGroupsQuery.data?.find((group) => group.groupKey === selectedGroupKey) ?? null,
    [courseGroupsQuery.data, selectedGroupKey],
  );

  const dropdownOptions = useMemo(
    () =>
      (courseGroupsQuery.data ?? []).map((group) => ({
        label: group.groupLabel,
        value: group.groupKey,
      })),
    [courseGroupsQuery.data],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) {
      return;
    }

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.3;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const selectedGroupUnits = selectedGroup?.courses.reduce((sum, course) => sum + course.units, 0) ?? 0;

  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden bg-black px-8 pb-12 pt-32 font-sans text-white antialiased lg:px-16">
        <Logo />

        <div className="relative z-20 mx-auto mb-8 flex w-full max-w-[1600px] justify-end">
          <SemesterDropdown
            options={dropdownOptions}
            value={selectedGroupKey}
            onChange={setSelectedGroupKey}
            disabled={courseGroupsQuery.isPending || dropdownOptions.length === 0}
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-start lg:flex-row">
          <div className="relative z-10 flex w-full flex-shrink-0 flex-col pr-8 pt-2 lg:w-[420px] lg:pr-16">
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold leading-[1.15] lg:text-[36px]">
                Ace <span className="text-[#00CEC8]">The</span> Semester.
                <br />
                Learn Smarter.
                <br />
                Organize <span className="text-[#00CEC8]">Better</span>.
              </h1>

              <p className="max-w-[340px] pt-2 text-[15px] leading-relaxed text-white/70">
                Your current study load at a glance. Review subjects by term, renew your load, and jump into notes or flashcards from one place.
              </p>

              <div className="flex items-center gap-2 pt-2 font-medium">
                <span className="text-lg">|</span>
                <p className="text-[14px]">
                  Current Study Load:{' '}
                  <span className="font-bold text-[#00CEC8]">
                    {selectedGroup?.groupLabel ?? 'Waiting for your study load'}
                  </span>
                </p>
              </div>

              {selectedGroup && (
                <div className="grid max-w-[340px] grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[#050505] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Subjects</p>
                    <p className="mt-3 text-2xl font-bold text-white">{selectedGroup.courses.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#050505] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Units</p>
                    <p className="mt-3 text-2xl font-bold text-white">{selectedGroupUnits.toFixed(1)}</p>
                  </div>
                </div>
              )}

              <div className="pt-8">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-white/50">Upload / Renew Study Load</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mb-4 rounded-xl bg-white px-12 py-3 font-bold text-black transition-all hover:bg-gray-200"
                >
                  Upload
                </button>
                <p className="text-sm text-white/50">Ready for upload after semester ends.</p>
              </div>
            </div>
          </div>

          <div className="relative z-20 mt-4 hidden h-[480px] w-[1.5px] rounded-full bg-white/20 lg:block" />

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="relative z-10 flex-1 w-full overflow-x-auto select-none hide-scrollbar cursor-grab active:cursor-grabbing"
          >
            <div className="pointer-events-none flex w-max gap-6 py-8">
              <div className="w-8 flex-shrink-0" />

              {courseGroupsQuery.isPending &&
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`course-skeleton-${index}`}
                    className="pointer-events-auto h-[480px] min-w-[340px] rounded-[32px] border border-white/10 bg-white/5 animate-pulse"
                  />
                ))}

              {courseGroupsQuery.isError && (
                <div className="pointer-events-auto w-[420px] rounded-[32px] border border-rose-400/20 bg-rose-950/20 p-8 text-left">
                  <h2 className="text-2xl font-bold text-white">Unable to load your courses</h2>
                  <p className="mt-3 text-white/70">{getErrorMessage(courseGroupsQuery.error)}</p>
                </div>
              )}

              {!courseGroupsQuery.isPending && !courseGroupsQuery.isError && (courseGroupsQuery.data?.length ?? 0) === 0 && (
                <div className="pointer-events-auto w-[420px] rounded-[32px] border border-white/10 bg-[#050505] p-8">
                  <h2 className="text-2xl font-bold text-white">No study load uploaded yet</h2>
                  <p className="mt-3 text-white/70">
                    Upload your current study load to organize subjects by academic year and semester.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-8 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
                  >
                    Upload Study Load
                  </button>
                </div>
              )}

              {!courseGroupsQuery.isPending &&
                !courseGroupsQuery.isError &&
                selectedGroup &&
                selectedGroup.courses.map((course) => (
                  <div key={course.studentCourseSqid} className="pointer-events-auto">
                    <CourseCard {...course} />
                  </div>
                ))}

              {!courseGroupsQuery.isPending &&
                !courseGroupsQuery.isError &&
                selectedGroup &&
                selectedGroup.courses.length === 0 && (
                  <div className="pointer-events-auto w-[420px] rounded-[32px] border border-white/10 bg-[#050505] p-8">
                    <h2 className="text-2xl font-bold text-white">This term has no linked courses yet</h2>
                    <p className="mt-3 text-white/70">
                      The study load exists, but there are no student-course records attached to it yet.
                    </p>
                  </div>
                )}

              <div className="w-16 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </>
  );
};

export default CoursePage;
