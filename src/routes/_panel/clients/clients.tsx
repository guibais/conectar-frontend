import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export const Route = createFileRoute("/_panel/clients/clients")({
  component: ClientsLayout,
});

function ClientsLayout() {
  return (
    <ProtectedRoute requireRole="admin">
      <Outlet />
    </ProtectedRoute>
  );
}
