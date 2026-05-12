import { apiClient } from "@/lib/api/client";

import {
  registrationStudyLoadPreviewResponseDtoSchema,
  registerWithStudyLoadFormSchema,
  registerWithStudyLoadResponseDtoSchema,
  type RegisterWithStudyLoadFormValues,
  type RegistrationStudyLoadPreviewResponseDto,
} from "./dto";

export async function previewStudyLoadRegistration(studyLoadDocument: File) {
  const formData = new FormData();
  formData.append("studyLoadDocument", studyLoadDocument);

  const { data } = await apiClient.post("/Onboarding/studyload-preview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return registrationStudyLoadPreviewResponseDtoSchema.parse(data);
}

export async function registerWithStudyLoad(
  input: RegisterWithStudyLoadFormValues,
  studyLoadDocument: File,
  reviewedStudyLoad?: RegistrationStudyLoadPreviewResponseDto | null,
) {
  const payload = registerWithStudyLoadFormSchema.parse(input);
  const formData = new FormData();

  formData.append("firstName", payload.firstName);
  formData.append("middleName", payload.middleName ?? "");
  formData.append("lastName", payload.lastName);
  formData.append("studentIdNumber", payload.studentIdNumber);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirmPassword", payload.confirmPassword);
  formData.append("expiresInMinutes", String(payload.expiresInMinutes));
  if (reviewedStudyLoad) {
    formData.append("parsedStudyLoadJson", JSON.stringify(toReviewedStudyLoadPayload(reviewedStudyLoad)));
  }
  formData.append("studyLoadDocument", studyLoadDocument);

  const { data } = await apiClient.post("/Onboarding/register-with-studyload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return registerWithStudyLoadResponseDtoSchema.parse(data);
}

function toReviewedStudyLoadPayload(reviewedStudyLoad: RegistrationStudyLoadPreviewResponseDto) {
  return {
    semester: reviewedStudyLoad.parseResult.parsedSemester,
    schoolYearStart: reviewedStudyLoad.parseResult.parsedSchoolYearStart,
    schoolYearEnd: reviewedStudyLoad.parseResult.parsedSchoolYearEnd,
    courses: reviewedStudyLoad.parseResult.parsedCourses.map((course) => ({
      edpCode: course.edpCode,
      courseName: course.courseName,
      units: course.units,
    })),
  };
}
