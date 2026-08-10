/**
 * StudyPilot — auth service (Task 2).
 *
 * Isolated so it can be replaced by a real authentication provider
 * (e.g. Supabase Auth) in a future production build WITHOUT touching the UI.
 * Prototype behavior: LocalStorage-backed accounts, prototype password hash,
 * no external services, no API keys, no network calls.
 */

import {
  createUser,
  getUserByEmail,
  hashPassword,
  removeCurrentUserId,
  resolveCurrentUser,
  writeCurrentUserId,
  type UserAccount,
} from "./dataLayer";

export const MIN_PASSWORD_LENGTH = 8;

export type AuthResult = { ok: true; userId: string } | { ok: false; error: string };

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Creates an account, starts a session and returns the new user id. */
export function signUp(input: {
  fullName: string;
  email: string;
  password: string;
}): AuthResult {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName) return { ok: false, error: "Please enter your full name." };
  if (!email) return { ok: false, error: "Please enter your email address." };
  if (!isValidEmail(email)) {
    return { ok: false, error: "That email address doesn't look right — please double-check it." };
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `Passwords need at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (getUserByEmail(email)) {
    return { ok: false, error: "An account with this email already exists. Try signing in instead." };
  }

  const account = createUser({ fullName, email, password: input.password });
  writeCurrentUserId(account.id);
  return { ok: true, userId: account.id };
}

/** Validates credentials, starts a session and returns the user id. */
export function signIn(input: { email: string; password: string }): AuthResult {
  const email = input.email.trim().toLowerCase();
  const account = getUserByEmail(email);

  if (!account || hashPassword(input.password) !== account.passwordHash) {
    return { ok: false, error: "Incorrect email or password. Please try again." };
  }

  writeCurrentUserId(account.id);
  return { ok: true, userId: account.id };
}

/** Ends the session. Account data is kept so the user can sign back in. */
export function signOut(): void {
  removeCurrentUserId();
}

/** Returns the currently authenticated account, or null when logged out. */
export function getCurrentUser(): UserAccount | null {
  return resolveCurrentUser();
}
