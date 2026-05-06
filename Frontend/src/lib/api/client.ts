import axios, { type InternalAxiosRequestConfig } from "axios";

import { clearAuthSession, getAccessToken } from "./auth";
import { env } from "./env";

function attachAuthorization(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getAccessToken();
  if (!token) {
    return config;
  }

  if (typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

function createClient(baseURL: string) {
  return axios.create({
    baseURL,
    timeout: env.VITE_REQUEST_TIMEOUT_MS,
    headers: {
      Accept: "application/json",
    },
  });
}

export const publicApiClient = createClient(env.VITE_API_URL);
export const apiClient = createClient(env.VITE_API_URL);

apiClient.interceptors.request.use(attachAuthorization);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(error);
  },
);
