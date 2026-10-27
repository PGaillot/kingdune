import { GameMeter } from "../config";
import { InputManager } from "../input-manager";
import { PlayerCharacter } from "./player-character";

/** -1 = gauche, 0 = immobile, 1 = droite */
export type Direction = -1 | 0 | 1;
export type DirectionHorizontalType = 'left' | 'idle' | 'right';
export const DIRECTION: Record<DirectionHorizontalType, Direction> = {
    left: -1,
    idle: 0,
    right: 1
}

export class PlayerController {

    constructor(
        protected inputManager: InputManager,
        protected playerCharacter: PlayerCharacter
    ) { }

    public update(deltaSeconds: number, minX: GameMeter, maxX: GameMeter): void {
        const isRunning: boolean = this.inputManager.isActive('run_left') || this.inputManager.isActive('run_right')
        if (isRunning) {
            this.playerCharacter.run(this.direction, deltaSeconds, minX, maxX);
        } else {
            this.playerCharacter.walk(this.direction, deltaSeconds, minX, maxX);
        }

        if (this.inputManager.isActive('drop')) {
            this.playerCharacter.dropCollectible();
        }

        if (this.inputManager.isActive('pay')) {
            this.playerCharacter.pay();
        }
    }

    private get direction(): Direction {
        const right = this.inputManager.isActive('move_right') ? 1 : 0;
        const left = this.inputManager.isActive('move_left') ? 1 : 0;
        return (right - left) as Direction;
    }

}                        