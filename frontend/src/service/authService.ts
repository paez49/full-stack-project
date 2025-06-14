const TOKEN_KEY = 'authToken';

export const authService = {
  saveToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
   logout: () => {
    localStorage.setItem(TOKEN_KEY,"");
  },

};
