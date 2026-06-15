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
