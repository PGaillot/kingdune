import { Hitbox, overlaps } from "../../hitbox";
import { applyPhysics, PhysicsEventType } from "../physics";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, Pixel, ScreenPoint, Second } from "../config";
import type { PurseCharacter } from "./purse";

const WATERRING_HITGROUND_SOUND: HTMLAudioElement = new Audio('/ressources/sound_fx/waterring/waterring_impact_sand_0.mp3');

export type CollectibleOptions = {
    height: GameMeter,
    width: GameMeter,
    image?: HTMLImageElement,
    purseImage?: HTMLImageElement,
    purseImageHeight: GameMeter,
    purseImageWidth: GameMeter,
    sounds: {
        hitGroundSounds: HTMLAudioElement
    }
}

const DEFAULT_OPTIONS: CollectibleOptions = {
    height: 1,
    width: 1,
    purseImageHeight: 0.2,
    purseImageWidth: 0.5,
    sounds: {
        hitGroundSounds: WATERRING_HITGROUND_SOUND
    }
}

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

    update(deltaSeconds: Second): void {
        applyPhysics(deltaSeconds, this, GROUND)
        const event: { event: PhysicsEventType } | undefined = applyPhysics(deltaSeconds, this, GROUND);
        if (event !== undefined) {
            this.options.sounds.hitGroundSounds.play();
        }
        if (this.droppedBy === undefined) return
        const isOverlap: boolean = overlaps(this.hitbox, this.droppedBy.hitbox);
        if (!isOverlap) this.droppedBy = undefined;
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