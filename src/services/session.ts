/**
 * Session facade (Task 2).
 *
 * Keeps the Task 1 API (`getCurrentUserId` / `setCurrentUserId` /
 * `clearCurrentUserId` / `signOut`) while delegating all real logic to the
 * typed data layer. `getCurrentUserId` validates the stored id against the
 * account registry — a stale/corrupt session is cleared automatically.
 */

import {
  readCurrentUserId,
  removeCurrentUserId,
  resolveCurrentUser,
  writeCurrentUserId,
} from "./dataLayer";

/** Current authenticated user id, or null when logged out / session invalid. */
export function getCurrentUserId(): string | null {
  return resolveCurrentUser()?.id ?? null;
}

export function setCurrentUserId(userId: string): void {
  writeCurrentUserId(userId);
}

export function clearCurrentUserId(): void {
  removeCurrentUserId();
}

/** Ends the session — keeps the account so the user can sign back in. */
export function signOut(): void {
  removeCurrentUserId();
}

/** Raw stored id (no validation). Used internally by the data layer. */
export function peekCurrentUserId(): string | null {
  return readCurrentUserId();
}
