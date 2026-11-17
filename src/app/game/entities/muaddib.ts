import { Hitbox } from "../../hitbox";
import { GameMeter, Second } from "../config";
import type { Bush } from "./bush";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = {
    width: 0.5,
    height: 0.5,
    speed: 0.5,
    color: 'grey',
}

// fake zone en attendant de coder vraiment les biomes, les zones et tout ça !
const FAKE_ZONE:Hitbox = {
    height:1,
    width:10,
    x:0,
    y:0
}

export class Muaddib extends Npc {

    constructor(x: GameMeter, y: GameMeter, worldContext: WorldContext,public attachAt?:Bush, options?: Partial<CharacterOptions>) {
        super(x, y, 2, 4, worldContext, { ...DEFAULT_OPTIONS, ...options });
    }

    override update(deltaSeconds: Second):void {
        const idleZone:Hitbox = this.attachAt === undefined ? FAKE_ZONE : this.attachAt.hitbox;
        this.idleInArea(deltaSeconds, idleZone, 'walk' , 3)
    }
}