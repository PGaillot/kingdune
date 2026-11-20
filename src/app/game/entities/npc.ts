import { getRandomBetweenMinMax } from "../../utils/random.utils";
import { Character, CharacterOptions } from "./character";
import { GameMeter, Second, Side } from "../config";
import { Direction } from "../config";
import { centerX, Hitbox } from "../../hitbox";
import { Clock } from "../clock";
import { Wall } from "./wall";

export type NpcState = 'idle' | 'escape';

export type WorldContext = {
    readonly sietchZone: Hitbox,
    readonly sideWalls: Record<Side, Wall>,
    readonly clock: Clock,
    readonly world: {
        start: GameMeter,
        center: GameMeter,
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

    goToHitbox(hitbox: Hitbox, deltaSeconds: Second, method: 'run' | 'walk' = 'walk'): boolean {
        const distance: number = centerX(hitbox) - centerX(this.hitbox);
        const direction: Direction = distance < 0 ? -1 : 1;
        if (Math.abs(distance) > 0.1) {
            this.navToDirection(deltaSeconds, direction, method)
            return false;
        };
        return true;
    }

    navToDirection(deltaSeconds: Second, direction: Direction, method: 'run' | 'walk' = 'walk'): void {
        if (method === "run") {
            this.run(direction, deltaSeconds);
        } else {
            this.walk(direction, deltaSeconds);
        }
    }

    idle(deltaSeconds: Second): void {
        this.timeUntilNextDecision -= deltaSeconds;
        if (this.timeUntilNextDecision <= 0) {
            const randomDirection: Direction = Math.round((Math.random() * 2) - 1) as Direction;
            this.currentDirection = randomDirection;
            this.timeUntilNextDecision = this.nextDecisionDuration;
        }
        this.walk(this.currentDirection, deltaSeconds)
    }

    update(deltaSeconds: Second): void {
        this.idle(deltaSeconds);
    }

    idleInArea(deltaSeconds: Second, hitbox: Hitbox, method: 'run' | 'walk' = 'walk', margin: GameMeter = 0): void {
        const start: GameMeter = hitbox.x - margin;
        const end: GameMeter = hitbox.x + hitbox.width + margin

        const distance: number = centerX(hitbox) - centerX(this.hitbox);
        const direction: Direction = distance < 0 ? -1 : 1;
        const inZone: boolean = this.hitbox.x > start && (this.hitbox.x + this.hitbox.width) < end;

        if (!inZone) {
            this.currentDirection = direction;
            this.timeUntilNextDecision = this.nextDecisionDuration;
            this.navToDirection(deltaSeconds, direction, method)
            return
        };
        this.idle(deltaSeconds)
    }
}