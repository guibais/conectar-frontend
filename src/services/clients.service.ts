import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export type Client = {
  id: string;
  nomeFachada: string;
  cnpj: string;
  razaoSocial: string;
  status: 'Ativo' | 'Inativo';
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
  latitude?: string;
  longitude?: string;
  createdAt: string;
  updatedAt: string;
};

type ClientFilterQuery = {
  name?: string;
  cnpj?: string;
  status?: 'Ativo' | 'Inativo' | '';
  conectaPlus?: 'Sim' | 'Não' | '';
  page?: number;
  limit?: number;
};

type CreateClientData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateClientData = Partial<CreateClientData>;

type ClientsResponse = {
  clients: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const clientsService = {
  getClients: async (filters?: ClientFilterQuery): Promise<ClientsResponse> => {
    const response = await api.get('/clients', { params: filters });
    return response.data;
  },

  getClientById: async (id: string): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (data: CreateClientData): Promise<Client> => {
    const response = await api.post('/clients', data);
    return response.data;
  },

  updateClient: async (id: string, data: UpdateClientData): Promise<Client> => {
    const response = await api.patch(`/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

export const useClients = (filters?: ClientFilterQuery) => {
  return useQuery({
    queryKey: ['clients', 'list', filters],
    queryFn: () => clientsService.getClients(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.getClientById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) => 
      clientsService.updateClient(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['clients', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
    },
  });
};
