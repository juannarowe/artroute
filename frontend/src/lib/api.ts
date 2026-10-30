import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(
      errorBody?.message ?? `Request failed (${response.status})`,
      response.status,
    );
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}
