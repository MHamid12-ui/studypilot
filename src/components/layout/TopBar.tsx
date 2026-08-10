import { Link } from "react-router-dom";
import { GraduationCap, Settings, User } from "lucide-react";

/**
 * Mobile-only top bar: brand on the left, Settings + Profile on the right.
 * Hidden on desktop, where the persistent sidebar takes over.
 */
export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur lg:hidden">
      <Link
        to="/dashboard"
        aria-label="StudyPilot home"
        className="flex cursor-pointer items-center gap-2 rounded-lg transition-opacity duration-150 hover:opacity-80"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-soft">
          <GraduationCap className="h-4.5 w-4.5 text-white" aria-hidden="true" />
        </span>
        <span className="text-sm font-bold text-foreground">StudyPilot</span>
      </Link>

      <div className="flex items-center gap-1">
        <Link
          to="/settings"
          aria-label="Settings"
          className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
        </Link>
        <Link
          to="/profile"
          aria-label="Profile"
          className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
        >
          <User className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
