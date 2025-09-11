import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useGoogleLogin as useGoogleLoginMutation } from "../services/google-auth.service";
import { useLogin } from "../services/auth.service";
import { useAuthStore } from "../stores/auth-store";
import { AuthTemplate } from "../components/ui/AuthTemplate";
import { GoogleLoginButton } from "../components/ui/GoogleLoginButton";
import { DynamicForm } from "../components/ui/DynamicForm";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { loginSchema, type LoginFormData } from "../lib/schemas";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserAndToken } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");
  const googleLoginMutation = useGoogleLoginMutation();
  const loginMutation = useLogin();

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
    [t]
  );

  const handleLogin = async (data: LoginFormData) => {
    setErrorMessage("");
    
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        setUserAndToken(response.user, response.access_token);
        if (response.user.role === "user") {
          navigate({ to: "/profile" });
        } else {
          navigate({ to: "/clients" });
        }
      },
      onError: () => {
        setErrorMessage(t("auth.login.invalidCredentials"));
      },
    });
  };

  const loginFields = [
    {
      name: "email",
      label: t("auth.login.email"),
      type: "email" as const,
      placeholder: "email@exemplo.com",
      required: true,
    },
    {
      name: "password",
      label: t("auth.login.password"),
      type: "password" as const,
      placeholder: t("auth.login.password"),
      required: true,
      showPasswordToggle: true,
    },
  ];

  useGoogleOneTapLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    cancel_on_tap_outside: false,
    auto_select: false,
  });

  return (
    <AuthTemplate subtitle={t("auth.login.subtitle")}>
      <div className="space-y-6">
        {errorMessage && (
          <ErrorAlert message={errorMessage} />
        )}

        <DynamicForm
          fields={loginFields}
          schema={loginSchema}
          onSubmit={handleLogin}
          submitLabel={t("auth.login.loginButton")}
          isLoading={loginMutation.isPending}
          fullWidthSubmit={true}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              {t("common.or")}
            </span>
          </div>
        </div>

        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t("auth.login.noAccount")}{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/register" })}
              className="font-medium text-conectar-primary hover:text-conectar-600 focus:outline-none focus:underline transition-colors"
              aria-label="Ir para página de registro"
            >
              {t("auth.login.createAccount")}
            </button>
          </p>
        </div>
      </div>
    </AuthTemplate>
  );
}
