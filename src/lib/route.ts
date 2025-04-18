import { adminIsLogin } from './admin';
import { errorGlobal } from './utils';
import { TNav } from './types';
import { $ } from './utils';

const routes: TNav[] = [];
let routeParams: RegExpExecArray | null;
let indexHash: string;
let adminHash: string;

/**
 * The function returns a route parameter with a given name. If creates an
 * error if the parameter does not exist.
 */
export const getRouteParam = (name: string) => {
  if (!routeParams) {
    errorGlobal(
      `Route parameter: ${name} - No parameters found: ${window.location.hash}`
    );
    return null;
  }
  if (!routeParams.groups) {
    errorGlobal(
      `Route parameter: ${name} - This parameter not found: ${window.location.hash}`
    );
    return null;
  }

  return routeParams.groups[name];
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

  const nav = routes.find((n) => n.regex.test(window.location.hash)) as TNav;

  routeParams = nav.regex.exec(window.location.hash);

  const element = document.createElement(nav.page);
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
export const routeInit = (idxHash: string, admhash: string) => {
  indexHash = idxHash;
  adminHash = admhash;
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('DOMContentLoaded', handleHashChange);
};
