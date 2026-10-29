import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { CENTER, Direction, GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../config";
import { Purchasable } from "../interfaces/purchasable";

const IMAGE_LVL_0: HTMLImageElement = new Image();
const IMAGE_LVL_1: HTMLImageElement = new Image();
const IMAGE_LVL_2: HTMLImageElement = new Image();
const IMAGE_LVL_3: HTMLImageElement = new Image();

IMAGE_LVL_0.src = '/ressources/wall/wall_level_0.png';
IMAGE_LVL_1.src = '/ressources/wall/wall_level_1.png';
IMAGE_LVL_2.src = '/ressources/wall/wall_level_2.png';
IMAGE_LVL_3.src = '/ressources/wall/wall_level_3.png';

const WALL_LEVEL: Record<number, { price: number, life: number, image: HTMLImageElement }> = {
    0: { price: 0, life: 0, image: IMAGE_LVL_0 },
    1: { price: 1, life: 10, image: IMAGE_LVL_1 },
    2: { price: 3, life: 25, image: IMAGE_LVL_2 },
    3: { price: 5, life: 50, image: IMAGE_LVL_3 }
}

export class Wall implements Purchasable {

    constructor(public positionX: GameMeter, private level: number = 0) { }

    public readonly width: GameMeter = 2;
    public readonly height: GameMeter = 3;

    get currentLevel(): number {
        return this.level;
    }

    get life(): number {
        return WALL_LEVEL[this.level].life
    }

    private get image(): HTMLImageElement {
        return WALL_LEVEL[this.level].image
    }

    private get levelMax(): number {
        return Object.keys(WALL_LEVEL).length - 1
    }


    levelUp(): void {
        if (this.level < this.levelMax) this.level += 1;
    }

    get hitbox(): Hitbox {
        return {
            height: this.height,
            width: this.width,
            x: this.positionX - (this.width / 2),
            y: GROUND
        }
    };

    get currentPrice(): number | undefined {
        return this.nextWallLevelPrice;
    };

    get nextWallLevelPrice(): number | undefined {
        return WALL_LEVEL[this.level + 1]?.price
    };

    get orientation(): Direction {
        return this.positionX >= CENTER ? 1 : -1
    }

    onPaid(): void {
        this.levelUp()
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.save();
        const position: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y });
        ctx.imageSmoothingEnabled = false;
        if (this.orientation > 0) { // si c'est a droite
            ctx.translate(position.x + this.hitbox.width * METER_UNIT, position.y - (this.hitbox.height * METER_UNIT));
            ctx.scale(-1, 1);
        } else {
            ctx.translate(position.x, position.y - (this.hitbox.height * METER_UNIT));
        }
        ctx.drawImage(this.image, 0, 0, this.hitbox.width * METER_UNIT, this.hitbox.height * METER_UNIT)
        ctx.restore();
    }

}