import { $, $$ } from '../utils';

export const fieldErrorReset = (root: HTMLElement) => {
  $$('ui-field', root).forEach((f) => {
    f.removeAttribute('data-error');
  });
};

export const fieldErrorSet = (root: HTMLElement, name: string, msg: string) => {
  $(`ui-field[data-id="${name}"]`, root).setAttribute('data-error', msg);
};

export const fieldErrorExists = (root: HTMLElement) => {
  return $$('ui-field', root).find((f) => f.hasAttribute('data-error'));
};
