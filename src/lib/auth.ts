import { db } from './storage';
import type { Profile, AuthState } from '../types';

const AUTH_KEY = 'studypilot_current_user';

export function getCurrentUser(): Profile | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: Profile): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function login(email: string, password: string): Profile | null {
  // Find user by email
  const users = db.getAll<Profile & { password: string }>('users');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) return null;
  const { password: _, ...profile } = user;
  setCurrentUser(profile as Profile);
  return profile as Profile;
}

export function signup(email: string, password: string, fullName: string): Profile {
  const users = db.getAll<Profile & { password: string }>('users');
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) throw new Error('An account with this email already exists.');

  const profile: Profile = {
    id: db.generateId(),
    email: email.toLowerCase(),
    fullName,
    educationLevel: 'high_school',
    subjects: [],
    createdAt: db.now(),
  };

  db.create('users', { ...profile, password } as any);
  setCurrentUser(profile);
  return profile;
}

export function updateProfile(updates: Partial<Profile>): Profile | null {
  const user = getCurrentUser();
  if (!user) return null;
  const updated = db.update<Profile>('users', user.id, updates as any);
  if (updated) {
    const { password: _, ...profile } = updated as any;
    setCurrentUser(profile as Profile);
    return profile as Profile;
  }
  return null;
}

export function getAuthState(): AuthState {
  const user = getCurrentUser();
  return {
    user,
    isAuthenticated: !!user,
    isLoading: false,
  };
}

export function getAllUsers(): Profile[] {
  return db.getAll<any>('users').map(({ password, ...rest }) => rest as Profile);
}