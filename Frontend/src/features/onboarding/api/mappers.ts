import type { AuthSession } from "@/lib/api/auth";

import type { RegisterWithStudyLoadResponseDto } from "./dto";

export function mapOnboardingSession(response: RegisterWithStudyLoadResponseDto): AuthSession {
  if (!response.auth.token) {
    throw new Error(response.auth.error?.trim() || "Registration did not return an access token.");
  }

  return {
    token: response.auth.token,
    expiration: response.auth.expiration ?? null,
    student: {
      sqid: response.student.sqid,
      studentIdNumber: response.student.studentIdNumber,
      firstName: response.student.firstName,
      middleName: null,
      lastName: response.student.lastName,
      email: response.student.email,
    },
  };
}
