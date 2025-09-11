import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useGoogleLogin as useGoogleLoginMutation } from "../services/google-auth.service";
import { useAuthStore } from "../stores/auth-store";
import { AuthTemplate } from "../components/ui/AuthTemplate";
import { GoogleLoginButton } from "../components/ui/GoogleLoginButton";
import { ErrorAlert } from "../components/ui/ErrorAlert";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserAndToken } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");
  const googleLoginMutation = useGoogleLoginMutation();

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

  return (
    <AuthTemplate subtitle={t("auth.login.subtitle")}>
      <div className="space-y-6">
        {errorMessage && (
          <ErrorAlert message={errorMessage} />
        )}

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
