"use client";

import React, { ChangeEventHandler } from "react";
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
import { cn } from "@/components/lib/utils";

interface InputSmartNumberProps
   extends React.InputHTMLAttributes<HTMLInputElement> {
   onChange?: ChangeEventHandler<HTMLInputElement>;
   onBlur?: ChangeEventHandler<HTMLInputElement>;
   className?: string; // Allow overriding the input's class
}

export default function InputSmartNumber({
   onChange,
   onBlur,
   value,
   className,
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
         const sanitizedExpression = expression.replace(/[^0-9+\-*/().]/g, "");
         return evaluate(sanitizedExpression);
      } catch {
         return NaN;
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
   };

   const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const calculatedValue = evaluateExpression(`${e.target.value}`);
      const inputValue = e.target.value;
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

   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger>
               <Input
                  {...props}
                  value={value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={cn("", className)} // Allow overriding styles with className
               />
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={-5}>
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
}
