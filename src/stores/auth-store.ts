import { create } from 'zustand';
import { authStorage } from '../lib/auth-storage';
import { authApi } from '../lib/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { access_token, user } = response;

      authStorage.setToken(access_token);
      authStorage.setUser(user);

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },

  logout: () => {
    authStorage.clear();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user: User) => {
    authStorage.setUser(user);
    set({ user });
  },

  setToken: (token: string) => {
    authStorage.setToken(token);
    set({ token, isAuthenticated: true });
  },

  initializeAuth: () => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
