export type TimeAction =
   | "reaction"
   | "bonus action"
   | "action"
   | "movement"
   | "free action"
   | "short rest"
   | "long rest"
   | "other";

export type DamageType =
   | "bludgeoning"
   | "piercing"
   | "slashing"
   | "fire"
   | "cold"
   | "lightning"
   | "thunder"
   | "poison"
   | "acid"
   | "psychic"
   | "necrotic"
   | "radiant"
   | "force"
   | "other";

export type CommonTrigger =
   | TimeAction
   | "enemy leaves range"
   | "enemy casts spell";

export interface Range {
   normal: number;
   long?: number;
}

export interface Attack {
   damage: string;
   type: DamageType;
   range?: Range;
}

export interface Action {
   id: number;
   characterID: number;
   title: string;
   description?: string;
   time?: TimeAction;
   attack?: Attack;
   triggers: (CommonTrigger | string)[];
}

export interface CharacterData {
   actions: Action[];
}

export const ATTRIBUTE_LIST = [
   "str",
   "dex",
   "con",
   "int",
   "wis",
   "cha",
] as const;
export type AttributeKey = (typeof ATTRIBUTE_LIST)[number];

export const SKILL_LIST = [
   "acrobatics",
   "animal handling",
   "arcana",
   "athletics",
   "deception",
   "history",
   "insight",
   "intimidation",
   "investigation",
   "medicine",
   "nature",
   "perception",
   "performance",
   "persuasion",
   "religion",
   "sleight of hand",
   "stealth",
   "survival",
] as const;
export type SkillKey = (typeof SKILL_LIST)[number];

export class Attribute {
   amount: number;
   modifier: number;

   constructor(amount: number) {
      this.amount = amount;
      this.modifier = Math.floor((amount - 10) / 2);
   }

   getModifierString(): string {
      const modifier = this.modifier;
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
   }
}

export type Character = {
   id: number;
   name: string;
   level: string;
   class: string;
   subclass?: string;
   race: string;
   background?: string;
   armorClass: string;
   initiativeBonus: string;
   speed: string;
   currentHP: string;
   maxHP: string;
   tempHP?: string;
   currentHitDice: string; // Added currentHitDice
   maxHitDice: string; // Added maxHitDice
   deathSaves: { successes: number; failures: number };
   attributes: {
      // str: Attribute; // Strength
      // dex: Attribute; // Dexterity
      // con: Attribute; // Constitution
      // int: Attribute; // Intelligence
      // wis: Attribute; // Wisdom
      // cha: Attribute; // Charisma
      [key in AttributeKey]: Attribute;
   };
   proficiency: number; // Proficiency bonus
   skillProficiencies: {
      [key in SkillKey]: "none" | "half" | "proficient" | "expert";
   };
};

export const LAST_USED_CHARACTER_ID = "lastUsedCharacterID";
