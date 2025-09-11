import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageTemplate } from "@/components/ui/PageTemplate";
import { DynamicForm, type FormFieldConfig } from "@/components/ui/DynamicForm";
import type { UserProfileFormData } from "@/lib/schemas";
import { userProfileSchema } from "@/lib/schemas";
import { useUserProfile, useUpdateUserProfile } from "@/services/users.service";
import { useAuthStore } from "@/stores/auth-store";

const profileFields: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nome completo",
    type: "text",
    placeholder: "Digite seu nome",
    required: true,
    gridCols: 1,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Digite seu email",
    required: true,
    gridCols: 1,
  },
  {
    name: "password",
    label: "Nova senha (opcional)",
    type: "password",
    placeholder: "Digite uma nova senha",
    gridCols: 2,
  },
];

export const Route = createFileRoute("/_panel/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const profileQuery = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  const defaultValues = profileQuery.data ? {
    name: profileQuery.data.name || "",
    email: profileQuery.data.email || "",
    password: "",
  } : {};

  const onSubmit = async (data: UserProfileFormData) => {
    setErrorMessage("");
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
      setErrorMessage(
        error.response?.data?.message || "Erro ao atualizar perfil. Tente novamente."
      );
    }
  };

  if (profileQuery.isLoading) {
    return (
      <PageTemplate
        title="Meu Perfil"
        description="Gerencie suas informações pessoais"
        isLoading={true}
      >
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
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
      <div className=" space-y-6 w-full">
        <div className="bg-white rounded-lg shadow p-6 w-full">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-conectar-primary rounded-full">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Informações da Conta
                </h2>
              </div>
            </div>
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
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          <DynamicForm
            fields={profileFields}
            schema={userProfileSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            submitLabel="Salvar Alterações"
            isLoading={updateProfileMutation.isPending}
            formActions={
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: user?.role === "admin" ? "/clients" : "/profile",
                  })
                }
              >
                Cancelar
              </Button>
            }
          >
            <div className="text-sm text-gray-500 mt-1">
              Deixe a senha em branco para manter a atual
            </div>
          </DynamicForm>
        </div>
      </div>
    </PageTemplate>
  );
}
