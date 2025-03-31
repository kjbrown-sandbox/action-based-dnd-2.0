"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react"; // Icons from lucide-react

interface InputSmartNumberProps
   extends React.InputHTMLAttributes<HTMLInputElement> {
   onChange?: (value: number) => void;
   onBlur?: (value: number) => void;
}

export default function InputSmartNumber({
   onChange,
   onBlur,
   ...props
}: InputSmartNumberProps) {
   const [inputValue, setInputValue] = useState<string>("");

   const evaluateExpression = (expression: string): number => {
      try {
         const sanitizedExpression = expression.replace(/[^0-9+\-*/(). ]/g, "");
         return new Function(`return ${sanitizedExpression}`)();
      } catch {
         return NaN;
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      const calculatedValue = evaluateExpression(value);
      if (!isNaN(calculatedValue) && onChange) {
         onChange(calculatedValue);
      }
   };

   const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const calculatedValue = evaluateExpression(inputValue);
      if (!isNaN(calculatedValue) && onBlur) {
         onBlur(calculatedValue);
      }
   };

   const incrementValue = () => {
      const calculatedValue = evaluateExpression(inputValue) || 0;
      const newValue = calculatedValue + 1;
      setInputValue(newValue.toString());
      if (onChange) onChange(newValue);
   };

   const decrementValue = () => {
      const calculatedValue = evaluateExpression(inputValue) || 0;
      const newValue = calculatedValue - 1;
      setInputValue(newValue.toString());
      if (onChange) onChange(newValue);
   };

   return (
      <div className="relative group">
         <Input
            {...props}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="pr-10" // Add padding to avoid overlap with icons
         />
         {/* Increment and Decrement Icons */}
         <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
               type="button"
               onClick={incrementValue}
               className="p-1 rounded hover:bg-contrast-2"
               aria-label="Increment"
            >
               <Plus size={16} />
            </button>
            <button
               type="button"
               onClick={decrementValue}
               className="p-1 rounded hover:bg-contrast-2"
               aria-label="Decrement"
            >
               <Minus size={16} />
            </button>
         </div>
      </div>
   );
}
