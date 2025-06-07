import { db } from './db';
import { storeDel, storeGet, storeGetAll, storePut } from './store';
import { TCache, TSearch } from '../types';

const S_CACHE = 'cache';

const S_SEARCH = 'search';

/**
 * The function gets the list of cached entries.
 */
export const entryListCache = async () => {
  const store = (await db)
    .transaction([S_CACHE], 'readonly')
    .objectStore(S_CACHE);
  return await storeGetAll<TCache<any>>(store);
};

/**
 * The function gets the list of search index entries.
 */
export const entryListSearch = async () => {
  const store = (await db)
    .transaction([S_SEARCH], 'readonly')
    .objectStore(S_SEARCH);
  return await storeGetAll<TSearch>(store);
};

/**
 * The function gets a cache entry.
 */
export const entryGetCache = async <T>(path: string) => {
  const store = (await db)
    .transaction([S_CACHE], 'readonly')
    .objectStore(S_CACHE);
  return await storeGet<TCache<T>>(store, path);
};

/**
 * The function gets a search index entry.
 */
export const entryGetSearch = async (path: string) => {
  const store = (await db)
    .transaction([S_SEARCH], 'readonly')
    .objectStore(S_SEARCH);
  return await storeGet<TSearch>(store, path);
};

/**
 * The function deletes a cache entry and if necessary the corresponding search
 * index entry.
 */
export const entryDelete = async (path: string, both: boolean) => {
  const stores = both ? [S_CACHE, S_SEARCH] : [S_CACHE];
  const tx = (await db).transaction(stores, 'readwrite');

  await storeDel(tx.objectStore(S_CACHE), path);

  if (both) {
    await storeDel(tx.objectStore(S_SEARCH), path);
  }
};

/**
 * The function creates / updates a cache entry and if necessary the
 * corresponding search index entry.
 */
export const entryPut = async <T>(cache: TCache<T>, searchIdx?: TSearch) => {
  const stores = searchIdx ? [S_CACHE, S_SEARCH] : [S_CACHE];
  const tx = (await db).transaction(stores, 'readwrite');

  await storePut<TCache<T>>(tx.objectStore(S_CACHE), {
    path: cache.path,
    data: cache.data,
    hash: cache.hash,
  });

  if (searchIdx) {
    await storePut<TSearch>(tx.objectStore(S_SEARCH), searchIdx);
  }
};
