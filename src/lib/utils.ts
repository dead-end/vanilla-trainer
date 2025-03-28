export const $ = <T extends Element>(
  query: string,
  root?: Document | DocumentFragment | HTMLElement
) => {
  if (!root) {
    root = document;
  }

  const result = root.querySelector(query);
  if (!result) {
    throw new Error('Mist');
  }
  return result as T;
};

export const tmplClone = (template: HTMLTemplateElement) => {
  return template.content.cloneNode(true) as DocumentFragment;
};

export const tmplCreate = (str: string) => {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = str;
  return tmpl;
};
