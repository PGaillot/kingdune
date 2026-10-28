import { Camera } from "../camera";
import { GameMeter, METER_UNIT, ScreenPoint } from "../config";
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

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.fillStyle = this.options.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.x, y: this.y })
        ctx.fillRect(
            positionInCamera.x,
            (positionInCamera.y - (this.options.height * METER_UNIT)),
            this.options.width * METER_UNIT,
            this.options.height * METER_UNIT)
    }
}