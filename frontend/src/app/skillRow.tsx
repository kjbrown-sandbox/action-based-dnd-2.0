"use client";

import { useContext, useState } from "react";
import { AppContext } from "./context";
import { ProficiencyLevel, SKILL_LIST, SkillKey } from "./types";
import { getAttributeForSkill } from "../lib/utils";
import { CircleDashed, Circle, CircleMinus, CircleEqual } from "lucide-react";
import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
} from "@/components/ui/tooltip";

const proficiencyIcons = [
   { level: 0, icon: CircleDashed, label: "No proficiency" },
   { level: 1, icon: Circle, label: "Half proficiency" },
   { level: 2, icon: CircleMinus, label: "Proficiency" },
   { level: 3, icon: CircleEqual, label: "Expertise" },
];

export default function SkillRow({ skillKey }: { skillKey: SkillKey }) {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { character, setCharacter } = context;

   function getProficiencyModifierNumber(
      proficiency: ProficiencyLevel | undefined
   ) {
      switch (proficiency) {
         case "No proficiency":
            return 0;
         case "Half proficiency":
            return 0.5;
         case "Proficiency":
            return 1;
         case "Expertise":
            return 2;
         default:
            return 0;
      }
   }

   const handleProficiencyChange = () => {
      if (!character) return;

      const currentLevel = character.skillProficiencies[skillKey];
      const nextLevel =
         (proficiencyIcons.findIndex((p) => p.label === currentLevel) + 1) %
         proficiencyIcons.length;

      const updatedCharacter = {
         ...character,
         skillProficiencies: {
            ...character.skillProficiencies,
            [skillKey]: proficiencyIcons[nextLevel].label,
         },
      };

      setCharacter(updatedCharacter);
   };

   const calculateModifier = (): number => {
      if (!character) return 0;

      const attributeKey = getAttributeForSkill(skillKey);
      if (!attributeKey) return 0;

      const baseModifier = character.attributes[attributeKey].modifier;
      const proficiencyLevel = proficiencyIcons.findIndex(
         (p) => p.label === character.skillProficiencies[skillKey]
      );
      const proficiencyBonus = character.proficiency;

      switch (proficiencyLevel) {
         case 1: // Half proficiency
            return baseModifier + Math.floor(proficiencyBonus / 2);
         case 2: // Full proficiency
            return baseModifier + proficiencyBonus;
         case 3: // Double proficiency
            return baseModifier + proficiencyBonus * 2;
         default: // No proficiency
            return baseModifier;
      }
   };

   const currentProficiencyLevel = proficiencyIcons.findIndex(
      (p) => p.label === character?.skillProficiencies[skillKey]
   );

   const Icon = proficiencyIcons[currentProficiencyLevel]?.icon || CircleDashed;

   const modifier = calculateModifier();
   const modifierString = modifier >= 0 ? `+${modifier}` : `${modifier}`;

   const relatedAttribute = getAttributeForSkill(skillKey);
   const attributeModifier = character?.attributes[relatedAttribute]?.modifier;

   return (
      <div className="flex items-center gap-3">
         <div className="flex-1 text-sm font-bold">
            {skillKey.toUpperCase()}
         </div>
         <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
               <div className="text-white ml-auto cursor-pointer">
                  {modifierString}
               </div>
            </TooltipTrigger>
            <TooltipContent>
               <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                     <div className="flex items-center gap-2">
                        <Circle size={6} />
                        <span>{`${relatedAttribute.toUpperCase()}`}</span>
                     </div>
                     <span>{`→ (${
                        character?.attributes[
                           getAttributeForSkill(skillKey)
                        ]?.getModifierString() || 0
                     })`}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                     <div className="flex items-center gap-2">
                        <Circle size={6} />
                        <span>PROFICIENCY</span>
                     </div>
                     <span>{`→ (+${character?.proficiency || 0})`}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                     <div className="flex items-center gap-2">
                        <Circle size={6} />
                        <span>PROF. MULTIPLIER</span>
                     </div>
                     <span>{`→ (×${getProficiencyModifierNumber(
                        character?.skillProficiencies[skillKey]
                     )})`}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 font-bold">
                     <div className="flex items-center gap-2">
                        <Circle size={6} />
                        <span>TOTAL</span>
                     </div>
                     <span>{`${modifier >= 0 ? "+" : ""}${modifier}`}</span>
                  </div>
               </div>
            </TooltipContent>
         </Tooltip>
         <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
               <button
                  onClick={handleProficiencyChange}
                  className="cursor-pointer text-contrast-6 hover:text-contrast-10 transition-colors duration-200"
                  aria-label={`Set proficiency level for ${skillKey}`}
                  data-tooltip-ignore // Custom attribute to ignore tooltip
               >
                  <Icon size={20} />
               </button>
            </TooltipTrigger>
            <TooltipContent>
               {proficiencyIcons[currentProficiencyLevel]?.label ||
                  "No Proficiency"}
            </TooltipContent>
         </Tooltip>
      </div>
   );
}
