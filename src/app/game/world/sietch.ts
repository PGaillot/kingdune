import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { CENTER, GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../config";
import { Purchasable } from "../interfaces/purchasable";

const SIETCH_IMAGE_LVL_0: HTMLImageElement = new Image();
SIETCH_IMAGE_LVL_0.src = '/ressources/sietch/sietch_level_0.png'

export class Sietch implements Purchasable {
    height: GameMeter = 1;
    width: GameMeter = 3;
    imageHeight: GameMeter = 7;
    imageWidth: GameMeter = 15;

    constructor() { }

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
            x: CENTER - (this.width / 2),
            y: GROUND,
        }
    }


    get position(): GameMeter {
        return this.hitbox.x
    }

    get currentPrice(): number | undefined { return this.nextSietchLevelPrice };


    get nextSietchLevelPrice(): number | undefined {
        return this.sietchLevel[this.level + 1]?.price
    }

    onPaid(): void {
        this.level += 1;
    }

    private get sietchImage(): HTMLImageElement {
        return SIETCH_IMAGE_LVL_0
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const positionInCamera: ScreenPoint = camera.convert({ x: CENTER, y: this.hitbox.y })
        ctx.drawImage(this.sietchImage, positionInCamera.x - ((this.imageWidth * METER_UNIT) / 2), (positionInCamera.y - (this.imageHeight * METER_UNIT)), this.imageWidth * METER_UNIT, this.imageHeight * METER_UNIT)
        ctx.restore();
    }
}