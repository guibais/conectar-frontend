import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
};

type AuthResponse = {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
};

const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });
};
