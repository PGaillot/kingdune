import { Camera } from "./camera";
import { GameMeter, METER_UNIT, ScreenPoint } from "./config";
import { Purchasable } from "./interfaces/purchasable";
import { centerX } from "../hitbox";

export function targetHighlight(ctx: CanvasRenderingContext2D, camera: Camera, object: Purchasable, isTarget: boolean): void {
    ctx.save()
    ctx.imageSmoothingEnabled = false;

    const placeHolderWateringSize: GameMeter = 1;

    if (isTarget && object.currentPrice !== undefined) {
        ctx.fillStyle = 'brown';
        for (let i = 0; i < object.currentPrice; i++) {
            const positionInCamera: ScreenPoint = camera.convert({ x: centerX(object.hitbox), y: object.hitbox.y });
            ctx.fillRect(positionInCamera.x - (placeHolderWateringSize * METER_UNIT) / 2, positionInCamera.y - (4 * METER_UNIT) - (i * (METER_UNIT + 20)), placeHolderWateringSize * METER_UNIT, placeHolderWateringSize * METER_UNIT)
        }
        ctx.filter = 'brightness(0.6)';
    }
    object.draw(ctx, camera);

    ctx.restore();
}