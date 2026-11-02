import { Pixel, METER_UNIT, SCREEN_WIDTH } from "../config";
import { Collectible } from "./collectible";
import { Purse } from "./purse";

export type PurseItem = {
    collectible: Collectible,
    x: number,
    y: number,
    vX: number,
    vY: number
    rotation: number,
    addedAt: number
}

export const HIDE_PURSE_DELAY: number = 3 // en secondes.

export class PurseHUD {
    margin: Pixel = 1 * METER_UNIT;
    purseWidth: Pixel = 2 * METER_UNIT;
    purseHeight: Pixel = 3 * METER_UNIT;
    pursePositionX: Pixel = SCREEN_WIDTH - this.purseWidth - this.margin;
    pursePositionY: Pixel = this.margin + 1 * METER_UNIT;
    private timer: number = 0;
    private lastChange: number = 0;

    constructor(private readonly purse: Purse) { };

    get isVisible(): boolean {
        return this.lastChange + HIDE_PURSE_DELAY > this.timer;
    }

    items: PurseItem[] = []

    updatePurse(deltaSeconds: number): void {
        this.purse.content.filter((collectible: Collectible) =>
            !this.items.some((purseItem: PurseItem) => purseItem.collectible === collectible)
        ).forEach((collectible: Collectible) => this.addCollectible(collectible))
        this.timer += deltaSeconds;
    };

    drawCollectible(purseItem: PurseItem, ctx: CanvasRenderingContext2D): void {
        const itemWidth: Pixel = purseItem.collectible.options.purseImageWidth * METER_UNIT;
        const itemHeight: Pixel = purseItem.collectible.options.purseImageHeight * METER_UNIT;
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.translate(purseItem.x, purseItem.y);
        ctx.rotate(purseItem.rotation);
        ctx.fillRect(-itemWidth / 2, 0 - (itemHeight / 2), itemWidth, itemHeight)
        ctx.restore();
    }

    addCollectible(collectible: Collectible): void {
        const randomRotation: number = (Math.random() * 300 - 150) * Math.PI / 180; // entre 150° et -150°
        const spawnPositionX: Pixel = SCREEN_WIDTH - (this.purseWidth / 2) - this.margin;
        const spawnPositionY: Pixel = this.margin;
        const purseItem: PurseItem = { collectible: collectible, vX: 0, vY: 0, x: spawnPositionX, y: spawnPositionY, rotation: randomRotation, addedAt: this.timer };
        this.items.push(purseItem);
        this.lastChange = this.timer;
    }

    hidePurse(): void { }

    displayPurse(): void { }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isVisible) return
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center'
        ctx.fillText(this.items.length.toString(), this.pursePositionX + (this.purseWidth / 2), this.pursePositionY + this.purseHeight + 20);
        this.items.forEach((purseItem: PurseItem) => this.drawCollectible(purseItem, ctx));
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pursePositionX, this.pursePositionY, this.purseWidth, this.purseHeight);
        ctx.restore();
    };
}