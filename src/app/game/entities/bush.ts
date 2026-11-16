import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../config";

const BUSH_IMAGE: HTMLImageElement = new Image();
BUSH_IMAGE.src = '/ressources/bush/bush.png';


export class Bush {

    constructor(
        private positionX: GameMeter,
    ) { }

    get hitbox(): Hitbox {
        return {
            height: 1,
            width: 2,
            x: this.positionX,
            y: GROUND,
        }
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const position: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y });
        ctx.drawImage(BUSH_IMAGE, position.x, (position.y - this.hitbox.height * METER_UNIT), this.hitbox.width * METER_UNIT, this.hitbox.height * METER_UNIT);
        ctx.restore();
    }
}