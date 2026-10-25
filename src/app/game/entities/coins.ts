import { Camera } from "../camera";
import { GameMeter, GROUND_Y, METER_UNIT, Pixel, ScreenPoint } from "../config";

export class Coin {

    color: string = 'gold';
    size: GameMeter = 0.7;

    constructor(
        private positionX: Pixel
    ) { }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.fillStyle = this.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.positionX, y: GROUND_Y })
        ctx.fillRect(positionInCamera.x, (positionInCamera.y - (this.size * METER_UNIT)), this.size * METER_UNIT, this.size * METER_UNIT)
    }
}