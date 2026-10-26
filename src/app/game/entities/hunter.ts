import { GameMeter } from "../config";
import { Purse } from "../purse";
import { Npc } from "./npc";

export class Hunter extends Npc {

    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter) {
        super(x, y, 1, 2, 2, 2, 4, "black");
    }
}