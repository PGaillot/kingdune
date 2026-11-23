import { GameMeter } from "./game/config";

export interface Hitbox {
    height: GameMeter,
    width: GameMeter,
    x: GameMeter,
    y: GameMeter,
    strokeDebugColor?: string;
    fillDebugColor?: string;
}

export function overlaps(a: Hitbox, b: Hitbox): boolean {
    // L'objet A
    const aBeginX: GameMeter = a.x;
    const aEndX: GameMeter = a.x + a.width;
    const aBeginY: GameMeter = a.y;
    const aEndY: GameMeter = a.y + a.height;
    // L'objet B
    const bBeginX: GameMeter = b.x;
    const bEndX: GameMeter = b.x + b.width;
    const bBeginY: GameMeter = b.y;
    const bEndY: GameMeter = b.y + b.height;

    const aIsLeftOfB: boolean = aEndX < bBeginX;
    const aIsRightOfB: boolean = bEndX < aBeginX;
    const aIsBottomOfB: boolean = aEndY < bBeginY;
    const aIsTopOfB: boolean = bEndY < aBeginY;

    return !(aIsLeftOfB || aIsRightOfB) && !(aIsTopOfB || aIsBottomOfB)
}

export function centerX(hitbox: Hitbox): GameMeter {
    return hitbox.x + (hitbox.width / 2)
}