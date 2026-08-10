import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { signOut } from "../../services/session";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subjects", label: "My Subjects", icon: BookOpen },
  { to: "/tutor", label: "AI Tutor", icon: Sparkles },
  { to: "/practice", label: "Practice", icon: Target },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/auth/login", { replace: true });
  };

  return (
    <aside
      aria-label="Sidebar"
      className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface lg:flex"
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
          <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-foreground">StudyPilot</p>
          <p className="text-xs text-muted-foreground">Your AI study copilot</p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-out ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Log out */}
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-150 ease-out hover:bg-surface-hover hover:text-foreground"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}
