"use client";

import React, { useState } from "react";

interface TabCollectionProps {
   labels: string[]; // List of tab labels
   onChange?: (activeIndex: number, activeLabel: string) => void; // Callback when the active tab changes
   className?: string; // Optional className for the tab collection
}

export const TabCollection: React.FC<TabCollectionProps> = ({ labels, onChange, className }) => {
   const [activeIndex, setActiveIndex] = useState(0);

   const handleTabClick = (index: number) => {
      setActiveIndex(index);
      onChange?.(index, labels[index]); // Pass both the index and the label
   };

   return (
      <div className={`flex gap-2 w-full bg-contrast-0 ${className}`}>
         {labels.map((label, index) => (
            <button
               key={label}
               onClick={() => handleTabClick(index)}
               className={`p-3 px-4 rounded-tr rounded-tl ${
                  activeIndex === index
                     ? "bg-contrast-1 text-contrast-10"
                     : "bg-contrast-0 text-gray-400"
               } hover:bg-contrast-1 hover:text-contrast-10 transition-colors duration-200`}
            >
               {label}
            </button>
         ))}
      </div>
   );
};
