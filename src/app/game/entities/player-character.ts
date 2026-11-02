import { centerX, overlaps } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter } from "../config";
import { Purchasable } from "../interfaces/purchasable";
import { World } from "../world/world";
import { Character, CharacterOptions } from "./character";
import { Collectible } from "./collectible";
import { Purse } from "./purse";
import { PurseHUD } from "./purse-hud";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = {
    width: 1,
    height: 2,
    speed: 2.4,
    color: 'purple',
    runFactor: 1.9,
}

export class PlayerCharacter extends Character {

    purse: Purse = new Purse(20);
    public target: Purchasable | undefined;
    private purseHUD: PurseHUD;

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
            collectible.x = this.x;
            collectible.y = this.y + 1; // pour qu'ils tombent un peu
            collectible.droppedBy = this;
            world.collectibles.push(collectible)
        }
    }

    findTarget(purchasables: Purchasable[]): void {
        const onOverlappingCheck: Purchasable[] = purchasables.filter((purchasable: Purchasable) => overlaps(this.hitbox, purchasable.hitbox) && purchasable.currentPrice !== undefined);
        if (onOverlappingCheck.length >= 1) {
            this.target = onOverlappingCheck.reduce((a: Purchasable, b: Purchasable) =>
                Math.abs(centerX(a.hitbox) - centerX(this.hitbox)) < Math.abs(centerX(b.hitbox) - centerX(this.hitbox)) ? a : b
            )
        } else {
            this.target = undefined;
        }
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

    override draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        super.draw(ctx, camera);
        this.purseHUD.draw(ctx);
    }

    update(deltaSeconds: number): void {
        this.purseHUD.updatePurse(deltaSeconds);
    }
}