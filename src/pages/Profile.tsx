import { BookOpen, GraduationCap, LineChart, School, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getUserPerformance,
  getUserSubjects,
  type EducationLevel,
} from "../services/dataLayer";

const LEVEL_LABELS: Record<EducationLevel, string> = {
  HIGH_SCHOOL: "High School",
  UNDERGRADUATE: "Undergraduate",
};

/**
 * Student profile — reads exclusively from the current user's own
 * namespaced data (user_<id>_profile / _subjects / _performance).
 * Never a shared global profile.
 */
export default function Profile() {
  const { user, profile } = useAuth();

  if (!user) return null; // ProtectedRoute guarantees a session.

  const subjects = getUserSubjects(user.id);
  const performance = getUserPerformance(user.id);
  const hasActivity = performance.questionsAttempted > 0;
  const educationLabel = profile?.educationLevel
    ? LEVEL_LABELS[profile.educationLevel]
    : null;

  return (
    <div className="space-y-6">
      {/* Header card with graduation-cap visual */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div
          className="h-28 bg-gradient-to-br from-primary via-indigo-600 to-accent sm:h-32"
          aria-hidden="true"
        />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-10 flex items-end gap-4">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-surface bg-gradient-to-br from-primary to-accent shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" aria-hidden="true" />
            </span>
            <div className="pb-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Student Profile
              </p>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {profile?.fullName ?? user.email}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{profile?.email ?? user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Education level */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <School className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">Education level</h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            {educationLabel ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-3.5 py-1.5 font-medium text-primary">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                {educationLabel}
              </span>
            ) : (
              "No education level set yet — complete onboarding to finish setting up."
            )}
          </p>
        </section>

        {/* Subjects */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">Subjects</h2>
          </div>
          <div className="mt-4">
            {subjects.length === 0 ? (
              <p className="text-muted-foreground">
                No subjects yet — complete onboarding or add a subject to get started.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-primary/25 bg-primary-soft px-3.5 py-1.5 text-sm font-medium text-primary"
                  >
                    {s.name}
                    {s.custom && <span className="ml-1.5 text-xs opacity-70">· custom</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Performance foundation — honest empty state, no fake numbers */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
            <LineChart className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Performance</h2>
            <p className="text-sm text-muted-foreground">
              {hasActivity
                ? "Your practice results, updated as you study."
                : "Personalized stats will live here once you start practicing."}
            </p>
          </div>
        </div>

        {hasActivity ? (
          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Questions", value: performance.questionsAttempted },
              { label: "Correct", value: performance.correctAnswers },
              { label: "Incorrect", value: performance.incorrectAnswers },
              {
                label: "Accuracy",
                value: performance.accuracy === null ? "—" : `${Math.round(performance.accuracy)}%`,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-background/60 p-4 text-center"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-5 flex items-center gap-4 rounded-xl border border-dashed border-border bg-background/40 px-5 py-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
              <UserRound className="h-5.5 w-5.5 text-primary" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted-foreground">
              Start practicing to see your performance here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
