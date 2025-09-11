import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Search } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth-store';
import { useEffect, useState } from 'react';
import { useCepQuery } from '../../../services/cep.service';
import { useCreateClient } from '../../../services/clients.service';
import { maskCEP, maskCNPJ, removeMask } from '../../../utils/masks';

export const Route = createFileRoute('/clients/create/')({
  component: CreateClientPage,
});

const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'user']),
  tradeName: z.string().optional(),
  taxId: z.string().optional(),
  companyName: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  complement: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  conectaPlus: z.boolean().default(false),
});

type CreateClientFormData = z.infer<typeof createClientSchema>;

function CreateClientPage() {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [cepValue, setCepValue] = useState('');
  const createClientMutation = useCreateClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      role: 'user',
      status: 'Active',
      conectaPlus: false,
    },
  });

  const cepQuery = useCepQuery(cepValue, cepValue.length >= 8);

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      navigate({ to: '/login' });
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (cepQuery.data && !cepQuery.isLoading) {
      setValue('street', cepQuery.data.street || '');
      setValue('district', cepQuery.data.district || '');
      setValue('city', cepQuery.data.city || '');
      setValue('state', cepQuery.data.state || '');
    }
  }, [cepQuery.data, cepQuery.isLoading, setValue]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCEP(e.target.value);
    setCepValue(removeMask(maskedValue));
    setValue('zipCode', maskedValue);
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCNPJ(e.target.value);
    setValue('taxId', maskedValue);
  };

  const handleCreateClient = async (data: CreateClientFormData) => {
    try {
      const clientData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        tradeName: data.tradeName || '',
        taxId: data.taxId || '',
        companyName: data.companyName || '',
        zipCode: data.zipCode || '',
        street: data.street || '',
        number: data.number || '',
        district: data.district || '',
        city: data.city || '',
        state: data.state || '',
        complement: data.complement || '',
        status: data.status || 'Active',
        conectaPlus: data.conectaPlus || false,
      };
      await createClientMutation.mutateAsync(clientData);
      navigate({ to: '/clients' });
    } catch (error: any) {
      if (error.response?.data?.message === 'Email already exists') {
        setError('email', { message: 'Este email já está em uso' });
      } else {
        console.error('Error creating client:', error);
        setError('root', { message: 'Erro ao criar cliente. Tente novamente.' });
      }
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Cliente</h1>
          <p className="text-gray-600">Adicione um novo cliente ao sistema</p>
        </div>
        <button
          onClick={() => navigate({ to: '/clients' })}
          className="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
      <form onSubmit={handleSubmit(handleCreateClient)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome completo *
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
            >
              <option value="user">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações da Empresa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Fantasia
              </label>
              <input
                type="text"
                {...register('tradeName')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                {...register('taxId')}
                onChange={handleCnpjChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razão Social
              </label>
              <input
                type="text"
                {...register('companyName')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('zipCode')}
                  onChange={handleCepChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
                  placeholder="00000-000"
                />
                {cepQuery.isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-conectar-primary"></div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                {...register('city')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rua
              </label>
              <input
                type="text"
                {...register('street')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número
              </label>
              <input
                type="text"
                {...register('number')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro
              </label>
              <input
                type="text"
                {...register('district')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <input
                type="text"
                {...register('state')}
                maxLength={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
                placeholder="SP"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complemento
              </label>
              <input
                type="text"
                {...register('complement')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              >
                <option value="Active">Ativo</option>
                <option value="Inactive">Inativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conecta Plus
              </label>
              <select
                {...register('conectaPlus', { 
                  setValueAs: (value) => value === 'true' 
                })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-conectar-primary text-sm"
              >
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>
          </div>
        </div>

        {errors.root && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={() => navigate({ to: '/clients' })}
            className="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Save className="h-5 w-5" />
            {isSubmitting ? 'Criando...' : 'Criar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}
