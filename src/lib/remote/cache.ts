import { TGithubConfig, TGithubListingResult, TQuestion } from '../types';
import { githubGetUrl, githubListing } from './github';
import { bookListing } from '../model/book';
import { chapterListing } from '../model/chapter';
import { questionListing } from '../model/question';
import { entryDelete, entryGetCache, entryListCache } from '../persist/entry';
import { githubConfigGet } from '../model/githubConfig';
import { dispatchError, GlobalError } from '../GlobalError';
import { pathRoot } from '../location/path';

/**
 * The function reads all files from cache and if one is missing from github.
 * Afer this call, the cache should be filled.
 */
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

/**
 * The function retuns a formatted string with the json of the cache.
 */
export const cacheGetRaw = async (path: string) => {
  const data = await entryGetCache<any>(path);
  if (!data) {
    throw new GlobalError(`Unable to get from cache: ${path}`);
  }

  return JSON.stringify(data.data, null, 2);
};

/**
 * The funtion is recurcivelly called to get all hashes from github.
 *
 * The result is shared and not locked.
 */
const cacheListing = async (
  result: TGithubListingResult,
  config: TGithubConfig,
  path: string
) => {
  const resRead = await githubListing(
    githubGetUrl(config.user, config.repo, path),
    config.token
  );
  if (resRead.hasError) {
    result.error = `cacheListing - ${resRead.message}`;
    return;
  }

  result.listing.push(...resRead.value);

  const promises: Promise<void>[] = [];

  for (const entry of resRead.value) {
    if (entry.type === 'dir') {
      promises.push(cacheListing(result, config, entry.path));
    }
  }

  await Promise.all(promises);
};

/**
 * The functions reads the hashes from github and checks the cache. All cache
 * entries, which are not found on github or which have a different hash are
 * deleted.
 */
export const cacheCheckHashes = async () => {
  const config = await githubConfigGet();
  const result: TGithubListingResult = {
    error: undefined,
    listing: [],
  };

  await cacheListing(result, config, pathRoot());
  if (result.error) {
    dispatchError(result.error);
    return;
  }

  const dbListing = await entryListCache();

  for (const dbEntry of dbListing) {
    const ghEntry = result.listing.find((e) => e.path === dbEntry.path);
    if (!ghEntry || dbEntry.hash !== ghEntry.sha) {
      await entryDelete(dbEntry.path, true);
    }
  }
};
