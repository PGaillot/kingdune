import { Hitbox, overlaps } from "../../hitbox";
import { applyPhysics, MIN_BOUNCE_SPEED, PhysicsEvent } from "../physics";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, MeterPerSecond, Pixel, ScreenPoint, Second } from "../config";
import type { PurseCharacter } from "./purse";
import { AudioEvent } from "../audio-manager";
import { inverseLerp } from "../../utils/inverse-lerp";

export type CollectibleOptions = {
    height: GameMeter,
    width: GameMeter,
    image?: HTMLImageElement,
    purseImage?: HTMLImageElement,
    purseImageHeight: GameMeter,
    purseImageWidth: GameMeter,
}

const DEFAULT_OPTIONS: CollectibleOptions = {
    height: 1,
    width: 1,
    purseImageHeight: 0.2,
    purseImageWidth: 0.5,
}

const MAX_BOUNCE_HIT: MeterPerSecond = 4;

export class Collectible {

    readonly options: CollectibleOptions;
    from: PurseCharacter | undefined = undefined;
    droppedBy: PurseCharacter | undefined = undefined;
    /** la vitesse sur X pour la physique tout ca tout ça ! */
    vX: number = 0;
    /** la vitesse sur Y pour la physique, faut bien que ça tombe. */
    vY: number = 0;

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
            x: this.x - (this.options.width / 2),
            y: this.y
        }
    };

    private get isNotFalling(): boolean {
        return this.vX === 0 && this.vY >= 0;
    }

    update(deltaSeconds: Second): AudioEvent | undefined {
        const event: PhysicsEvent | undefined = applyPhysics(deltaSeconds, this, GROUND);
        let soundEvent: AudioEvent | undefined;
        if (event !== undefined) {
            switch (event.type) {
                case 'hitGround':
                    const hitValue: MeterPerSecond = event.value;
                    const hitVolume: number = inverseLerp(hitValue, MIN_BOUNCE_SPEED, MAX_BOUNCE_HIT);
                    soundEvent = { type: 'hitGround', volume: hitVolume }
            }
        }
        if (this.droppedBy === undefined) return soundEvent
        const isOverlap: boolean = overlaps(this.hitbox, this.droppedBy.hitbox);
        if (!isOverlap) this.droppedBy = undefined;
        return soundEvent
    }

    canBePickedBy(character: PurseCharacter): boolean {
        return character !== this.droppedBy && this.isNotFalling
    }

    resetSpeed(): void {
        this.vX = 0;
        this.vY = 0;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.save();
        const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
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