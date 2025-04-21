import { adminIsLogin } from './admin';
import { errorGlobal } from './utils';
import { TNav } from './types';
import { $ } from './utils';

const routes: TNav[] = [];
let routeParams: RegExpExecArray | null;
let indexHash: string;
let adminHash: string;
let notFound: string;

const cache = new Map<string, HTMLElement>();

/**
 * The function returns a route parameter with a given name. If creates an
 * error if the parameter does not exist.
 */
export const getRouteParam = (name: string) => {
  if (!routeParams || !routeParams.groups) {
    errorGlobal(
      `Route parameter: ${name} - No parameters found: ${window.location.hash}`
    );
    return null;
  }

  return routeParams.groups[name];
};

/**
 * We use a cache for the HTMLElements of the pages.
 */
const getPageElement = (page: string) => {
  let element = cache.get(page);
  if (!element) {
    element = document.createElement(page);
    cache.set(page, element);
  }
  return element;
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

  let element = getPageElement(page);

  $('main').replaceChildren(element);
};

/**
 * Register a new route.
 *
 * TODO: Create a regex from a string: escape
 */
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
