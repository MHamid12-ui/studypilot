import { BookOpen, GraduationCap, LineChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
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
 * Personalized dashboard foundation — the greeting always comes from the
 * current user's own profile (never a hardcoded name).
 */
export default function Dashboard() {
  const { user, profile } = useAuth();

  if (!user) return null; // ProtectedRoute guarantees a session.

  const subjects = getUserSubjects(user.id);
  const performance = getUserPerformance(user.id);
  const hasActivity = performance.questionsAttempted > 0;
  const firstName = profile?.fullName.trim().split(/\s+/)[0];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <header>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {firstName ? (
            <>
              Welcome back, <span className="text-primary">{firstName}</span>
            </>
          ) : (
            "Welcome back"
          )}
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          {profile?.educationLevel
            ? `${LEVEL_LABELS[profile.educationLevel]} student · ${subjects.length} subject${subjects.length === 1 ? "" : "s"}`
            : "Let's get your study setup ready."}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Education level */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">Education level</h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            {profile?.educationLevel ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-3.5 py-1.5 font-medium text-primary">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                {LEVEL_LABELS[profile.educationLevel]}
              </span>
            ) : (
              "Complete onboarding to set your education level."
            )}
          </p>
        </section>

        {/* Subjects */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">Your subjects</h2>
          </div>
          <div className="mt-4">
            {subjects.length === 0 ? (
              <p className="text-muted-foreground">
                No subjects yet.{" "}
                <Link
                  to="/subjects"
                  className="cursor-pointer font-medium text-primary transition-colors duration-150 hover:text-primary-hover hover:underline"
                >
                  Add a subject
                </Link>{" "}
                to get started.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-primary/25 bg-primary-soft px-3.5 py-1.5 text-sm font-medium text-primary"
                  >
                    {s.name}
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
          <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-background/40 px-5 py-6">
            <p className="text-sm text-muted-foreground">
              Start practicing to see your performance here.
            </p>
            <Link
              to="/practice"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:brightness-105 active:scale-[0.97]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Practice now
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
