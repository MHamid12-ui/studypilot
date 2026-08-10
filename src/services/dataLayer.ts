/**
 * StudyPilot — typed LocalStorage data layer (Task 2).
 *
 * Centralizes every storage read/write so UI components never touch
 * `localStorage` directly. All per-user keys are namespaced by user id
 * (`studypilot:user_<id>_<suffix>`) so multiple accounts on one browser
 * are fully isolated. Every data-layer function takes `userId` explicitly —
 * there is NO module-level "current student" object.
 *
 * Reads are wrapped in try/catch with JSON parse guards: corrupt or missing
 * keys return safe defaults (never throw into the UI).
 */

export const SCHEMA_VERSION = 1;

const SCHEMA_VERSION_KEY = "studypilot:schemaVersion";
const USERS_KEY = "studypilot:users";
const CURRENT_USER_KEY = "studypilot:currentUserId";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type EducationLevel = "HIGH_SCHOOL" | "UNDERGRADUATE";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

/** Auth registry entry — one per account (password is a prototype hash). */
export interface UserAccount {
  id: string; // uniqueId — crypto.randomUUID()
  email: string; // lowercased, validated
  passwordHash: string; // prototype-level hash (NOT real security)
  createdAt: string; // ISO timestamp
}

export interface UserProfile {
  fullName: string;
  email: string;
  educationLevel: EducationLevel | null;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string; // crypto.randomUUID()
  name: string; // e.g. "Biology"
  custom: boolean; // true when added via "+ Add Subject"
  topics: Topic[]; // [] allowed for custom subjects
  addedAt: string;
}

export interface UserOnboarding {
  completed: boolean;
  completedAt: string | null;
}

export interface PerformanceActivity {
  subjectId: string;
  subjectName: string;
  timestamp: string;
}

/**
 * Per-user performance foundation. Zero/empty for new accounts — later
 * Practice/Progress tasks update these with real activity. `accuracy` stays
 * `null` until there is something to measure (never show fake stats).
 */
export interface UserPerformance {
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number | null; // percentage 0–100, null until first answer
  subjectsPracticed: string[]; // subject ids practiced
  recentActivity: PerformanceActivity[];
  learningProgress: number; // 0–100 placeholder, updated by later tasks
  updatedAt: string;
}

export interface UserSettings {
  currentSubjectId: string | null;
  currentTopicId: string | null;
  currentDifficulty: Difficulty;
  updatedAt: string;
}

export interface PracticeRecord {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string | null;
  topicName: string | null;
  difficulty: Difficulty;
  question: string;
  options: string[];
  chosenAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean | null; // null until answered
  explanation: string;
  timestamp: string;
}

/* ------------------------------------------------------------------ */
/* Safe read/write helpers                                             */
/* ------------------------------------------------------------------ */

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt value — drop it rather than crash the app.
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / quota exceeded — fail silently, app keeps working.
  }
}

/** Per-user namespace helper: `studypilot:user_<id>_<suffix>`. */
function userKey(userId: string, suffix: string): string {
  return `studypilot:user_${userId}_${suffix}`;
}

/* ------------------------------------------------------------------ */
/* IDs & prototype password hash                                       */
/* ------------------------------------------------------------------ */

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * PROTOTYPE-ONLY password obfuscation.
 * This is NOT real security — a synchronous hash with no secret, stored in
 * LocalStorage. It exists so plaintext passwords never sit in storage and so
 * the auth layer can be swapped for a real provider (Supabase Auth, etc.)
 * in production without changing the UI. Never use this pattern in production.
 */
export function hashPassword(password: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  const data = `studypilot::${password}`;
  for (let i = 0; i < data.length; i++) {
    const ch = data.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `${(h2 >>> 0).toString(16).padStart(8, "0")}${(h1 >>> 0).toString(16).padStart(8, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Account registry                                                    */
/* ------------------------------------------------------------------ */

function readUsers(): UserAccount[] {
  return readJson<UserAccount[]>(USERS_KEY, []);
}

export function getUserByEmail(email: string): UserAccount | null {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((u) => u.email === normalized) ?? null;
}

export function getUserById(id: string): UserAccount | null {
  return readUsers().find((u) => u.id === id) ?? null;
}

/**
 * Creates an account and initializes that user's entire per-user namespace
 * (profile, subjects, onboarding, performance, practice, settings) with
 * safe empty defaults. Returns the new account.
 */
export function createUser(input: {
  fullName: string;
  email: string;
  password: string;
}): UserAccount {
  const now = new Date().toISOString();
  const id = generateId();
  const email = input.email.trim().toLowerCase();

  const account: UserAccount = {
    id,
    email,
    passwordHash: hashPassword(input.password),
    createdAt: now,
  };

  const users = readUsers();
  users.push(account);
  writeJson(USERS_KEY, users);
  writeJson(SCHEMA_VERSION_KEY, SCHEMA_VERSION);

  writeJson(userKey(id, "profile"), {
    fullName: input.fullName.trim(),
    email,
    educationLevel: null,
    updatedAt: now,
  } satisfies UserProfile);
  writeJson(userKey(id, "subjects"), [] satisfies Subject[]);
  writeJson(userKey(id, "onboarding"), {
    completed: false,
    completedAt: null,
  } satisfies UserOnboarding);
  writeJson(userKey(id, "performance"), emptyPerformance(now));
  writeJson(userKey(id, "practice"), [] satisfies PracticeRecord[]);
  writeJson(userKey(id, "settings"), {
    currentSubjectId: null,
    currentTopicId: null,
    currentDifficulty: "MEDIUM",
    updatedAt: now,
  } satisfies UserSettings);

  return account;
}

/* ------------------------------------------------------------------ */
/* Session (studypilot:currentUserId)                                  */
/* ------------------------------------------------------------------ */

export function readCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

export function writeCurrentUserId(userId: string): void {
  if (typeof window === "undefined") return;
  try {
    // Store the raw id (no JSON.stringify) so the value round-trips
    // through readCurrentUserId's raw getItem without literal quotes.
    window.localStorage.setItem(CURRENT_USER_KEY, userId);
  } catch {
    /* ignore */
  }
}

export function removeCurrentUserId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Resolves the active session: reads the stored user id and validates it
 * against the account registry. If the id is missing OR no longer maps to a
 * real account (corrupt / stale), the invalid session is cleared and `null`
 * is returned. Never auto-logs-in a different user.
 */
export function resolveCurrentUser(): UserAccount | null {
  const id = readCurrentUserId();
  if (!id) return null;
  const account = getUserById(id);
  if (!account) {
    removeCurrentUserId();
    return null;
  }
  return account;
}

/* ------------------------------------------------------------------ */
/* Per-user profile                                                    */
/* ------------------------------------------------------------------ */

export function getUserProfile(userId: string): UserProfile | null {
  return readJson<UserProfile | null>(userKey(userId, "profile"), null);
}

export function saveUserProfile(userId: string, profile: UserProfile): void {
  writeJson(userKey(userId, "profile"), profile);
}

/* ------------------------------------------------------------------ */
/* Per-user subjects                                                   */
/* ------------------------------------------------------------------ */

export function getUserSubjects(userId: string): Subject[] {
  return readJson<Subject[]>(userKey(userId, "subjects"), []);
}

export function saveUserSubjects(userId: string, subjects: Subject[]): void {
  writeJson(userKey(userId, "subjects"), subjects);
}

/* ------------------------------------------------------------------ */
/* Per-user onboarding                                                 */
/* ------------------------------------------------------------------ */

export function getUserOnboarding(userId: string): UserOnboarding {
  return readJson<UserOnboarding>(userKey(userId, "onboarding"), {
    completed: false,
    completedAt: null,
  });
}

export function saveUserOnboarding(userId: string, onboarding: UserOnboarding): void {
  writeJson(userKey(userId, "onboarding"), onboarding);
}

export function isOnboardingComplete(userId: string): boolean {
  return getUserOnboarding(userId).completed;
}

/* ------------------------------------------------------------------ */
/* Per-user performance (foundation — zero/empty for new accounts)     */
/* ------------------------------------------------------------------ */

export function emptyPerformance(updatedAt: string): UserPerformance {
  return {
    questionsAttempted: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    accuracy: null,
    subjectsPracticed: [],
    recentActivity: [],
    learningProgress: 0,
    updatedAt,
  };
}

export function getUserPerformance(userId: string): UserPerformance {
  return readJson<UserPerformance>(
    userKey(userId, "performance"),
    emptyPerformance(new Date().toISOString())
  );
}

export function saveUserPerformance(userId: string, performance: UserPerformance): void {
  writeJson(userKey(userId, "performance"), performance);
}

/* ------------------------------------------------------------------ */
/* Per-user settings & practice (foundation for later tasks)           */
/* ------------------------------------------------------------------ */

export function getUserSettings(userId: string): UserSettings {
  return readJson<UserSettings>(userKey(userId, "settings"), {
    currentSubjectId: null,
    currentTopicId: null,
    currentDifficulty: "MEDIUM",
    updatedAt: new Date().toISOString(),
  });
}

export function saveUserSettings(userId: string, settings: UserSettings): void {
  writeJson(userKey(userId, "settings"), settings);
}

export function getPracticeRecords(userId: string): PracticeRecord[] {
  return readJson<PracticeRecord[]>(userKey(userId, "practice"), []);
}

export function savePracticeRecords(userId: string, records: PracticeRecord[]): void {
  writeJson(userKey(userId, "practice"), records);
}
