import { GameMeter, Second } from "../config";
import { Workable } from "../interfaces/workable";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";
import { Purse } from "./purse";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = { color: 'green' }


/**
 * Les Ouvrier sont des NPC essenciel dans le jeu.
 * Les fremens deviennent Ouvrier uniquement si un Marteau lui est accessible.
 * Au service du joueur ils peuvent ;
 *  - construire un batiment
 *  - reparé un mur abimé
 *  - reconstruire un mur completement détriut
 *  - fouiller les catchbasin, (l'équivalent de couper des arbres dans Kingdom)
 *  - TODO: - pousser la bombe pour detruire le maxi portail
 *  - TODO: - controller la catapulte
 *  - TODO: - pousser les barils pour la catapulte
 *  @param x sa position dans le monde en GameMeter
 *  @param y sa position en hauteur, y'as 99.92% de chance que ce soit juste le GROUND, donc 0.
 *  @param worldContext des infos sur le monde. c'est très pratique. pour ne pas tomber par exemple.
 *  @param options des options facultative, taille, couleur, image ...
 */
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
                const hasArrived: boolean = this.goToHitbox(this.task.hitbox, deltaSeconds, 'run');
                if (hasArrived) this.work(deltaSeconds)
                if (this.task === undefined) this.state = 'idle'
                break;
        };
    }
}