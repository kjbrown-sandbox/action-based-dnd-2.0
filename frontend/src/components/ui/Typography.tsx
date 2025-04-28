import * as React from "react";
import { cn } from "../lib/utils";

interface TypographyProps {
   variant?: "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "table" | "list" | "muted";
   className?: string;
   children: React.ReactNode;
   italic?: boolean; // Optional prop to apply italic style
}

export function Typography({ variant = "p", className, children, italic }: TypographyProps) {
   const Component = ({
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      p: "p",
      blockquote: "blockquote",
      table: "table",
      list: "ul", // Map 'list' to a valid HTML tag like 'ul'
      muted: "p",
   }[variant] || "div") as React.ElementType;

   return (
      <Component
         className={cn(
            "text-contrast-10",
            {
               h1: "text-4xl font-bold",
               h2: "text-3xl font-semibold",
               h3: "text-2xl font-medium",
               h4: "text-xl font-medium",
               p: "text-base",
               blockquote: "border-l-4 pl-4 italic",
               table: "table-auto border-collapse border border-gray-300",
               list: "list-disc pl-5",
               muted: "text-contrast-10/70",
            }[variant],
            italic && "italic", // Apply italic style if the prop is true
            className
         )}
      >
         {children}
      </Component>
   );
}
