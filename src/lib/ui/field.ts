import { TField } from '../types';
import { fieldErrorSet } from './fieldError';

export const fieldGet = (formData: FormData, id: string): TField => {
  const value = formData.get(id);

  if (typeof value === 'string') {
    return {
      id: id,
      value: value,
    };
  }
  throw new Error(`Unknown value: ${value} for key: ${id}`);
};

export const fieldRequired = (root: HTMLElement, field: TField) => {
  if (!field.value) {
    fieldErrorSet(root, field.id, 'Please enter a value!');
    return false;
  }
  return true;
};

export const fieldId = (root: HTMLElement, field: TField) => {
  if (!/^[-_a-zA-Z0-9]+$/.test(field.value)) {
    fieldErrorSet(root, field.id, 'Please enter an id value!');
    return false;
  }
  return true;
};
