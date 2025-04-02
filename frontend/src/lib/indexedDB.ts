import { Action, Character } from "app/types";
import { openDB } from "idb";

const DB_NAME = "ActionBasedDnD";
const ACTION_STORE = "actions";
const CHARACTER_STORE = "character";

export async function initDB() {
   return openDB(DB_NAME, 4, {
      upgrade(db) {
         if (!db.objectStoreNames.contains(ACTION_STORE)) {
            const store = db.createObjectStore(ACTION_STORE, {
               keyPath: "id",
               autoIncrement: true,
            });
            if (!store.indexNames.contains("characterID")) {
               store.createIndex("characterID", "characterID"); // Add index on characterID
            }
         }
         if (!db.objectStoreNames.contains(CHARACTER_STORE)) {
            db.createObjectStore(CHARACTER_STORE, {
               keyPath: "id",
               autoIncrement: true,
            });
         }
      },
   });
}

export async function saveActionToIndexedDB(action: Action): Promise<Action> {
   const db = await initDB();
   const tx = db.transaction(ACTION_STORE, "readwrite");
   const store = tx.objectStore(ACTION_STORE);

   let actionId: string;

   // Check if the action already exists
   const existingAction = await store.get(action.id);
   if (existingAction) {
      // Update the existing action
      await store.put(action);
      actionId = action.id;
   } else {
      // Add a new action
      actionId = (await store.add(action)) as string;
   }

   await tx.done;

   // Return the newly created/updated action
   return { ...action, id: actionId };
}

export async function getActionsFromIndexedDB(
   characterID: string
): Promise<Action[]> {
   const db = await initDB();
   const tx = db.transaction(ACTION_STORE, "readonly");
   const store = tx.objectStore(ACTION_STORE);
   const index = store.index("characterID");
   const actions = await index.getAll(characterID); // Fetch actions by characterID
   await tx.done;
   return actions;
}

export async function saveCharacterToIndexedDB(
   character: Character
): Promise<Character> {
   console.log("saving this character", character);

   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readwrite");
   const store = tx.objectStore(CHARACTER_STORE);

   // Update the existing action
   await store.put(character);

   await tx.done;

   // Return the newly created/updated action
   return character;
}

export async function getCharacterFromIndexedDB(): Promise<Character | null> {
   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readonly");
   const store = tx.objectStore(CHARACTER_STORE);

   const allCharacters = await store.getAll(); // Retrieve all characters
   return allCharacters.length > 0 ? allCharacters[0] : null; // Return the first character or null
}
