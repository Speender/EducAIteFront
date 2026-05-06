import axios from "axios";

export type ApiFieldErrors = Record<string, string[]>;

export interface NormalizedApiError {
  status: number;
  code: string;
  message: string;
  fieldErrors?: ApiFieldErrors;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const payload = error.response?.data;
    const fieldErrors = extractFieldErrors(payload);

    return {
      status,
      code: extractCode(payload, error.code, status),
      message: extractMessage(payload) ?? error.message ?? "Something went wrong.",
      ...(fieldErrors ? { fieldErrors } : {}),
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  return {
    status: 500,
    code: "UNKNOWN_ERROR",
    message: "Something went wrong.",
  };
}

export function getErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

function extractCode(payload: unknown, fallbackCode: string | undefined, status: number): string {
  if (typeof payload === "object" && payload !== null) {
    const code = (payload as { code?: unknown }).code;
    if (typeof code === "string" && code.trim()) {
      return code;
    }
  }

  return fallbackCode?.trim() || `HTTP_${status}`;
}

function extractMessage(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const message = (payload as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  const error = (payload as { error?: unknown }).error;
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  const detail = (payload as { detail?: unknown }).detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  const debugMessage = (payload as { debugMessage?: unknown }).debugMessage;
  if (typeof debugMessage === "string" && debugMessage.trim()) {
    return debugMessage;
  }

  const title = (payload as { title?: unknown }).title;
  if (typeof title === "string" && title.trim()) {
    return title;
  }

  return null;
}

function extractFieldErrors(payload: unknown): ApiFieldErrors | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const errors = (payload as { errors?: unknown }).errors;
  if (typeof errors !== "object" || errors === null) {
    return undefined;
  }

  const normalizedEntries = Object.entries(errors).flatMap(([key, value]) => {
    if (!Array.isArray(value)) {
      return [];
    }

    const messages = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return messages.length > 0 ? [[key, messages] as const] : [];
  });

  if (normalizedEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(normalizedEntries);
}
