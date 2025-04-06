"use client";

import { useContext, useState } from "react";
import { AppContext } from "./context";
import { ProficiencyLabel, SKILL_LIST, SkillKey } from "./types";
import { getAttributeForSkill } from "../lib/utils";
import { CircleDashed, Circle, CircleMinus, CircleEqual } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// const proficiencyIcons = [
//    { level: 0, icon: CircleDashed, label: "No proficiency" },
//    { level: 1, icon: Circle, label: "Half proficiency" },
//    { level: 2, icon: CircleMinus, label: "Proficiency" },
//    { level: 3, icon: CircleEqual, label: "Expertise" },
// ];

type SkillProficiency = {
   label: ProficiencyLabel;
   proficiencyMultiplier: number;
   icon: typeof CircleDashed;
   level: number;
};

const SKILL_PROFICIENCY_MAP: Record<ProficiencyLabel, SkillProficiency> = {
   "No proficiency": {
      label: "No proficiency",
      proficiencyMultiplier: 0,
      icon: CircleDashed,
      level: 0,
   },
   "Half proficiency": {
      label: "Half proficiency",
      proficiencyMultiplier: 0.5,
      icon: Circle,
      level: 1,
   },
   Proficiency: {
      label: "Proficiency",
      proficiencyMultiplier: 1,
      icon: CircleMinus,
      level: 2,
   },
   Expertise: {
      label: "Expertise",
      proficiencyMultiplier: 2,
      icon: CircleEqual,
      level: 3,
   },
};

function getNextSkillProficiency(currentSkillProficiency: SkillProficiency): SkillProficiency {
   const nextLevel =
      (currentSkillProficiency.level + 1) % Object.keys(SKILL_PROFICIENCY_MAP).length;

   for (const skill of Object.values(SKILL_PROFICIENCY_MAP)) {
      if (skill.level === nextLevel) {
         return skill;
      }
   }

   console.error("Found bad skill proficiency", currentSkillProficiency);
   return SKILL_PROFICIENCY_MAP["No proficiency"];
}

interface SkillRowProps {
   skillKey: SkillKey;
}

export default function SkillRow({ skillKey }: SkillRowProps) {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { character, setCharacter } = context;
   console.log("character", character);

   if (!character) {
      return <div className="flex-1 text-sm font-bold">Loading...</div>;
   }

   console.log("skillKey", skillKey);
   const label = character.skillProficiencies[skillKey];
   const skillProficiency = SKILL_PROFICIENCY_MAP[label];
   console.log("label", label);
   console.log("skillProficiency", skillProficiency);

   const handleProficiencyChange = () => {
      const nextProficiency = getNextSkillProficiency(skillProficiency);

      const updatedCharacter = {
         ...character,
         skillProficiencies: {
            ...character.skillProficiencies,
            [skillKey]: nextProficiency.label,
         },
      };

      console.log("updatedCharacter", updatedCharacter);

      setCharacter(updatedCharacter);
   };

   const calculateTotalModifier = (): number => {
      const attributeKey = getAttributeForSkill(skillKey);
      if (!attributeKey) return 0;

      const attributeModifier = character.attributes[attributeKey].modifier;
      return attributeModifier + character.proficiency * skillProficiency.proficiencyMultiplier;
   };

   const totalModifier = calculateTotalModifier();
   const totalModifierString = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;

   const relatedAttribute = getAttributeForSkill(skillKey);

   return (
      <div className="flex items-center gap-3">
         <div className="flex-1 text-sm font-bold">{skillKey.toUpperCase()}</div>
         <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
               <div className="text-contrast-10 ml-auto cursor-pointer">{totalModifierString}</div>
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
                     <span>{`→ (+${character?.proficiency})`}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                     <div className="flex items-center gap-2">
                        <Circle size={6} />
                        <span>PROF. MULTIPLIER</span>
                     </div>
                     <span>{`→ (${skillProficiency.proficiencyMultiplier}`}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 font-bold">
                     <div className="flex items-center gap-2">
                        <Circle size={6} />
                        <span>TOTAL</span>
                     </div>
                     <span>{`${totalModifier >= 0 ? "+" : ""}${totalModifier}`}</span>
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
               >
                  <skillProficiency.icon
                     size={20}
                     className="text-contrast-6 hover:text-contrast-10 transition-colors duration-200"
                  />
               </button>
            </TooltipTrigger>
            <TooltipContent>{skillProficiency.label}</TooltipContent>
         </Tooltip>
      </div>
   );
}
