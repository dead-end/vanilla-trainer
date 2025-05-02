import {
  githubConfigDelete,
  githubConfigPut,
  githubConfigUnsure,
} from './model/githubConfig';
import { TGithubConfig } from './types';

/**
 * The id of the object in the admin store.
 */
const STORE_ID = 'github';

let configPromise = githubConfigUnsure();

export const adminInit = async () => {
  document.dispatchEvent(
    (await configPromise) ? new Event('login') : new Event('logout')
  );
};

export const adminIsLogin = async () => {
  return (await configPromise) !== undefined;
};

export const adminLogin = async (user: string, repo: string, token: string) => {
  const githubConfig: TGithubConfig = {
    id: STORE_ID,
    user,
    repo,
    token,
  };
  configPromise = githubConfigPut(githubConfig);
  document.dispatchEvent(new Event('login'));
};

export const adminLogout = async () => {
  const config = await configPromise;
  if (config) {
    configPromise = githubConfigDelete(STORE_ID);
    document.dispatchEvent(new Event('logout'));
  }
};
