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
   id: string;
   title: string;
   description?: string;
   time?: TimeAction;
   attack?: Attack;
   triggers: (CommonTrigger | string)[];
}

export interface CharacterData {
   actions: Action[];
}
