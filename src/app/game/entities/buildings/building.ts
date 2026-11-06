import { Hitbox } from "../../../hitbox"
import { Camera } from "../../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../../config"

export type BuildingOption = {
    height: GameMeter,
    width: GameMeter,
    y: GameMeter,
    color: string
}


const DEFAULT_OPTIONS: BuildingOption = {
    height: 3,
    width: 5,
    y: GROUND,
    color: 'deepskyblue'
}

export class Building {
    readonly options: BuildingOption;

    constructor(
        public readonly x: GameMeter, options?: Partial<BuildingOption>
    ) {
        this.options = { ...DEFAULT_OPTIONS, ...options }
    }

    get hitbox(): Hitbox {
        return {
            height: this.options.height,
            width: this.options.width,
            x: this.x - (this.options.width / 2),
            y: this.options.y
        }
    };

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
        ctx.save();
        ctx.fillStyle = this.options.color;
        ctx.fillRect(positionInCamera.x, (positionInCamera.y - this.options.height * METER_UNIT), this.options.width * METER_UNIT, this.options.height * METER_UNIT)
        ctx.restore();
    }
}