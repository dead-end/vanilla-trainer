import { errorGlobal } from '../GlobalError';
import { db } from './db';

/**
 * Function to get a store with a transaction.
 */
export const storeTx = async (
  store: string,
  mode: 'readonly' | 'readwrite'
) => {
  return (await db).transaction([store], mode).objectStore(store);
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
      errorGlobal(`Store: ${store.name} id: ${id} storeGet error: ${e}`);
      reject();
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
      errorGlobal(`Store: ${store.name} put: ${obj} error: ${e}`);
      reject();
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
      errorGlobal(`Store: ${store.name} delete: ${id} error: ${e}`);
      reject();
    };
  });
};

export const storeGetAll = <T>(store: IDBObjectStore) => {
  return new Promise<T[]>((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('Store:', store.name, 'get all');
      resolve(request.result);
    };

    request.onerror = (e) => {
      errorGlobal(`Store: ${store.name} get all: ${e}`);
      reject();
    };
  });
};
