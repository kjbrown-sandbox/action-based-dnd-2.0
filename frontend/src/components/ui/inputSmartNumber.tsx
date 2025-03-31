"use client";

import React, { ChangeEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { evaluate } from "mathjs";
import { Minus, Plus } from "lucide-react";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "./tooltip";
import { Divider } from "./Divider";

interface InputSmartNumberProps
   extends React.InputHTMLAttributes<HTMLInputElement> {
   onChange?: ChangeEventHandler<HTMLInputElement>;
   onBlur?: ChangeEventHandler<HTMLInputElement>;
}

export default function InputSmartNumber({
   onChange,
   onBlur,
   value,
   ...props
}: InputSmartNumberProps) {
   const incrementValue = (amount: number) => {
      const calculatedValue = evaluateExpression(`${value}`) || 0;
      const newValue = calculatedValue + amount;
      if (onChange) {
         const customEvent = {
            target: {
               value: newValue ? newValue.toString() : `${value}`,
            },
         };
         onChange(customEvent as React.FocusEvent<HTMLInputElement>);
      }
   };

   const evaluateExpression = (expression: string): number => {
      try {
         // Use mathjs to evaluate the expression safely
         // Only allow numbers and operators
         const sanitizedExpression = expression.replace(/[^0-9+\-*/().]/g, "");
         return evaluate(sanitizedExpression);
      } catch {
         return NaN; // Return NaN if the expression is invalid
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("smart", e.target.value);
      onChange?.(e);
   };

   const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const calculatedValue = evaluateExpression(`${e.target.value}`);
      const inputValue = e.target.value;
      console.log("smart blur", inputValue);
      if (onBlur) {
         const customEvent: React.FocusEvent<HTMLInputElement> = {
            ...e,
            target: {
               ...e.target,
               value: calculatedValue ? calculatedValue.toString() : inputValue,
            },
         };
         onBlur(customEvent);
      }
   };

   // <TooltipProvider>
   //    <Tooltip>
   //       <TooltipTrigger>Hover</TooltipTrigger>
   //       <TooltipContent>
   //          <p>Add to library</p>
   //       </TooltipContent>
   //    </Tooltip>
   // </TooltipProvider>;

   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger>
               <Input
                  {...props}
                  value={value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="pr-10" // Add padding to avoid overlap with icons
                  // placeholder="Enter expression"
               />
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={-15}>
               {/* <div className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 flex flex-col items-center gap-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity"> */}
               <div className="flex flex-col items-center">
                  <button
                     type="button"
                     onClick={() => incrementValue(1)}
                     className="p-1 rounded text-contrast-7 hover:text-contrast-10 cursor-pointer mb-1"
                     aria-label="Increment"
                  >
                     <Plus size={20} />
                  </button>
                  <Divider />
                  <button
                     type="button"
                     onClick={() => incrementValue(-1)}
                     className="p-1 rounded text-contrast-7 hover:text-contrast-10 cursor-pointer"
                     aria-label="Decrement"
                  >
                     <Minus size={20} />
                  </button>
               </div>
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );

   return (
      <div className="relative group">
         <Input
            {...props}
            value={value}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="pr-10" // Add padding to avoid overlap with icons
         />

         {/* Increment and Decrement Icons */}
         <div className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 flex flex-col items-center gap-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
               type="button"
               onClick={() => incrementValue(1)}
               className="p-1 rounded hover:bg-contrast-2 hover:bg-opacity-50"
               aria-label="Increment"
            >
               <Plus size={20} />
            </button>
            <button
               type="button"
               onClick={() => incrementValue(-1)}
               className="p-1 rounded hover:bg-contrast-2 hover:bg-opacity-50"
               aria-label="Decrement"
            >
               <Minus size={20} />
            </button>
         </div>
      </div>
   );
}
