import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useCreateClient } from "@/services/clients.service";
import { useClientForm } from "@/hooks/useClientForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { handleStandardizedError } from "@/utils/error-handler";
import {
  createClientSchema,
  type CreateClientFormData,
} from "@/lib/client-schemas";
import {
  ActionButton,
  DynamicForm,
  ErrorAlert,
  FormSection,
  PageHeader,
  TabBar,
} from "@/components";

export const Route = createFileRoute("/_panel/clients/create/")({
  component: CreateClientPage,
});

function CreateClientPage() {
  const { t } = useTranslation();
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
      const errorMessage = handleStandardizedError(error, t);
      handleError(error, errorMessage);
    }
  };

  return (
    <div>
      <TabBar activeTab="dados-basicos" />
      <main className="px-6 py-8" role="main">
        <PageHeader
          title={t("clients.create")}
          description={t("clients.createDescription")}
          actions={
            <ActionButton
              onClick={() => navigate({ to: "/clients" })}
              className="focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
            >
              {t("common.cancel")}
            </ActionButton>
          }
        />

        {errorMessage && <ErrorAlert message={errorMessage} className="mb-6" />}

        <FormSection title={t("clients.createForm")}>
          <DynamicForm
            fields={getFieldsWithHandlers()}
            schema={createClientSchema}
            onSubmit={handleCreateClient}
            defaultValues={defaultValues}
            submitLabel={t("clients.create")}
            isLoading={createClientMutation.isPending}
            formActions={
              <button
                type="button"
                onClick={() => navigate({ to: "/clients" })}
                className="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-medium cursor-pointer transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
                aria-label={t("clients.cancelCreate")}
              >
                {t("common.cancel")}
              </button>
            }
          />
        </FormSection>
      </main>
    </div>
  );
}
