import { centerX, overlaps } from "../../hitbox";
import { clamp } from "../../utils/clamp";
import { Camera } from "../camera";
import { Direction, GameMeter, Pace, Second } from "../config";
import { Purchasable } from "../interfaces/purchasable";
import { World } from "../world/world";
import { Character, CharacterOptions } from "./character";
import { Collectible } from "./collectible";
import { Purse } from "./purse";
import { PurseHUD } from "./purse-hud";

const STAMINA_MAX: number = 10;
const STAMINA_MIN: number = 0;
const STAMINA_MIN_FOR_RUN = 3;


const DEFAULT_OPTIONS: Partial<CharacterOptions> = {
    width: 1,
    height: 2,
    speed: 2.4,
    color: 'purple',
    runFactor: 1.9,
}

const STAMINA_RATE_BY_PACE: StaminaRates = { 'idle': 1, 'walk': 0.6, 'run': -0.8 }


export type StaminaRates = Record<Pace, number>;

export class PlayerCharacter extends Character {

    purse: Purse = new Purse();
    public target: Purchasable | undefined;
    private purseHUD: PurseHUD;
    stamina: number = STAMINA_MAX;

    constructor(
        x: GameMeter,
        y: GameMeter,
        worldStart: GameMeter,
        worldEnd: GameMeter,
        options?: Partial<CharacterOptions>
    ) {
        super(x, y, worldStart, worldEnd, { ...DEFAULT_OPTIONS, ...options });
        this.purseHUD = new PurseHUD(this.purse);
    }



    dropCollectible(world: World): void {
        const collectible: Collectible | undefined = this.purse.remove();
        if (collectible) {
            collectible.from = this;
            collectible.droppedBy = this;
            collectible.x = this.x;
            collectible.y = this.y + 1; // pour qu'ils tombent un peu
            world.collectibles.push(collectible)
        }
    }

    findTarget(purchasables: Purchasable[]): void {
        const onOverlappingCheck: Purchasable[] = purchasables.filter((purchasable: Purchasable) => overlaps(this.hitbox, purchasable.hitbox) && purchasable.currentPrice !== undefined);
        if (onOverlappingCheck.length >= 1) {
            this.target = onOverlappingCheck.reduce((a: Purchasable, b: Purchasable) =>
                Math.abs(centerX(a.hitbox) - centerX(this.hitbox)) < Math.abs(centerX(b.hitbox) - centerX(this.hitbox)) ? a : b
            )
            return
        }
        this.target = undefined;
    }

    pay(): void {
        if (!this.target) return;
        if (this.target.currentPrice !== undefined && this.purse.contentCount >= this.target.currentPrice) {
            for (let i = 0; i < this.target.currentPrice; i++) {
                this.purse.remove()
            }
            this.target.onPaid();
        }
    }

    moveWithStamina(askedPace: Pace, direction: Direction, deltaSeconds: Second): void {
        let pace: Pace = askedPace;
        console.log(this.stamina)

        if (pace === 'run' && this.stamina > STAMINA_MIN_FOR_RUN) {
            pace = 'run'
        } else {
            pace = 'walk'
        }

        this.stamina = clamp(this.stamina + STAMINA_RATE_BY_PACE[pace] * deltaSeconds, STAMINA_MIN, STAMINA_MAX);


        if (pace === 'run') this.run(direction, deltaSeconds)
        if (pace === 'walk') this.walk(direction, deltaSeconds)

    }

    override draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        super.draw(ctx, camera);
        this.purseHUD.draw(ctx);
    }

    update(deltaSeconds: number): void {
        this.purseHUD.updatePurse(deltaSeconds);
    }
}