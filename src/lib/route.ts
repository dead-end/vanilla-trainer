import { adminIsLogin } from './admin';
import { TNav } from './types';
import { $ } from './utils';

const notFound: TNav = {
  hash: '*',
  label: 'Not Found',
  page: 'not-found-page',
};

const routes: TNav[] = [];

const handleHashChange = () => {
  let hash = window.location.hash || '#/';

  if (!adminIsLogin() && hash !== '#/admin') {
    window.location.hash = '#/admin';
    return;
  }

  const nav = routes.find((n) => n.hash === hash) || notFound;
  const element = document.createElement(nav.page);
  $('main').replaceChildren(element);
};

export const routesGet = () => {
  return routes;
};

export const routeRegister = (hash: string, label: string, page: string) => {
  routes.push({ hash, label, page });
};

export const routeInit = () => {
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('DOMContentLoaded', handleHashChange);
};
