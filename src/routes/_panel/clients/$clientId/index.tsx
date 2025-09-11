import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useCepQuery } from "@/services/cep.service";
import { useClient, useUpdateClient, useDeleteClient } from "@/services/clients.service";
import { maskCEP, maskCNPJ, removeMask } from "@/utils/masks";
import { TabBar } from "@/components/ui/TabBar";
import { DynamicForm, type FormFieldConfig } from "@/components/ui/DynamicForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { updateClientSchema, type UpdateClientFormData } from "@/lib/client-schemas";
import { clientFormFields } from "@/lib/form-fields";

export const Route = createFileRoute("/_panel/clients/$clientId/")({
  component: ClientEditPage,
});

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

  const defaultValues = clientQuery.data ? {
    name: clientQuery.data.name || "",
    email: clientQuery.data.email || "",
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
    conectaPlus: clientQuery.data.conectaPlus ? "Yes" : "No",
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
      if (field.name === "password") {
        return {
          ...field,
          label: "Nova senha (opcional)",
          placeholder: "Deixe em branco para manter a atual",
          required: false,
        };
      }
      return field;
    });
  };

  const handleUpdateClient = async (data: UpdateClientFormData) => {
    setErrorMessage("");
    
    try {
      const clientData = {
        name: data.name,
        email: data.email,
        ...(data.password && { password: data.password }),
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
        conectaPlus: data.conectaPlus === "Yes",
      };
      
      await updateClientMutation.mutateAsync({ id: clientId, data: clientData });
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
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteClientMutation.mutateAsync(clientId);
        navigate({ to: "/clients" });
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message || "Erro ao excluir cliente. Tente novamente."
        );
      }
    }
  };

  if (clientQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
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
      <main className="px-6 py-8" role="main">
        <PageHeader
          title="Editar Cliente"
          description="Atualize as informações do cliente"
          actions={
            <ActionButton
              variant="danger"
              onClick={handleDeleteClient}
              disabled={deleteClientMutation.isPending}
              className="focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Excluir cliente {clientQuery.data?.name || ''}</span>
              {deleteClientMutation.isPending ? "Excluindo..." : "Excluir Cliente"}
            </ActionButton>
          }
        />

        {errorMessage && (
          <div role="alert" aria-live="polite">
            <ErrorMessage message={errorMessage} className="mb-6" />
          </div>
        )}

        <section className="bg-white rounded-lg shadow p-6" aria-labelledby="client-form">
          <h2 id="client-form" className="sr-only">Formulário de edição do cliente</h2>
          <DynamicForm
            fields={getFieldWithCustomHandlers()}
            schema={updateClientSchema}
            onSubmit={handleUpdateClient}
            defaultValues={defaultValues}
            submitLabel={updateClientMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            isLoading={updateClientMutation.isPending}
          />
        </section>
      </main>
    </div>
  );
}
