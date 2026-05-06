import type {
  StudentCourseDashboardDto,
  StudentCourseResponseDto,
  StudyLoadResponseDto,
} from "./dto";

export interface CourseCardViewModel {
  studentCourseSqid: string;
  courseSqid: string;
  courseName: string;
  edpCode: string;
  units: number;
  overallPerformanceScore: number | null;
}

export interface CourseGroupViewModel {
  groupKey: string;
  groupLabel: string;
  yearOrdinal: number;
  studyLoadSqid: string;
  schoolYearStart: number;
  schoolYearEnd: number;
  semester: number;
  totalUnits: number | null;
  courses: CourseCardViewModel[];
}

function parseSchoolYearPart(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseSemesterOrder(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("first")) {
    return 1;
  }

  if (normalized.includes("second")) {
    return 2;
  }

  if (normalized.includes("third")) {
    return 3;
  }

  const numeric = Number.parseInt(normalized, 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getOrdinalLabel(value: number) {
  const suffix =
    value % 100 >= 11 && value % 100 <= 13
      ? "th"
      : value % 10 === 1
        ? "st"
        : value % 10 === 2
          ? "nd"
          : value % 10 === 3
            ? "rd"
            : "th";

  return `${value}${suffix} Year`;
}

function getSemesterLabel(semester: number) {
  if (semester === 1) {
    return "1st Semester";
  }

  if (semester === 2) {
    return "2nd Semester";
  }

  if (semester === 3) {
    return "3rd Semester";
  }

  return `Semester ${semester}`;
}

function compareStudyLoadAscending(left: StudyLoadResponseDto, right: StudyLoadResponseDto) {
  const leftStart = parseSchoolYearPart(left.schoolYearStart);
  const rightStart = parseSchoolYearPart(right.schoolYearStart);
  if (leftStart !== rightStart) {
    return leftStart - rightStart;
  }

  const leftEnd = parseSchoolYearPart(left.schoolYearEnd);
  const rightEnd = parseSchoolYearPart(right.schoolYearEnd);
  if (leftEnd !== rightEnd) {
    return leftEnd - rightEnd;
  }

  const leftSemester = parseSemesterOrder(left.semester);
  const rightSemester = parseSemesterOrder(right.semester);
  if (leftSemester !== rightSemester) {
    return leftSemester - rightSemester;
  }

  return left.createdAt.getTime() - right.createdAt.getTime();
}

export function mapStudentCourseGroups(
  studyLoads: StudyLoadResponseDto[],
  studentCourses: StudentCourseResponseDto[],
  dashboard: StudentCourseDashboardDto | null,
) {
  const sortedStudyLoads = [...studyLoads].sort(compareStudyLoadAscending);
  const performanceByStudentCourseSqid = new Map(
    (dashboard?.performanceSummaryRate.items ?? []).map((item) => [
      item.studentCourseSqid,
      item.overallPerformanceScore,
    ]),
  );

  const groups = sortedStudyLoads.map<CourseGroupViewModel>((studyLoad, index) => {
    const schoolYearStart = parseSchoolYearPart(studyLoad.schoolYearStart);
    const schoolYearEnd = parseSchoolYearPart(studyLoad.schoolYearEnd);
    const semester = parseSemesterOrder(studyLoad.semester);
    const courses = studentCourses
      .filter((studentCourse) => studentCourse.studyLoadSqid === studyLoad.sqid)
      .sort((left, right) => left.edpCode.localeCompare(right.edpCode))
      .map<CourseCardViewModel>((studentCourse) => ({
        studentCourseSqid: studentCourse.sqid,
        courseSqid: studentCourse.courseSqid,
        courseName: studentCourse.courseName,
        edpCode: studentCourse.edpCode,
        units: studentCourse.units,
        overallPerformanceScore: performanceByStudentCourseSqid.get(studentCourse.sqid) ?? null,
      }));

    const yearOrdinal = index + 1;

    return {
      groupKey: `${studyLoad.sqid}:${schoolYearStart}:${semester}`,
      groupLabel: `${getOrdinalLabel(yearOrdinal)} - ${getSemesterLabel(semester)}`,
      yearOrdinal,
      studyLoadSqid: studyLoad.sqid,
      schoolYearStart,
      schoolYearEnd,
      semester,
      totalUnits: typeof studyLoad.totalUnits === "number" ? studyLoad.totalUnits : null,
      courses,
    };
  });

  return groups.sort((left, right) => {
    if (left.schoolYearStart !== right.schoolYearStart) {
      return right.schoolYearStart - left.schoolYearStart;
    }

    if (left.schoolYearEnd !== right.schoolYearEnd) {
      return right.schoolYearEnd - left.schoolYearEnd;
    }

    return right.semester - left.semester;
  });
}
