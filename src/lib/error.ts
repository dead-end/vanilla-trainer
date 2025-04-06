import { $, $$ } from './utils';

export const errorReset = (root: HTMLElement) => {
  $$('p[data-error]', root).forEach((p) => {
    p.style.display = 'none';
    p.textContent = '';
  });
};

export const errorSet = (root: HTMLElement, name: string, msg: string) => {
  const p = $(`p[data-error="${name}"]`, root);
  p.style.display = 'block';
  p.textContent = msg;
};

export const errorExists = (root: HTMLElement) => {
  return (
    $$('p[data-error]', root).find((p) => p.style.display !== 'none') !==
    undefined
  );
};
