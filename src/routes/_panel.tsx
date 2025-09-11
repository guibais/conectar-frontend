import { Layout } from "@/components/Layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_panel")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
