import { getRandomBetweenMinMax } from "../../utils/random.utils";
import { Character, Direction } from "./character";
import { GameMeter } from "../config";

export class Npc extends Character {


    private nextDecisionDuration: number = 0;

    private timeUntilNextDecision: number = this.nextDecisionDuration;
    private currentDirection: Direction = 0;

    constructor(x: GameMeter, y: GameMeter, width: GameMeter, height: GameMeter, speed: GameMeter, nextDecisionDurationMin: number, nextDecisionDurationMax: number, color: string) {
        super(x, y, width, height, speed, color);
        this.nextDecisionDuration = getRandomBetweenMinMax(nextDecisionDurationMin, nextDecisionDurationMax);
    }

    update(deltaSeconds: number, minX: GameMeter, maxX: GameMeter): void {
        this.timeUntilNextDecision -= deltaSeconds;

        if (this.timeUntilNextDecision <= 0) {
            const randomDirection: Direction = Math.round((Math.random() * 2) - 1) as Direction;
            this.currentDirection = randomDirection;
            this.timeUntilNextDecision = this.nextDecisionDuration;
        }

        this.move(this.currentDirection, deltaSeconds, minX, maxX)
    }
}