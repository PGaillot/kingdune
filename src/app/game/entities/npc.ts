import { getRandomBetweenMinMax } from "../../utils/random.utils";
import { Character, CharacterOptions } from "./character";
import { GameMeter } from "../config";
import { Direction } from "./player-controller";

export class Npc extends Character {

    private nextDecisionDuration: number = 0;

    private timeUntilNextDecision: number = this.nextDecisionDuration;
    private currentDirection: Direction = 0;

    constructor(x: GameMeter, y: GameMeter, nextDecisionDurationMin: number, nextDecisionDurationMax: number, options: Partial<CharacterOptions>) {
        super(x, y, options);
        this.nextDecisionDuration = getRandomBetweenMinMax(nextDecisionDurationMin, nextDecisionDurationMax);
    }

    update(deltaSeconds: number, minX: GameMeter, maxX: GameMeter): void {
        this.timeUntilNextDecision -= deltaSeconds;

        if (this.timeUntilNextDecision <= 0) {
            const randomDirection: Direction = Math.round((Math.random() * 2) - 1) as Direction;
            this.currentDirection = randomDirection;
            this.timeUntilNextDecision = this.nextDecisionDuration;
        }

        this.walk(this.currentDirection, deltaSeconds, minX, maxX)
    }
}