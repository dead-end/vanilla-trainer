import { errorGlobal } from './utils';

export class GlobalError extends Error {
  constructor(msg: string) {
    super(msg);
    errorGlobal(msg);
  }
}
