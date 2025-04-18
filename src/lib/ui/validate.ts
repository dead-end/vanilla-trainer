import { fieldErrorSet } from './fieldError';

export const fieldRequired = (root: HTMLElement, id: string, value: string) => {
  if (!value) {
    fieldErrorSet(root, id, 'Please enter a value!');
    return false;
  }
  return true;
};

export const fieldId = (root: HTMLElement, id: string, value: string) => {
  if (!/^[_-a-zA-Z0-9]+$/.test(value)) {
    fieldErrorSet(root, id, 'Please enter an id value!');
    return false;
  }
  return true;
};
