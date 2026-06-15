/**
 * Function to escape a string which is used in innerHtml.
 */
const escapeHtml_old = (unsafe: string) => {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

/**
 * Function to escape a string which is used in innerHtml.
 */
export const escapeHtml = (() => {
  const div = document.createElement('div');

  return (str: string) => {
    div.textContent = str;
    const escaped = div.innerHTML;
    div.textContent = '';
    return escaped;
  };
})();
