import {
   Action,
   Attribute,
   ATTRIBUTE_LIST,
   Character,
   SKILL_LIST,
   PROFICIENCY_LEVELS,
   Item,
} from "app/types";
import { openDB } from "idb";
import { copyCharacter } from "./utils";

const DB_NAME = "ActionBasedDnD";
const ACTION_STORE = "actions";
const CHARACTER_STORE = "character";
const ITEMS_STORE = "items";

export async function initDB() {
   return openDB(DB_NAME, 7, {
      upgrade(db, oldVersion, newVersion, transaction) {
         // Action
         if (!db.objectStoreNames.contains(ACTION_STORE)) {
            db.createObjectStore(ACTION_STORE, {
               keyPath: "id",
               autoIncrement: true,
            });
         }

         const actionStore = transaction.objectStore(ACTION_STORE);
         if (!actionStore.indexNames.contains("characterID")) {
            actionStore.createIndex("characterID", "characterID", {
               unique: false,
            }); // Add index on characterID
         }

         // Character
         if (!db.objectStoreNames.contains(CHARACTER_STORE)) {
            db.createObjectStore(CHARACTER_STORE, {
               keyPath: "id",
               autoIncrement: true,
            });
         }

         // Items
         if (!db.objectStoreNames.contains(ITEMS_STORE)) {
            db.createObjectStore(ITEMS_STORE, {
               keyPath: "id",
               autoIncrement: true,
            });
         }

         const itemStore = transaction.objectStore(ITEMS_STORE);
         if (!itemStore.indexNames.contains("characterID")) {
            itemStore.createIndex("characterID", "characterID", {
               unique: false,
            }); // Add index on characterID
         }
      },
   });
}

export async function saveActionToIndexedDB(action: Action): Promise<Action> {
   const db = await initDB();
   const tx = db.transaction(ACTION_STORE, "readwrite");
   const store = tx.objectStore(ACTION_STORE);

   let actionId: number;

   // Check if the action already exists
   const existingAction = await store.get(action.id);
   if (existingAction) {
      // Update the existing action
      await store.put(action);
      actionId = action.id;
   } else {
      // Add a new action
      actionId = (await store.add(action)).valueOf() as number;
   }

   await tx.done;

   // Return the newly created/updated action
   return { ...action, id: actionId };
}

export async function getActionsFromIndexedDB(characterID: number): Promise<Action[]> {
   const db = await initDB();
   const tx = db.transaction(ACTION_STORE, "readonly");
   const store = tx.objectStore(ACTION_STORE);
   const index = store.index("characterID");
   const actions = await index.getAll(characterID); // Fetch actions by characterID
   await tx.done;
   return actions;
}

export async function saveCharacterToIndexedDB(c: Character): Promise<Character> {
   const character = copyCharacter(c);

   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readwrite");
   const store = tx.objectStore(CHARACTER_STORE);

   // Save to IndexedDB
   const existingCharacter = await store.get(character?.id || "");
   let characterId = character.id;
   if (existingCharacter) {
      await store.put(character);
   } else {
      const newId = await store.add(character);
      characterId = newId.valueOf() as number;
   }
   await tx.done;

   return { ...character, id: characterId! };
}

function sterilizeDatabaseCharacter(dbCharacter: any): Character {
   const defaultCharacter: Partial<Character> = {
      id: -1,
      name: "New Character",
      level: "1",
      class: "Fighter",
      race: "Human",
      background: "Soldier",
      armorClass: "10",
      initiativeBonus: "2",
      speed: "30",
      currentHP: "10",
      maxHP: "10",
      tempHP: "0",
      currentHitDice: "1d10",
      maxHitDice: "1d10",
      deathSaves: {
         successes: 0,
         failures: 0,
      },
      proficiency: 2,
   };

   // Sterilize attributes
   dbCharacter.attributes = dbCharacter.attributes || {};
   ATTRIBUTE_LIST.forEach((attr) => {
      if (!dbCharacter.attributes[attr]) {
         dbCharacter.attributes[attr] = new Attribute(10); // Default to 10 if missing
      } else if (!(dbCharacter.attributes[attr] instanceof Attribute)) {
         dbCharacter.attributes[attr] = new Attribute(dbCharacter.attributes[attr].amount || 10);
      }
   });

   // Sterilize skills
   dbCharacter.skillProficiencies = dbCharacter.skillProficiencies || {};
   SKILL_LIST.forEach((skill) => {
      if (!dbCharacter.skillProficiencies[skill]) {
         dbCharacter.skillProficiencies[skill] = "No proficiency";
      }
      if (!Object.values(PROFICIENCY_LEVELS).includes(dbCharacter.skillProficiencies[skill])) {
         dbCharacter.skillProficiencies[skill] = "No proficiency";
      }
   });

   const character: Character = {
      ...defaultCharacter,
      ...dbCharacter,
      deathSaves: {
         successes: dbCharacter.deathSaves?.successes || 0,
         failures: dbCharacter.deathSaves?.failures || 0,
      },
   };
   return character;
}

export async function getCharacterFromIndexedDB(characterID: number): Promise<Character | null> {
   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readonly");
   const store = tx.objectStore(CHARACTER_STORE);

   let character = await store.get(characterID);

   if (character) {
      character = sterilizeDatabaseCharacter(character); // Clean up the character object
   }

   return character || null;
}

export async function getAllCharactersFromIndexedDB(): Promise<Character[]> {
   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readonly");
   const store = tx.objectStore(CHARACTER_STORE);

   const allCharacters = await store.getAll();
   return allCharacters;
}

export async function saveItemToIndexedDB(item: Omit<Item, "id"> & { id?: number }): Promise<Item> {
   const db = await initDB();
   const tx = db.transaction(ITEMS_STORE, "readwrite");
   const store = tx.objectStore(ITEMS_STORE);

   let itemId: number;

   // Check if the item already exists
   const existingItem = await store.get(item.id || 0);
   if (existingItem) {
      await store.put(item);
      itemId = item.id!;
   } else {
      itemId = (await store.add(item)).valueOf() as number;
   }

   await tx.done;

   return { ...item, id: itemId };
}

export async function getItemsFromIndexedDB(characterID: number): Promise<Item[]> {
   const db = await initDB();
   const tx = db.transaction(ITEMS_STORE, "readonly");
   const store = tx.objectStore(ITEMS_STORE);

   const allItems = await store.getAll();
   return allItems.filter((item) => item.characterID === characterID);
}
