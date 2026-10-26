import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../config";

export class Sietch {
    height: GameMeter = 1;
    width: GameMeter = 3;
    color: string = 'orange';

    constructor(public position: GameMeter) { }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.fillStyle = this.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: (this.position - (this.width / 2)), y: GROUND })
        ctx.fillRect(positionInCamera.x, (positionInCamera.y - (this.height * METER_UNIT)), this.width * METER_UNIT, this.height * METER_UNIT)
    }
}