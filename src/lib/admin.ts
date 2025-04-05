import { TAdmin } from './types';

const STORE_KEY = 'admin';

export const adminInit = () => {
  const event = adminIsLogin() ? new Event('login') : new Event('logout');
  document.dispatchEvent(event);
};

export const adminIsLogin = () => {
  return localStorage.getItem(STORE_KEY) !== null;
};

export const adminLogin = (user: string, repo: string, token: string) => {
  const admin: TAdmin = {
    user,
    repo,
    token,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(admin));
  document.dispatchEvent(new Event('login'));
};

export const adminLogout = () => {
  if (localStorage.getItem(STORE_KEY) !== null) {
    localStorage.removeItem(STORE_KEY);
    document.dispatchEvent(new Event('logout'));
  }
};

export const adminGet = () => {
  let result: TAdmin;

  const str = localStorage.getItem(STORE_KEY);
  if (!str) {
    result = {
      user: '',
      repo: '',
      token: '',
    };
    return result;
  }

  result = JSON.parse(str);
  return result;
};
