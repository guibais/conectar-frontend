import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Save, Trash2, Search } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth-store';
import { useCepQuery } from '../../../services/cep.service';
import { useClient, useUpdateClient, useDeleteClient } from '../../../services/clients.service';
import { maskCEP, maskCNPJ, removeMask } from '../../../utils/masks';

export const Route = createFileRoute('/clients/$clientId/')({
  component: ClientEditPage,
});

const updateClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().optional(),
  role: z.enum(['admin', 'user']),
  nomeFachada: z.string().optional(),
  cnpj: z.string().optional(),
  razaoSocial: z.string().optional(),
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  complemento: z.string().optional(),
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
});

type UpdateClientFormData = z.infer<typeof updateClientSchema>;


function ClientEditPage() {
  const navigate = useNavigate();
  const { clientId } = Route.useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [cepValue, setCepValue] = useState('');
  
  const clientQuery = useClient(clientId);
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
  });

  const cepQuery = useCepQuery(cepValue, cepValue.length >= 8);

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      navigate({ to: '/login' });
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (clientQuery.data) {
      reset({
        nomeFachada: clientQuery.data.nomeFachada || '',
        cnpj: clientQuery.data.cnpj || '',
        razaoSocial: clientQuery.data.razaoSocial || '',
        cep: clientQuery.data.cep || '',
        rua: clientQuery.data.rua || '',
        numero: clientQuery.data.numero || '',
        bairro: clientQuery.data.bairro || '',
        cidade: clientQuery.data.cidade || '',
        estado: clientQuery.data.estado || '',
        complemento: clientQuery.data.complemento || '',
        status: clientQuery.data.status || 'Ativo',
      });
      
      setCepValue(removeMask(clientQuery.data.cep || ''));
    }
  }, [clientQuery.data, reset]);

  useEffect(() => {
    if (cepQuery.data && cepQuery.data.cep) {
      setValue('rua', cepQuery.data.street || '');
      setValue('bairro', cepQuery.data.district || '');
      setValue('cidade', cepQuery.data.city || '');
      setValue('estado', cepQuery.data.state || '');
    }
  }, [cepQuery.data, setValue]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCEP(e.target.value);
    setCepValue(removeMask(maskedValue));
    setValue('cep', maskedValue);
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCNPJ(e.target.value);
    setValue('cnpj', maskedValue);
  };

  const handleUpdateClient = async (data: UpdateClientFormData) => {
    try {
      const updateData = { ...data };
      
      await updateClientMutation.mutateAsync({
        id: clientId,
        data: updateData
      });
      
      navigate({ to: '/clients' });
    } catch (error: any) {
      console.error('Error updating client:', error);
      if (error.response?.data?.message) {
        setError('root', { message: error.response.data.message });
      } else {
        setError('root', { message: 'Erro ao atualizar cliente' });
      }
    }
  };

  const handleDeleteClient = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      await deleteClientMutation.mutateAsync(clientId);
      navigate({ to: '/clients' });
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };


  if (clientQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-primary"></div>
      </div>
    );
  }

  if (clientQuery.isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Cliente não encontrado</h2>
          <p className="text-red-600">O cliente solicitado não foi encontrado.</p>
          <button
            onClick={() => navigate({ to: '/clients' })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Voltar para lista de clientes
          </button>
        </div>
      </div>
    );
  }

  if (!clientQuery.data) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cliente não encontrado</h1>
          <button
            onClick={() => navigate({ to: '/clients' })}
            className="text-conectar-primary hover:text-conectar-600"
          >
            Voltar para lista de clientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Editar Cliente</h1>
          <p className="text-sm text-gray-500">Gerencie informações do cliente</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/clients' })}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          {currentUser?.id !== clientQuery.data?.id && (
            <button
              onClick={handleDeleteClient}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Excluir Cliente
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <form onSubmit={handleSubmit(handleUpdateClient)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nova senha (opcional)
                </label>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Deixe em branco para manter a atual"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Papel
                </label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="user">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-medium text-gray-900 mb-4">Informações da Empresa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nome Fachada
                </label>
                <input
                  type="text"
                  {...register('nomeFachada')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  {...register('cnpj')}
                  onChange={handleCnpjChange}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Razão Social
              </label>
              <input
                type="text"
                {...register('razaoSocial')}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  CEP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('cep')}
                    onChange={handleCepChange}
                    className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="00000-000"
                  />
                  {cepQuery.isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {cepQuery.data && (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {cepQuery.error && (
                  <p className="mt-1 text-sm text-red-600">CEP não encontrado</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  {...register('rua')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  {...register('numero')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  {...register('bairro')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  {...register('cidade')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  {...register('estado')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  {...register('complemento')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate({ to: '/clients' })}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updateClientMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {updateClientMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
