import { getRandomBetweenMinMax } from "../../utils/random.utils";
import { Character, CharacterOptions } from "./character";
import { GameMeter, Second } from "../config";
import { Direction } from "../config";
import { centerX, Hitbox } from "../../hitbox";
import { Clock } from "../clock";

export type NpcState = 'idle' | 'escape';

export type WorldContext = {
    readonly sietchZone: Hitbox,
    readonly clock: Clock,
    readonly world: {
        start: GameMeter,
        end: GameMeter
    }
}

export class Npc<AdditionalState extends string = never> extends Character {

    private nextDecisionDuration: number = 0;

    private timeUntilNextDecision: number = this.nextDecisionDuration;
    private currentDirection: Direction = 0;
    public state: NpcState | AdditionalState = 'idle';

    constructor(
        x: GameMeter,
        y: GameMeter,
        nextDecisionDurationMin: number,
        nextDecisionDurationMax: number,
        public worldContext: WorldContext,
        options: Partial<CharacterOptions>
    ) {
        super(x, y, worldContext.world.start, worldContext.world.end, options);
        this.nextDecisionDuration = getRandomBetweenMinMax(nextDecisionDurationMin, nextDecisionDurationMax);
    }

    updateWorldContexte(context: WorldContext): void {
        this.worldContext = context;
    }

    // (POUR LE MOMENT) pour faire aller le Worker jusqua son prochain taff
    runTo(hitbox: Hitbox, deltaSeconds: number): boolean {
        const distance: number = centerX(hitbox) - centerX(this.hitbox);
        const direction: Direction = distance < 0 ? -1 : 1;
        if (Math.abs(distance) > 0.1) {
            this.run(direction, deltaSeconds);
            return false;
        };
        return true;
    }

    update(deltaSeconds: Second): void {
        this.timeUntilNextDecision -= deltaSeconds;
        if (this.timeUntilNextDecision <= 0) {
            const randomDirection: Direction = Math.round((Math.random() * 2) - 1) as Direction;
            this.currentDirection = randomDirection;
            this.timeUntilNextDecision = this.nextDecisionDuration;
        }
        this.walk(this.currentDirection, deltaSeconds)
    }
}