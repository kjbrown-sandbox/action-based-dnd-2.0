"use client";

import { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import "./globals.css";
import { Action, Character } from "./types";
import { Button } from "../components/ui/button";
import {
   saveActionToIndexedDB,
   getActionsFromIndexedDB,
   saveCharacterToIndexedDB,
   getCharacterFromIndexedDB,
} from "../lib/indexedDB";
import { Divider } from "@/components/ui/Divider";
import { AppContext } from "./context";
import ActionsDisplay from "./actionsDisplay";
import ExtraInfoPanels from "./extraInfoPanels";
import Navbar from "./navbar";

export default function Home() {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   return (
      <div className="min-h-screen h-200 bg-contrast-0 text-contrast-10 flex flex-col">
         <Navbar />
         <div className="flex-1 flex bg-contrast-0">
            <ExtraInfoPanels />
            <ActionsDisplay />
         </div>
      </div>
   );
}
