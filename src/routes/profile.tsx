import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { userProfileSchema, type UserProfileFormData } from '../lib/schemas';
import { useUserProfile, useUpdateUserProfile } from '../services/users.service';
import { useAuthStore } from '../stores/auth-store';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const profileQuery = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
  });

  useEffect(() => {
    if (profileQuery.data) {
      reset({
        name: profileQuery.data.name,
        email: profileQuery.data.email,
        password: '',
      });
    }
  }, [profileQuery.data, reset]);

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      const response = await updateProfileMutation.mutateAsync(updateData);
      setUser(response);
      
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError('root', { message: 'Erro ao atualizar perfil' });
    }
  };

  if (profileQuery.isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ECDC4]"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#4ECDC4] rounded-full">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Informações da Conta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Role:</span>
                  <span className="ml-2 font-medium capitalize">
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Membro desde:</span>
                  <span className="ml-2 font-medium">
                    {profileQuery.data?.createdAt ? 
                      new Date(profileQuery.data.createdAt).toLocaleDateString('pt-BR') : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome completo"
                  placeholder="Digite seu nome"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Digite seu email"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div>
                <Input
                  label="Nova senha (opcional)"
                  type="password"
                  placeholder="Digite uma nova senha"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Deixe em branco para manter a senha atual
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: user?.role === 'admin' ? '/clients' : '/profile' })}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  <Save size={16} className="mr-2" />
                  {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
