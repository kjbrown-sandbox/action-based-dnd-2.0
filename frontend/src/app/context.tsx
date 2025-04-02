"use client";

import React, { createContext, useState, useEffect } from "react";
import { Action, Character, LAST_USED_CHARACTER_ID } from "./types";
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

            console.log("localStorageCharacterID", localStorageCharacterID);
            const localCharacter = await getCharacterFromIndexedDB(
               idAsNumber || -1
            );
            console.log("localCharacter", localCharacter);

            if (localCharacter) {
               setCharacter(localCharacter);
               console.log("Found character in IndexedDB:", localCharacter);
            } else {
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
