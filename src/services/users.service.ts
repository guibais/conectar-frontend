import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

type UserFilterQuery = {
  role?: 'admin' | 'user';
  sortBy?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
};

type UsersResponse = {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const usersService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/clients/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateUserData): Promise<User> => {
    const response = await api.patch('/clients/profile', data);
    return response.data;
  },

  getUsers: async (filters?: UserFilterQuery): Promise<UsersResponse> => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getInactiveUsers: async (): Promise<User[]> => {
    const response = await api.get('/users/inactive');
    return response.data;
  },
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: usersService.getProfile,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['users', 'profile'], data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUsers = (filters?: UserFilterQuery) => {
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: () => usersService.getUsers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => 
      usersService.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['users', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
    },
  });
};

export const useInactiveUsers = () => {
  return useQuery({
    queryKey: ['users', 'inactive'],
    queryFn: usersService.getInactiveUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
