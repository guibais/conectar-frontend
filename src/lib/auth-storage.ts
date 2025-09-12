import secureLocalStorage from 'react-secure-storage';

const TOKEN_KEY = 'conectar_token';
const USER_KEY = 'conectar_user';

export const authStorage = {
  setToken: (token: string) => {
    secureLocalStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    const token = secureLocalStorage.getItem(TOKEN_KEY);
    return typeof token === 'string' ? token : null;
  },

  removeToken: () => {
    secureLocalStorage.removeItem(TOKEN_KEY);
  },

  setUser: (user: any) => {
    secureLocalStorage.setItem(USER_KEY, user);
  },

  getUser: () => {
    return secureLocalStorage.getItem(USER_KEY);
  },

  removeUser: () => {
    secureLocalStorage.removeItem(USER_KEY);
  },

  clear: () => {
    authStorage.removeToken();
    authStorage.removeUser();
  }
};
