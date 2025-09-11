import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Save, Trash2, Search } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth-store';
import { api } from '../../../lib/api';
import { useCepQuery } from '../../../services/cep.service';
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

type ClientData = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  nomeFachada?: string;
  cnpj?: string;
  razaoSocial?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  status?: 'Ativo' | 'Inativo';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

function ClientEditPage() {
  const navigate = useNavigate();
  const { clientId } = Route.useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cepValue, setCepValue] = useState('');
  const [cnpjValue, setCnpjValue] = useState('');
  
  // Keep cnpjValue for potential future use with CNPJ validation
  console.log('CNPJ value for validation:', cnpjValue);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
  });

  const cepQuery = useCepQuery(cepValue, cepValue.length >= 8);

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      navigate({ to: '/login' });
      return;
    }
    loadClient();
  }, [isAuthenticated, currentUser, navigate, clientId]);

  useEffect(() => {
    if (cepQuery.data && !cepQuery.isLoading) {
      setValue('rua', cepQuery.data.street || '');
      setValue('bairro', cepQuery.data.district || '');
      setValue('cidade', cepQuery.data.city || '');
      setValue('estado', cepQuery.data.state || '');
    }
  }, [cepQuery.data, cepQuery.isLoading, setValue]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCEP(e.target.value);
    setCepValue(removeMask(maskedValue));
    setValue('cep', maskedValue);
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCNPJ(e.target.value);
    setCnpjValue(removeMask(maskedValue));
    setValue('cnpj', maskedValue);
  };

  const loadClient = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/clients/${clientId}`);
      setClientData(response.data);
      reset({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        password: '',
        nomeFachada: response.data.nomeFachada || '',
        cnpj: response.data.cnpj || '',
        razaoSocial: response.data.razaoSocial || '',
        cep: response.data.cep || '',
        rua: response.data.rua || '',
        numero: response.data.numero || '',
        bairro: response.data.bairro || '',
        cidade: response.data.cidade || '',
        estado: response.data.estado || '',
        complemento: response.data.complemento || '',
        status: response.data.status || 'Ativo',
      });
    } catch (error) {
      console.error('Error loading client:', error);
      navigate({ to: '/clients' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (data: UpdateClientFormData) => {
    try {
      setIsUpdating(true);
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await api.patch(`/clients/${clientId}`, updateData);
      navigate({ to: '/clients' });
    } catch (error: any) {
      if (error.response?.data?.message === 'Email already exists') {
        setError('email', { message: 'Este email já está em uso' });
      } else {
        console.error('Error updating client:', error);
        setError('root', { message: 'Erro ao atualizar cliente. Tente novamente.' });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await api.delete(`/clients/${clientId}`);
      navigate({ to: '/clients' });
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Erro ao excluir cliente. Tente novamente.');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-primary"></div>
      </div>
    );
  }

  if (!clientData) {
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
          {currentUser?.id !== clientData.id && (
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
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
