import { AuthResponse } from "./types/auth";

const API_BASE_URL = "http://localhost:3001/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  token?: string;
}

/**
 * Low-level API request helper.
 * - Always sends `credentials: 'include'` so cookies (session) travel cross-origin.
 * - Attaches a Bearer token if one is supplied explicitly, else falls back to
 *   the JWT stored in localStorage under `fc_token`.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, token } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  // Resolve token: explicit param > localStorage
  const resolvedToken =
    token ??
    (typeof window !== "undefined" ? localStorage.getItem("fc_token") : null);

  const config: RequestInit = {
    method,
    credentials: "include", // send cookies cross-origin (session cookie, etc.)
    headers: {
      "Content-Type": "application/json",
      ...(resolvedToken
        ? { Authorization: `Bearer ${resolvedToken}` }
        : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const authApi = {
  signIn: (data: any) =>
    apiRequest<AuthResponse>("/auth/sign-in/email", {
      method: "POST",
      body: data,
    }),
  signUp: (data: any) =>
    apiRequest<AuthResponse>("/auth/sign-up/email", {
      method: "POST",
      body: data,
    }),
};

