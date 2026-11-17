import { GameMeter } from "../config";
import { Collectible, CollectibleOptions } from "./collectible";

const WATERRING_IMAGE: HTMLImageElement = new Image();
WATERRING_IMAGE.src = 'ressources/waterring/waterring_1.png';

const WATERRING_OPTIONS: Partial<CollectibleOptions> = {
    height: 1,
    width: 1,
    image: WATERRING_IMAGE
}

export class WaterRing extends Collectible {
    constructor(x: GameMeter, y: GameMeter, options?: Partial<CollectibleOptions>) {
        super(x, y, { ...WATERRING_OPTIONS, ...options })
    }
}