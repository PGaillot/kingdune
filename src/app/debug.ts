import { Camera } from "./game/camera";
import { METER_UNIT, Pixel, ScreenPoint } from "./game/config";
import { PurseHolder } from "./game/entities/purse";
import { centerX, Hitbox } from "./hitbox";

export function drawDebugHitbox(ctx: CanvasRenderingContext2D, camera: Camera, hitbox: Hitbox) {
    ctx.save();
    ctx.strokeStyle = hitbox.strokeDebugColor ?? "greenyellow";
    const cameraPosition: ScreenPoint = camera.convert({ x: hitbox.x, y: hitbox.y })
    ctx.strokeRect(cameraPosition.x, (cameraPosition.y - (hitbox.height * METER_UNIT)), hitbox.width * METER_UNIT, hitbox.height * METER_UNIT);
    ctx.restore();
}

export function drawViewHitbox(ctx: CanvasRenderingContext2D, camera: Camera, hitbox: Hitbox) {
    ctx.save();
    ctx.fillStyle = hitbox.fillDebugColor ?? "yellow";
    ctx.globalAlpha = 0.25;
    const cameraPosition: ScreenPoint = camera.convert({ x: hitbox.x, y: hitbox.y })
    ctx.fillRect(cameraPosition.x, (cameraPosition.y - (hitbox.height * METER_UNIT)), hitbox.width * METER_UNIT, hitbox.height * METER_UNIT);
    ctx.restore();
}


export function drawDebugWaterringsCount(ctx: CanvasRenderingContext2D, camera: Camera, character: PurseHolder): void {
    if (character.purse.contentCount === 0) return
    ctx.save()
    const position: ScreenPoint = camera.convert({ x: centerX(character.hitbox), y: character.hitbox.y })
    const marginTop: Pixel = 0.2 * METER_UNIT
    ctx.textAlign = 'center'
    ctx.fillText(character.purse.contentCount.toString(), position.x, position.y - character.hitbox.height * METER_UNIT - marginTop)
    ctx.restore()
}