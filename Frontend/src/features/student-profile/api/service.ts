import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import { currentStudentDtoSchema } from "@/features/auth/api/dto";
import { mapCurrentStudent } from "@/features/auth/api/mappers";

// --- DTOs ---

export const updateProfileRequestSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(1),
  phoneNumber: z.string().optional().nullable(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

// --- Service ---

export const profileService = {
  async updateProfile(payload: UpdateProfileRequest) {
    const { data } = await apiClient.put("/Student/me", payload);
    return mapCurrentStudent(currentStudentDtoSchema.parse(data));
  },

  // Education (Global)
  async getEducation() {
     const { data } = await apiClient.get("/Student/education");
     // Using existing schema from resume for consistency if applicable
     return data;
  },

  async addEducation(payload: any) {
     const { data } = await apiClient.post("/Student/education", payload);
     return data;
  },

  async updateEducation(educationSqid: string, payload: any) {
     const { data } = await apiClient.put(`/Student/education/${educationSqid}`, payload);
     return data;
  },

  async deleteEducation(educationSqid: string) {
     await apiClient.delete(`/Student/education/${educationSqid}`);
  },

  // Experience (Global)
  async getExperience() {
     const { data } = await apiClient.get("/Student/employment-history");
     return data;
  },

  async addExperience(payload: any) {
     const { data } = await apiClient.post("/Student/employment-history", payload);
     return data;
  },

  async updateExperience(employmentSqid: string, payload: any) {
     const { data } = await apiClient.put(`/Student/employment-history/${employmentSqid}`, payload);
     return data;
  },

  async deleteExperience(employmentSqid: string) {
     await apiClient.delete(`/Student/employment-history/${employmentSqid}`);
  }
};
