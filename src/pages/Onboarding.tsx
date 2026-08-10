import { useRef, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  GraduationCap,
  Plus,
  School,
  Sigma,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PREDEFINED_SUBJECTS, type PredefinedSubject } from "../constants/subjects";
import {
  generateId,
  getUserProfile,
  isOnboardingComplete,
  saveUserOnboarding,
  saveUserProfile,
  saveUserSubjects,
  type EducationLevel,
  type Subject,
} from "../services/dataLayer";

const LEVEL_OPTIONS: {
  value: EducationLevel;
  label: string;
  description: string;
  icon: typeof School;
}[] = [
  {
    value: "HIGH_SCHOOL",
    label: "High School",
    description: "Secondary school courses and exams",
    icon: School,
  },
  {
    value: "UNDERGRADUATE",
    label: "Undergraduate",
    description: "University and college courses",
    icon: GraduationCap,
  },
];

const PREDEFINED_ICONS = [Code2, Sigma] as const;

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [level, setLevel] = useState<EducationLevel | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [addingSubject, setAddingSubject] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const toastTimer = useRef<number | null>(null);

  // Guard: onboarding requires an active session.
  if (!user) return <Navigate to="/auth/login" replace />;
  // Already completed onboarding? Never force it again.
  if (isOnboardingComplete(user.id)) return <Navigate to="/dashboard" replace />;

  const showToast = (message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  };

  const isPredefinedSelected = (name: string) =>
    subjects.some((s) => s.name === name);

  const togglePredefined = (pre: PredefinedSubject) => {
    setSubjects((prev) =>
      prev.some((s) => s.name === pre.name)
        ? prev.filter((s) => s.name !== pre.name)
        : [
            ...prev,
            {
              id: generateId(),
              name: pre.name,
              custom: false,
              topics: pre.topics.map((t) => ({ id: generateId(), name: t })),
              addedAt: new Date().toISOString(),
            },
          ]
    );
  };

  const handleAddCustom = (event: FormEvent) => {
    event.preventDefault();
    const name = customName.trim();
    if (!name) {
      setCustomError("Please enter a subject name.");
      return;
    }
    if (subjects.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setCustomError("That subject is already in your list.");
      return;
    }

    const subject: Subject = {
      id: generateId(),
      name,
      custom: true,
      topics: [],
      addedAt: new Date().toISOString(),
    };
    setSubjects((prev) => [...prev, subject]);
    setCustomName("");
    setCustomError(null);
    setAddingSubject(false);
    showToast(`${name} has been added to your subjects.`);
  };

  const handleFinish = () => {
    if (!user || !level || subjects.length === 0) return;
    setSaving(true);
    const now = new Date().toISOString();
    const existing = getUserProfile(user.id);
    saveUserProfile(user.id, {
      fullName: existing?.fullName ?? "",
      email: existing?.email ?? user.email,
      educationLevel: level,
      updatedAt: now,
    });
    saveUserSubjects(user.id, subjects);
    saveUserOnboarding(user.id, { completed: true, completedAt: now });
    refreshProfile();
    navigate("/dashboard", { replace: true });
  };

  const canContinue = step === 1 ? level !== null : subjects.length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      {/* Confirmation toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-border bg-surface px-5 py-3 shadow-lg"
        >
          <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{toast}</p>
        </div>
      )}

      <div className="w-full max-w-2xl">
        {/* Brand mark */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
            <GraduationCap className="h-5.5 w-5.5 text-white" aria-hidden="true" />
          </span>
          <p className="text-lg font-bold text-foreground">StudyPilot</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
          {/* Step indicator */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Step {step} of 2
            </p>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              <span
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  step >= 1 ? "bg-gradient-to-r from-primary to-accent" : "bg-muted"
                }`}
              />
              <span
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  step >= 2 ? "bg-gradient-to-r from-primary to-accent" : "bg-muted"
                }`}
              />
            </div>
          </div>

          {step === 1 && (
            <>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                What are you studying?
              </h1>
              <p className="mt-2 text-muted-foreground">
                Choose your education level — we'll tailor StudyPilot to match.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {LEVEL_OPTIONS.map(({ value, label, description, icon: Icon }) => {
                  const selected = level === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLevel(value)}
                      aria-pressed={selected}
                      className={`group cursor-pointer rounded-2xl border-2 p-5 text-left transition-all duration-150 ease-out active:scale-[0.98] ${
                        selected
                          ? "border-primary bg-primary-soft shadow-soft"
                          : "border-border bg-surface hover:border-primary/40 hover:bg-surface-hover"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-150 ${
                          selected
                            ? "bg-gradient-to-br from-primary to-accent text-white"
                            : "bg-primary-soft text-primary"
                        }`}
                      >
                        <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                      </span>
                      <span className="mt-4 flex items-center gap-2">
                        <span className="text-base font-semibold text-foreground">{label}</span>
                        {selected && (
                          <Check className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  aria-label="Back to education level"
                  className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                    What subjects are you studying?
                  </h1>
                  <p className="mt-0.5 text-muted-foreground">
                    Pick one or more — you can add more anytime.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {PREDEFINED_SUBJECTS.map((pre, index) => {
                  const selected = isPredefinedSelected(pre.name);
                  const Icon = PREDEFINED_ICONS[index] ?? BookOpen;
                  return (
                    <button
                      key={pre.name}
                      type="button"
                      onClick={() => togglePredefined(pre)}
                      aria-pressed={selected}
                      className={`group cursor-pointer rounded-2xl border-2 p-5 text-left transition-all duration-150 ease-out active:scale-[0.98] ${
                        selected
                          ? "border-primary bg-primary-soft shadow-soft"
                          : "border-border bg-surface hover:border-primary/40 hover:bg-surface-hover"
                      }`}
                    >
                      <span className="flex items-start justify-between">
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-150 ${
                            selected
                              ? "bg-gradient-to-br from-primary to-accent text-white"
                              : "bg-primary-soft text-primary"
                          }`}
                        >
                          <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                        </span>
                        {selected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                            <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span className="mt-4 block text-base font-semibold text-foreground">
                        {pre.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {pre.topics.length} topics
                      </span>
                    </button>
                  );
                })}

                {/* + Add Subject tile */}
                <button
                  type="button"
                  onClick={() => {
                    setAddingSubject((v) => !v);
                    setCustomError(null);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-5 text-center text-muted-foreground transition-all duration-150 ease-out hover:border-primary/50 hover:bg-primary-soft/60 hover:text-primary active:scale-[0.98]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                    <Plus className="h-5.5 w-5.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold">Add Subject</span>
                </button>
              </div>

              {/* Custom subject input */}
              {addingSubject && (
                <form
                  onSubmit={handleAddCustom}
                  className="mt-4 rounded-2xl border border-border bg-background/60 p-4"
                >
                  <label
                    htmlFor="customSubject"
                    className="block text-sm font-medium text-foreground"
                  >
                    What subject would you like to study?
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="customSubject"
                      type="text"
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        if (customError) setCustomError(null);
                      }}
                      placeholder="e.g. Biology, Physics, History…"
                      className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-all duration-150 ease-out focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-xl bg-gradient-to-br from-primary to-accent px-5 py-2.5 font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:brightness-105 active:scale-[0.97]"
                    >
                      Add
                    </button>
                  </div>
                  {customError && (
                    <p role="alert" className="mt-2 text-sm text-destructive">
                      {customError}
                    </p>
                  )}
                </form>
              )}

              {/* Selected subjects summary */}
              {subjects.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Selected subjects">
                  {subjects.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      {s.name}
                      <button
                        type="button"
                        onClick={() =>
                          setSubjects((prev) => prev.filter((x) => x.id !== s.id))
                        }
                        aria-label={`Remove ${s.name}`}
                        className="cursor-pointer rounded-full p-0.5 text-primary/70 transition-colors duration-150 hover:text-primary"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canContinue}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent px-6 py-3 font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                Continue
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={!canContinue || saving}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent px-6 py-3 font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {saving ? "Saving…" : "Continue to Dashboard"}
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          You can change your subjects anytime from the app.
        </p>
      </div>
    </div>
  );
}
