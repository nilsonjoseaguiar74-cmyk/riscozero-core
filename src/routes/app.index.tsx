import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { HOME_ROUTE_BY_ROLE } from "@/lib/rbac";

export const Route = createFileRoute("/app/")({
  component: AppIndexRoute,
});

function AppIndexRoute() {
  const { user } = useAuth();
  const to = user ? HOME_ROUTE_BY_ROLE[user.role] : "/app/dashboard";
  return <Navigate to={to as "/"} replace />;
}
