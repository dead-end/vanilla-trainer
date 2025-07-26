/**
 * Simple function to create a DocumentFragment from a string.
 */
export const createFragment = (str: string) => {
  var tmpl = document.createElement('template');
  tmpl.innerHTML = str;
  return tmpl.content;
};
