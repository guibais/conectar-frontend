import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Trash2, Search } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useCepQuery } from "@/services/cep.service";
import {
  useClient,
  useUpdateClient,
  useDeleteClient,
} from "@/services/clients.service";
import { maskCEP, maskCNPJ, removeMask } from "@/utils/masks";
import { TabBar } from "@/components/ui/TabBar";
import { DynamicForm, type FormFieldConfig } from "@/components/ui/DynamicForm";

export const Route = createFileRoute("/_panel/clients/$clientId/")({
  component: ClientEditPage,
});

const updateClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
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
  status: z.enum(["Active", "Inactive"]),
  conectaPlus: z.string(),
});

type UpdateClientFormData = z.infer<typeof updateClientSchema>;

const updateClientFields: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nome completo",
    type: "text",
    placeholder: "Digite o nome completo",
    required: true,
    gridCols: 1,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Digite o email",
    required: true,
    gridCols: 1,
  },
  {
    name: "password",
    label: "Nova senha (opcional)",
    type: "password",
    placeholder: "Deixe em branco para manter a atual",
    gridCols: 1,
  },
  {
    name: "role",
    label: "Papel",
    type: "select",
    required: true,
    options: [
      { value: "user", label: "Cliente" },
      { value: "admin", label: "Administrador" },
    ],
    gridCols: 1,
  },
  {
    name: "tradeName",
    label: "Nome Fantasia",
    type: "text",
    placeholder: "Digite o nome fantasia",
    gridCols: 1,
  },
  {
    name: "taxId",
    label: "CNPJ",
    type: "text",
    placeholder: "00.000.000/0000-00",
    gridCols: 1,
  },
  {
    name: "companyName",
    label: "Razão Social",
    type: "text",
    placeholder: "Digite a razão social",
    gridCols: 2,
  },
  {
    name: "zipCode",
    label: "CEP",
    type: "text",
    placeholder: "00000-000",
    gridCols: 1,
  },
  {
    name: "street",
    label: "Rua",
    type: "text",
    placeholder: "Digite a rua",
    gridCols: 1,
  },
  {
    name: "number",
    label: "Número",
    type: "text",
    placeholder: "Digite o número",
    gridCols: 1,
  },
  {
    name: "district",
    label: "Bairro",
    type: "text",
    placeholder: "Digite o bairro",
    gridCols: 1,
  },
  {
    name: "city",
    label: "Cidade",
    type: "text",
    placeholder: "Digite a cidade",
    gridCols: 1,
  },
  {
    name: "state",
    label: "Estado",
    type: "text",
    placeholder: "SP",
    gridCols: 1,
  },
  {
    name: "complement",
    label: "Complemento",
    type: "text",
    placeholder: "Digite o complemento",
    gridCols: 2,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Active", label: "Ativo" },
      { value: "Inactive", label: "Inativo" },
    ],
    gridCols: 1,
  },
  {
    name: "conectaPlus",
    label: "Conecta Plus",
    type: "select",
    options: [
      { value: "false", label: "Não" },
      { value: "true", label: "Sim" },
    ],
    gridCols: 1,
  },
];

function ClientEditPage() {
  const navigate = useNavigate();
  const { clientId } = Route.useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [cepValue, setCepValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clientQuery = useClient(clientId);
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  const cepQuery = useCepQuery(cepValue, cepValue.length >= 8);

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== "admin") {
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (clientQuery.data) {
      setCepValue(removeMask(clientQuery.data.zipCode || ""));
    }
  }, [clientQuery.data]);

  const defaultValues = clientQuery.data ? {
    name: clientQuery.data.name || "",
    email: clientQuery.data.email || "",
    password: "",
    role: clientQuery.data.role || "user",
    tradeName: clientQuery.data.tradeName || "",
    taxId: clientQuery.data.taxId || "",
    companyName: clientQuery.data.companyName || "",
    zipCode: clientQuery.data.zipCode || "",
    street: clientQuery.data.street || "",
    number: clientQuery.data.number || "",
    district: clientQuery.data.district || "",
    city: clientQuery.data.city || "",
    state: clientQuery.data.state || "",
    complement: clientQuery.data.complement || "",
    status: clientQuery.data.status || "Active",
    conectaPlus: clientQuery.data.conectaPlus ? "true" : "false",
    ...(cepQuery.data && !cepQuery.isLoading ? {
      street: cepQuery.data.street || clientQuery.data.street || "",
      district: cepQuery.data.district || clientQuery.data.district || "",
      city: cepQuery.data.city || clientQuery.data.city || "",
      state: cepQuery.data.state || clientQuery.data.state || "",
    } : {}),
  } : {};

  const handleCepChange = (value: string) => {
    const maskedValue = maskCEP(value);
    setCepValue(removeMask(maskedValue));
    return maskedValue;
  };

  const handleCnpjChange = (value: string) => {
    return maskCNPJ(value);
  };

  const getFieldWithCustomHandlers = (): FormFieldConfig[] => {
    return updateClientFields.map((field) => {
      if (field.name === "zipCode") {
        return {
          ...field,
          loading: cepQuery.isLoading,
          icon: cepQuery.data ? <Search className="h-4 w-4 text-green-500" /> : undefined,
          onChange: handleCepChange,
        };
      }
      if (field.name === "taxId") {
        return {
          ...field,
          onChange: handleCnpjChange,
        };
      }
      return field;
    });
  };

  const handleUpdateClient = async (data: UpdateClientFormData) => {
    setErrorMessage("");
    
    try {
      const updateData = {
        ...data,
        conectaPlus: data.conectaPlus === "true",
        password: data.password || undefined,
      };

      await updateClientMutation.mutateAsync({
        id: clientId,
        data: updateData,
      });

      navigate({ to: "/clients" });
    } catch (error: any) {
      if (
        error.response?.data?.message === "Este email já está em uso" ||
        error.response?.data?.message?.includes("email já está em uso")
      ) {
        setErrorMessage("Este email já está em uso");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Erro ao atualizar cliente. Tente novamente."
        );
      }
    }
  };

  const handleDeleteClient = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) {
      return;
    }

    try {
      await deleteClientMutation.mutateAsync(clientId);
      navigate({ to: "/clients" });
    } catch (error) {
    }
  };

  if (clientQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-primary"></div>
      </div>
    );
  }

  if (clientQuery.isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Cliente não encontrado
          </h2>
          <p className="text-red-600">
            O cliente solicitado não foi encontrado.
          </p>
          <button
            onClick={() => navigate({ to: "/clients" })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            Voltar para lista de clientes
          </button>
        </div>
      </div>
    );
  }

  if (!clientQuery.data) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Cliente não encontrado
          </h1>
          <button
            onClick={() => navigate({ to: "/clients" })}
            className="text-conectar-primary hover:text-conectar-600 cursor-pointer"
          >
            Voltar para lista de clientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TabBar activeTab="dados-basicos" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Editar Cliente
            </h1>
            <p className="text-sm text-gray-500">
              Gerencie informações do cliente
            </p>
          </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/clients" })}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          {currentUser?.id !== clientQuery.data?.id && (
            <button
              onClick={handleDeleteClient}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Excluir Cliente
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <DynamicForm
            fields={getFieldWithCustomHandlers()}
            schema={updateClientSchema}
            onSubmit={handleUpdateClient}
            defaultValues={defaultValues}
            submitLabel="Salvar Alterações"
            isLoading={updateClientMutation.isPending}
            formActions={
              <button
                type="button"
                onClick={() => navigate({ to: "/clients" })}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            }
          />
        </div>
      </div>
      </div>
    </div>
  );
}
