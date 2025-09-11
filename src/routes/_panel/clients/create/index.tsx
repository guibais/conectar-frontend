import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { createClientSchema, type CreateClientFormData } from "@/lib/client-schemas";
import { clientFormFields } from "@/lib/form-fields";

export const Route = createFileRoute("/_panel/clients/create/")({
  component: CreateClientPage,
});

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
    return clientFormFields.map((field) => {
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
      <main className="px-6 py-8" role="main">
        <PageHeader
          title="Novo Cliente"
          description="Adicione um novo cliente ao sistema"
          actions={
            <ActionButton 
              onClick={() => navigate({ to: "/clients" })}
              className="focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
            >
              Cancelar
            </ActionButton>
          }
        />

        {errorMessage && (
          <div role="alert" aria-live="polite">
            <ErrorMessage message={errorMessage} />
          </div>
        )}

        <section className="bg-white rounded-lg shadow p-6" aria-labelledby="client-create-form">
          <h2 id="client-create-form" className="sr-only">Formulário de criação de cliente</h2>
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
                className="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-medium cursor-pointer transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
                aria-label="Cancelar criação do cliente"
              >
                Cancelar
              </button>
            }
          />
        </section>
      </main>
    </div>
  );
}
