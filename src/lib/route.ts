import { adminIsLogin } from './admin';
import { TNav } from './types';
import { $ } from './utils/query';

const routes: TNav[] = [];
let routeParams: RegExpExecArray | null;
let indexHash: string;
let adminHash: string;
let notFound: string;

/**
 * The function returns a route parameter with a given name. If creates an
 * error if the parameter does not exist.
 */
export const getRouteParam = (name: string) => {
  if (!routeParams || !routeParams.groups) {
    const msg = `Route parameter: ${name} - No parameters found: ${window.location.hash}`;
    throw new Error(msg);
  }

  return routeParams.groups[name];
};

export const getRouteParams = (...names: string[]) => {
  return names.map((name) => getRouteParam(name));
};

/**
 * The function handles has changes. It only works if we have not found page
 * with an appropriate regex at the end of the nav list.
 */
const handleHashChange = async () => {
  let hash = window.location.hash || indexHash;

  if (!(await adminIsLogin()) && hash !== adminHash) {
    window.location.hash = adminHash;
    return;
  }

  const nav = routes.find((n) => n.regex.test(hash));
  if (nav) {
    routeParams = nav.regex.exec(window.location.hash);
  }

  const page = nav ? nav.page : notFound;

  //
  // Caching pages is easy, but the you have to reset all forms.
  //
  const element = document.createElement(page);

  $('main').replaceChildren(element);
};

/**
 * Register a new route.
 */
// TODO: Create a regex from a string: escape
export const routeRegister = (regex: RegExp, page: string) => {
  routes.push({ regex, page });
};

/**
 * Initialize the routes with the index and admin hash.
 */
export const routeInit = (
  _indexHash: string,
  _adminHash: string,
  _notFound: string
) => {
  indexHash = _indexHash;
  adminHash = _adminHash;
  notFound = _notFound;

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('DOMContentLoaded', handleHashChange);
};
