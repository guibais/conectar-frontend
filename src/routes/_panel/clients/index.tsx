import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useClients, useDeleteClient } from "@/services/clients.service";
import { maskCNPJ } from "@/utils/masks";
import { filterOptions } from "@/lib/filter-options";
import { TableSkeleton } from "@/components/common/feedback/SkeletonLoader";
import {
  ConfirmModal,
  DataTable,
  FilterCard,
  ProtectedRoute,
  StatusBadge,
  TabBar,
} from "@/components";
import { ConectaPlusBadge } from "@/components/ui/data-display/StatusBadge";

const clientsSearchSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  taxId: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  conectaPlus: z.enum(["Yes", "No", ""]).optional(),
  sortBy: z.enum(["name", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export const Route = createFileRoute("/_panel/clients/")({
  component: ProtectedClientsPage,
  validateSearch: clientsSearchSchema,
});

type ClientFilterQuery = {
  name?: string;
  email?: string;
  taxId?: string;
  status?: "Active" | "Inactive";
  conectaPlus?: "Yes" | "No" | "";
  sortBy?: "name" | "createdAt";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

function ClientsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: "/_panel/clients/" }) as z.infer<
    typeof clientsSearchSchema
  >;
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [tempFilters, setTempFilters] = useState<ClientFilterQuery>({
    name: search.name || "",
    taxId: search.taxId || "",
    status: search.status,
    conectaPlus: search.conectaPlus,
  });

  const filters: ClientFilterQuery = {
    name: search.name,
    email: search.email,
    taxId: search.taxId,
    status: search.status,
    conectaPlus: search.conectaPlus,
    sortBy: search.sortBy || "createdAt",
    order: search.order || "desc",
    page: search.page || 1,
    limit: search.limit || 10,
  };

  const clientsQuery = useClients(filters);
  const deleteClientMutation = useDeleteClient();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    clientId: string;
    clientName: string;
  }>({
    isOpen: false,
    clientId: "",
    clientName: "",
  });

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== "admin") {
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSort = (column: string) => {
    const newOrder =
      filters.sortBy === column && filters.order === "asc" ? "desc" : "asc";
    navigate({
      to: "/clients",
      search: {
        ...search,
        sortBy: column as "name" | "createdAt",
        order: newOrder,
        page: 1,
      },
    });
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    setDeleteModal({
      isOpen: true,
      clientId,
      clientName,
    });
  };

  const confirmDeleteClient = async () => {
    try {
      await deleteClientMutation.mutateAsync(deleteModal.clientId);
      setDeleteModal({ isOpen: false, clientId: "", clientName: "" });
    } catch (error) {}
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, clientId: "", clientName: "" });
  };

  if (clientsQuery.isLoading) {
    return (
      <div>
        <TabBar activeTab="dados-basicos" />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <TableSkeleton />
        </div>
      </div>
    );
  }

  const handleClearFilters = () => {
    setTempFilters({
      name: "",
      taxId: "",
      status: undefined,
      conectaPlus: undefined,
    });
    navigate({
      to: "/clients",
      search: {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
      },
    });
  };

  const handleApplyFilters = () => {
    navigate({
      to: "/clients",
      search: {
        ...tempFilters,
        page: 1,
        sortBy: filters.sortBy,
        order: filters.order,
        limit: filters.limit,
      },
    });
  };

  const columns = [
    {
      key: "name",
      header: t("clients.fields.name"),
      sortable: true,
      render: (client: any) => (
        <div>
          <div className="font-medium text-gray-900">{client.name}</div>
          <div className="text-sm text-gray-500">{client.email}</div>
        </div>
      ),
    },
    {
      key: "taxId",
      header: t("clients.fields.taxId"),
      render: (client: any) => (
        <span className="text-sm text-gray-600">
          {client.taxId ? maskCNPJ(client.taxId) : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("clients.fields.status"),
      render: (client: any) => <StatusBadge status={client.status} />,
    },
    {
      key: "conectaPlus",
      header: t("clients.fields.conectaPlus"),
      render: (client: any) => (
        <ConectaPlusBadge conectaPlus={client.conectaPlus} />
      ),
    },
    {
      key: "createdAt",
      header: t("clients.fields.createdAt"),
      sortable: true,
      render: (client: any) => (
        <span className="text-sm text-gray-600">
          {new Date(client.createdAt).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <TabBar activeTab="dados-basicos" />
      <main className="px-6 py-8" role="main">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("clients.title")}
            </h1>
            <p className="text-gray-600">{t("clients.subtitle")}</p>
          </div>
          <button
            onClick={() => navigate({ to: "/clients/create" })}
            className="flex items-center gap-2 px-4 py-2 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 transition-colors focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
            aria-label={t("clients.create")}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("clients.create")}
          </button>
        </header>

        <FilterCard
          title={t("filters.title")}
          itemCount={clientsQuery.data?.clients?.length || 0}
          onClear={handleClearFilters}
          onApply={handleApplyFilters}
        >
          <div>
            <label
              htmlFor="filter-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("clients.fields.name")}
            </label>
            <input
              id="filter-name"
              type="text"
              value={tempFilters.name || ""}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
              placeholder={t("filters.searchName")}
              aria-describedby="filter-name-help"
            />
            <span id="filter-name-help" className="sr-only">
              {t("filters.searchNameHelp")}
            </span>
          </div>

          <div>
            <label
              htmlFor="filter-cnpj"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("clients.fields.taxId")}
            </label>
            <input
              id="filter-cnpj"
              type="text"
              value={tempFilters.taxId || ""}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, taxId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
              placeholder={t("filters.searchTaxId")}
              aria-describedby="filter-cnpj-help"
            />
            <span id="filter-cnpj-help" className="sr-only">
              {t("filters.searchTaxIdHelp")}
            </span>
          </div>

          <div>
            <label
              htmlFor="filter-status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("clients.fields.status")}
            </label>
            <select
              id="filter-status"
              value={tempFilters.status || ""}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  status: e.target.value as "Active" | "Inactive" | undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
              aria-describedby="filter-status-help"
            >
              {filterOptions.status.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span id="filter-status-help" className="sr-only">
              {t("filters.selectStatusHelp")}
            </span>
          </div>

          <div>
            <label
              htmlFor="filter-conecta-plus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("clients.fields.conectaPlus")}
            </label>
            <select
              id="filter-conecta-plus"
              value={tempFilters.conectaPlus || ""}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  conectaPlus: e.target.value as "Yes" | "No" | "" | undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
              aria-describedby="filter-conecta-plus-help"
            >
              {filterOptions.conectaPlus.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span id="filter-conecta-plus-help" className="sr-only">
              {t("filters.selectConectaPlusHelp")}
            </span>
          </div>
        </FilterCard>

        <div className="bg-white rounded-lg border border-gray-200">
          <DataTable
            data={clientsQuery.data?.clients || []}
            columns={columns}
            onSort={handleSort}
            sortBy={filters.sortBy}
            sortOrder={filters.order}
            pagination={clientsQuery.data?.pagination}
            onPageChange={(page) =>
              navigate({
                to: "/clients",
                search: { ...search, page },
              })
            }
            actions={(client: any) => (
              <div
                className="flex items-center gap-2"
                role="group"
                aria-label={`Ações para ${client.name}`}
              >
                <button
                  onClick={() => navigate({ to: `/clients/${client.id}` })}
                  className="p-1 text-gray-400 hover:text-conectar-primary transition-colors focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2 rounded"
                  aria-label={t("clients.editClient", { name: client.name })}
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                </button>
                {currentUser?.id !== client.id && (
                  <button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    aria-label={t("clients.deleteClient", {
                      name: client.name,
                    })}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
          />
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteClient}
        title={t("clients.delete")}
        message={t("clients.deleteConfirmName", {
          name: deleteModal.clientName,
        })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
        isLoading={deleteClientMutation.isPending}
      />
    </div>
  );
}

function ProtectedClientsPage() {
  return (
    <ProtectedRoute requireRole="admin">
      <ClientsPage />
    </ProtectedRoute>
  );
}

export default ProtectedClientsPage;
