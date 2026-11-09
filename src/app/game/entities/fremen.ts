import { GameMeter, Second } from "../config";
import { Tool } from "./buildings/shop";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";
import { Purse } from "./purse";

const DEFAULT_FREMEN_OPTION: Partial<CharacterOptions> = {
    color: 'cadetblue',
}

/** Un Fremen est un Pyon qui a recu une piéce, il attend qu'on lui donne un taff de dispo. */
export class Fremen extends Npc {

    toolTargeted: Tool | undefined;
    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter, worldContext: WorldContext, option?: CharacterOptions) {
        super(x, y, 1, 2, worldContext, { ...DEFAULT_FREMEN_OPTION, ...option })
    };

    override update(deltaSeconds: Second): void {
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