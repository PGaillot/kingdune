import { GameMeter } from "../config";
import { Collectible, CollectibleOptions } from "./collectible";

const WATERRING_IMAGE: HTMLImageElement = new Image();
WATERRING_IMAGE.src = 'ressources/waterring/waterring_1.png';

const WATERRING_OPTIONS: Partial<CollectibleOptions> = {
    height: 1,
    width: 1,
    image: WATERRING_IMAGE
}

/**
 * La Monnaie, des anneaux d'eau.
 * Pratique comme monnaie d'echange quand on vit sur Arakis.
 * ils ont une petite physique, et peuvent meme faire un petit bruit sympa quand ils tombent.
 */
export class WaterRing extends Collectible {
    constructor(x: GameMeter, y: GameMeter, options?: Partial<CollectibleOptions>) {
        super(x, y, { ...WATERRING_OPTIONS, ...options })
    }
}