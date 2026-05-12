import { apiClient } from "@/lib/api/client";

import { studentDashboardResponseDtoSchema } from "./dto";

export async function getStudentDashboard() {
  const { data } = await apiClient.get("/Student/me/dashboard");

  return studentDashboardResponseDtoSchema.parse(data);
}
