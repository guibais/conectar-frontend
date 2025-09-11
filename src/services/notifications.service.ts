import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

type InactiveClient = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt: string | null;
};

export const useInactiveClients = () => {
  return useQuery({
    queryKey: ['inactive-clients'],
    queryFn: async (): Promise<InactiveClient[]> => {
      const response = await api.get('/clients/inactive');
      return response.data;
    },
  });
};
