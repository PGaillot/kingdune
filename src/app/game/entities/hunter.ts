import { GameMeter } from "../config";
import { Npc } from "./npc";

export class Hunter extends Npc {
    constructor(x: GameMeter, y: GameMeter) {
        super(x, y, 1, 2, 2, 2, 4, "black");
    }
}