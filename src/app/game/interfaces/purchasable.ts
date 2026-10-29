import { Hitbox } from "../../hitbox"
import { Camera } from "../camera";

// Interface des trucs 'achetable' pour lesquels on peux claquer des anneaux ! 
export interface Purchasable {
    hitbox: Hitbox,
    /** si c'est undefied c'est qu'on peux pas l'acheter. (dune deja marqué par exemple) */
    currentPrice: number | undefined,
    /** L'action à qui se declanche une fois payé. */
    onPaid(): void,
    draw(ctx: CanvasRenderingContext2D, camera: Camera): void,
}