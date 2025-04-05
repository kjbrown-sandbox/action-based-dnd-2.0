import { Character, Attribute } from "../app/types";

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

export function getAttributeForSkill(
   skill: string
): keyof Character["attributes"] | null {
   const skillToAttributeMap: Record<string, keyof Character["attributes"]> = {
      acrobatics: "dex",
      animalHandling: "wis",
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
      sleightOfHand: "dex",
      stealth: "dex",
      survival: "wis",
   };

   return skillToAttributeMap[skill] || null;
}
