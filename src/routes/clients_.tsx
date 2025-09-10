import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const Route = createFileRoute('/clients_')({
  component: ClientsLayout,
});

function ClientsLayout() {
  return (
    <ProtectedRoute requireRole="admin">
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}
