import { $ } from './utils';

const routes = new Map<string, string>();
routes.set('/', 'index-page');
routes.set('/admin', 'admin-page');

const handleHashChange = () => {
  const hash = (window.location.hash || '#/').substring(1);
  const page = routes.get(hash) || 'not-found-page';
  const element = document.createElement(page);
  $('main').replaceChildren(element);
};

export const routeRegister = (hash: string, page: string) => {
  routes.set(hash, page);
};

export const routeInit = () => {
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('DOMContentLoaded', handleHashChange);
};
