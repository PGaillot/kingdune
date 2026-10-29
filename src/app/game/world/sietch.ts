import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../config";
import { Purchasable } from "../interfaces/purchasable";

export class Sietch implements Purchasable {
    height: GameMeter = 1;
    width: GameMeter = 3;
    color: string = 'orange';

    constructor(public position: GameMeter) { }

    level: number = 0;
    sietchLevel: Record<number, { price: number }> = {
        0: { price: 0 },
        1: { price: 3 },
        2: { price: 8 },
        3: { price: 12 },
    }

    get hitbox(): Hitbox {
        return {
            height: this.height,
            width: this.width,
            x: this.position - (this.width / 2),
            y: GROUND
        }
    }

    get currentPrice(): number | undefined { return this.nextSietchLevelPrice };


    get nextSietchLevelPrice(): number | undefined {
        return this.sietchLevel[this.level + 1]?.price
    }

    onPaid(): void {
        this.level += 1;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.fillStyle = this.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
        ctx.fillRect(positionInCamera.x, (positionInCamera.y - (this.height * METER_UNIT)), this.width * METER_UNIT, this.height * METER_UNIT)
    }
}