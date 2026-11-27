import { DELAY_BETWEEN_THROW_COLLECTIBLE, GameMeter, Second } from "../config";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";
import { Purse } from "./purse";
import { Tool } from "./tool";
import { CollectibleThrower } from '../interfaces/collectible-thrower'
import { Collectible } from "./collectible";
import { throwCollectible } from "../../utils/throw-collectible";
import { Cooldown } from "../cooldown";

const DEFAULT_FREMEN_OPTION: Partial<CharacterOptions> = {
    color: 'cadetblue',
    runFactor: 1.5
}

/** Un Fremen est un Pyon qui a recu une piéce, il attend qu'on lui donne un taff de dispo. */
export class Fremen extends Npc implements CollectibleThrower {

    toolTargeted: Tool | undefined;
    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter, worldContext: WorldContext, option?: CharacterOptions) {
        super(x, y, 1, 2, worldContext, { ...DEFAULT_FREMEN_OPTION, ...option })
    }

    private throwCollectibleCooldown: Cooldown = new Cooldown(DELAY_BETWEEN_THROW_COLLECTIBLE);

    throwCollectible(throwDistance: GameMeter): Collectible | undefined {
        return throwCollectible(this, throwDistance, this.throwCollectibleCooldown)
    }

    override update(deltaSeconds: Second): void {
        this.throwCollectibleCooldown.update(deltaSeconds);
        switch (this.state) {
            case "idle":
                if (this.toolTargeted === undefined) {
                    this.idleInArea(deltaSeconds, this.worldContext.sietchZone, 'walk');
                } else {
                    this.goToHitbox(this.toolTargeted.hitbox, deltaSeconds, 'run')
                }
                break
            case "escape":
                this.idleInArea(deltaSeconds, this.worldContext.sietchZone, 'run');
                break
        }
    };
}