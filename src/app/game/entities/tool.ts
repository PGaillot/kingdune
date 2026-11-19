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