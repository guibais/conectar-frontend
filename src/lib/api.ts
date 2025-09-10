import axios from 'axios';
import { authStorage } from './auth-storage';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };

export const mockApi = {
  auth: {
    login: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@conectar.com' && password === '123456') {
        return {
          access_token: 'mock-admin-token',
          user: {
            id: '1',
            name: 'Admin User',
            email: 'admin@conectar.com',
            role: 'admin'
          }
        };
      }
      
      if (email === 'user@conectar.com' && password === '123456') {
        return {
          access_token: 'mock-user-token',
          user: {
            id: '2',
            name: 'Regular User',
            email: 'user@conectar.com',
            role: 'user'
          }
        };
      }
      
      throw new Error('Invalid credentials');
    }
  },

  clients: {
    list: async (filters?: any) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        clients: [
          {
            id: '1',
            razaoSocial: 'TOKEN TEST LTDA',
            cnpj: '71.547.504/0001-74',
            nomeFachada: 'JOANINHA BISTRO',
            status: 'Inativo',
            conectaPlus: 'Não',
            tags: ['Restaurante']
          },
          {
            id: '2',
            razaoSocial: 'RESTAURANTE BOA VISTA',
            cnpj: '71.673.990/0001-77',
            nomeFachada: 'RESTAURANTE BOA VISTA',
            status: 'Inativo',
            conectaPlus: 'Não',
            tags: ['Restaurante']
          },
          {
            id: '3',
            razaoSocial: 'TOKEN TEST LTDA',
            cnpj: '64.152.434/0005-51',
            nomeFachada: 'Geo Food',
            status: 'Inativo',
            conectaPlus: 'Não',
            tags: ['Delivery']
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1
        }
      };
    },

    getById: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id,
        razaoSocial: 'TOKEN TEST LTDA',
        cnpj: '71.547.504/0001-74',
        nomeFachada: 'JOANINHA BISTRO',
        cep: '01310-100',
        rua: 'Av. Paulista, 1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        numero: '1000',
        complemento: 'Sala 101'
      };
    },

    create: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now().toString(), ...data };
    },

    update: async (id: string, data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...data };
    }
  },

  users: {
    profile: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = authStorage.getUser();
      return {
        ...user,
        createdAt: '2024-01-15T10:30:00Z'
      };
    },

    updateProfile: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = authStorage.getUser();
      const updatedUser = { ...user, ...data };
      authStorage.setUser(updatedUser);
      return updatedUser;
    }
  }
};
