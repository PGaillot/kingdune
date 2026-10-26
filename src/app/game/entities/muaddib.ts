import { GameMeter } from "../config";
import { Npc } from "./npc";

export class Muaddib extends Npc {
    constructor(x: GameMeter, y: GameMeter) {
        super(x, y, 0.5, 0.5, 0.5, 2, 4, "grey");
    }
}