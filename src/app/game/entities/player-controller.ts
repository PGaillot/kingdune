import { Direction, Pace, Second } from "../config";
import { InputManager } from "../input-manager";
import { World } from "../world/world";
import { PlayerCharacter } from "./player-character";

export type DirectionHorizontalType = 'left' | 'idle' | 'right';
export const DIRECTION: Record<DirectionHorizontalType, Direction> = {
    left: -1,
    idle: 0,
    right: 1
}


/**
 * Le cerveau de notre player, c'est lui qui prends les descisions
 */
export class PlayerController {

    constructor(
        protected inputManager: InputManager,
        protected playerCharacter: PlayerCharacter
    ) { }


    public update(deltaSeconds: Second, world: World): void {
        let currentPace: Pace = 'idle'
        const isRunning: boolean = this.inputManager.isActive('run_left') || this.inputManager.isActive('run_right')
        this.playerCharacter.findTarget(world.purchasables)
        if (isRunning && this.direction !== 0) {
            currentPace = 'run'
        } else if (this.direction !== 0) {
            currentPace = 'walk';
        } else {
            currentPace = 'idle'
        }

        this.playerCharacter.moveWithStamina(currentPace, this.direction, deltaSeconds)

        if (this.inputManager.isActive('drop')) {
            this.playerCharacter.dropCollectible(world);
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