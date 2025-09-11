import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useRegister } from "../services/auth.service";
import { useGoogleLogin as useGoogleLoginMutation } from "../services/google-auth.service";
import { useAuthStore } from "../stores/auth-store";
import { AuthTemplate } from "../components/ui/AuthTemplate";
import { DynamicForm } from "../components/ui/DynamicForm";
import { GoogleLoginButton } from "../components/ui/GoogleLoginButton";
import { authFormFields } from "../lib/form-fields";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const createRegisterSchema = (t: any) => z
  .object({
    name: z.string().min(2, t("auth.validation.nameMinLength")),
    email: z.string().email(t("auth.validation.email")),
    password: z.string().min(6, t("auth.validation.passwordMinLength")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("auth.register.passwordMismatch"),
    path: ["confirmPassword"],
  });

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const createRegisterFields = (t: any) => [
  {
    ...authFormFields.register.find(field => field.name === "name")!,
    label: t("auth.register.name"),
    placeholder: t("clients.placeholders.name"),
    gridCols: 2,
  },
  {
    ...authFormFields.register.find(field => field.name === "email")!,
    label: t("auth.register.email"),
    placeholder: t("clients.placeholders.email"),
    gridCols: 2,
  },
  {
    ...authFormFields.register.find(field => field.name === "password")!,
    label: t("auth.register.password"),
    placeholder: t("clients.placeholders.password"),
  },
  {
    ...authFormFields.register.find(field => field.name === "password")!,
    name: "confirmPassword",
    label: t("auth.register.confirmPassword"),
    placeholder: "••••••",
  },
];

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserAndToken } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLoginMutation();
  
  const registerSchema = createRegisterSchema(t);
  const registerFields = createRegisterFields(t);

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: any) => {
      if (!credentialResponse.credential) return;

      googleLoginMutation.mutate(credentialResponse.credential, {
        onSuccess: (data) => {
          setUserAndToken(data.user, data.access_token);
          if (data.user.role === "user") {
            navigate({ to: "/profile" });
          } else {
            navigate({ to: "/clients" });
          }
        },
        onError: () => {
          setErrorMessage(t("auth.login.loginError"));
        },
      });
    },
    [googleLoginMutation, setUserAndToken, navigate]
  );

  const handleGoogleError = useCallback(
    (error?: any) => {
      console.warn("Google login error:", error);
      if (error?.type !== "popup_closed") {
        setErrorMessage(t("auth.login.loginError"));
      }
    },
    []
  );

  useGoogleOneTapLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    cancel_on_tap_outside: false,
    auto_select: false,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "user",
      });

      setSuccessMessage(t("auth.register.registerSuccess"));

      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } catch (error: any) {
      if (
        error.response?.data?.message === "Este email já está em uso" ||
        error.response?.data?.message?.includes("email já está em uso")
      ) {
        setErrorMessage(t("auth.register.emailInUse"));
      } else {
        setErrorMessage(
          error.response?.data?.message ||
          t("auth.register.registerError")
        );
      }
    }
  };

  return (
    <AuthTemplate 
      subtitle={t("auth.register.subtitle")}
      success={successMessage ? {
        icon: <UserPlus className="w-8 h-8 text-success" aria-hidden="true" />,
        title: t("auth.register.title"),
        message: successMessage
      } : undefined}
    >
      <DynamicForm
        fields={registerFields}
        schema={registerSchema}
        onSubmit={onSubmit}
        submitLabel={registerMutation.isPending ? t("common.loading") : t("auth.register.registerButton")}
        isLoading={registerMutation.isPending}
        fullWidthSubmit={true}
        errorMessage={errorMessage}
        formActions={
          <div className="space-y-4">
            <div className="relative" role="separator" aria-label={t("common.or")}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t("common.or")}</span>
              </div>
            </div>

            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
            />

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate({ to: "/login" })}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-medium cursor-pointer transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
                aria-label={t("auth.register.backToLogin")}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("auth.register.backToLogin")}
              </button>
            </div>
          </div>
        }
      />
    </AuthTemplate>
  );
}
