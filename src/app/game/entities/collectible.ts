import { Hitbox } from "../../hitbox";
import { GameMeter } from "../config";

export type CollectibleOptions = {
    height: GameMeter,
    width: GameMeter,
    color: string
}

const DEFAULT_OPTIONS: CollectibleOptions = {
    height: 1,
    width: 1,
    color: 'white'
}

export class Collectible {

    readonly options: CollectibleOptions;

    constructor(
        public x: GameMeter,
        public y: GameMeter,
        options: Partial<CollectibleOptions> = {}
    ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    get hitbox(): Hitbox {
        return {
            height: this.options.height,
            width: this.options.width,
            x: this.x,
            y: this.y
        }
    }

}