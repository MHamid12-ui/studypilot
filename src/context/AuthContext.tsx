import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthState, Profile } from '../types';
import { getAuthState, login as authLogin, signup as authSignup, updateProfile as authUpdateProfile } from '../lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<Profile | null>;
  signup: (email: string, password: string, fullName: string) => Promise<Profile>;
  logout: () => void;
  updateProfile: (updates: Partial<Profile>) => Profile | null;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true });

  const refreshUser = useCallback(() => {
    setState(getAuthState());
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<Profile | null> => {
    const user = authLogin(email, password);
    if (user) {
      setState({ user, isAuthenticated: true, isLoading: false });
    }
    return user;
  }, []);

  const signup = useCallback(async (email: string, password: string, fullName: string): Promise<Profile> => {
    const user = authSignup(email, password, fullName);
    setState({ user, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  const handleLogout = useCallback(() => {
    clearCurrentUser();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const handleUpdateProfile = useCallback((updates: Partial<Profile>): Profile | null => {
    const updated = authUpdateProfile(updates);
    if (updated) {
      setState({ user: updated, isAuthenticated: true, isLoading: false });
    }
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout: handleLogout,
      updateProfile: handleUpdateProfile,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function clearCurrentUser(): void {
  localStorage.removeItem('studypilot_current_user');
}