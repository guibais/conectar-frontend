import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useRegister } from "../services/auth.service";
import { AuthTemplate } from "../components/ui/AuthTemplate";
import { DynamicForm } from "../components/ui/DynamicForm";
import { authFormFields } from "../lib/form-fields";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const registerFields = [
  {
    ...authFormFields.register.find(field => field.name === "name")!,
    gridCols: 2,
  },
  {
    ...authFormFields.register.find(field => field.name === "email")!,
    gridCols: 2,
  },
  authFormFields.register.find(field => field.name === "password")!,
  {
    ...authFormFields.register.find(field => field.name === "password")!,
    name: "confirmPassword",
    label: "Confirmar senha",
    placeholder: "••••••",
  },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const registerMutation = useRegister();

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

      setSuccessMessage(
        "Conta criada com sucesso! Redirecionando para o login..."
      );

      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } catch (error: any) {
      if (
        error.response?.data?.message === "Este email já está em uso" ||
        error.response?.data?.message?.includes("email já está em uso")
      ) {
        setErrorMessage("Este email já está em uso");
      } else {
        setErrorMessage(
          error.response?.data?.message ||
          "Erro ao criar conta. Tente novamente."
        );
      }
    }
  };

  return (
    <AuthTemplate 
      subtitle="Crie sua conta"
      success={successMessage ? {
        icon: <UserPlus className="w-8 h-8 text-success" aria-hidden="true" />,
        title: "Conta criada!",
        message: successMessage
      } : undefined}
    >
      <DynamicForm
        fields={registerFields}
        schema={registerSchema}
        onSubmit={onSubmit}
        submitLabel={registerMutation.isPending ? "Criando conta..." : "Criar conta"}
        isLoading={registerMutation.isPending}
        fullWidthSubmit={true}
        errorMessage={errorMessage}
        formActions={
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-medium cursor-pointer transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
            aria-label="Voltar para página de login"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para o login
          </button>
        }
      />
    </AuthTemplate>
  );
}
