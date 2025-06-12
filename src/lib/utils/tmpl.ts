/**
 * The funtion clones the template.
 */
export const tmplClone = (template: HTMLTemplateElement) => {
  return template.content.cloneNode(true) as DocumentFragment;
};

// TODO: Not used ??
export const tmplCreate = (str: string) => {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = str;
  return tmpl;
};
