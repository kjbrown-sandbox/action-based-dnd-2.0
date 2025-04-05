import {
   Action,
   Attribute,
   ATTRIBUTE_LIST,
   Character,
   SKILL_LIST,
} from "app/types";
import { openDB } from "idb";
import { copyCharacter } from "./utils";

const DB_NAME = "ActionBasedDnD";
const ACTION_STORE = "actions";
const CHARACTER_STORE = "character";

export async function initDB() {
   return openDB(DB_NAME, 6, {
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

export async function getActionsFromIndexedDB(
   characterID: number
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
   c: Omit<Character, "id"> & { id?: number }
): Promise<Character> {
   const character = copyCharacter(c);

   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readwrite");
   const store = tx.objectStore(CHARACTER_STORE);

   if ((character.id || 0) <= 0) {
      delete character.id; // Remove the ID to allow auto-increment
   }

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

function sterilizeDatabaseCharacter(databaseCharacter: any): Character {
   //  const defaultCharacter: Character = {
   //                id: -1,
   //                name: "New Character",
   //                level: "1",
   //                class: "Fighter",
   //                race: "Human",
   //                background: "Soldier",
   //                armorClass: "15",
   //                initiativeBonus: "2",
   //                speed: "30",
   //                currentHP: "10",
   //                maxHP: "10",
   //                tempHP: "0",
   //                currentHitDice: "1d10",
   //                maxHitDice: "1d10",
   //                deathSaves: {
   //                   successes: 0,
   //                   failures: 0,
   //                },
   //                proficiency: 2,
   //                attributes: ATTRIBUTE_LIST.map((attr) => ({
   //                   [attr]: new Attribute(10), // Default value for each attribute
   //                })).reduce(
   //                   (acc, curr) => ({ ...acc, ...curr }),
   //                   {}
   //                ) as Character["attributes"],
   //                skillProficiencies: SKILL_LIST.reduce(
   //                   (acc, skill) => ({
   //                      ...acc,
   //                      [skill]: "none", // Default proficiency for each skill
   //                   }),
   //                   {}
   //                ) as Character["skillProficiencies"],

   const defaultCharacter: Character = {
      id: -1,
      name: "New Character",
      level: "1",
      class: "Fighter",
      race: "Human",
      background: "Soldier",
      armorClass: "15",
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
      attributes: ATTRIBUTE_LIST.map((attr) => ({
         [attr]: new Attribute(10),
      })).reduce(
         (acc, curr) => ({ ...acc, ...curr }),
         {}
      ) as Character["attributes"],
      skillProficiencies: SKILL_LIST.reduce(
         (acc, skill) => ({
            ...acc,
            [skill]: "none",
         }),
         {}
      ) as Character["skillProficiencies"],
   };

   const character: Character = {
      ...defaultCharacter,
      ...databaseCharacter,
      attributes: {
         ...defaultCharacter.attributes,
         ...databaseCharacter.attributes,
      },
      skillProficiencies: {
         ...defaultCharacter.skillProficiencies,
         ...databaseCharacter.skillProficiencies,
      },
   };
   return character;
}

export async function getCharacterFromIndexedDB(
   characterID: number
): Promise<Character | null> {
   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readonly");
   const store = tx.objectStore(CHARACTER_STORE);

   let character = await store.get(characterID); // Retrieve character by ID

   if (character) {
      // Reconstruct the attributes object
      character.attributes = ATTRIBUTE_LIST.reduce((acc, attr) => {
         acc[attr] = new Attribute(character[attr]);
         return acc;
      }, {} as Character["attributes"]);

      // Ensure proficiency is set
      character.proficiency = character.proficiency;
      character = sterilizeDatabaseCharacter(character); // Clean up the character object
   }

   return character || null; // Return the character or null if not found
}

export async function getAllCharactersFromIndexedDB(): Promise<Character[]> {
   const db = await initDB();
   const tx = db.transaction(CHARACTER_STORE, "readonly");
   const store = tx.objectStore(CHARACTER_STORE);

   const allCharacters = await store.getAll(); // Retrieve all characters
   return allCharacters; // Return all characters
}
