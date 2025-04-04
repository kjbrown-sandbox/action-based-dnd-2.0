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

export class Attribute {
   amount: number;

   constructor(amount: number) {
      this.amount = amount;
   }

   getModifier(): number {
      return Math.floor((this.amount - 10) / 2);
   }

   getModifierString(): string {
      const modifier = this.getModifier();
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
   str: Attribute; // Strength
   dex: Attribute; // Dexterity
   con: Attribute; // Constitution
   int: Attribute; // Intelligence
   wis: Attribute; // Wisdom
   cha: Attribute; // Charisma
};

export const LAST_USED_CHARACTER_ID = "lastUsedCharacterID";
