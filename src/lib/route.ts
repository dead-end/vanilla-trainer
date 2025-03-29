import { $ } from './utils';

const routes = new Map<string, string>();

const handleHashChange = () => {
  const hash = (window.location.hash || '#/').substring(1);
  const page = routes.get(hash) || 'not-found-page';
  const element = document.createElement(page);
  $('main').replaceChildren(element);
};

export const routesGet = () => {
  return routes;
};

export const routeRegister = (hash: string, page: string) => {
  routes.set(hash, page);
};

export const routeInit = () => {
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('DOMContentLoaded', handleHashChange);
};
