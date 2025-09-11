import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  GoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { loginSchema, type LoginFormData } from "../lib/schemas";
import { useAuthStore } from "../stores/auth-store";
import { useGoogleLogin as useGoogleLoginMutation } from "../services/google-auth.service";
import { AuthTemplate } from "../components/ui/AuthTemplate";
import { DynamicForm, type FormFieldConfig } from "../components/ui/DynamicForm";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const loginFields: FormFieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Digite seu email",
    required: true,
    gridCols: 2,
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    placeholder: "••••••",
    required: true,
    showPasswordToggle: true,
    gridCols: 2,
  },
];

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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}
      
      <DynamicForm
        fields={loginFields}
        schema={loginSchema}
        onSubmit={onSubmit}
        submitLabel="Entrar"
        isLoading={isLoading}
        fullWidthSubmit={true}
      />

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            shape="rectangular"
            theme="outline"
            size="large"
            logo_alignment="center"
          />
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <button
            type="button"
            onClick={() => navigate({ to: "/register" })}
            className="text-conectar-primary hover:text-conectar-600 font-medium cursor-pointer"
          >
            Criar conta
          </button>
        </p>
      </div>
    </AuthTemplate>
  );
}
