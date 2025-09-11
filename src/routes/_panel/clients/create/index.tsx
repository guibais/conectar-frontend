import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Search } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { useCepQuery } from "@/services/cep.service";
import { useCreateClient } from "@/services/clients.service";
import { maskCEP, maskCNPJ, removeMask } from "@/utils/masks";
import { TabBar } from "@/components/ui/TabBar";
import { DynamicForm, type FormFieldConfig } from "@/components/ui/DynamicForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export const Route = createFileRoute("/_panel/clients/create/")({
  component: CreateClientPage,
});

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
  status: z.enum(["Active", "Inactive"]),
  conectaPlus: z.string(),
});

type CreateClientFormData = z.infer<typeof createClientSchema>;

const createClientFields: FormFieldConfig[] = [
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
    label: "Senha",
    type: "password",
    placeholder: "••••••",
    required: true,
    gridCols: 1,
  },
  {
    name: "role",
    label: "Tipo",
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
    name: "city",
    label: "Cidade",
    type: "text",
    placeholder: "Digite a cidade",
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

function CreateClientPage() {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [cepValue, setCepValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const createClientMutation = useCreateClient();

  const cepQuery = useCepQuery(cepValue, cepValue.length >= 8);

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== "admin") {
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  const defaultValues = {
    role: "user",
    status: "Active",
    conectaPlus: "false",
    ...(cepQuery.data && !cepQuery.isLoading ? {
      street: cepQuery.data.street || "",
      district: cepQuery.data.district || "",
      city: cepQuery.data.city || "",
      state: cepQuery.data.state || "",
    } : {}),
  };

  const handleCepChange = (value: string) => {
    const maskedValue = maskCEP(value);
    setCepValue(removeMask(maskedValue));
    return maskedValue;
  };

  const handleCnpjChange = (value: string) => {
    return maskCNPJ(value);
  };

  const getFieldWithCustomHandlers = (): FormFieldConfig[] => {
    return createClientFields.map((field) => {
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

  const handleCreateClient = async (data: CreateClientFormData) => {
    setErrorMessage("");
    
    try {
      const clientData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
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
        conectaPlus: data.conectaPlus === "true",
      };
      await createClientMutation.mutateAsync(clientData);
      navigate({ to: "/clients" });
    } catch (error: any) {
      if (
        error.response?.data?.message === "Este email já está em uso" ||
        error.response?.data?.message?.includes("email já está em uso")
      ) {
        setErrorMessage("Este email já está em uso");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Erro ao criar cliente. Tente novamente."
        );
      }
    }
  };

  return (
    <div>
      <TabBar activeTab="dados-basicos" />
      <div className="px-6 py-8">
        <PageHeader
          title="Novo Cliente"
          description="Adicione um novo cliente ao sistema"
          actions={
            <ActionButton onClick={() => navigate({ to: "/clients" })}>
              Cancelar
            </ActionButton>
          }
        />

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <DynamicForm
          fields={getFieldWithCustomHandlers()}
          schema={createClientSchema}
          onSubmit={handleCreateClient}
          defaultValues={defaultValues}
          submitLabel="Criar Cliente"
          isLoading={createClientMutation.isPending}
          formActions={
            <button
              type="button"
              onClick={() => navigate({ to: "/clients" })}
              className="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-medium cursor-pointer transform active:scale-95"
            >
              Cancelar
            </button>
          }
        />
      </div>
    </div>
  );
}
