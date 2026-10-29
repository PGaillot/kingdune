import { CENTER, GameMeter } from "../game/config";

export function mirrored<T>(distance: GameMeter, create: (x: GameMeter) => T): [T, T] {
    return [create(CENTER + distance), create(CENTER - distance)]
}