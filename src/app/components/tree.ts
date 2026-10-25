import { getRandomBetweenMinMax } from "../utils/random.utils";
import { Camera } from "./camera";
import { GameMeter, GROUND_Y, METER_UNIT, ScreenPoint } from "./game/config";

export class Tree {
    private color: string = 'brown'
    private width: GameMeter = 1;
    private height: GameMeter = Math.round(getRandomBetweenMinMax(5, 10))
    flagged: boolean = false;

    constructor(readonly positionX: GameMeter) { }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.fillStyle = this.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.positionX, y: GROUND_Y })
        ctx.fillRect(positionInCamera.x, (positionInCamera.y - (this.height * METER_UNIT)), this.width * METER_UNIT, this.height * METER_UNIT)
    }

}