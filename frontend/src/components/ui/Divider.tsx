import React from "react";

type DividerProps = {
   orientation?: "horizontal" | "vertical";
   size?: "full" | "lg" | "md" | "sm"; // Size of the divider
   color?: string; // Optional color for the divider
};

export const Divider: React.FC<DividerProps> = ({
   orientation = "horizontal",
   size = "full",
   color = "contrast-3",
}) => {
   const isHorizontal = orientation === "horizontal";
   const sizeChart = {
      full: "full",
      lg: "3/4",
      md: "1/2",
      sm: "1/4",
   };

   // return isHorizontal ? (
   //    <div className={`bg-${color} h-px w-1/2`} />
   // ) : (
   //    <div className={`bg-${color} w-px h-full mx-${fillPercentage} my-0`} />
   // );
   return isHorizontal ? (
      <div className={`bg-${color} h-px w-${sizeChart[size]} mx-auto`} />
   ) : (
      <div className={`bg-${color} w-px y-${sizeChart[size]} my-auto`} />
   );
};
