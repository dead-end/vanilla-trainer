import { pathIsQuestions } from '../location/path';
import { entryDelete, entryGetCache, entryPut } from '../persist/entry';
import Result from '../result';
import { searchIndex } from '../search';
import { TCache, TGithubConfig, TQuestion } from '../types';
import {
  githubDelete,
  githubGetUrl,
  githubReadContent,
  githubWriteContent,
} from './github';

/**
 * The function get the json form a github file (or the cache).
 */
export const jsonGet = async <T>(config: TGithubConfig, path: string) => {
  const result = new Result<TCache<T>>();

  const data = await entryGetCache<T>(path);
  if (data) {
    return result.setOk(data);
  }

  const resultRead = await githubReadContent(
    githubGetUrl(config.user, config.repo, path),
    config.token
  );
  if (resultRead.hasError) {
    return result.setError(`jsonGet - ${resultRead.message}`);
  }

  const cache: TCache<T> = {
    path,
    data: JSON.parse(resultRead.value.content),
    hash: resultRead.value.hash,
  };

  const searchIdx = pathIsQuestions(path)
    ? searchIndex(path, cache.data as TQuestion[], cache.hash)
    : undefined;
  entryPut(cache, searchIdx);

  return result.setOk(cache);
};

/**
 * The function writes the json to github and updates the cache.
 */
export const jsonPut = async <T>(
  config: TGithubConfig,
  path: string,
  data: T,
  hash: string | void,
  comment: string
) => {
  const result = new Result<T>();

  const resultWrite = await githubWriteContent(
    githubGetUrl(config.user, config.repo, path),
    JSON.stringify(data),
    hash,
    comment,
    config.token
  );
  if (resultWrite.hasError) {
    return result.setError(resultWrite);
  }

  const cache: TCache<T> = {
    path,
    data,
    hash: resultWrite.value,
  };

  const searchIdx = pathIsQuestions(path)
    ? searchIndex(path, cache.data as TQuestion[], cache.hash)
    : undefined;
  entryPut(cache, searchIdx);

  return result.setOk(data);
};

/**
 * The function deletes a file from gitbub and the cache.
 */
export const jsonDelete = async <T>(
  config: TGithubConfig,
  path: string,
  comment: string
) => {
  const result = new Result<void>();

  const resGet = await jsonGet<T>(config, path);
  if (resGet.hasError) {
    return result.setError(resGet.message);
  }

  const resultDelete = await githubDelete(
    githubGetUrl(config.user, config.repo, path),
    resGet.value.hash,
    comment,
    config.token
  );
  if (resultDelete.hasError) {
    return result.setError(resultDelete);
  }

  await entryDelete(path, pathIsQuestions(path));

  return result.setOk();
};
