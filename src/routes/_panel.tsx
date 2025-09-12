import { Layout, ProtectedRoute } from "@/components";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_panel")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}
