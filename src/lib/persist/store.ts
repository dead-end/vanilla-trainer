import { db } from './db';

/**
 * Function to get a store with a transaction.
 */
export const storeTx = async (
  store: string,
  mode: 'readonly' | 'readwrite',
  stores?: string[]
) => {
  const s = stores ? stores : [store];
  return (await db).transaction(s, mode).objectStore(store);
};

/**
 * The function reads an object from indexed db.
 */
export const storeGet = <T>(store: IDBObjectStore, id: string) => {
  return new Promise<T | undefined>((resolve, reject) => {
    const request = store.get(id);

    request.onsuccess = () => {
      console.log(
        'Store:',
        store.name,
        'id:',
        id,
        'get:',
        request.result ? request.result : 'NOT-FOUND'
      );
      resolve(request.result);
    };

    request.onerror = (e) => {
      reject(`Store: ${store.name} id: ${id} storeGet error: ${e}`);
    };
  });
};

/**
 * The function writes an object to indexed db.
 */
export const storePut = <T>(store: IDBObjectStore, obj: T) => {
  return new Promise<T>((resolve, reject) => {
    const request = store.put(obj);

    request.onsuccess = () => {
      console.log('Store:', store.name, 'put:', obj);
      resolve(obj);
    };

    request.onerror = (e) => {
      reject(`Store: ${store.name} put: ${obj} error: ${e}`);
    };
  });
};

/**
 * The function deletes an object from the indexed db.
 */
export const storeDel = (store: IDBObjectStore, id: IDBValidKey) => {
  return new Promise<undefined>((resolve, reject) => {
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('Store:', store.name, 'delete:', id);
      resolve(request.result);
    };

    request.onerror = (e) => {
      reject(`Store: ${store.name} delete: ${id} error: ${e}`);
    };
  });
};
