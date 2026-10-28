import { Hitbox, overlaps } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, METER_UNIT, ScreenPoint } from "../config";
import { Character } from "./character";

export type CollectibleOptions = {
    height: GameMeter,
    width: GameMeter,
    color: string,
}

const DEFAULT_OPTIONS: CollectibleOptions = {
    height: 1,
    width: 1,
    color: 'white',
}

export class Collectible {

    readonly options: CollectibleOptions;
    droppedBy: Character | undefined = undefined

    constructor(
        public x: GameMeter,
        public y: GameMeter,
        options: Partial<CollectibleOptions> = {}
    ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    get hitbox(): Hitbox {
        return {
            height: this.options.height,
            width: this.options.width,
            x: this.x,
            y: this.y
        }
    };

    update(): void {
        if (this.droppedBy === undefined) return
        const isOverlap: boolean = overlaps(this.hitbox, this.droppedBy.hitbox);
        if (!isOverlap) this.droppedBy = undefined;
    }

    canBePickedBy(character: Character): boolean {
        return character !== this.droppedBy
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.fillStyle = this.options.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.x, y: this.y })
        ctx.fillRect(
            positionInCamera.x,
            (positionInCamera.y - (this.options.height * METER_UNIT)),
            this.options.width * METER_UNIT,
            this.options.height * METER_UNIT)
    }

}