import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUserId } from "../services/session";

/**
 * Wraps public auth pages: an already-authenticated user is sent to
 * /dashboard instead of seeing the login/signup forms.
 */
export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const userId = getCurrentUserId();

  if (userId) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
