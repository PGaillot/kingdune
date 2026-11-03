import { GameMeter, Second } from "../config";
import { CharacterOptions } from "./character";
import { Npc } from "./npc";
import { PyonsCamp } from "./pyons-camp";

const DEFAULT_PYON_OPTIONS: Partial<CharacterOptions> = {
    color: 'beige',
    speed: 0.7,
    runFactor: 2.3
}

export class Pyon extends Npc {
    constructor(x: GameMeter, y: GameMeter, public createdBy: PyonsCamp, options?: Partial<CharacterOptions>) {
        super(x, y, 3, 5, createdBy.worldContext, { ...DEFAULT_PYON_OPTIONS, ...options })
    }

    override update(deltaSeconds: Second): void {
        this.idleInArea(deltaSeconds, this.createdBy.hitbox, 'walk', 3)
    }
}