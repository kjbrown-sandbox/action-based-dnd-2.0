"use client";

import React, { createContext, useState, useEffect } from "react";
import { Action, Character } from "./types";
import {
   saveActionToIndexedDB,
   getActionsFromIndexedDB,
   saveCharacterToIndexedDB,
   getCharacterFromIndexedDB,
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
            const localActions = await getActionsFromIndexedDB();
            setActions(localActions);

            const localCharacter = await getCharacterFromIndexedDB();
            if (localCharacter) {
               setCharacter(localCharacter);
            } else {
               const defaultCharacter: Character = {
                  name: "New Character",
                  level: 1,
                  class: "Fighter",
                  race: "Human",
                  background: "Soldier",
                  armorClass: 15,
                  initiativeBonus: 2,
                  speed: 30,
                  currentHP: 10,
                  maxHP: 10,
                  tempHP: 0,
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

   return (
      <AppContext.Provider
         value={{ actions, setActions, character, setCharacter }}
      >
         {children}
      </AppContext.Provider>
   );
}
