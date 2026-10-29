import { Hitbox, overlaps } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, METER_UNIT, Pixel, ScreenPoint } from "../config";
import { Character } from "./character";


export type CollectibleOptions = {
    height: GameMeter,
    width: GameMeter,
    image?: HTMLImageElement,
}


const DEFAULT_OPTIONS: CollectibleOptions = {
    height: 1,
    width: 1,
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
        ctx.save();
        const positionInCamera: ScreenPoint = camera.convert({ x: this.x, y: this.y })
        const postionOptions: { dX: Pixel, dY: Pixel } = { dX: positionInCamera.x, dY: positionInCamera.y - (this.options.height * METER_UNIT) }
        const dimentionOptions: { dW: Pixel, dH: Pixel } = { dW: this.options.width * METER_UNIT, dH: this.options.height * METER_UNIT }
        ctx.imageSmoothingEnabled = false;
        if (this.options.image) {
            ctx.drawImage(
                this.options.image,
                postionOptions.dX,
                postionOptions.dY,
                dimentionOptions.dW,
                dimentionOptions.dH)
        } else {
            ctx.fillStyle = "silver"
            ctx.fillRect(
                postionOptions.dX,
                postionOptions.dY,
                dimentionOptions.dW,
                dimentionOptions.dH
            )

        }
        ctx.restore();
    }

}