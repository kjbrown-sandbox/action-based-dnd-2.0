"use client";

import { Divider } from "@/components/ui/Divider";
import { useContext, useEffect, useState } from "react";
import {
   saveCharacterToIndexedDB,
   getCharacterFromIndexedDB,
   getAllCharactersFromIndexedDB,
} from "../lib/indexedDB";
import { AppContext } from "./context";
import "./globals.css";
import { Attribute, Character, LAST_USED_CHARACTER_ID } from "./types";
import InputSmartNumber from "@/components/ui/inputSmartNumber";
import { Autocomplete } from "@/components/ui/Autocomplete";

export default function Navbar() {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { character, setCharacter } = context;
   const [allCharacters, setAllCharacters] = useState<Character[]>([]);

   useEffect(() => {
      const fetchCharacters = async () => {
         const characters = await getAllCharactersFromIndexedDB(); // Fetch all characters
         setAllCharacters(characters); // Assuming single character for now
      };

      fetchCharacters();
   }, [character]);

   const handleCharacterChange = async (key: keyof Character, value: any) => {
      if (!character) return;
      const updatedCharacter = { ...character, [key]: value };
      setCharacter(updatedCharacter);
      localStorage.setItem(LAST_USED_CHARACTER_ID, `${updatedCharacter.id}`); // Save the character ID to local storage
      await saveCharacterToIndexedDB(updatedCharacter);
   };

   const handleCharacterSelect = async (id: string) => {
      const idAsNumber = Number(id);
      const selectedCharacter = allCharacters.find((char) => char.id === idAsNumber);
      if (selectedCharacter) {
         setCharacter(selectedCharacter);
      }
   };

   return (
      <>
         {/* Navbar */}
         <div className="bg-contrast-0 p-4 m-4 flex rounded justify-between items-start gap-8">
            {character ? (
               <>
                  {/* Character Selection */}
                  <div className="w-full mb-4">
                     <label className="block font-bold mb-2">Select Character:</label>
                     <Autocomplete
                        items={allCharacters.map((char) => ({
                           value: char.id.toString(),
                           label: char.name,
                        }))}
                        onSelect={handleCharacterSelect}
                        placeholder="Select a character"
                        value={character.id.toString()}
                     />
                  </div>

                  {/* First Section */}
                  <div className="flex flex-col gap-2">
                     <div>
                        <label className="block font-bold">Name:</label>
                        <input
                           type="text"
                           value={character.name}
                           onChange={(e) => handleCharacterChange("name", e.target.value)}
                           onBlur={(e) => handleCharacterChange("name", e.target.value)}
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block font-bold">Level:</label>
                           <InputSmartNumber
                              value={character.level}
                              onChange={(e) => handleCharacterChange("level", e.target.value)}
                              onBlur={(e) => handleCharacterChange("level", e.target.value)}
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                        <div>
                           <label className="block font-bold">Class:</label>
                           <input
                              type="text"
                              value={character.class}
                              onChange={(e) => handleCharacterChange("class", e.target.value)}
                              onBlur={(e) => handleCharacterChange("class", e.target.value)}
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                        <div>
                           <label className="block font-bold">Race:</label>
                           <input
                              type="text"
                              value={character.race}
                              onChange={(e) => handleCharacterChange("race", e.target.value)}
                              onBlur={(e) => handleCharacterChange("race", e.target.value)}
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                        <div>
                           <label className="block font-bold">Background:</label>
                           <input
                              type="text"
                              value={character.background || ""}
                              onChange={(e) => handleCharacterChange("background", e.target.value)}
                              onBlur={(e) => handleCharacterChange("background", e.target.value)}
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                     </div>
                  </div>

                  <Divider orientation="vertical" size="lg" />
                  {/* Middle Section */}
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block font-bold">Armor Class:</label>
                        <input
                           type="number"
                           value={character.armorClass}
                           onChange={(e) =>
                              handleCharacterChange("armorClass", parseInt(e.target.value))
                           }
                           onBlur={(e) =>
                              handleCharacterChange("armorClass", parseInt(e.target.value))
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Initiative Bonus:</label>
                        <input
                           type="number"
                           value={character.initiativeBonus}
                           onChange={(e) =>
                              handleCharacterChange("initiativeBonus", parseInt(e.target.value))
                           }
                           onBlur={(e) =>
                              handleCharacterChange("initiativeBonus", parseInt(e.target.value))
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Speed:</label>
                        <input
                           type="number"
                           value={character.speed}
                           onChange={(e) =>
                              handleCharacterChange("speed", parseInt(e.target.value))
                           }
                           onBlur={(e) => handleCharacterChange("speed", parseInt(e.target.value))}
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Proficiency:</label>
                        <InputSmartNumber
                           value={character.proficiency}
                           onChange={(e) =>
                              handleCharacterChange("proficiency", parseInt(e.target.value))
                           }
                           onBlur={(e) =>
                              handleCharacterChange("proficiency", parseInt(e.target.value))
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                  </div>

                  {/* New Section: Hit Dice */}
                  <div className="flex flex-col gap-2">
                     <div>
                        <label className="block font-bold">Current Hit Dice:</label>
                        <input
                           type="text"
                           value={character.currentHitDice}
                           onChange={(e) => handleCharacterChange("currentHitDice", e.target.value)}
                           onBlur={(e) => handleCharacterChange("currentHitDice", e.target.value)}
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Max Hit Dice:</label>
                        <input
                           type="text"
                           value={character.maxHitDice}
                           onChange={(e) => handleCharacterChange("maxHitDice", e.target.value)}
                           onBlur={(e) => handleCharacterChange("maxHitDice", e.target.value)}
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                  </div>

                  {/* Last Section */}
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block font-bold">Current HP:</label>
                        <input
                           type="number"
                           value={character.currentHP}
                           onChange={(e) =>
                              handleCharacterChange("currentHP", parseInt(e.target.value))
                           }
                           onBlur={(e) =>
                              handleCharacterChange("currentHP", parseInt(e.target.value))
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Max HP:</label>
                        <input
                           type="number"
                           value={character.maxHP}
                           onChange={(e) =>
                              handleCharacterChange("maxHP", parseInt(e.target.value))
                           }
                           onBlur={(e) => handleCharacterChange("maxHP", parseInt(e.target.value))}
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Temp HP:</label>
                        <input
                           type="number"
                           value={character.tempHP || 0}
                           onChange={(e) =>
                              handleCharacterChange("tempHP", parseInt(e.target.value))
                           }
                           onBlur={(e) => handleCharacterChange("tempHP", parseInt(e.target.value))}
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                  </div>

                  {/* New Section: Attributes */}
                  {/* <div className="grid grid-cols-6 gap-4">
                     {Object.entries(character.attributes).map(
                        ([key, attr]) => (
                           <div
                              key={key}
                              className="flex flex-col items-center"
                           >
                              <div className="text-sm font-bold mb-1">
                                 {key.toUpperCase()}
                              </div>
                              <div className="bg-contrast-2 text-white w-16 h-16 flex items-center justify-center rounded">
                                 {attr.getModifierString()}
                              </div>
                              <InputSmartNumber
                                 value={attr.amount}
                                 onChange={(e) =>
                                    handleCharacterChange("attributes", {
                                       ...character.attributes,
                                       [key]: new Attribute(
                                          Number(e.target.value)
                                       ),
                                    })
                                 }
                                 className="w-10 text-contrast-10 text-center bg-contrast-3 opacity-100 rounded"
                              />
                           </div>
                        )
                     )}
                  </div> */}
               </>
            ) : (
               <p>Loading character...</p>
            )}
         </div>
      </>
   );
}
