export const errorGlobal = (msg: string) => {
  const event = new CustomEvent('error-msg', { detail: msg });
  document.dispatchEvent(event);
};

export class GlobalError extends Error {
  constructor(msg: string) {
    super(msg);
    errorGlobal(msg);
  }
}
