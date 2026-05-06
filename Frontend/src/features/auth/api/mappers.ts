import type { AuthSession, AuthSessionUser } from "@/lib/api/auth";

import type { AuthResultDto, CurrentStudentDto } from "./dto";

export function mapCurrentStudent(dto: CurrentStudentDto): AuthSessionUser {
  return {
    sqid: dto.sqid,
    studentIdNumber: dto.studentIdNumber,
    firstName: dto.firstName,
    middleName: dto.middleName ?? null,
    lastName: dto.lastName,
    email: dto.email,
    phoneNumber: dto.phoneNumber ?? null,
    program: dto.program ?? null,
    semester: dto.semester ?? null,
  };
}

export function mapAuthSession(auth: AuthResultDto, student: CurrentStudentDto): AuthSession {
  if (!auth.token) {
    throw new Error(auth.error?.trim() || "Login did not return an access token.");
  }

  return {
    token: auth.token,
    expiration: auth.expiration ?? null,
    student: mapCurrentStudent(student),
  };
}
