import { Character, Attribute } from "../app/types";

export function copyCharacter(character: Character): Character {
   return {
      ...character,
      str: new Attribute(character.str.amount),
      dex: new Attribute(character.dex.amount),
      con: new Attribute(character.con.amount),
      int: new Attribute(character.int.amount),
      wis: new Attribute(character.wis.amount),
      cha: new Attribute(character.cha.amount),
   };
}
