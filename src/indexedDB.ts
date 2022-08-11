export default class IndexedDB {
  static open(name: string, version: number): Promise<IDBDatabase> {
    // Open DB
    const request = indexedDB.open(name, version);

    // Returns promise
    return new Promise((resolve, rejects) => {
      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onupgradeneeded = (e) => {
        const IDB = request.result;

        if (e.oldVersion < 1) {
          const objectStore = IDB.createObjectStore("todo", {
            keyPath: "_id",
            autoIncrement: true,
          });
          objectStore.createIndex("indexByContent", "content");
          objectStore.createIndex("indexByUpdated", "updated");
          objectStore.createIndex("indexByStart", "start");
          objectStore.createIndex("indexByEnd", "end");
        }
      };
    });
  }

  static create(
    DB: IDBDatabase,
    store: string,
    data: {}
  ): Promise<IDBValidKey> {
    // Open transaction
    const transaction = DB.transaction(store, "readwrite");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.add(data);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  static read(
    DB: IDBDatabase,
    store: string,
    query: IDBValidKey | IDBKeyRange
  ): Promise<any> {
    // Open transaction
    const transaction = DB.transaction(store, "readonly");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(query);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  static update(
    DB: IDBDatabase,
    store: string,
    query: IDBValidKey | IDBKeyRange,
    data: {}
  ): Promise<any> {
    // Open transaction
    const transaction = DB.transaction(store, "readwrite");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(query);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        const updateReq = objectStore.put(data);
        updateReq.onerror = () => {
          rejects(updateReq.error);
        };
        updateReq.onsuccess = () => {
          resolve(updateReq.result);
        };
      };
    });
  }

  static delete(
    DB: IDBDatabase,
    store: string,
    query: IDBValidKey | IDBKeyRange
  ): Promise<any> {
    // Open transaction
    const transaction = DB.transaction(store, "readwrite");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(query);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  static readAll(DB: IDBDatabase, store: string): Promise<any[]> {
    // Open transaction
    const transaction = DB.transaction(store, "readonly");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.openCursor();
      const result: any[] = [];

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          console.log(cursor.value);
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
    });
  }
}
