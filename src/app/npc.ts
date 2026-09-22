import { Character, Direction } from "./components/game/character";

export class Npc extends Character {


    private nextDecisionDuration: number = 0;

    private timeUntilNextDecision: number = this.nextDecisionDuration;
    private currentDirection: Direction = 0;
    hitbox: { height: number, width: number, position: { x: number, y: number } } | undefined;

    constructor(x: number, y: number, width: number, height: number, speed: number, nextDecisionDurationMin: number, nextDecisionDurationMax: number, color: string) {
        super(x, y, width, height, speed, color);
        this.nextDecisionDuration = this.getRandomBetweenMinMax(nextDecisionDurationMin, nextDecisionDurationMax);
    }

    getRandomBetweenMinMax(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    update(deltaSeconds: number, minX: number, maxX: number): void {
        this.timeUntilNextDecision -= deltaSeconds;

        if (this.timeUntilNextDecision <= 0) {
            const randomDirection: Direction = Math.round((Math.random() * 2) - 1) as Direction;
            this.currentDirection = randomDirection;
            this.timeUntilNextDecision = this.nextDecisionDuration;
        }

        this.move(this.currentDirection, deltaSeconds, minX, maxX)
    }
}