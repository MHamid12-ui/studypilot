import { NavLink } from "react-router-dom";
import { BookOpen, LayoutDashboard, Sparkles, Target, TrendingUp } from "lucide-react";

const BOTTOM_ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/tutor", label: "Tutor", icon: Sparkles },
  { to: "/practice", label: "Practice", icon: Target },
  { to: "/progress", label: "Progress", icon: TrendingUp },
] as const;

/**
 * Mobile-only fixed bottom navigation with the 5 primary destinations.
 * Hidden on desktop (persistent sidebar instead).
 */
export default function BottomNav() {
  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="flex">
        {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex cursor-pointer flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`}
                    aria-hidden="true"
                  />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
