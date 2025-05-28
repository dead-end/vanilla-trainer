import {
  storeDel,
  storeGet,
  storeGetAll,
  storePut,
  storeTx,
} from '../persist/store';
import { TCache } from '../types';

const STORE = 'cache';

/**
 * The function returns an array of all cache entries.
 */
export const cacheEntryList = async () => {
  const storeRead = await storeTx(STORE, 'readonly');
  return await storeGetAll<TCache<any>>(storeRead);
};

/**
 * The function deletes the cache entry.
 */
export const cacheEntryDelete = async (path: string) => {
  const store = await storeTx(STORE, 'readwrite');
  await storeDel(store, path);
};

/**
 * The function creates or updates a cache entry.
 */
export const cacheEntryPut = async <T>(cache: TCache<T>) => {
  const storeWrite = await storeTx(STORE, 'readwrite');
  await storePut<TCache<T>>(storeWrite, {
    path: cache.path,
    data: cache.data,
    hash: cache.hash,
  });
};

/**
 * The function returns a cache entry or undefined.
 */
export const cacheEntryGet = async <T>(path: string) => {
  const storeRead = await storeTx(STORE, 'readonly');
  return await storeGet<TCache<T>>(storeRead, path);
};
