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
import { updateClientSchema, type UpdateClientFormData } from "@/lib/client-schemas";
import { clientFormFields } from "@/lib/form-fields";

export const Route = createFileRoute("/_panel/clients/$clientId/index-clean")({
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
    return <div>Carregando...</div>;
  }

  if (clientQuery.error) {
    return <div>Erro ao carregar cliente</div>;
  }

  return (
    <div>
      <TabBar activeTab="dados-basicos" />
      <div className="px-6 py-8">
        <PageHeader
          title={`Editar Cliente: ${clientQuery.data?.name}`}
          description="Edite as informações do cliente"
          actions={
            <>
              <ActionButton
                onClick={handleDeleteClient}
                variant="danger"
                icon={<Trash2 className="h-4 w-4" />}
                disabled={deleteClientMutation.isPending}
              >
                Excluir
              </ActionButton>
              <ActionButton onClick={() => navigate({ to: "/clients" })}>
                Cancelar
              </ActionButton>
            </>
          }
        />

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <DynamicForm
          fields={getFieldWithCustomHandlers()}
          schema={updateClientSchema}
          onSubmit={handleUpdateClient}
          defaultValues={defaultValues}
          submitLabel="Atualizar Cliente"
          isLoading={updateClientMutation.isPending}
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
