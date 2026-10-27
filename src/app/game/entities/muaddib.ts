import { GameMeter } from "../config";
import { CharacterOptions } from "./character";
import { Npc } from "./npc";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = {
    width: 0.5,
    height: 0.5,
    speed: 0.5,
    color: 'grey',
}

export class Muaddib extends Npc {



    constructor(x: GameMeter, y: GameMeter, options?: Partial<CharacterOptions>) {
        super(x, y, 2, 4, { ...DEFAULT_OPTIONS, ...options });
    }
}