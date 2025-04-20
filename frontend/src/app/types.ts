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

export type CommonTrigger = TimeAction | "enemy leaves range" | "enemy casts spell";

export interface Range {
   normal: number;
   long?: number;
}

export interface AreaOfEffect {
   shape: "cone" | "sphere" | "cube" | "line" | "other";
   size: number; // Size of the area of effect
}

export interface Attack {
   damage: string;
   type: DamageType;
   range?: Range;
   areaOfEffect?: AreaOfEffect;
}

type SpellComponent = {
   verbal?: boolean;
   somatic?: boolean;
   material?: string;
};

export interface Spell {
   level?: number;
   school?: string;
   components?: SpellComponent;
   concentration?: boolean;
   classes?: string[];
   ritual?: boolean;
}

export interface Action {
   id: number;
   characterID: number;
   title: string;
   description?: string;
   time?: TimeAction;
   attack?: Attack;
   triggers: (CommonTrigger | string)[];
   spell?: Spell; // New field for spell-specific attributes
   source?: string; // New field for source information
}

export interface CharacterData {
   actions: Action[];
}

export const ATTRIBUTE_LIST = ["str", "dex", "con", "int", "wis", "cha"] as const;
export type AttributeKey = (typeof ATTRIBUTE_LIST)[number];

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

export const PROFICIENCY_LEVELS = [
   "No proficiency",
   "Half proficiency",
   "Proficiency",
   "Expertise",
] as const;
export type ProficiencyLabel = (typeof PROFICIENCY_LEVELS)[number];

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
   deathSaves: {
      successes: number; // Number of successful death saves (0-3)
      failures: number; // Number of failed death saves (0-3)
   };
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
      [key in SkillKey]: ProficiencyLabel;
   };
};

export const LAST_USED_CHARACTER_ID = "lastUsedCharacterID";

export type ItemType =
   | "Weapon"
   | "Armor"
   | "Potion"
   | "Scroll"
   | "Tool"
   | "Adventuring Gear"
   | "Other";

export type ItemSubtype =
   | "Melee Weapon"
   | "Ranged Weapon"
   | "Light Armor"
   | "Medium Armor"
   | "Heavy Armor"
   | "Consumable"
   | "Miscellaneous";

export interface Item {
   id: number;
   characterID: number; // The ID of the character this item belongs to
   name?: string;
   type?: ItemType;
   subtype?: ItemSubtype;
   description?: string;
   weight?: number;
   value?: number;
   rarity?: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Legendary" | "Artifact";
   quantity?: number;
   tags?: string[];
   equippable?: boolean;
   equipped?: boolean;
   attunement?: boolean;
   magic?: boolean;
   timeToUse?: TimeAction;

   // Weapon-specific attributes
   damage?: string;
   damageType?: "Slashing" | "Piercing" | "Bludgeoning" | "Other";
   range?: string;
   properties?: string[];
   attackBonus?: number;
   criticalRange?: string;
   ammunition?: string;

   // Armor-specific attributes
   armorClass?: string;
   armorType?: "Light" | "Medium" | "Heavy" | "Shield";
   stealthDisadvantage?: boolean;
   strengthRequirement?: number;

   // Consumable-specific attributes
   uses?: number;
   effects?: string;
   duration?: string;

   // Magical attributes
   magicBonus?: string;
   charges?: number;
   recharge?: string;
   spellcasting?: string;
   cursed?: boolean;

   // Tool/Adventuring Gear attributes
   toolType?: string;
   skillBonus?: string;
   specialUse?: string;

   // Homebrew/Custom attributes
   customFields?: Record<string, string>;
   notes?: string;
}
