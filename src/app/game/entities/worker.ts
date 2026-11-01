import { GameMeter, Second } from "../config";
import { Workable } from "../interfaces/workable";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";
import { Purse } from "./purse";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = { color: 'green' }


export class Worker extends Npc<'build' | 'repair' | 'dig'> {

    task: Workable | undefined;
    purse: Purse = new Purse();
    /** La force de travail en WF/s fait baisser la WorkCharge. */
    workForce: number = 0.5;

    constructor(x: GameMeter, y: GameMeter, worldContext: WorldContext, options?: Partial<CharacterOptions>) {
        super(x, y, 2, 5, worldContext, { ...DEFAULT_OPTIONS, ...options })
    }

    // Pour faire travailler le worker !
    work(deltaSeconds: Second): void {
        if (this.task === undefined) return;
        this.task.workChargeLeft -= this.workForce * deltaSeconds;
        if (this.task.workChargeLeft <= 0) this.task = undefined;

    }

    override update(deltaSeconds: Second): void {
        switch (this.state) {
            case "idle":
                if (this.task) this.state = 'dig'
                super.update(deltaSeconds);
                break
            case "dig":
                if (this.task === undefined) return;
                const hasArrived: boolean = this.runTo(this.task.hitbox, deltaSeconds);
                if (hasArrived) this.work(deltaSeconds)
                if (this.task === undefined) this.state = 'idle'
                break;
        };
    }
}