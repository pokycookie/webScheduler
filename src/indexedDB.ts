import { IData, IUpdateOptions } from "./type";

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
          const todoStore = IDB.createObjectStore("todo", {
            keyPath: "_id",
            autoIncrement: true,
          });
          todoStore.createIndex("indexByContent", "content");
          todoStore.createIndex("indexByUpdated", "updated");
          todoStore.createIndex("indexByStart", "start");
          todoStore.createIndex("indexByEnd", "end");
        }
        if (e.oldVersion < 2) {
          const deletedStore = IDB.createObjectStore("completed", {
            keyPath: "_id",
            autoIncrement: true,
          });
          deletedStore.createIndex("updated", "updated");
        }
      };
    });
  }

  static create(DB: IDBDatabase, store: string, data: {}): Promise<IDBValidKey> {
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

  static read<T>(DB: IDBDatabase, store: string, query: IDBValidKey | IDBKeyRange): Promise<T> {
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
    query: IDBValidKey,
    data: IUpdateOptions
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
        const prevData: IData = request.result;

        if (typeof data.checked !== "undefined") {
          prevData.checked = data.checked;
        }
        if (typeof data.content !== "undefined") {
          prevData.content = data.content;
        }
        if (typeof data.updated !== "undefined") {
          prevData.updated = data.updated;
        }
        if (typeof data.start !== "undefined") {
          prevData.start = data.start;
        }
        if (typeof data.end !== "undefined") {
          prevData.end = data.end;
        }

        const updateReq = objectStore.put(prevData);
        updateReq.onerror = () => {
          rejects(updateReq.error);
        };
        updateReq.onsuccess = () => {
          console.log("updated");
          resolve(updateReq.result);
        };
      };
    });
  }

  static delete(DB: IDBDatabase, store: string, query: IDBValidKey | IDBKeyRange): Promise<any> {
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

  static move(DB: IDBDatabase, store1: string, store2: string, query: IDBValidKey | IDBKeyRange) {
    const transaction1 = DB.transaction(store1, "readwrite");

    return new Promise((resolve, rejects) => {
      const objectStore1 = transaction1.objectStore(store1);
      const data = objectStore1.get(query);
      const removeReq = objectStore1.delete(query);

      data.onsuccess = () => {
        removeReq.onsuccess = () => {
          const transaction2 = DB.transaction(store2, "readwrite");
          const objectStore2 = transaction2.objectStore(store2);

          if (data.result) {
            const createReq = objectStore2.add(data.result);

            createReq.onsuccess = () => {
              resolve(createReq.result);
            };
            createReq.onerror = () => {
              rejects(createReq.error);
            };
          }
        };
        removeReq.onerror = () => {
          rejects(removeReq.error);
        };
      };
      data.onerror = () => {
        rejects(data.error);
      };
    });
  }

  static readAll<T>(DB: IDBDatabase, store: string): Promise<T[]> {
    // Open transaction
    const transaction = DB.transaction(store, "readonly");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.openCursor();
      const result: T[] = [];

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
    });
  }
}
