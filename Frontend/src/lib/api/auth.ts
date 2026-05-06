import { z } from "zod";

const AUTH_SESSION_STORAGE_KEY = "educaite.auth.session";
const AUTH_TOKEN_STORAGE_KEY = "educaite.auth.token";

const authSessionUserSchema = z.object({
  sqid: z.string().trim().min(1),
  studentIdNumber: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  middleName: z.string().trim().nullable().optional(),
  lastName: z.string().trim().min(1),
  email: z.string().trim(),
  phoneNumber: z.string().nullable().optional(),
  program: z.string().nullable().optional(),
  semester: z.number().nullable().optional(),
});

const persistedAuthSessionSchema = z.object({
  token: z.string().trim().min(1),
  expiration: z.string().datetime().nullable(),
  student: authSessionUserSchema,
});

export type AuthSessionUser = z.output<typeof authSessionUserSchema>;

export interface AuthSession {
  token: string;
  expiration: Date | null;
  student: AuthSessionUser;
}

export function persistAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.token);
  window.localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify({
      token: session.token,
      expiration: session.expiration?.toISOString() ?? null,
      student: session.student,
    }),
  );
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = persistedAuthSessionSchema.parse(JSON.parse(rawValue));
    const session: AuthSession = {
      token: parsed.token,
      expiration: parsed.expiration ? new Date(parsed.expiration) : null,
      student: parsed.student,
    };

    if (isAuthSessionExpired(session)) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (rawToken?.trim()) {
    return rawToken;
  }

  return getAuthSession()?.token ?? null;
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null;
}

export function syncAuthSessionStudent(student: AuthSessionUser): void {
  const session = getAuthSession();
  if (!session) {
    return;
  }

  persistAuthSession({
    ...session,
    student,
  });
}

function isAuthSessionExpired(session: AuthSession): boolean {
  return session.expiration instanceof Date && session.expiration.getTime() <= Date.now();
}
