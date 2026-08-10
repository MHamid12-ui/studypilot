/**
 * StudyPilot — authenticated user context (Task 2).
 *
 * Hydrates synchronously from LocalStorage on mount (no login-screen flash)
 * and exposes the current account + profile globally, so any page can render
 * the personalized "Welcome back, <name>" without hardcoding a name.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  type AuthResult,
} from "../services/auth";
import {
  getUserById,
  getUserProfile,
  type UserAccount,
  type UserProfile,
} from "../services/dataLayer";

interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
}

interface SignInInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  /** Currently authenticated account (null when logged out). */
  user: UserAccount | null;
  /** Current user's profile (name, email, education level). */
  profile: UserProfile | null;
  /** Re-reads user + profile from storage (e.g. after onboarding). */
  refreshProfile: () => void;
  signUp: (input: SignUpInput) => AuthResult;
  signIn: (input: SignInInput) => AuthResult;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const current = getCurrentUser();
    return current ? getUserProfile(current.id) : null;
  });

  const refreshProfile = useCallback(() => {
    const current = getCurrentUser();
    setUser(current);
    setProfile(current ? getUserProfile(current.id) : null);
  }, []);

  const applySession = useCallback((userId: string) => {
    const account = getUserById(userId);
    setUser(account);
    setProfile(account ? getUserProfile(account.id) : null);
  }, []);

  const signUp = useCallback(
    (input: SignUpInput): AuthResult => {
      const result = authSignUp(input);
      if (result.ok) applySession(result.userId);
      return result;
    },
    [applySession]
  );

  const signIn = useCallback(
    (input: SignInInput): AuthResult => {
      const result = authSignIn(input);
      if (result.ok) applySession(result.userId);
      return result;
    },
    [applySession]
  );

  const signOut = useCallback(() => {
    authSignOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, profile, refreshProfile, signUp, signIn, signOut }),
    [user, profile, refreshProfile, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return ctx;
}
