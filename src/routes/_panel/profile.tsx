import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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

const createProfileFields = (t: any) => [
  {
    ...authFormFields.profile.find((field) => field.name === "name")!,
    label: t("profile.fields.name"),
    placeholder: t("clients.placeholders.name"),
  },
  {
    ...authFormFields.profile.find((field) => field.name === "email")!,
    label: t("profile.fields.email"),
    placeholder: t("clients.placeholders.email"),
  },
  {
    ...authFormFields.profile.find((field) => field.name === "password")!,
    label: t("profile.fields.password"),
    placeholder: "Digite uma nova senha",
    required: false,
    gridCols: 2,
  },
];

export const Route = createFileRoute("/_panel/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const { errorMessage, handleError, clearError } = useErrorHandler();
  const profileQuery = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  
  const profileFields = createProfileFields(t);

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

      setSuccessMessage(t("profile.updateSuccess"));
    } catch (error: any) {
      handleError(error, t("profile.updateError"));
    }
  };

  if (profileQuery.isLoading) {
    return (
      <PageTemplate
        title={t("profile.title")}
        description={t("profile.subtitle")}
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
      title={t("profile.title")}
      description={t("profile.subtitle")}
      isLoading={profileQuery.isLoading}
    >
      <main className="space-y-6 w-full" role="main">
        <section
          className="bg-white rounded-lg shadow p-6 w-full"
          aria-labelledby="profile-info"
        >
          <header className="mb-6">
            <h2 id="profile-info" className="sr-only">
              {t("profile.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">{t("profile.fields.role")}:</span>
                <span className="ml-2 font-medium capitalize">
                  {user?.role === "admin" ? t("profile.roles.admin") : t("profile.roles.user")}
                </span>
              </div>
              <div>
                <span className="text-gray-500">{t("profile.fields.memberSince")}:</span>
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
            submitLabel={t("profile.saveChanges")}
            isLoading={updateProfileMutation.isPending}
            formActions={
              user?.role === "admin" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/clients" })}
                  className="focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
                  aria-label={t("common.cancel")}
                >
                  {t("common.cancel")}
                </Button>
              ) : undefined
            }
          >
            <div className="text-sm text-gray-500 mt-1">
              {t("profile.passwordHint")}
            </div>
          </DynamicForm>
        </section>
      </main>
    </PageTemplate>
  );
}
