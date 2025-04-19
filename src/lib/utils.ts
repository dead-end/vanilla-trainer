export const $ = <T extends Element>(
  query: string,
  root?: Document | DocumentFragment | HTMLElement
) => {
  if (!root) {
    root = document;
  }

  const result = root.querySelector(query);
  if (!result) {
    throw new Error(`Unable to find: ${query}`);
  }
  return result as T;
};

export const $$ = <T extends Element>(
  query: string,
  root?: Document | DocumentFragment | HTMLElement
) => {
  if (!root) {
    root = document;
  }

  const arr = [...root.querySelectorAll(query)];

  if (arr.length === 0) {
    throw new Error(`Unable to find: ${query}`);
  }
  return arr as T[];
};

export const tmplClone = (template: HTMLTemplateElement) => {
  return template.content.cloneNode(true) as DocumentFragment;
};

export const tmplCreate = (str: string) => {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = str;
  return tmpl;
};

export const errorGlobal = (msg: string) => {
  const event = new CustomEvent('error-msg', { detail: msg });
  document.dispatchEvent(event);
};
