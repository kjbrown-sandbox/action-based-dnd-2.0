"use client";

import { useContext } from "react";
import { AppContext } from "./context";
import "./globals.css";
import { Action, Attack } from "./types";
import {
   Accordion,
   AccordionItem,
   AccordionTrigger,
   AccordionContent,
} from "../components/ui/accordion";
import React from "react";
import { Typography } from "@/components/ui/Typography";

function ActionRow({ action }: { action: Action }) {
   function getRangeString(range: Attack["range"]) {
      if (!range) return "";

      if (range.normal && range.long) {
         return `(${range.normal}/${range.long})`;
      }
      if (range.normal || range.long) {
         return `(${range.normal || range.long})`;
      }

      console.error("Invalid range object:", range);
      return "";
   }

   return (
      <AccordionItem value={`action-${action.id}`}>
         <AccordionTrigger>
            <div>
               <Typography>{action.title}</Typography>
               {action.attack && (
                  <div>
                     <Typography variant="muted">
                        {action.attack.damage} {action.attack.type} damage{" "}
                        {getRangeString(action.attack.range)}
                     </Typography>
                  </div>
               )}
            </div>
         </AccordionTrigger>
         <AccordionContent>
            {action.description && <Typography>{action.description}</Typography>}
            {action.spell && <Typography>Spell: {JSON.stringify(action.spell)}</Typography>}
            {action.triggers && <Typography>Triggers: {action.triggers.join(", ")}</Typography>}
         </AccordionContent>
      </AccordionItem>
   );
}

export default function ActionsDisplay() {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { actions } = context;

   // const groupedActions = actions.reduce<Record<string, Record<string, Action[]>>>(
   //    (acc, action) => {
   //       if (!action.time) return acc;
   //       const timeKey = action.time as string;
   //       action.triggers.forEach((trigger) => {
   //          if (!acc[timeKey]) acc[timeKey] = {};
   //          if (!acc[timeKey][trigger]) acc[timeKey][trigger] = [];
   //          acc[timeKey][trigger].push(action);
   //       });
   //       return acc;
   //    },
   //    {}
   // );
   const groupedActions = actions.reduce<Record<string, Action[]>>((groupsSoFar, currAction) => {
      if (currAction.time) {
         if (!groupsSoFar[currAction.time]) {
            groupsSoFar[currAction.time] = [];
         }
         groupsSoFar[currAction.time].push(currAction);
      }

      currAction.triggers.forEach((trigger) => {
         if (!groupsSoFar[trigger]) {
            groupsSoFar[trigger] = [];
         }
         groupsSoFar[trigger].push(currAction);
      });

      return groupsSoFar;
   }, {});

   const timeGroups = Object.entries(groupedActions);

   console.log("groupedActions", groupedActions);
   console.log("timeGroups", timeGroups);

   return (
      <div className="flex flex-2 gap-4 p-4">
         <div className="grid grid-cols-3 gap-4 w-full">
            {timeGroups.map(([key, actions]) => (
               <div key={key} className="flex flex-col">
                  <Accordion type="multiple">
                     <AccordionItem value={`group-${key}`}>
                        <AccordionTrigger>
                           <div className="flex justify-between w-full">
                              <h1>{key.toUpperCase()}</h1>
                              <span>{actions.length} options</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="flex flex-col gap-4">
                              {actions.map((action) => (
                                 <ActionRow key={action.id} action={action} />
                              ))}
                           </div>
                        </AccordionContent>
                     </AccordionItem>
                  </Accordion>
               </div>
            ))}
         </div>
      </div>
   );
}
