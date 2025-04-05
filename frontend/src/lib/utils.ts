import { Character, Attribute, SkillKey } from "../app/types";

export function copyCharacter(character: Character): Character {
   return {
      ...character,
      attributes: {
         str: new Attribute(character.attributes.str.amount),
         dex: new Attribute(character.attributes.dex.amount),
         con: new Attribute(character.attributes.con.amount),
         int: new Attribute(character.attributes.int.amount),
         wis: new Attribute(character.attributes.wis.amount),
         cha: new Attribute(character.attributes.cha.amount),
      },
   };
}

export function getAttributeForSkill(skill: SkillKey): keyof Character["attributes"] {
   const skillToAttributeMap: Record<SkillKey, keyof Character["attributes"]> = {
      acrobatics: "dex",
      "animal handling": "wis",
      arcana: "int",
      athletics: "str",
      deception: "cha",
      history: "int",
      insight: "wis",
      intimidation: "cha",
      investigation: "int",
      medicine: "wis",
      nature: "int",
      perception: "wis",
      performance: "cha",
      persuasion: "cha",
      religion: "int",
      "sleight of hand": "dex",
      stealth: "dex",
      survival: "wis",
   };

   if (!skillToAttributeMap[skill]) {
      console.error(`Skill "${skill}" not found in the skill-to-attribute mapping.`);
      return "str";
   }

   return skillToAttributeMap[skill];
}
