import { Npc } from "./npc";

export class Rabbit extends Npc {
    constructor(x: number, y: number) {
        super(x, y, 25, 25, 30, 2, 4, "grey");
    }
}