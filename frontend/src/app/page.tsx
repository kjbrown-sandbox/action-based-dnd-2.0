"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import "./globals.css";
import { Action } from "./types";

export default function Home() {
   const [actions, setActions] = useState<Action[]>([]);

   const handleSubmit = (values: Action, { resetForm }: any) => {
      setActions((prev) => [...prev, values]);
      resetForm();
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

   type FormValues = Omit<Action, "triggers"> & { triggers: string };
   return (
      <div className="min-h-screen bg-gray-900 text-white grid grid-cols-2 gap-4 p-8">
         {/* Left Section: Form */}
         <div className="flex items-center justify-center">
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
                     triggers: values.triggers.split(",").map((t) => t.trim()),
                  };
                  handleSubmit(formattedValues, actions);
               }}
            >
               {() => (
                  <Form className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
                     <h2 className="text-xl font-bold mb-4">Add New Action</h2>
                     <div className="mb-4">
                        <label className="block mb-1" htmlFor="title">
                           Title
                        </label>
                        <Field
                           id="title"
                           name="title"
                           placeholder="Action Title"
                           className="w-full p-2 rounded bg-gray-700 text-white"
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
                           className="w-full p-2 rounded bg-gray-700 text-white"
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
                           className="w-full p-2 rounded bg-gray-700 text-white"
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
                           className="w-full p-2 rounded bg-gray-700 text-white"
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
                           className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                     </div>
                     <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                     >
                        Add Action
                     </button>
                  </Form>
               )}
            </Formik>
         </div>

         {/* Right Section: Actions List */}
         <div>
            <h2 className="text-xl font-bold mb-4">Actions by Trigger</h2>
            {Object.keys(groupedActions).length === 0 ? (
               <p className="text-gray-400">No actions added yet.</p>
            ) : (
               Object.entries(groupedActions).map(([trigger, actions]) => (
                  <div key={trigger} className="mb-6">
                     <h3 className="text-lg font-semibold mb-2">{trigger}</h3>
                     <ul className="space-y-2">
                        {actions.map((action, index) => (
                           <li
                              key={index}
                              className="bg-gray-800 p-4 rounded shadow"
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
   );
}
