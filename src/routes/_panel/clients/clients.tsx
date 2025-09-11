import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_panel/clients/clients")({
  component: ClientsLayout,
});

function ClientsLayout() {
  return <Outlet />;
}
