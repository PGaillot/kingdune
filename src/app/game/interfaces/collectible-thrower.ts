import { Hitbox } from "../../hitbox";
import { GameMeter } from "../config";
import { Collectible } from "../entities/collectible";
import { PurseHolder } from "../entities/purse";

export interface CollectibleThrower extends PurseHolder {
    view: Hitbox,
    throwCollectible(throwDistance: GameMeter): Collectible | undefined
}