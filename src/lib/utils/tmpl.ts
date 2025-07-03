/**
 * The funtion clones the template.
 */
export const tmplClone = (template: HTMLTemplateElement) => {
  return template.content.cloneNode(true) as DocumentFragment;
};
