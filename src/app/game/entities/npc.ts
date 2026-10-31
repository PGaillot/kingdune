import { getRandomBetweenMinMax } from "../../utils/random.utils";
import { Character, CharacterOptions } from "./character";
import { GameMeter, Second } from "../config";
import { Direction } from "../config";
import { centerX, Hitbox } from "../../hitbox";

export type NpcState = 'idle' | 'escape';

export class Npc<AdditionalState extends string = never> extends Character {

    private nextDecisionDuration: number = 0;

    private timeUntilNextDecision: number = this.nextDecisionDuration;
    private currentDirection: Direction = 0;
    public state: NpcState | AdditionalState = 'idle'

    constructor(x: GameMeter, y: GameMeter, nextDecisionDurationMin: number, nextDecisionDurationMax: number, options: Partial<CharacterOptions>) {
        super(x, y, options);
        this.nextDecisionDuration = getRandomBetweenMinMax(nextDecisionDurationMin, nextDecisionDurationMax);
    }

    // (POUR LE MOMENT) pour faire aller le Worker jusqua son prochain taff
    runTo(hitbox: Hitbox, deltaSeconds: number, minX: GameMeter, maxX: GameMeter): boolean {
        const distance: number = centerX(hitbox) - centerX(this.hitbox);
        const direction: Direction = distance < 0 ? -1 : 1;
        if (Math.abs(distance) > 0.1) {
            this.run(direction, deltaSeconds, minX, maxX);
            return false;
        };
        return true;
    }

    update(deltaSeconds: Second, minX: GameMeter, maxX: GameMeter): void {
        this.timeUntilNextDecision -= deltaSeconds;
        if (this.timeUntilNextDecision <= 0) {
            const randomDirection: Direction = Math.round((Math.random() * 2) - 1) as Direction;
            this.currentDirection = randomDirection;
            this.timeUntilNextDecision = this.nextDecisionDuration;
        }
        this.walk(this.currentDirection, deltaSeconds, minX, maxX)
    }
}