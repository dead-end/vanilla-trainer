/**
 * Dispatch an error so it can be displayed by ErrorMsg .
 */
export const dispatchError = (msg: string) => {
  const event = new CustomEvent('error-msg', { detail: msg });
  document.dispatchEvent(event);
};

/**
 * Throws an error which dispatches it. It is used in functions that return a
 * value other than void / undefined. Using dispatchError and then return the
 * function leads to a different return value type (undefined).
 */
export class GlobalError extends Error {
  constructor(msg: string) {
    super(msg);
    dispatchError(msg);
  }
}
