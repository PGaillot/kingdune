import { Camera } from "../camera";
import { GameMeter, GROUND_Y, METER_UNIT, Pixel, ScreenPoint } from "../config";

export class Ground {

    thickness: GameMeter = 0.2;
    color: string = 'chocolate';

    constructor(private width: GameMeter) { }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.fillStyle = this.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: -(this.width / 2), y: GROUND_Y })
        ctx.fillRect(positionInCamera.x, positionInCamera.y, this.width * METER_UNIT, this.thickness * METER_UNIT);
    }
}