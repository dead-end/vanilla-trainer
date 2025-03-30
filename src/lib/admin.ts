import { TAdmin } from './types';

const STORE_KEY = 'admin';

export const adminIsLogin = () => {
  return localStorage.getItem(STORE_KEY) !== null;
};

export const adminLogin = (url: string, token: string) => {
  const admin: TAdmin = {
    url,
    token,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(admin));
};

export const adminLogout = () => {
  if (localStorage.getItem(STORE_KEY) !== null) {
    localStorage.removeItem(STORE_KEY);
  }
};
