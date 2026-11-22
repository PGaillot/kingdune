import { Hitbox } from "../../hitbox";
import { Collectible } from "../entities/collectible";


/**
 * une interface pour rendre les trucs travaillable,
 * comme ca on peux y envoyer un worker.
 * @argument workChargeLef La charge de taff restante, 0 ? c'est fini ! oust
 * @argument workerRequired Si il vaux 0 alors pas beosin de worker 
 * @argument requestedAt Le moment ou a demander d'aller bosser
 * @function complete quand c'est terminé ca retourne une recompence. Ou pas !
 * @argument hitbox la hitbox du truc travaillable.
 */
export interface Workable {
    workChargeLeft: number;
    readonly workerRequired: number;
    requestedAt: number | undefined;
    complete(): Collectible[] | undefined;
    hitbox: Hitbox
}