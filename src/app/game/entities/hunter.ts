import { GameMeter } from "../config";
import { CharacterOptions } from "./character";
import { Npc } from "./npc";
import { Purse } from "./purse";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = { color: 'black' }

export class Hunter extends Npc<'hunt' | 'protect_sietch'> {

    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter, options?: Partial<CharacterOptions>) {
        super(x, y, 2, 4, { ...DEFAULT_OPTIONS, ...options });
    }
}