import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../lib/schemas';
import { useAuthStore } from '../stores/auth-store';
import { useLogin } from '../services/auth.service';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      if (user?.role === 'user') {
        navigate({ to: '/profile' });
      } else {
        navigate({ to: '/clients' });
      }
    } catch (error) {
      setError('root', {
        message: 'Email ou senha inválidos',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-conectar-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold underline decoration-2 underline-offset-4">
            Conéctar
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent outline-none transition-all"
                {...register('email')}
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent outline-none transition-all"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-conectar-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
              className="w-full bg-conectar-primary hover:bg-conectar-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/register' })}
                className="text-conectar-primary hover:text-conectar-600 font-medium"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
