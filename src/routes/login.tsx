import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  GoogleLogin,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { loginSchema, type LoginFormData } from "../lib/schemas";
import { useAuthStore } from "../stores/auth-store";
import { useGoogleLogin as useGoogleLoginMutation } from "../services/google-auth.service";
import { AuthTemplate } from "../components/ui/AuthTemplate";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, setUserAndToken } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const googleLoginMutation = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
          setError("root", {
            message: "Erro ao fazer login com Google",
          });
        },
      });
    },
    [googleLoginMutation, setUserAndToken, navigate, setError]
  );

  const handleGoogleError = useCallback(
    (error?: any) => {
      console.warn("Google login error:", error);
      // Não mostrar erro para falhas de status do GSI (403)
      if (error?.type !== "popup_closed") {
        setError("root", {
          message: "Falha no login com Google",
        });
      }
    },
    [setError]
  );

  useGoogleOneTapLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    cancel_on_tap_outside: false,
    auto_select: false,
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      if (user?.role === "user") {
        navigate({ to: "/profile" });
      } else {
        navigate({ to: "/clients" });
      }
    } catch (error) {
      setError("root", {
        message: "Email ou senha inválidos",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate subtitle="Faça login em sua conta">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Digite seu email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent outline-none transition-all"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent outline-none transition-all"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-conectar-primary transition-colors cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-conectar-primary hover:bg-conectar-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2 cursor-pointer"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-sm">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
              logo_alignment="center"
            />
          </div>
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
