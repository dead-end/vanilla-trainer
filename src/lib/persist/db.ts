const DB_VERSION = 1;

/**
 * The function creates the db tables / stores and adds initial values if
 * necessary.
 */
const initAndUpdate = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains('cache')) {
    db.createObjectStore('cache', {
      keyPath: 'path',
    });
  }

  if (!db.objectStoreNames.contains('admin')) {
    const store = db.createObjectStore('admin', {
      keyPath: 'id',
    });

    store.add({
      id: 'github',
      user: '',
      repo: '',
      token: '',
    });
  }
};

/**
 * The function initializes the indexed db.
 */
export const dbInit = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('trainer', DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;

      if (event.oldVersion < DB_VERSION) {
        initAndUpdate(db);
      }

      console.log('db upgrade success!');
    };

    request.onerror = (event: Event) => {
      console.error(event.type);
      reject();
    };

    request.onsuccess = () => {
      const db = request.result;

      db.onerror = (event: Event) => {
        console.log(event.type);
      };
      console.log('db init success!');
      resolve(db);
    };
  });
};

export const db = dbInit();
