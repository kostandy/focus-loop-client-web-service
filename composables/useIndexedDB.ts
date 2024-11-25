import { ref } from 'vue';
import { DB_NAME, STORE_NAME } from '~/constants/dbConstants';

export function useIndexedDB(dbName: string = DB_NAME, storeName: string = STORE_NAME) {
    const db = ref<IDBDatabase | null>(null);

    const openDB = async () => {
        if (db.value) {
            return db.value;
        }
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(storeName)) {
                    const objectStore = db.createObjectStore(storeName, { keyPath: 'id' });

                    objectStore.createIndex('title', 'title', { unique: false })
                }
            };

            request.onsuccess = () => {
                db.value = request.result;
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    };

    const saveTasks = async (tasks: Task[]) => {
        if (!db.value) {
            await openDB()
        };
        return new Promise<void>((resolve, reject) => {
            const transaction = db.value!.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);

            tasks.forEach(task => {
                store.put(JSON.parse(JSON.stringify(task)));
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    };

    const loadTasks = async (): Promise<Task[]> => {
        if (!db.value) {
            await openDB();
        }
        return new Promise<Task[]>((resolve, reject) => {
            const transaction = db.value!.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                console.log('Request to the IndexedDB is succeeded', request.result);
                resolve(request.result as Task[]);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    };

    return { openDB, loadTasks, saveTasks };
} 