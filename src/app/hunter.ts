import { Npc } from "./npc";

export class Hunter extends Npc {
    constructor(x: number, y: number) {
        super(x, y, 25, 60, 50, 2, 4, "black");
    }
}