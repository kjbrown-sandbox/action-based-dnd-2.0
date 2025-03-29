import { openDB } from "idb";

const DB_NAME = "ActionBasedDnD";
const STORE_NAME = "actions";

export async function initDB() {
   return openDB(DB_NAME, 1, {
      upgrade(db) {
         if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, {
               keyPath: "id",
               autoIncrement: true,
            });
         }
      },
   });
}

export async function saveActionToIndexedDB(action: any) {
   const db = await initDB();
   await db.add(STORE_NAME, action);
}

export async function getActionsFromIndexedDB() {
   const db = await initDB();
   return await db.getAll(STORE_NAME);
}
