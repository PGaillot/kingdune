import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, Pixel, ScreenPoint } from "../config";

export class WaterRing {

    color: string = 'silver';
    size: GameMeter = 0.7;

    constructor(
        private positionX: GameMeter
    ) { }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.fillStyle = this.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.positionX, y: GROUND })
        ctx.fillRect(positionInCamera.x, (positionInCamera.y - (this.size * METER_UNIT)), this.size * METER_UNIT, this.size * METER_UNIT)
    }
}