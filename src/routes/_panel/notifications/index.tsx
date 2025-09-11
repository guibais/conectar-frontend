import { DataTable } from "@/components/ui/DataTable";
import { RoleBadge } from "@/components/ui/StatusBadge";
import { PageTemplate } from "@/components/ui/PageTemplate";
import { useInactiveClients } from "@/services/notifications.service";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Clock, User, Mail, Calendar } from "lucide-react";
import { formatDate, getDaysInactive } from "@/utils/date-helpers";

export const Route = createFileRoute("/_panel/notifications/")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t } = useTranslation();
  const inactiveClientsQuery = useInactiveClients();


  return (
    <PageTemplate
      title={t("notifications.title")}
      description={t("notifications.subtitle")}
      isLoading={inactiveClientsQuery.isLoading}
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-800">
              {t("notifications.inactiveUsers")}
            </h2>
            {inactiveClientsQuery.data && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                {inactiveClientsQuery.data.length} {t("notifications.users", { count: inactiveClientsQuery.data.length })}
              </span>
            )}
          </div>
          <p className="text-sm text-orange-700 mt-1">
            {t("notifications.description")}
          </p>
        </div>

        <DataTable
          data={inactiveClientsQuery.data || []}
          columns={[
            {
              key: "name",
              header: t("notifications.columns.user"),
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
              header: t("notifications.columns.type"),
              render: (client) => <RoleBadge role={client.role} />,
            },
            {
              key: "lastLoginAt",
              header: t("notifications.columns.lastLogin"),
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
              header: t("notifications.columns.createdAt"),
              render: (client) => (
                <span className="text-sm text-gray-500">
                  {formatDate(client.createdAt)}
                </span>
              ),
            },
            {
              key: "daysInactive",
              header: t("notifications.columns.daysInactive"),
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
                    {days} {t("notifications.days")}
                  </span>
                );
              },
            },
          ]}
          isLoading={inactiveClientsQuery.isLoading}
          emptyMessage={t("notifications.noData")}
        />
      </div>
    </PageTemplate>
  );
}
