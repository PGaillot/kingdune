import { Hitbox } from "../../hitbox";
import { GameMeter, Second } from "../config";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";
import { Purse } from "./purse";
import { PyonsCamp } from "./pyons-camp";

const DEFAULT_PYON_OPTIONS: Partial<CharacterOptions> = {
    color: 'beige',
    speed: 0.7,
    runFactor: 2.3
}


/**
 * Le Pyon est un NPC qui apparait de facon régulière au PyonsCamp.
 * Il n'est pas rataché au sietch, Il reste autour de son camp
 * en attendant un waterring donnée par le Joueur (uniquement).
 * Un fois que celui ci à reccuperé un waterring, il se tranforme en fremen.
 */
export class Pyon extends Npc {
    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter, worldContext: WorldContext, public createdBy?: PyonsCamp, options?: Partial<CharacterOptions>) {
        super(x, y, 3, 5, worldContext, { ...DEFAULT_PYON_OPTIONS, ...options })
    }

    override update(deltaSeconds: Second): void {
        const idleZone: Hitbox = this.createdBy === undefined ? this.worldContext.sietchZone : this.createdBy.hitbox;
        this.idleInArea(deltaSeconds, idleZone, 'walk', 3)
    }
}