import { GameMeter, Second } from "../config";
import { Tool } from "./buildings/shop";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";

const DEFAULT_FREMEN_OPTION: Partial<CharacterOptions> = {
    color: 'cadetblue',
}

/** Un Fremen est un Pyon qui a recu une piéce, il attend qu'on lui donne un taff de dispo. */
export class Fremen extends Npc {

    tool: Tool | undefined;

    constructor(x: GameMeter, y: GameMeter, worldContext: WorldContext, option?: CharacterOptions) {
        super(x, y, 1, 2, worldContext, { ...DEFAULT_FREMEN_OPTION, ...option })
    };

    override update(deltaSeconds: Second): void {
        this.idleInArea(deltaSeconds, this.worldContext.sietchZone, 'walk');
    };
}