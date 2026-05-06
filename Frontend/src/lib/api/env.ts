import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:5126/api"),
  VITE_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(400000),
});

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_REQUEST_TIMEOUT_MS: import.meta.env.VITE_REQUEST_TIMEOUT_MS,
});
