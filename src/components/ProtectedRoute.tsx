import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUserId } from "../services/session";

/**
 * Guards the app area: unauthenticated users (no `studypilot:currentUserId`
 * in localStorage) are sent to /auth/login.
 */
export default function ProtectedRoute() {
  const userId = getCurrentUserId();

  if (!userId) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
