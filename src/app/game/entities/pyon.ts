import { GameMeter, Second } from "../config";
import { CharacterOptions } from "./character";
import { Npc } from "./npc";
import { Purse } from "./purse";
import { PyonsCamp } from "./pyons-camp";

const DEFAULT_PYON_OPTIONS: Partial<CharacterOptions> = {
    color: 'beige',
    speed: 0.7,
    runFactor: 2.3
}

export class Pyon extends Npc {

    // meme si dans absolue il n'y faut qu'une piece pour devenir un FREMEN, faut bien la stocker,
    // et autant garder la même facon de faire.

    // ou alors faire juste une fonction des qu'il recoit une piece pas besoin de la stoker , il devient direct un fremen.
    // dans ce cas pas de bou-bourse ... 
    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter, public createdBy: PyonsCamp, options?: Partial<CharacterOptions>) {
        super(x, y, 3, 5, createdBy.worldContext, { ...DEFAULT_PYON_OPTIONS, ...options })
    }

    override update(deltaSeconds: Second): void {
        this.idleInArea(deltaSeconds, this.createdBy.hitbox, 'walk', 3)
    }
}