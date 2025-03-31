"use client";

import { Divider } from "@/components/ui/Divider";
import { useContext } from "react";
import { saveCharacterToIndexedDB } from "../lib/indexedDB";
import { AppContext } from "./context";
import "./globals.css";
import { Character } from "./types";
import InputSmartNumber from "@/components/ui/inputSmartNumber";

export default function Navbar() {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { character, setCharacter } = context;

   const handleCharacterChange = async (key: keyof Character, value: any) => {
      if (!character) return;
      const updatedCharacter = { ...character, [key]: value };
      setCharacter(updatedCharacter);
      await saveCharacterToIndexedDB(updatedCharacter);
   };

   return (
      <>
         {/* Navbar */}
         <div className="bg-contrast-1 p-4 m-4 flex rounded justify-between items-start gap-8">
            {character ? (
               <>
                  {/* First Section */}
                  <div className="flex flex-col gap-2">
                     <div>
                        <label className="block font-bold">Name:</label>
                        <input
                           type="text"
                           value={character.name}
                           onChange={(e) =>
                              handleCharacterChange("name", e.target.value)
                           }
                           onBlur={(e) =>
                              handleCharacterChange("name", e.target.value)
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block font-bold">Level:</label>
                           {/* <input
                              type="number"
                              value={character.level}
                              onChange={(e) =>
                                 handleCharacterChange(
                                    "level",
                                    parseInt(e.target.value)
                                 )
                              }
                              onBlur={(e) =>
                                 handleCharacterChange(
                                    "level",
                                    parseInt(e.target.value)
                                 )
                              }
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           /> */}
                           <InputSmartNumber
                              value={character.level}
                              onChange={(e) =>
                                 handleCharacterChange("level", e.target.value)
                              }
                              onBlur={(e) =>
                                 handleCharacterChange("level", e.target.value)
                              }
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                        <div>
                           <label className="block font-bold">Class:</label>
                           <input
                              type="text"
                              value={character.class}
                              onChange={(e) =>
                                 handleCharacterChange("class", e.target.value)
                              }
                              onBlur={(e) =>
                                 handleCharacterChange("class", e.target.value)
                              }
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                        <div>
                           <label className="block font-bold">Race:</label>
                           <input
                              type="text"
                              value={character.race}
                              onChange={(e) =>
                                 handleCharacterChange("race", e.target.value)
                              }
                              onBlur={(e) =>
                                 handleCharacterChange("race", e.target.value)
                              }
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                        <div>
                           <label className="block font-bold">
                              Background:
                           </label>
                           <input
                              type="text"
                              value={character.background || ""}
                              onChange={(e) =>
                                 handleCharacterChange(
                                    "background",
                                    e.target.value
                                 )
                              }
                              onBlur={(e) =>
                                 handleCharacterChange(
                                    "background",
                                    e.target.value
                                 )
                              }
                              className="bg-contrast-3 text-white p-1 rounded w-full"
                           />
                        </div>
                     </div>
                  </div>

                  <Divider orientation="vertical" />
                  {/* Middle Section */}
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block font-bold">Armor Class:</label>
                        <input
                           type="number"
                           value={character.armorClass}
                           onChange={(e) =>
                              handleCharacterChange(
                                 "armorClass",
                                 parseInt(e.target.value)
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "armorClass",
                                 parseInt(e.target.value)
                              )
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">
                           Initiative Bonus:
                        </label>
                        <input
                           type="number"
                           value={character.initiativeBonus}
                           onChange={(e) =>
                              handleCharacterChange(
                                 "initiativeBonus",
                                 parseInt(e.target.value)
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "initiativeBonus",
                                 parseInt(e.target.value)
                              )
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
                              handleCharacterChange(
                                 "speed",
                                 parseInt(e.target.value)
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "speed",
                                 parseInt(e.target.value)
                              )
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                  </div>

                  {/* New Section: Hit Dice */}
                  <div className="flex flex-col gap-2">
                     <div>
                        <label className="block font-bold">
                           Current Hit Dice:
                        </label>
                        <input
                           type="text"
                           value={character.currentHitDice}
                           onChange={(e) =>
                              handleCharacterChange(
                                 "currentHitDice",
                                 e.target.value
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "currentHitDice",
                                 e.target.value
                              )
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Max Hit Dice:</label>
                        <input
                           type="text"
                           value={character.maxHitDice}
                           onChange={(e) =>
                              handleCharacterChange(
                                 "maxHitDice",
                                 e.target.value
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "maxHitDice",
                                 e.target.value
                              )
                           }
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
                              handleCharacterChange(
                                 "currentHP",
                                 parseInt(e.target.value)
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "currentHP",
                                 parseInt(e.target.value)
                              )
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
                              handleCharacterChange(
                                 "maxHP",
                                 parseInt(e.target.value)
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "maxHP",
                                 parseInt(e.target.value)
                              )
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                     <div>
                        <label className="block font-bold">Temp HP:</label>
                        <input
                           type="number"
                           value={character.tempHP || 0}
                           onChange={(e) =>
                              handleCharacterChange(
                                 "tempHP",
                                 parseInt(e.target.value)
                              )
                           }
                           onBlur={(e) =>
                              handleCharacterChange(
                                 "tempHP",
                                 parseInt(e.target.value)
                              )
                           }
                           className="bg-contrast-3 text-white p-1 rounded w-full"
                        />
                     </div>
                  </div>
               </>
            ) : (
               <p>Loading character...</p>
            )}
         </div>
      </>
   );
}
