import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

type RedirectConfig = {
  requireAuth?: boolean;
  requireRole?: "admin" | "user";
  redirectTo?: string;
};

export function useAuthRedirect(config: RedirectConfig = {}) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const {
    requireAuth = true,
    requireRole,
    redirectTo = "/login"
  } = config;

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate({ to: redirectTo });
      return;
    }

    if (requireRole && user?.role !== requireRole) {
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, user, navigate, requireAuth, requireRole, redirectTo]);

  return { isAuthorized: isAuthenticated && (!requireRole || user?.role === requireRole) };
}
