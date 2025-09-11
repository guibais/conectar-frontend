import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
