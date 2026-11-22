import { Pixel, METER_UNIT, SCREEN_WIDTH, GameMeter, Second, MeterPerSecond, Radian } from "../config";
import { applyPhysics } from "../physics";
import { Collectible } from "./collectible";
import { Purse } from "./purse";

export type PurseItem = {
    collectible: Collectible,
    x: GameMeter,
    y: GameMeter,
    vX: MeterPerSecond,
    vY: MeterPerSecond,
    rotation: Radian,
    addedAt: Second
}

export const HIDE_PURSE_DELAY: Second = 3 // en secondes.

/**
 * Version visible de laa bourse, c'est elle qui s'affiche tout en haut de droite 
 * de la fenêtre de jeu. Elle permet d'avoir une idée approximative de votre 
 * niveau de richesse dans le jeu.
 */
export class PurseHUD {
    purseWidth: GameMeter = 2;
    purseHeight: GameMeter = 3;
    margin: Pixel = 1 * METER_UNIT;
    pursePositionX: Pixel = SCREEN_WIDTH - this.purseWidth * METER_UNIT - this.margin;
    pursePositionY: Pixel = this.margin + 1 * METER_UNIT;
    private timer: Second = 0;
    private lastChange: Second = 0;
    items: PurseItem[] = []

    constructor(private readonly purse: Purse) { };

    get isVisible(): boolean {
        return this.lastChange + HIDE_PURSE_DELAY > this.timer;
    }

    updatePurse(deltaSeconds: number): void {
        //filtre les nouveau items
        this.purse.content.filter((collectible: Collectible) =>
            !this.items.some((purseItem: PurseItem) => purseItem.collectible === collectible))
            .forEach((collectible: Collectible) => {
                this.addCollectible(collectible)
            })

        //filtre les items "partit"
        this.items.filter((item: PurseItem) => {
            return !this.purse.content.includes(item.collectible)
        }).forEach((item: PurseItem) => this.removePurseItem(item))

        this.items.forEach((item: PurseItem) => applyPhysics(deltaSeconds, item, 0))
        this.timer += deltaSeconds;
    };

    drawCollectible(purseItem: PurseItem, ctx: CanvasRenderingContext2D): void {
        const itemWidth: Pixel = purseItem.collectible.options.purseImageWidth * METER_UNIT;
        const itemHeight: Pixel = purseItem.collectible.options.purseImageHeight * METER_UNIT;
        ctx.save();
        ctx.fillStyle = 'blue';
        const positionConverted: { x: number, y: number } = this.positionInPurse(purseItem.x, purseItem.y)
        ctx.translate(positionConverted.x, positionConverted.y);
        ctx.rotate(purseItem.rotation);
        ctx.fillRect(-itemWidth / 2, 0 - (itemHeight / 2), itemWidth, itemHeight);
        ctx.restore();
    }

    addCollectible(collectible: Collectible): void {
        const randomRotation: number = (Math.random() * 300 - 150) * Math.PI / 180; // entre 150° et -150°
        const purseItem: PurseItem = { collectible: collectible, vX: 0, vY: 0, x: 0, y: this.purseHeight + (this.margin / METER_UNIT), rotation: randomRotation, addedAt: this.timer };
        this.items.push(purseItem);
        this.lastChange = this.timer;
    }

    removePurseItem(purseItem: PurseItem): void {
        this.items = this.items.filter((item: PurseItem) => item !== purseItem)
        this.lastChange = this.timer;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isVisible) return
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center'
        ctx.fillText(this.items.length.toString(), this.pursePositionX + (this.purseWidth * METER_UNIT / 2), this.pursePositionY + this.purseHeight * METER_UNIT + 20);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pursePositionX, this.pursePositionY, this.purseWidth * METER_UNIT, this.purseHeight * METER_UNIT);
        this.items.forEach((purseItem: PurseItem) => this.drawCollectible(purseItem, ctx));
        ctx.restore();
    };

    private positionInPurse(x: GameMeter, y: GameMeter): { x: Pixel, y: Pixel } {
        // si je met 0 0 => je veux le fond du sac au milieu.
        x = this.pursePositionX + (this.purseWidth * METER_UNIT / 2) + x * METER_UNIT;
        y = this.pursePositionY + this.purseHeight * METER_UNIT - y * METER_UNIT;
        return { x: x, y: y }
    }
}