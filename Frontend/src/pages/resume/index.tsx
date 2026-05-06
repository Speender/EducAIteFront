import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCurrentStudentQuery } from "@/features/auth/api/hooks";
import type { AuthSessionUser } from "@/lib/api/auth";
import { useResume, useResumeReview } from "@/features/resume/api/hooks";
import type { ResumeReviewResponseDto } from "@/features/resume/api/dto";
import { useResumeStore } from "@/features/resume/hooks/useResumeStore";
import ResumeWorkspace from "@/features/resume/components/ResumeWorkspace";
import ResumeDashboard from "@/features/resume/components/ResumeDashboard";

const ResumePage = () => {
  const { resumeSqid } = useParams<{ resumeSqid: string }>();
  const setInitialData = useResumeStore((state) => state.setInitialData);
  const setData = useResumeStore((state) => state.setData);

  const { isLoading: isLoadingResume } = useResume(resumeSqid || "");
  const { data: review, isLoading: isLoadingReview } = useResumeReview(resumeSqid || "");
  const { data: currentStudent } = useCurrentStudentQuery();

  useEffect(() => {
    if (review) {
      setInitialData(review);
    }
  }, [review, setInitialData]);

  useEffect(() => {
    if (!review || !currentStudent) {
      return;
    }

    setData({
      personalDetails: mergePersonalDetailsWithCurrentStudent(review.personalDetails, currentStudent),
    });
  }, [currentStudent, review, setData]);

  if (!resumeSqid) {
    return <ResumeDashboard />;
  }

  if (isLoadingResume || isLoadingReview) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#00CEC8]/20 border-t-[#00CEC8]" />
      </div>
    );
  }

  return <ResumeWorkspace resumeSqid={resumeSqid} />;
};

function mergePersonalDetailsWithCurrentStudent(
  personalDetails: ResumeReviewResponseDto["personalDetails"] | null | undefined,
  student: AuthSessionUser
): NonNullable<ResumeReviewResponseDto["personalDetails"]> {
  return {
    firstName: personalDetails?.firstName || student.firstName,
    lastName: personalDetails?.lastName || student.lastName,
    middleName: personalDetails?.middleName ?? student.middleName ?? null,
    email: personalDetails?.email || student.email,
    phoneNumber: personalDetails?.phoneNumber || student.phoneNumber || "",
    addressLine1: personalDetails?.addressLine1 || "",
    addressLine2: personalDetails?.addressLine2 ?? null,
    city: personalDetails?.city || "",
    provinceState: personalDetails?.provinceState || "",
    country: personalDetails?.country || "",
    postalCode: personalDetails?.postalCode || "",
    linkedInUrl: personalDetails?.linkedInUrl ?? null,
    portfolioUrl: personalDetails?.portfolioUrl ?? null,
  };
}

export default ResumePage;
