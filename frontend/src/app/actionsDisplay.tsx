"use client";

import { useContext } from "react";
import { AppContext } from "./context";
import "./globals.css";
import { Action } from "./types";

export default function ActionsDisplay() {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { actions } = context;

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

   return (
      <>
         <div className="flex-2 p-4">
            <h2 className="text-xl font-bold mb-4">Actions by Trigger</h2>
            {Object.keys(groupedActions).length === 0 ? (
               <p className="text-contrast-5">No actions added yet.</p>
            ) : (
               Object.entries(groupedActions).map(([trigger, actions]) => (
                  <div key={trigger} className="mb-6">
                     <h3 className="text-lg font-semibold mb-2">{trigger}</h3>
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
      </>
   );
}
