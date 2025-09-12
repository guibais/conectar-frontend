import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import {
  useClient,
  useUpdateClient,
  useDeleteClient,
} from "@/services/clients.service";

import { useClientForm } from "@/hooks/useClientForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import {
  updateClientSchema,
  type UpdateClientFormData,
} from "@/lib/client-schemas";
import {
  ActionButton,
  ConfirmModal,
  DynamicForm,
  ErrorAlert,
  FormSection,
  LoadingSpinner,
  PageHeader,
  TabBar,
} from "@/components";

export const Route = createFileRoute("/_panel/clients/$clientId/")({
  component: ClientEditPage,
});

function ClientEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientId } = Route.useParams();
  const { getFieldsWithHandlers, getDefaultValuesWithCep } = useClientForm();
  const { errorMessage, handleError, clearError } = useErrorHandler();

  const clientQuery = useClient(clientId);
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useAuthRedirect({ requireRole: "admin" });

  const baseValues = clientQuery.data
    ? {
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
      }
    : {};

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
      await updateClientMutation.mutateAsync({
        id: clientId,
        data: updateData,
      });
      navigate({ to: "/clients" });
    } catch (error: any) {
      handleError(error, t("clients.updateError"));
    }
  };

  const handleDeleteClient = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteClient = async () => {
    try {
      await deleteClientMutation.mutateAsync(clientId);
      navigate({ to: "/clients" });
    } catch (error: any) {
      handleError(error, t("clients.deleteError"));
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
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
            {t("clients.notFound")}
          </h2>
          <p className="text-red-600">{t("clients.notFoundMessage")}</p>
          <button
            onClick={() => navigate({ to: "/clients" })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            {t("clients.backToList")}
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
            {t("clients.notFound")}
          </h1>
          <button
            onClick={() => navigate({ to: "/clients" })}
            className="text-conectar-primary hover:text-conectar-600 cursor-pointer"
          >
            {t("clients.backToList")}
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
          title={t("clients.edit")}
          description={t("clients.editDescription")}
          actions={
            <ActionButton
              variant="danger"
              onClick={handleDeleteClient}
              disabled={deleteClientMutation.isPending}
              className="focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">
                {t("clients.deleteClient", {
                  name: clientQuery.data?.name || "",
                })}
              </span>
              {deleteClientMutation.isPending
                ? t("clients.deleting")
                : t("clients.delete")}
            </ActionButton>
          }
        />

        {errorMessage && <ErrorAlert message={errorMessage} className="mb-6" />}

        <FormSection title={t("clients.editForm")}>
          <DynamicForm
            fields={getFieldsWithHandlers()}
            schema={updateClientSchema}
            onSubmit={handleUpdateClient}
            defaultValues={defaultValues}
            submitLabel={
              updateClientMutation.isPending
                ? t("clients.saving")
                : t("clients.saveChanges")
            }
            isLoading={updateClientMutation.isPending}
          />
        </FormSection>
      </main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteClient}
        title={t("clients.delete")}
        message={t("clients.deleteConfirmName", {
          name: clientQuery.data?.name || "este cliente",
        })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
        isLoading={deleteClientMutation.isPending}
      />
    </div>
  );
}
