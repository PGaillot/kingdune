import { GameMeter } from "../config";
import { World } from "../world/world";
import { Character, CharacterOptions } from "./character";
import { Collectible } from "./collectible";
import { Purse } from "./purse";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = {
    width: 1,
    height: 2,
    speed: 2.4,
    color: 'purple',
    runFactor: 1.9,
}

export class PlayerCharacter extends Character {

    purse: Purse = new Purse(20);

    constructor(x: GameMeter, y: GameMeter, options?: Partial<CharacterOptions>) {
        super(x, y, { ...DEFAULT_OPTIONS, ...options });
    }

    dropCollectible(world: World): void {
        const collectible: Collectible | undefined = this.purse.remove();
        if (collectible) {
            collectible.x = this.x;
            collectible.y = this.y;
            collectible.droppedBy = this;
            world.collectibles.push(collectible)
        }
    }

    pay(): void {
        console.log('pay')
    }
}