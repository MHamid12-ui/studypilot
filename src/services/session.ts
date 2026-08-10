/**
 * Session helpers backed by localStorage.
 *
 * Task 1: minimal shell — auth flow (signUp/signIn/AuthProvider) arrives in Task 2.
 */

const CURRENT_USER_KEY = "studypilot:currentUserId";

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(userId: string): void {
  window.localStorage.setItem(CURRENT_USER_KEY, userId);
}

export function clearCurrentUserId(): void {
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Temporary signOut stub for the app shell (Task 1).
 * Task 2 replaces this with the real auth flow — clearing the session and
 * any per-user data as defined in specs/data-layer.md.
 */
export function signOut(): void {
  clearCurrentUserId();
}
