import { TCache, TGithubConfig, TQuestion } from '../types';
import {
  githubDelete,
  githubGetHash,
  githubGetUrl,
  githubReadContent,
  githubWriteContent,
} from './github';
import Result from '../result';
import { searchIndex } from '../search';
import { pathIsQuestions } from '../path';
import { bookListing } from '../model/book';
import { chapterListing } from '../model/chapter';
import { questionListing } from '../model/question';
import { entryDelete, entryGetCache, entryPut } from '../persist/entry';

// TODO: file name is wrong

/**
 * The function reads a path from the cache or from github.
 */
export const cachedGetPath = async <T>(config: TGithubConfig, path: string) => {
  const result = new Result<TCache<T>>();

  //
  // Read the file from the cache.
  //
  const data = await entryGetCache<T>(path);
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
  if (resultRead.hasError) {
    return result.setError(
      `cachedGetPath - unable to read data: ${resultRead.message}`
    );
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
  if (resultHash.hasError) {
    return result.setError(resultHash);
  }

  //
  // If the hash exists, then delete the file on github.
  // If the hash does not exist, then the file does not exist.
  //
  if (resultHash.value) {
    const resultDelete = await githubDelete(
      url,
      resultHash.value,
      comment,
      config.token
    );
    if (resultDelete.hasError) {
      return result.setError(resultDelete);
    }
  }

  await entryDelete(path, pathIsQuestions(path));

  return result.setOk();
};

// TODO: file name is wrong but not for this function
export const cacheAll = async () => {
  const arr: Promise<TQuestion[]>[] = [];
  const books = await bookListing();

  for (const book of books) {
    const chapters = await chapterListing(book.id);

    for (const chapter of chapters) {
      arr.push(questionListing(book.id, chapter.id));
    }
  }

  await Promise.all(arr);
};
