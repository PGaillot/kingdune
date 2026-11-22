import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, METER_UNIT, ScreenPoint } from "../config";
import { Shop } from "./buildings/shop";

export type ToolType = 'hammer' | 'maula-pistol';

export type ToolOption = {
    type: ToolType
    height: GameMeter
    width: GameMeter,
    image: HTMLImageElement,
}

/**
 * Les Outils sont en vente dans les magasins, et cette classe permet de créer des outils.
 * une fois qu'un magasin dispose d'un outil, un fremen va venir le chercher et tranformera ce fremen
 * en l'employé correspondant. (la reparition des metier se passe dans {@link toolsDistributor},
 *  et la tranfomation en metier se passe dans l'upadate du fremen dans World)
 */
export class Tool {

    constructor(private x: GameMeter, private y: GameMeter, private options: ToolOption, private createdBy: Shop) { }

    get hitbox(): Hitbox {
        return {
            height: this.options.height,
            width: this.options.width,
            x: this.x - (this.options.width / 2),
            y: this.y
        }
    }

    get type(): ToolType {
        return this.options.type;
    }

    remove(): void {
        this.createdBy.tools = this.createdBy.tools.filter((tool: Tool) => tool !== this)
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
        ctx.save();
        ctx.drawImage(this.options.image, positionInCamera.x, (positionInCamera.y - this.options.height * METER_UNIT), this.options.width * METER_UNIT, this.options.height * METER_UNIT)
        ctx.restore();
    }
}