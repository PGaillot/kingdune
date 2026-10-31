import { Hitbox } from "../../hitbox";
import { Collectible } from "../entities/collectible";

export interface Workable {
    /** La charge de taff restante, 0 ? c'est fini ! oust  */
    workChargeLeft: number;
    /** Si il vaux 0 alors pas beosin de worker */
    readonly workerRequired: number;
    /** Le moment ou a demander d'aller bosser ! */
    requestedAt: number | undefined;
    complete(): Collectible[] | undefined;
    hitbox: Hitbox
}