import { TCache, TGithubConfig } from '../types';
import {
  githubDelete,
  githubGetHash,
  githubGetUrl,
  githubReadContent,
  githubWriteContent,
} from './github';
import Result from '../result';
import { storeDel, storeGet, storePut, storeTx } from '../persist/store';

const STORE = 'cache';

/**
 * The function reads a path from the cache or from github.
 */
export const cachedGetPath = async <T>(config: TGithubConfig, path: string) => {
  const result = new Result<TCache<T>>();

  //
  // Get the file from the cache and return it if it exists.
  //
  const storeRead = await storeTx(STORE, 'readonly');
  const data = await storeGet<TCache<T>>(storeRead, path);
  if (data) {
    return result.setOk(data);
  }

  //
  // Read the file from github.
  //
  const resultRead = await githubReadContent(
    githubGetUrl(config.user, config.repo, path),
    config.token
  );
  if (resultRead.hasError()) {
    return result.setError(
      `cachedGetPath - unable to read data: ${resultRead.getMessage()}`
    );
  }

  //
  // Create the result object.
  //
  const cache: TCache<T> = {
    path,
    data: JSON.parse(resultRead.getValue().content),
    hash: resultRead.getValue().hash,
  };

  //
  // Update the cache.
  //
  const storeWrite = await storeTx(STORE, 'readwrite');
  await storePut<TCache<T>>(storeWrite, {
    path: cache.path,
    data: cache.data,
    hash: cache.hash,
  });

  return result.setOk(cache);
};

/**
 * The function writes the file to github and updates the cache.
 */
export const cachePutPath = async <T>(
  config: TGithubConfig,
  path: string,
  data: T,
  hash: string | void,
  comment: string
) => {
  const result = new Result<T>();

  //
  // Write the content to github.
  //
  const resultWrite = await githubWriteContent(
    githubGetUrl(config.user, config.repo, path),
    JSON.stringify(data),
    hash,
    comment,
    config.token
  );
  if (resultWrite.hasError()) {
    return result.setError(resultWrite);
  }

  //
  // Update the cache.
  //
  const store = await storeTx(STORE, 'readwrite');
  await storePut<TCache<T>>(store, {
    path,
    data,
    hash: resultWrite.getValue(),
  });

  return result.setOk(data);
};

/**
 * The function deletes a file from gitbub and the cache.
 */
export const cacheDeletePath = async (
  config: TGithubConfig,
  path: string,
  comment: string
) => {
  const result = new Result<void>();
  const url = githubGetUrl(config.user, config.repo, path);

  //
  // Get the has value from github.
  //
  const resultHash = await githubGetHash(url, config.token);
  if (resultHash.hasError()) {
    return result.setError(resultHash);
  }

  //
  // If the hash exists, then delete the file on github.
  // If the hash does not exist, then the file does not exist.
  //
  if (resultHash.getValue()) {
    const resultDelete = await githubDelete(
      url,
      resultHash.getValue(),
      comment,
      config.token
    );
    if (resultDelete.hasError()) {
      return result.setError(resultDelete);
    }
  }

  //
  // Remove the file from the cache.
  //
  const store = await storeTx(STORE, 'readwrite');
  await storeDel(store, path);

  return result.setOk();
};
