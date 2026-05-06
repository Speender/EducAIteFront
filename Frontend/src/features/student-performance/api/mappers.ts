import type {
  StudentAnalyticsDashboardResponseDto,
  StudentCoursePerformanceSummaryResponseDto,
  StudentOverallPerformanceSummaryResponseDto,
} from "./dto";

export function mapStudentAnalyticsDashboard(dto: StudentAnalyticsDashboardResponseDto) {
  return dto;
}

export function mapStudentOverallPerformance(dto: StudentOverallPerformanceSummaryResponseDto) {
  return dto;
}

export function mapStudentCoursePerformance(dto: StudentCoursePerformanceSummaryResponseDto) {
  return dto;
}
