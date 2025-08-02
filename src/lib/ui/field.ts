import { TField } from '../types';
import { $, $$ } from '../utils/query';

export const fieldGet = (formData: FormData, id: string): TField => {
  const value = formData.get(id);

  if (typeof value === 'string') {
    return {
      id: id,
      value: value.trim(),
    };
  }
  throw new Error(`Unknown value: ${value} for key: ${id}`);
};

export const fieldErrorReset = (root: HTMLElement) => {
  $$('ui-field', root).forEach((f) => {
    f.removeAttribute('data-error');
  });
};

const fieldErrorSet = (root: HTMLElement, name: string, msg: string) => {
  $(`ui-field[data-id="${name}"]`, root).setAttribute('data-error', msg);
};

export const fieldErrorExists = (root: HTMLElement) => {
  return $$('ui-field', root).find((f) => f.hasAttribute('data-error'));
};

export const fieldRequired = (root: HTMLElement, field: TField) => {
  if (!field.value) {
    fieldErrorSet(root, field.id, 'Please enter a value!');
    return false;
  }
  return true;
};

export const fieldId = (root: HTMLElement, field: TField) => {
  if (!/^[-_a-zA-Z0-9.]+$/.test(field.value)) {
    fieldErrorSet(root, field.id, 'Please enter an id value!');
    return false;
  }
  return true;
};

export const fieldMinLen = (
  root: HTMLElement,
  field: TField,
  minLen: number
) => {
  if (field.value.length < minLen) {
    fieldErrorSet(
      root,
      field.id,
      `Input has to be at least ${minLen} characters!`
    );
    return false;
  }
  return true;
};
