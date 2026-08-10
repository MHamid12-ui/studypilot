import type { ReactNode } from "react";
import { GraduationCap, Sparkles, Target, TrendingUp } from "lucide-react";

const BRAND_POINTS = [
  {
    icon: Sparkles,
    text: "An AI tutor that explains any subject, your way",
  },
  {
    icon: Target,
    text: "Practice questions that adapt to what you're studying",
  },
  {
    icon: TrendingUp,
    text: "Track your progress and watch yourself improve",
  },
];

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Shared two-panel shell for the /auth pages: a brand panel (desktop only)
 * and the form column. Keeps the account screens consistent with the
 * StudyPilot light indigo/white design.
 */
export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary via-indigo-600 to-accent lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Decorative glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />

        {/* Brand mark */}
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight text-white">StudyPilot</p>
            <p className="text-sm text-indigo-100">Your AI study copilot</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Study anything.
            <br />
            Understand everything.
          </h2>
          <p className="mt-4 text-indigo-100">
            Pick your subjects and StudyPilot tailors your tutor, practice and progress to
            exactly what you're learning.
          </p>

          <ul className="mt-8 space-y-4">
            {BRAND_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-4.5 w-4.5 text-white" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-200">
          Built for students — hackathon prototype, data stays on your device.
        </p>
      </aside>

      {/* Form panel */}
      <main
        id="main-content"
        className="flex w-full items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2 lg:px-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile brand mark */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <GraduationCap className="h-5.5 w-5.5 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold leading-tight text-foreground">StudyPilot</p>
              <p className="text-xs text-muted-foreground">Your AI study copilot</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
