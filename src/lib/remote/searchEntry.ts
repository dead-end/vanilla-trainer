import {
  storeDel,
  storeGet,
  storeGetAll,
  storePut,
  storeTx,
} from '../persist/store';
import { TSearch } from '../types';

// TODO: combine searchEntry and cacheEntry
// Both are nearly identical. We can share a transaction for both.

const STORE = 'search';

export const searchEntryList = async () => {
  const storeRead = await storeTx(STORE, 'readonly');
  return await storeGetAll<TSearch>(storeRead);
};

/**
 * The function deletes the cache entry.
 */
export const searchEntryDelete = async (path: string) => {
  const store = await storeTx(STORE, 'readwrite');
  await storeDel(store, path);
};

/**
 * The function creates or updates the search index entry.
 */
export const searchEntryPut = async (searchIdx: TSearch) => {
  const storeWrite = await storeTx(STORE, 'readwrite');
  await storePut<TSearch>(storeWrite, searchIdx);
};

/**
 * The function returns a cache entry or undefined.
 */
export const searchEntryGet = async (path: string) => {
  const storeRead = await storeTx(STORE, 'readonly');
  return await storeGet<TSearch>(storeRead, path);
};
