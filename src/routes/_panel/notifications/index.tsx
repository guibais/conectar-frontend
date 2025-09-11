import { DataTable } from "@/components/ui/DataTable";
import { RoleBadge } from "@/components/ui/StatusBadge";
import { PageTemplate } from "@/components/ui/PageTemplate";
import { useInactiveClients } from "@/services/notifications.service";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, User, Mail, Calendar } from "lucide-react";

export const Route = createFileRoute("/_panel/notifications/")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const inactiveClientsQuery = useInactiveClients();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysInactive = (lastLoginAt: string | null, createdAt: string) => {
    const referenceDate = lastLoginAt
      ? new Date(lastLoginAt)
      : new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - referenceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <PageTemplate
      title="Notificações"
      description="Acompanhe usuários que precisam de atenção da equipe"
      isLoading={inactiveClientsQuery.isLoading}
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-800">
              Usuários Inativos (30+ dias)
            </h2>
            {inactiveClientsQuery.data && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                {inactiveClientsQuery.data.length} usuários
              </span>
            )}
          </div>
          <p className="text-sm text-orange-700 mt-1">
            Usuários que não fizeram login nos últimos 30 dias
          </p>
        </div>

        <DataTable
          data={inactiveClientsQuery.data || []}
          columns={[
            {
              key: "name",
              header: "Usuário",
              render: (client) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {inactiveClientsQuery.isLoading ? (
                      <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {client.name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "role",
              header: "Tipo",
              render: (client) => <RoleBadge role={client.role} />,
            },
            {
              key: "lastLoginAt",
              header: "Último Login",
              render: (client) => (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {formatDate(client.lastLoginAt)}
                  </span>
                </div>
              ),
            },
            {
              key: "createdAt",
              header: "Criado em",
              render: (client) => (
                <span className="text-sm text-gray-500">
                  {formatDate(client.createdAt)}
                </span>
              ),
            },
            {
              key: "daysInactive",
              header: "Dias Inativo",
              render: (client) => {
                const days = getDaysInactive(
                  client.lastLoginAt,
                  client.createdAt
                );
                return (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      days >= 60
                        ? "bg-red-100 text-red-800"
                        : days >= 45
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {days} dias
                  </span>
                );
              },
            },
          ]}
          isLoading={inactiveClientsQuery.isLoading}
          emptyMessage="Nenhum usuário inativo encontrado"
        />
      </div>
    </PageTemplate>
  );
}
