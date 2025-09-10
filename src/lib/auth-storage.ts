import Cookies from 'js-cookie';

const TOKEN_KEY = 'conectar_token';
const USER_KEY = 'conectar_user';

export const authStorage = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 1, 
      secure: true, 
      sameSite: 'strict' 
    });
  },

  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || null;
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  setUser: (user: any) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  clear: () => {
    authStorage.removeToken();
    authStorage.removeUser();
  }
};
