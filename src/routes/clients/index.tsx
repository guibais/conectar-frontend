import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuthStore } from '../../stores/auth-store';
import { api } from '../../lib/api';

export const Route = createFileRoute('/clients/')({
  component: ClientsPage,
});

type Client = {
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
  latitude?: number;
  longitude?: number;
  status?: 'Ativo' | 'Inativo';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

type ClientFilterQuery = {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
  cnpj?: string;
  status?: 'Ativo' | 'Inativo';
  sortBy?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
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

type CreateClientFormData = z.infer<typeof createClientSchema>;

function ClientsPage() {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<ClientFilterQuery>({
    name: '',
    cnpj: '',
    status: undefined,
    role: undefined,
  });
  const [filters, setFilters] = useState<ClientFilterQuery>({
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
  });

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      navigate({ to: '/login' });
      return;
    }
    loadClients();
  }, [isAuthenticated, currentUser, navigate, filters]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      );
      const response = await api.get('/clients', { params: cleanFilters });
      setClients(response.data.clients);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: 'name' | 'createdAt') => {
    const newOrder = filters.sortBy === column && filters.order === 'asc' ? 'desc' : 'asc';
    setFilters({
      ...filters,
      sortBy: column,
      order: newOrder,
      page: 1,
    });
  };

  const getSortIcon = (column: 'name' | 'createdAt') => {
    if (filters.sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return filters.order === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };


  const handleCreateClient = async (data: CreateClientFormData) => {
    try {
      await api.post('/clients', data);
      setShowCreateModal(false);
      reset();
      loadClients();
    } catch (error: any) {
      if (error.response?.data?.message === 'Email already exists') {
        setError('email', { message: 'Este email já está em uso' });
      } else {
        console.error('Error creating client:', error);
      }
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    try {
      await api.delete(`/clients/${clientId}`);
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes e informações</p>
        </div>
        <button
          onClick={() => navigate({ to: '/clients/create' })}
          className="flex items-center gap-2 px-6 py-3 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Adicionar Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="p-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Search className="h-4 w-4" />
              Filtros
              <span className="text-xs text-gray-500">• 4 opções items na página</span>
              {showFilters ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>
          </div>
          
          {showFilters && (
            <div className="px-6 pb-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por nome
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    value={tempFilters.name || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por CNPJ
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o CNPJ"
                    value={tempFilters.cnpj || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, cnpj: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por status
                  </label>
                  <select
                    value={tempFilters.status || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por conector+
                  </label>
                  <select
                    value={tempFilters.role || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="admin">Administrador</option>
                    <option value="user">Cliente</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setTempFilters({
                      name: '',
                      cnpj: '',
                      status: undefined,
                      role: undefined,
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                >
                  Limpar campos
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      ...filters,
                      name: tempFilters.name,
                      cnpj: tempFilters.cnpj,
                      status: tempFilters.status,
                      role: tempFilters.role,
                      page: 1,
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Filtrar
                </button>
              </div>
            </div>
          )}
        </div>


        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cliente
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Criado em
                    {getSortIcon('createdAt')}
                  </button>
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((client: Client) => (
                <tr key={client.id} className="hover:bg-gray-25 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.role === 'admin' 
                        ? 'bg-conectar-50 text-conectar-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {client.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      !client.lastLoginAt || new Date(client.lastLoginAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        ? 'bg-red-50 text-red-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {!client.lastLoginAt || new Date(client.lastLoginAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        ? 'Inativo'
                        : 'Ativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(client.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate({ to: `/clients/${client.id}` })}
                        className="p-2 text-gray-400 hover:text-conectar-primary hover:bg-conectar-50 rounded-lg transition-colors"
                        title="Editar cliente"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {currentUser?.id !== client.id && (
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir cliente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} clientes
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              {pagination.page} de {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Criar Novo Cliente</h2>
            <form onSubmit={handleSubmit(handleCreateClient)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Papel
                </label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-error">{errors.role.message}</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Empresa (Opcional)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Fachada
                    </label>
                    <input
                      type="text"
                      {...register('nomeFachada')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      {...register('cnpj')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    {...register('razaoSocial')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      {...register('cep')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      {...register('cidade')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua
                    </label>
                    <input
                      type="text"
                      {...register('rua')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      {...register('numero')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      {...register('bairro')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      {...register('estado')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    {...register('complemento')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
