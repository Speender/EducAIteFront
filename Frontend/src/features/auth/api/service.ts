import { apiClient, publicApiClient } from "@/lib/api/client";

import { authResultDtoSchema, currentStudentDtoSchema, loginRequestSchema, type LoginRequest } from "./dto";
import { mapAuthSession, mapCurrentStudent } from "./mappers";

export async function login(input: LoginRequest) {
  const payload = loginRequestSchema.parse(input);
  const { data } = await publicApiClient.post("/Auth/login", payload);
  const auth = authResultDtoSchema.parse(data);

  if (!auth.success || !auth.token) {
    throw new Error(auth.error?.trim() || "Login failed.");
  }

  const profileResponse = await publicApiClient.get("/Student/me", {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  const student = currentStudentDtoSchema.parse(profileResponse.data);
  return mapAuthSession(auth, student);
}

export async function getCurrentStudent() {
  const { data } = await apiClient.get("/Student/me");
  return mapCurrentStudent(currentStudentDtoSchema.parse(data));
}
