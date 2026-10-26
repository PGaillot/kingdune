import { GameMeter } from "../config";
import { InputManager } from "../input-manager";
import { PlayerCharacter } from "./player-character";

/** -1 = gauche, 0 = immobile, 1 = droite */
export type Direction = -1 | 0 | 1;

export class PlayerController {

    constructor(
        protected inputManager: InputManager,
        protected playerCharacter: PlayerCharacter
    ) { }

    public update(deltaSeconds: number, minX: GameMeter, maxX: GameMeter): void {
        this.playerCharacter.move(this.direction, deltaSeconds, minX, maxX)
    }

    private get direction(): Direction {
        const right = this.inputManager.isActive('move_right') ? 1 : 0;
        const left = this.inputManager.isActive('move_left') ? 1 : 0;
        return (right - left) as Direction;
    }

}                        