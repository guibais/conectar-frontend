import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useClient, useUpdateClient, useDeleteClient } from "@/services/clients.service";
import { TabBar } from "@/components/ui/TabBar";
import { DynamicForm } from "@/components/ui/DynamicForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FormSection } from "@/components/ui/FormSection";
import { useClientForm } from "@/hooks/useClientForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { updateClientSchema, type UpdateClientFormData } from "@/lib/client-schemas";

export const Route = createFileRoute("/_panel/clients/$clientId/")({
  component: ClientEditPage,
});

function ClientEditPage() {
  const navigate = useNavigate();
  const { clientId } = Route.useParams();
  const { getFieldsWithHandlers, getDefaultValuesWithCep } = useClientForm();
  const { errorMessage, handleError, clearError } = useErrorHandler();
  
  const clientQuery = useClient(clientId);
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  useAuthRedirect({ requireRole: "admin" });

  const baseValues = clientQuery.data ? {
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
  } : {};
  
  const defaultValues = getDefaultValuesWithCep(baseValues);


  const handleUpdateClient = async (data: UpdateClientFormData) => {
    clearError();
    
    try {
      const updateData = {
        name: data.name,
        email: data.email,
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
      await updateClientMutation.mutateAsync({ id: clientId, data: updateData });
      navigate({ to: "/clients" });
    } catch (error: any) {
      handleError(error, "Erro ao atualizar cliente. Tente novamente.");
    }
  };

  const handleDeleteClient = async () => {
    const clientName = clientQuery.data?.name || "este cliente";
    if (!window.confirm(`Tem certeza que deseja excluir ${clientName}?`)) {
      return;
    }

    try {
      await deleteClientMutation.mutateAsync(clientId);
      navigate({ to: "/clients" });
    } catch (error: any) {
      handleError(error, "Erro ao excluir cliente. Tente novamente.");
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
          <ErrorAlert message={errorMessage} className="mb-6" />
        )}

        <FormSection title="Formulário de edição do cliente">
          <DynamicForm
            fields={getFieldsWithHandlers()}
            schema={updateClientSchema}
            onSubmit={handleUpdateClient}
            defaultValues={defaultValues}
            submitLabel={updateClientMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            isLoading={updateClientMutation.isPending}
          />
        </FormSection>
      </main>
    </div>
  );
}
