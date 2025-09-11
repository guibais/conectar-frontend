import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PageTemplate } from "@/components/ui/PageTemplate";
import { DynamicForm } from "@/components/ui/DynamicForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SuccessAlert } from "@/components/ui/SuccessAlert";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { UserProfileFormData } from "@/lib/schemas";
import { userProfileSchema } from "@/lib/schemas";
import { useUserProfile, useUpdateUserProfile } from "@/services/users.service";
import { useAuthStore } from "@/stores/auth-store";
import { authFormFields } from "@/lib/form-fields";

const profileFields = [
  authFormFields.profile.find((field) => field.name === "name")!,
  authFormFields.profile.find((field) => field.name === "email")!,
  {
    ...authFormFields.profile.find((field) => field.name === "password")!,
    label: "Nova senha (opcional)",
    placeholder: "Digite uma nova senha",
    required: false,
    gridCols: 2,
  },
];

export const Route = createFileRoute("/_panel/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const { errorMessage, handleError, clearError } = useErrorHandler();
  const profileQuery = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  const defaultValues = profileQuery.data
    ? {
        name: profileQuery.data.name || "",
        email: profileQuery.data.email || "",
        password: "",
      }
    : {};

  const onSubmit = async (data: UserProfileFormData) => {
    clearError();
    setSuccessMessage("");

    try {
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await updateProfileMutation.mutateAsync(updateData);
      setUser(response);

      setSuccessMessage("Perfil atualizado com sucesso!");
    } catch (error: any) {
      handleError(error, "Erro ao atualizar perfil. Tente novamente.");
    }
  };

  if (profileQuery.isLoading) {
    return (
      <PageTemplate
        title="Meu Perfil"
        description="Gerencie suas informações pessoais"
        isLoading={true}
      >
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Meu Perfil"
      description="Gerencie suas informações pessoais"
      isLoading={profileQuery.isLoading}
    >
      <main className="space-y-6 w-full" role="main">
        <section
          className="bg-white rounded-lg shadow p-6 w-full"
          aria-labelledby="profile-info"
        >
          <header className="mb-6">
            <h2 id="profile-info" className="sr-only">
              Informações do perfil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Role:</span>
                <span className="ml-2 font-medium capitalize">
                  {user?.role === "admin" ? "Administrador" : "Usuário"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Membro desde:</span>
                <span className="ml-2 font-medium">
                  {profileQuery.data?.createdAt
                    ? new Date(profileQuery.data.createdAt).toLocaleDateString(
                        "pt-BR"
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          </header>

          {errorMessage && (
            <ErrorAlert message={errorMessage} className="mb-6" />
          )}

          {successMessage && (
            <SuccessAlert message={successMessage} className="mb-6" />
          )}

          <DynamicForm
            fields={profileFields}
            schema={userProfileSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            submitLabel="Salvar Alterações"
            isLoading={updateProfileMutation.isPending}
            formActions={
              user?.role === "admin" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/clients" })}
                  className="focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
                  aria-label="Cancelar alterações no perfil"
                >
                  Cancelar
                </Button>
              ) : undefined
            }
          >
            <div className="text-sm text-gray-500 mt-1">
              Deixe a senha em branco para manter a atual
            </div>
          </DynamicForm>
        </section>
      </main>
    </PageTemplate>
  );
}
