import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { loginSchema, type LoginFormData } from "../lib/schemas";
import { useAuthStore } from "../stores/auth-store";
import { useGoogleLogin as useGoogleLoginMutation } from "../services/google-auth.service";
import { AuthTemplate } from "../components/ui/AuthTemplate";
import { DynamicForm } from "../components/ui/DynamicForm";
import { GoogleLoginButton } from "../components/ui/GoogleLoginButton";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { authFormFields } from "../lib/form-fields";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});


function LoginPage() {
  const navigate = useNavigate();
  const { login, setUserAndToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
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
          setErrorMessage("Erro ao fazer login com Google");
        },
      });
    },
    [googleLoginMutation, setUserAndToken, navigate]
  );

  const handleGoogleError = useCallback(
    (error?: any) => {
      console.warn("Google login error:", error);
      if (error?.type !== "popup_closed") {
        setErrorMessage("Falha no login com Google");
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

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      if (user?.role === "user") {
        navigate({ to: "/profile" });
      } else {
        navigate({ to: "/clients" });
      }
    } catch (error) {
      setErrorMessage("Email ou senha inválidos");
    } finally {
    }
  };

  return (
    <AuthTemplate subtitle="Faça login em sua conta">
      {errorMessage && (
        <ErrorAlert message={errorMessage} className="mb-6" />
      )}
      
      <DynamicForm
        fields={authFormFields.login}
        schema={loginSchema}
        onSubmit={onSubmit}
        submitLabel="Entrar"
        isLoading={isLoading}
        fullWidthSubmit={true}
        formActions={
          <div className="space-y-4">
            <div className="relative" role="separator" aria-label="ou">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
            />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/register" })}
                  className="text-conectar-primary hover:text-conectar-600 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2 rounded"
                  aria-label="Ir para página de criação de conta"
                >
                  Criar conta
                </button>
              </p>
            </div>
          </div>
        }
      />
    </AuthTemplate>
  );
}
