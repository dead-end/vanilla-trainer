import { adminIsLogin } from './admin';
import { TNav } from './types';
import { $ } from './utils';

const notFound: TNav = {
  hash: '*',
  page: 'not-found-page',
};

const routes: TNav[] = [];

const handleHashChange = async () => {
  let hash = window.location.hash || '#/';

  if (!(await adminIsLogin()) && hash !== '#/admin') {
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

export const routeRegister = (hash: string, page: string) => {
  routes.push({ hash, page });
};

export const routeInit = () => {
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('DOMContentLoaded', handleHashChange);
};
