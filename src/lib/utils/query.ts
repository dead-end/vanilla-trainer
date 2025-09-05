import { GlobalError } from '../GlobalError';

/**
 * Simple jquery clone :)
 */
export const $ = <T extends Element>(
  query: string,
  root?: Document | DocumentFragment | HTMLElement
) => {
  if (!root) {
    root = document;
  }

  const result = root.querySelector(query);
  if (!result) {
    throw new GlobalError(`Unable to find: ${query}`);
  }
  return result as T;
};

/**
 * Simple jquery clone :)
 */
export const $$ = <T extends Element>(
  query: string,
  root?: Document | DocumentFragment | HTMLElement
) => {
  if (!root) {
    root = document;
  }

  const arr = [...root.querySelectorAll(query)];

  if (arr.length === 0) {
    throw new GlobalError(`Unable to find: ${query}`);
  }
  return arr as T[];
};
