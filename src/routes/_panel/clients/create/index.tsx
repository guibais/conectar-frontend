import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TabBar } from "@/components/ui/TabBar";
import { DynamicForm } from "@/components/ui/DynamicForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { FormSection } from "@/components/ui/FormSection";
import { useCreateClient } from "@/services/clients.service";
import { useClientForm } from "@/hooks/useClientForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { createClientSchema, type CreateClientFormData } from "@/lib/client-schemas";

export const Route = createFileRoute("/_panel/clients/create/")({
  component: CreateClientPage,
});

function CreateClientPage() {
  const navigate = useNavigate();
  const createClientMutation = useCreateClient();
  const { getFieldsWithHandlers, getDefaultValuesWithCep } = useClientForm();
  const { errorMessage, handleError, clearError } = useErrorHandler();
  
  useAuthRedirect({ requireRole: "admin" });

  const baseValues = {
    role: "user",
    status: "Active",
    conectaPlus: "false",
  };
  
  const defaultValues = getDefaultValuesWithCep(baseValues);


  const handleCreateClient = async (data: CreateClientFormData) => {
    clearError();
    
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
      const emailInUseMessages = [
        "Este email já está em uso",
        "email já está em uso"
      ];
      
      const isEmailInUse = emailInUseMessages.some(msg => 
        error.response?.data?.message?.includes(msg)
      );
      
      if (isEmailInUse) {
        handleError(error, "Este email já está em uso");
      } else {
        handleError(error, "Erro ao criar cliente. Tente novamente.");
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
          <ErrorAlert message={errorMessage} className="mb-6" />
        )}

        <FormSection title="Formulário de criação de cliente">
          <DynamicForm
            fields={getFieldsWithHandlers()}
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
        </FormSection>
      </main>
    </div>
  );
}
