import { TGithubConfig } from '../types';
import { storeDel, storeGet, storePut, storeTx } from '../persist/store';

const STORE = 'admin';

export const githubConfigGet = async () => {
  const store = await storeTx(STORE, 'readonly');
  const result = await storeGet<TGithubConfig>(store, 'github');
  if (result === undefined) {
    throw new Error('Unable to get github config.');
  }
  return result;
};

export const githubConfigUnsure = async () => {
  const store = await storeTx(STORE, 'readonly');
  return storeGet<TGithubConfig>(store, 'github');
};

export const githubConfigPut = async (config: TGithubConfig) => {
  const store = await storeTx(STORE, 'readwrite');
  return storePut<TGithubConfig>(store, config);
};

export const githubConfigDelete = async (id: string) => {
  const store = await storeTx(STORE, 'readwrite');
  return storeDel(store, id);
};
