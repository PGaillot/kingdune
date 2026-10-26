import { Npc } from "./npc";

export class Muaddib extends Npc {
    constructor(x: number, y: number) {
        super(x, y, 0.5, 0.5, 0.5, 2, 4, "grey");
    }
}