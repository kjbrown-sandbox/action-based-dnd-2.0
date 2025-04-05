"use client";

import React, { createContext, useState, useEffect } from "react";
import {
   Action,
   Attribute,
   ATTRIBUTE_LIST,
   Character,
   LAST_USED_CHARACTER_ID,
   SKILL_LIST,
} from "./types";
import {
   saveActionToIndexedDB,
   getActionsFromIndexedDB,
   saveCharacterToIndexedDB,
   getCharacterFromIndexedDB,
   getAllCharactersFromIndexedDB,
} from "../lib/indexedDB";

// Define the context
export const AppContext = createContext<{
   actions: Action[];
   setActions: React.Dispatch<React.SetStateAction<Action[]>>;
   character: Character | null;
   setCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
   const [actions, setActions] = useState<Action[]>([]);
   const [character, setCharacter] = useState<Character | null>(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const localStorageCharacterID = localStorage.getItem(
               LAST_USED_CHARACTER_ID
            );
            const idAsNumber = Number(localStorageCharacterID);
            if (isNaN(idAsNumber)) {
               console.error(
                  "Invalid character ID in localStorage. Expected a number."
               );
               return;
            }

            const localCharacter = await getCharacterFromIndexedDB(
               idAsNumber || -1
            );

            if (localCharacter) {
               setCharacter(localCharacter);
            } else {
               const defaultAttributes = ATTRIBUTE_LIST.map((attr) => ({
                  [attr]: new Attribute(10), // Default value for each attribute
               })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
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
                     [attr]: new Attribute(10), // Default value for each attribute
                  })).reduce(
                     (acc, curr) => ({ ...acc, ...curr }),
                     {}
                  ) as Character["attributes"],
                  skillProficiencies: SKILL_LIST.reduce(
                     (acc, skill) => ({
                        ...acc,
                        [skill]: "none", // Default proficiency for each skill
                     }),
                     {}
                  ) as Character["skillProficiencies"],
               };
               setCharacter(defaultCharacter);
               await saveCharacterToIndexedDB(defaultCharacter);
            }
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, []);

   useEffect(() => {
      const fetchActions = async () => {
         try {
            if (character) {
               const localActions = await getActionsFromIndexedDB(character.id);
               setActions(localActions);
            }
         } catch (error) {
            console.error("Error fetching actions:", error);
         }
      };

      fetchActions();
   }, [character]);

   return (
      <AppContext.Provider
         value={{ actions, setActions, character, setCharacter }}
      >
         {children}
      </AppContext.Provider>
   );
}
