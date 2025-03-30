import { Action } from "app/types";
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

export async function saveActionToIndexedDB(action: Action): Promise<void> {
   const db = await initDB();
   const tx = db.transaction(STORE_NAME, "readwrite");
   const store = tx.objectStore(STORE_NAME);

   // Check if the action already exists
   const existingAction = await store.get(action.id);

   if (existingAction) {
      // Update the existing action
      await store.put(action);
   } else {
      // Add a new action
      await store.add(action);
   }

   await tx.done;
}

export async function getActionsFromIndexedDB(): Promise<Action[]> {
   const db = await initDB();
   const tx = db.transaction(STORE_NAME, "readonly");
   const store = tx.objectStore(STORE_NAME);
   const allActions = await store.getAll();
   const allKeys = await store.getAllKeys();

   // Combine actions with their IDs
   return allActions.map((action, index) => ({
      ...action,
      id: allKeys[index],
   }));
}
