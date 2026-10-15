/**
 * Centralized API client.
 *
 * Connected to https://github.com/hxscyprodz/ZimReg_Backend (a rewrite of
 * the earlier ZimRegistry_Backend — different route paths, response
 * shapes, and auth model; see the comments in each *.api.ts module for
 * specifics).
 *
 * Auth model: this backend uses httpOnly, sameSite=strict session cookies
 * (accessToken + refreshToken, set by the server on login/register) —
 * NOT a bearer token in a header. That's actually a stronger security
 * posture than the previous backend (JS can never read the token at all),
 * so `apiRequest` just sends `credentials: 'include'` on every request and
 * lets the browser handle the cookie automatically. There's nothing for
 * the frontend to store in memory anymore.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiRequestError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
  }
}

/** Simulates network latency for the mock layer so loading states are visible in dev. */
export function delay<T>(value: T, ms = 650): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Real request function backing the modules connected to the actual backend. */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiRequestError(
      "We couldn't connect to the service. Please check your internet connection and try again.",
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(
      body?.message ??
        `Something went wrong (${response.status}). Please try again.`,
      body?.code,
    );
  }

  return body as T;
}
