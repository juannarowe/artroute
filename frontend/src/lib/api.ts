import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;

// Every request goes through here: base URL, JSON, auth token and errors.
export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // getIdToken() refreshes the token automatically when it expires
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    // NestJS sends { message, statusCode }; React Query puts this in "error"
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message ?? `Request failed (${response.status})`,
    );
  }

  // 204 No Content (DELETE) has no body to read
  if (response.status === 204) {
    return null;
  }
  return response.json();
}
