import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../../../stores/auth-store";
import {
  useClients,
  useCreateClient,
  useDeleteClient,
} from "../../../services/clients.service";
import { DataTable } from "../../../components/ui/DataTable";
import {
  StatusBadge,
  ConectaPlusBadge,
} from "../../../components/ui/StatusBadge";
import { FilterCard } from "../../../components/ui/FilterCard";
import { TabBar } from "../../../components/ui/TabBar";
import { maskCNPJ } from "../../../utils/masks";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
  component: ClientsPage,
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

const createClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["admin", "user"]),
  tradeName: z.string().optional(),
  taxId: z.string().optional(),
  companyName: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  complement: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

type CreateClientFormData = z.infer<typeof createClientSchema>;

function ClientsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_panel/clients/" }) as z.infer<
    typeof clientsSearchSchema
  >;
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
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
  const createClientMutation = useCreateClient();
  const deleteClientMutation = useDeleteClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
  });

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== "admin") {
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSort = (column: "name" | "createdAt") => {
    const newOrder =
      filters.sortBy === column && filters.order === "asc" ? "desc" : "asc";
    navigate({
      to: "/clients",
      search: {
        ...search,
        sortBy: column,
        order: newOrder,
        page: 1,
      },
    });
  };

  const handleCreateClient = async (data: CreateClientFormData) => {
    try {
      const clientData = {
        tradeName: data.tradeName || "",
        taxId: data.taxId || "",
        companyName: data.companyName || "",
        zipCode: data.zipCode || "",
        street: data.street || "",
        number: data.number || "",
        district: data.district || "",
        city: data.city || "",
        state: data.state || "",
        complement: data.complement || "",
        status: data.status || "Active",
      };

      await createClientMutation.mutateAsync(clientData);
      setShowCreateModal(false);
      reset();
    } catch (error: any) {
      if (error.response?.data?.message === "Email already exists") {
        setError("email", { message: "Este email já está em uso" });
      } else {
      }
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await deleteClientMutation.mutateAsync(clientId);
    } catch (error) {
    }
  };

  if (clientsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <TabBar activeTab="dados-basicos" />
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
            <p className="text-gray-600">Gerencie seus clientes e informações</p>
          </div>
          <button
            onClick={() => navigate({ to: "/clients/create" })}
            className="flex items-center gap-2 px-6 py-3 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 transition-colors font-medium cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Adicionar Cliente
          </button>
        </div>

      <FilterCard
        title="Filtros"
        itemCount={clientsQuery.data?.clients?.length || 0}
        onClear={() => {
          setTempFilters({
            name: "",
            taxId: "",
            status: undefined,
            conectaPlus: "",
          });
          navigate({
            to: "/clients",
            search: {
              sortBy: search.sortBy,
              order: search.order,
              page: 1,
              limit: search.limit,
            },
          });
        }}
        onApply={() => {
          navigate({
            to: "/clients",
            search: {
              ...search,
              name: tempFilters.name || undefined,
              taxId: tempFilters.taxId || undefined,
              status: tempFilters.status,
              conectaPlus: tempFilters.conectaPlus || undefined,
              page: 1,
            },
          });
        }}
      >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nome
            </label>
            <input
              type="text"
              placeholder=""
              value={tempFilters.name || ""}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por CNPJ
            </label>
            <input
              type="text"
              placeholder=""
              value={tempFilters.taxId || ""}
              onChange={(e) => {
                const maskedValue = maskCNPJ(e.target.value);
                setTempFilters({ ...tempFilters, taxId: maskedValue });
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por status
            </label>
            <select
              value={tempFilters.status || ""}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  status: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary transition-colors bg-white cursor-pointer"
            >
              <option value="">Selecione</option>
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por conecta+
            </label>
            <select
              value={tempFilters.conectaPlus || ""}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  conectaPlus: e.target.value as "Yes" | "No" | "",
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary transition-colors bg-white cursor-pointer"
            >
              <option value="">Selecione</option>
              <option value="Yes">Sim</option>
              <option value="No">Não</option>
            </select>
          </div>
      </FilterCard>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <DataTable
            data={clientsQuery.data?.clients || []}
            columns={[
              {
                key: "name",
                header: "Nome do Usuário",
                sortable: true,
                render: (client) => (
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {client.name}
                    </div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </div>
                ),
              },
              {
                key: "companyName",
                header: "Razão Social",
                render: (client) => (
                  <span className="text-sm text-gray-900">
                    {client.companyName || "-"}
                  </span>
                ),
              },
              {
                key: "taxId",
                header: "CNPJ",
                render: (client) => (
                  <span className="text-sm text-gray-900">
                    {client.taxId || "-"}
                  </span>
                ),
              },
              {
                key: "tradeName",
                header: "Nome na Fachada",
                render: (client) => (
                  <span className="text-sm text-gray-900">
                    {client.tradeName || "-"}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (client) => <StatusBadge status={client.status} />,
              },
              {
                key: "conectaPlus",
                header: "Conecta Plus",
                render: (client) => (
                  <ConectaPlusBadge conectaPlus={client.conectaPlus} />
                ),
              },
            ]}
            sortBy={search.sortBy}
            sortOrder={search.order}
            onSort={(column) => handleSort(column as "name" | "createdAt")}
            isLoading={clientsQuery.isLoading}
            actions={(client) => (
              <>
                <button
                  onClick={() => navigate({ to: `/clients/${client.id}` })}
                  className="p-2 text-gray-400 hover:text-conectar-primary hover:bg-conectar-50 rounded-lg transition-colors cursor-pointer"
                  title="Editar cliente"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {currentUser?.id !== client.id && (
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir cliente"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          />
        </div>

        {clientsQuery.data?.pagination && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando{" "}
              {(Number(clientsQuery.data.pagination.page) - 1) *
                Number(clientsQuery.data.pagination.limit) +
                1}{" "}
              a{" "}
              {Math.min(
                Number(clientsQuery.data.pagination.page) *
                  Number(clientsQuery.data.pagination.limit),
                Number(clientsQuery.data.pagination.total)
              )}{" "}
              de {clientsQuery.data.pagination.total} clientes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  navigate({
                    to: "/clients",
                    search: {
                      ...search,
                      page: Number(clientsQuery.data.pagination.page) - 1,
                    },
                  })
                }
                disabled={Number(clientsQuery.data.pagination.page) <= 1}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Anterior
              </button>
              <span className="px-3 py-2 text-sm text-gray-600">
                {Number(clientsQuery.data.pagination.page)} de{" "}
                {Number(clientsQuery.data.pagination.totalPages)}
              </span>
              <button
                onClick={() =>
                  navigate({
                    to: "/clients",
                    search: {
                      ...search,
                      page: Number(clientsQuery.data.pagination.page) + 1,
                    },
                  })
                }
                disabled={
                  Number(clientsQuery.data.pagination.page) >=
                  Number(clientsQuery.data.pagination.totalPages)
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Criar Novo Cliente</h2>
            <form
              onSubmit={handleSubmit(handleCreateClient)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Papel
                </label>
                <select
                  {...register("role")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-error">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informações da Empresa (Opcional)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trade Name
                    </label>
                    <input
                      type="text"
                      {...register("tradeName")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      {...register("taxId")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    {...register("companyName")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      {...register("zipCode")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street
                    </label>
                    <input
                      type="text"
                      {...register("street")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number
                    </label>
                    <input
                      type="text"
                      {...register("number")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      {...register("district")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complement
                  </label>
                  <input
                    type="text"
                    {...register("complement")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createClientMutation.isPending}
                  className="px-4 py-2 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createClientMutation.isPending
                    ? "Criando..."
                    : "Criar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
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
