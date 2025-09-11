import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export type GoogleAuthResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
};

export type GoogleLoginRequest = {
  credential: string;
};

const googleAuthService = {
  loginWithCredential: async (credential: string): Promise<GoogleAuthResponse> => {
    const response = await api.post('/auth/google', {
      credential,
    });
    return response.data;
  },

  loginWithCode: async (code: string): Promise<GoogleAuthResponse> => {
    const response = await api.post('/auth/google/callback', {
      code,
    });
    return response.data;
  },
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: googleAuthService.loginWithCredential,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.setQueryData(['auth', 'token'], data.access_token);
      localStorage.setItem('token', data.access_token);
    },
  });
};

export const useGoogleLoginWithCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: googleAuthService.loginWithCode,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
      localStorage.setItem('token', data.access_token);
    },
  });
};
