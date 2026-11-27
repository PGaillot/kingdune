import { GameMeter, MeterPerSecond } from "../game/config";
import { Cooldown } from "../game/cooldown";
import { Collectible } from "../game/entities/collectible";
import { PurseHolder } from "../game/entities/purse";
import { centerX } from "../hitbox";

export function throwCollectibleAtDistance(launcher: PurseHolder, collectible: Collectible, throwDistance: GameMeter): Collectible {
    const verticalSpeed: MeterPerSecond = 3;
    collectible.x = centerX(launcher.hitbox);
    collectible.vX = throwDistance;
    collectible.vY = verticalSpeed;
    collectible.droppedBy = launcher;
    return collectible;
}

export function throwCollectible(launcher: PurseHolder, throwDistance: GameMeter, cooldown: Cooldown): Collectible | undefined {
    if (cooldown.isReady) {
        const collectibleRemoved: Collectible | undefined = launcher.purse.remove();
        if (collectibleRemoved === undefined) return
        cooldown.start()
        return throwCollectibleAtDistance(launcher, collectibleRemoved, throwDistance)
    }
    return undefined
}
