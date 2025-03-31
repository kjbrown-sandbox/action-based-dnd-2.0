"use client";

import { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import "./globals.css";
import { Action, Character } from "./types";
import { Button } from "../components/ui/button";
import {
   saveActionToIndexedDB,
   getActionsFromIndexedDB,
   saveCharacterToIndexedDB,
   getCharacterFromIndexedDB,
} from "../lib/indexedDB";
import { Divider } from "@/components/ui/Divider";
import { AppContext } from "./context";

export default function Home() {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { actions, setActions, character, setCharacter } = context;

   const handleCharacterChange = async (key: keyof Character, value: any) => {
      if (!character) return;
      const updatedCharacter = { ...character, [key]: value };
      setCharacter(updatedCharacter);
      await saveCharacterToIndexedDB(updatedCharacter);
   };

   const handleSubmit = async (values: Action, { resetForm }: any) => {
      try {
         const id = await saveActionToIndexedDB(values);
         setActions((prev) => [...prev, values]);
         resetForm();
      } catch (error) {
         console.error("Error saving action:", error);
      }
   };

   const groupedActions = actions.reduce<Record<string, Action[]>>(
      (acc, action) => {
         action.triggers.forEach((trigger) => {
            if (!acc[trigger]) acc[trigger] = [];
            acc[trigger].push(action);
         });
         return acc;
      },
      {}
   );

   type FormValues = Omit<Action, "triggers" | "id"> & { triggers: string };

   return (
      <div className="min-h-screen h-200 bg-contrast-0 text-white flex flex-col">
         {/* Navbar */}
         <div className="bg-contrast-1 p-4 flex justify-between items-start gap-8">
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
                           <input
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

                  <Divider orientation="vertical" gutter="1rem" />
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

         {/* Main Content */}
         <div className="flex flex-1 p-8">
            {/* Left Section: Form */}
            <div className="flex-1 flex bg-contrast-1 justify-center items-center">
               <Formik<FormValues>
                  initialValues={{
                     title: "",
                     description: "",
                     time: undefined,
                     attack: undefined,
                     triggers: "",
                  }}
                  onSubmit={(values, actions) => {
                     const formattedValues: Action = {
                        ...values,
                        id: "", // ID will be generated by IndexedDB
                        triggers: values.triggers
                           .split(",")
                           .map((t) => t.trim()),
                     };
                     handleSubmit(formattedValues, actions);
                  }}
               >
                  {() => (
                     <Form className="bg-contrast-2 p-6 rounded shadow-md w-full max-w-md">
                        <Divider />
                        <h2 className="text-xl font-bold mb-4">
                           Add New Action
                        </h2>
                        <div className="mb-4">
                           <label className="block mb-1" htmlFor="title">
                              Title
                           </label>
                           <Field
                              id="title"
                              name="title"
                              placeholder="Action Title"
                              className="w-full p-2 rounded bg-contrast-3 text-white"
                           />
                        </div>
                        <div className="mb-4">
                           <label className="block mb-1" htmlFor="description">
                              Description
                           </label>
                           <Field
                              id="description"
                              name="description"
                              as="textarea"
                              placeholder="Action Description"
                              className="w-full p-2 rounded bg-contrast-3 text-white"
                           />
                        </div>
                        <div className="mb-4">
                           <label className="block mb-1" htmlFor="time">
                              Time
                           </label>
                           <Field
                              id="time"
                              name="time"
                              placeholder="e.g., Action, Bonus Action"
                              className="w-full p-2 rounded bg-contrast-3 text-white"
                           />
                        </div>
                        <div className="mb-4">
                           <label className="block mb-1" htmlFor="attack">
                              Attack
                           </label>
                           <Field
                              id="attack"
                              name="attack"
                              placeholder="e.g., 1d8 slashing"
                              className="w-full p-2 rounded bg-contrast-3 text-white"
                           />
                        </div>
                        <div className="mb-4">
                           <label className="block mb-1" htmlFor="triggers">
                              Triggers (comma-separated)
                           </label>
                           <Field
                              id="triggers"
                              name="triggers"
                              placeholder="e.g., Enemy casts spell, Bonus Action"
                              className="w-full p-2 rounded bg-contrast-3 text-white"
                           />
                        </div>
                        <Button type="submit" className="w-full">
                           Add Action
                        </Button>
                     </Form>
                  )}
               </Formik>
            </div>

            {/* Right Section: Actions List */}
            <div className="flex-2 p-4">
               <h2 className="text-xl font-bold mb-4">Actions by Trigger</h2>
               {Object.keys(groupedActions).length === 0 ? (
                  <p className="text-contrast-5">No actions added yet.</p>
               ) : (
                  Object.entries(groupedActions).map(([trigger, actions]) => (
                     <div key={trigger} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                           {trigger}
                        </h3>
                        <ul className="space-y-2">
                           {actions.map((action, index) => (
                              <li
                                 key={index}
                                 className="bg-contrast-4 p-4 rounded shadow"
                              >
                                 <p>
                                    <strong>{action.title}</strong>
                                 </p>
                                 {action.description && (
                                    <p>{action.description}</p>
                                 )}
                                 {action.time && <p>Time: {action.time}</p>}
                                 {action.attack && (
                                    <p>Attack: {action.attack.damage}</p>
                                 )}
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>
   );
}
