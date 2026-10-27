import { GameMeter } from "../config";
import { CharacterOptions } from "./character";
import { Npc } from "./npc";
import { Purse } from "./purse";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = { color: 'green' }

export class Builder extends Npc {

    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter, options?: Partial<CharacterOptions>) {
        super(x, y, 2, 5, { ...DEFAULT_OPTIONS, ...options })
    }
}