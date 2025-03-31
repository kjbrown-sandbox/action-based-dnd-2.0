import React from "react";

type DividerProps = {
   orientation?: "horizontal" | "vertical";
   gutter?: string; // CSS value for spacing (e.g., "1rem", "8px")
   color?: string; // Optional color for the divider
};

export const Divider: React.FC<DividerProps> = ({
   orientation = "horizontal",
   gutter = "0",
   color = "contrast-3",
}) => {
   const isHorizontal = orientation === "horizontal";

   return isHorizontal ? (
      <div className={`bg-${color} h-px w-full my-${gutter} mx-0`} />
   ) : (
      <div className={`bg-${color} w-px h-full mx-${gutter} my-0`} />
      // <div
      //    className={
      //       `bg-${color} ${isHorizontal ? "h-1" : "w-1"} ${
      //          isHorizontal ? "w-full" : "h-full"
      //       }` +
      //       ` ${isHorizontal ? "my-" : "mx-"}${gutter} ${
      //          isHorizontal ? "mx-0" : "my-0"
      //       }`
      //    }
      // style={{
      //    backgroundColor: color,
      //    width: isHorizontal ? "100%" : "100px",
      //    height: isHorizontal ? "10px" : "100%",
      //    margin: isHorizontal ? `${gutter} 0` : `0 ${gutter}`,
      // }}
   );
};
