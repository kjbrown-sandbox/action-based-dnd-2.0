"use client";

import React from "react";

interface TabProps {
   isActive: boolean; // Whether the tab is currently active
   children: React.ReactNode; // Content of the tab
}

export const Tab: React.FC<TabProps> = ({ isActive, children }) => {
   if (!isActive) return null;

   return <div>{children}</div>;
};
