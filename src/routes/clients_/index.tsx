import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { filterSchema, type FilterFormData } from '../../lib/schemas';
import { clientsApi } from '../../lib/api';

export const Route = createFileRoute('/clients_/')({
  component: ClientsPage,
});

type Client = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  nomeFachada: string;
  status: string;
  conectaPlus: string;
  tags: string[];
};

function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      status: '',
      conectaPlus: '',
    },
  });

  const loadClients = async (filters?: FilterFormData) => {
    setIsLoading(true);
    try {
      const response = await clientsApi.list(filters);
      setClients(response.clients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const onFilter = (data: FilterFormData) => {
    loadClients(data);
  };

  const onClearFilters = () => {
    reset();
    loadClients();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Link to="/clients/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Novo
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-[#4ECDC4] hover:text-[#45B7B8] transition-colors"
          >
            <Search size={16} />
            <span className="font-medium">Filtros</span>
            <span className="text-sm text-gray-500">Para a busca de itens na página</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showFilters && (
            <form onSubmit={handleSubmit(onFilter)} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Buscar por nome"
                  {...register('name')}
                />
                <Input
                  placeholder="Buscar por CNPJ"
                  {...register('cnpj')}
                />
                <Select
                  options={[
                    { value: '', label: 'Buscar por status' },
                    { value: 'Ativo', label: 'Ativo' },
                    { value: 'Inativo', label: 'Inativo' },
                  ]}
                  {...register('status')}
                />
                <Select
                  options={[
                    { value: '', label: 'Buscar por conecta+' },
                    { value: 'Sim', label: 'Sim' },
                    { value: 'Não', label: 'Não' },
                  ]}
                  {...register('conectaPlus')}
                />
              </div>
              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={onClearFilters}>
                  Limpar campos
                </Button>
                <Button type="submit">
                  Filtrar
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Clientes</h2>
            <p className="text-sm text-gray-500">Selecione um usuário para editar suas informações</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ECDC4]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Razão social
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CNPJ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome na fachada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conecta Plus
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate({ to: '/clients/$clientId', params: { clientId: client.id } })}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.razaoSocial}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.cnpj}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.nomeFachada}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.tags.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.status === 'Ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.conectaPlus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {clients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum cliente encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
