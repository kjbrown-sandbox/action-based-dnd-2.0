"use client";

import React, { ChangeEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { evaluate } from "mathjs";

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
   // const [inputValue, setInputValue] = useState<string>("");

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
      // const value = e.target.value;
      // setInputValue(value);
      console.log("smart", e.target.value);
      onChange?.(e);

      // const calculatedValue = evaluateExpression(value);
      // if (!isNaN(calculatedValue) && onChange) {
      //    onChange(calculatedValue);
      // }
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

   return (
      <Input
         {...props}
         value={value}
         onChange={handleInputChange}
         onBlur={handleInputBlur}
      />
   );
}
