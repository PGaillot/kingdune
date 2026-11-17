import { Camera } from "./camera";
import { GameMeter, METER_UNIT, ScreenPoint } from "./config";
import { Purchasable } from "./interfaces/purchasable";
import { centerX } from "../hitbox";

const PLACEHOLDER: HTMLImageElement = new Image();
PLACEHOLDER.src = 'ressources/waterring/waterring_placeholder_1.png';

export function targetHighlight(ctx: CanvasRenderingContext2D, camera: Camera, object: Purchasable, isTarget: boolean): void {

    ctx.save()
    ctx.imageSmoothingEnabled = false;
    const currentPrice: number | undefined = object.currentPrice;
    if (isTarget && currentPrice !== undefined) ctx.filter = 'brightness(0.6)';
    const placeHolderWateringSize: GameMeter = 1;
    object.draw(ctx, camera);
    if (isTarget && currentPrice !== undefined) {
        ctx.filter = 'opacity(0.35)';
        for (let i = 0; i < currentPrice; i++) {
            const positionInCamera: ScreenPoint = camera.convert({ x: centerX(object.hitbox), y: object.hitbox.y });
            ctx.drawImage(PLACEHOLDER, positionInCamera.x - (placeHolderWateringSize * METER_UNIT) / 2, positionInCamera.y - (4 * METER_UNIT) - (i * (METER_UNIT + 10)), placeHolderWateringSize * METER_UNIT, placeHolderWateringSize * METER_UNIT)
        }
    }
    ctx.restore();
}