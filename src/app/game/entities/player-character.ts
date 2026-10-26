import { GameMeter } from "../config";
import { Purse } from "../purse";
import { Character } from "./character";
import { Collectible } from "./collectible";

export class PlayerCharacter extends Character {
    purse: Purse = new Purse(20);

    constructor(x: GameMeter, y: GameMeter) {
        super(x, y);
    }

    dropCollectible(): void {
        const collectible: Collectible | undefined = this.purse.remove();
        if (collectible) {
            // le faire apparaitre au sol
        }
    }
}