"use client";

import { useContext, useState } from "react";
import { AppContext } from "./context";
import { SKILL_LIST, SkillKey } from "./types";
import { getAttributeForSkill } from "../lib/utils";
import { CircleDashed, Circle, CircleMinus, CircleEqual } from "lucide-react";

const proficiencyIcons = [
   { level: 0, icon: CircleDashed, label: "No Proficiency" },
   { level: 1, icon: Circle, label: "Half Proficiency" },
   { level: 2, icon: CircleMinus, label: "Full Proficiency" },
   { level: 3, icon: CircleEqual, label: "Expertise" },
];

export default function SkillRow({ skillKey }: { skillKey: SkillKey }) {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { character, setCharacter } = context;

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

   return (
      <div className="flex items-center gap-4">
         <div className="flex-1 text-sm font-bold">
            {skillKey.toUpperCase()}
         </div>
         <div className="text-white">{modifierString}</div>
         <button
            onClick={handleProficiencyChange}
            className="text-contrast-2 hover:text-contrast-3"
            aria-label={`Set proficiency level for ${skillKey}`}
         >
            <Icon size={20} />
         </button>
      </div>
   );
}
