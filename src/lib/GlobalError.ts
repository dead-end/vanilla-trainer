// TODO: naming of the function / class : dispatchError
export const dispatchError = (msg: string) => {
  const event = new CustomEvent('error-msg', { detail: msg });
  document.dispatchEvent(event);
};

export class GlobalError extends Error {
  constructor(msg: string) {
    super(msg);
    dispatchError(msg);
  }
}
