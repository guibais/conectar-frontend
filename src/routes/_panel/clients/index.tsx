import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useClients, useDeleteClient } from "@/services/clients.service";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge, ConectaPlusBadge } from "@/components/ui/StatusBadge";
import { FilterCard } from "@/components/ui/FilterCard";
import { TabBar } from "@/components/ui/TabBar";
import { maskCNPJ } from "@/utils/masks";
import { TableSkeleton } from "@/components/ui/SkeletonLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { filterOptions } from "@/lib/filter-options";

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

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await deleteClientMutation.mutateAsync(clientId);
    } catch (error) {}
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
      header: "Nome",
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
      header: "CNPJ",
      render: (client: any) => (
        <span className="text-sm text-gray-600">
          {client.taxId ? maskCNPJ(client.taxId) : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (client: any) => <StatusBadge status={client.status} />,
    },
    {
      key: "conectaPlus",
      header: "Conecta+",
      render: (client: any) => (
        <ConectaPlusBadge conectaPlus={client.conectaPlus} />
      ),
    },
    {
      key: "createdAt",
      header: "Criado em",
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
            <p className="text-gray-600">
              Gerencie seus clientes e informações
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/clients/create" })}
            className="flex items-center gap-2 px-4 py-2 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 transition-colors focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
            aria-label="Criar novo cliente"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo Cliente
          </button>
        </header>

        <FilterCard
          title="Filtros"
          itemCount={clientsQuery.data?.clients?.length || 0}
          onClear={handleClearFilters}
          onApply={handleApplyFilters}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                id="filter-name"
                type="text"
                value={tempFilters.name || ""}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                placeholder="Buscar por nome..."
                aria-describedby="filter-name-help"
              />
              <span id="filter-name-help" className="sr-only">Digite o nome do cliente para filtrar a lista</span>
            </div>

            <div>
              <label htmlFor="filter-cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ
              </label>
              <input
                id="filter-cnpj"
                type="text"
                value={tempFilters.taxId || ""}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, taxId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                placeholder="Buscar por CNPJ..."
                aria-describedby="filter-cnpj-help"
              />
              <span id="filter-cnpj-help" className="sr-only">Digite o CNPJ do cliente para filtrar a lista</span>
            </div>

            <div>
              <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
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
              <span id="filter-status-help" className="sr-only">Selecione o status do cliente para filtrar a lista</span>
            </div>

            <div>
              <label htmlFor="filter-conecta-plus" className="block text-sm font-medium text-gray-700 mb-1">
                Conecta+
              </label>
              <select
                id="filter-conecta-plus"
                value={tempFilters.conectaPlus || ""}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    conectaPlus: e.target.value as
                      | "Yes"
                      | "No"
                      | ""
                      | undefined,
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
              <span id="filter-conecta-plus-help" className="sr-only">Selecione se o cliente possui Conecta+ para filtrar a lista</span>
            </div>
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
              <div className="flex items-center gap-2" role="group" aria-label={`Ações para ${client.name}`}>
                <button
                  onClick={() => navigate({ to: `/clients/${client.id}` })}
                  className="p-1 text-gray-400 hover:text-conectar-primary transition-colors focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2 rounded"
                  aria-label={`Editar cliente ${client.name}`}
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                </button>
                {currentUser?.id !== client.id && (
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    aria-label={`Excluir cliente ${client.name}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
          />
        </div>
      </main>
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
