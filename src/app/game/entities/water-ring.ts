import { GameMeter } from "../config";
import { Collectible, CollectibleOptions } from "./collectible";

const WATERRING_OPTIONS: Partial<CollectibleOptions> = {
    height: 0.7,
    width: 0.7,
    color: 'silver'
}

export class WaterRing extends Collectible {
    constructor(x: GameMeter, y: GameMeter, options?: Partial<CollectibleOptions>) {
        super(x, y, { ...WATERRING_OPTIONS, ...options })
    }
}