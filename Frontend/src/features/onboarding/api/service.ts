import { apiClient } from "@/lib/api/client";

import {
  registerWithStudyLoadFormSchema,
  registerWithStudyLoadResponseDtoSchema,
  type RegisterWithStudyLoadFormValues,
} from "./dto";

export async function registerWithStudyLoad(input: RegisterWithStudyLoadFormValues, studyLoadDocument: File) {
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
  formData.append("studyLoadDocument", studyLoadDocument);

  const { data } = await apiClient.post("/Onboarding/register-with-studyload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return registerWithStudyLoadResponseDtoSchema.parse(data);
}
