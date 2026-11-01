import { centerX, Hitbox } from "../../hitbox";
import { Purchasable } from "../interfaces/purchasable";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, Pixel, ScreenPoint } from "../config";
import { Workable } from "../interfaces/workable";
import { WaterRing } from "../entities/water-ring";
import { getRandomBetweenMinMax } from "../../utils/random.utils";

export type CatchbasinOptions = {
    image: HTMLImageElement,
    marker: HTMLImageElement,
    imageWidth: GameMeter,
    imageHeight: GameMeter,
}

const IMAGE: HTMLImageElement = new Image();
IMAGE.src = '/ressources/catchbasin/catchbasin_1.png';

const MARKER: HTMLImageElement = new Image();
MARKER.src = '/ressources/catchbasin/catchbasin_flag_1.png';

const DEFAULT_CATCHBASIN_OPTION: CatchbasinOptions = {
    image: IMAGE,
    marker: MARKER,
    imageHeight: 2,
    imageWidth: 3
}

export class Catchbasin implements Purchasable, Workable {

    readonly options: CatchbasinOptions;

    private width: GameMeter = 1;
    private height: GameMeter = 2;
    get workerRequired(): number {
        return this.marked ? 1 : 0;
    };

    public readonly price: number = 1; // le prix qu'il en coute en WaterRing pour la fouiller et la faire disparaitre.

    constructor(readonly x: GameMeter, option?: Partial<CatchbasinOptions>) {
        this.options = { ...DEFAULT_CATCHBASIN_OPTION, ...option }
    }

    private initialWorkCharge: number = 2.5;

    workChargeLeft: number = this.initialWorkCharge;
    public requestedAt: number | undefined = undefined;


    private get marked(): boolean {
        return this.requestedAt !== undefined
    };


    complete(): WaterRing[] {
        const randomWaterringNumber: number = Math.floor(Math.random() + 1.5);
        return Array.from({ length: randomWaterringNumber }, () => (new WaterRing(centerX(this.hitbox), 1))).map((waterring: WaterRing) => {
            waterring.vY = getRandomBetweenMinMax(1, 2);
            waterring.vX = getRandomBetweenMinMax(-2, 2);
            return waterring
        })
    }

    get currentPrice(): number | undefined {
        return this.marked ? undefined : this.price;
    }

    public get hitbox(): Hitbox {
        return {
            height: this.height,
            width: this.width,
            x: this.x - (this.width / 2),
            y: GROUND
        }
    };

    public onPaid(): void {
        this.mark()
    }

    public draw(ctx: CanvasRenderingContext2D, camera: Camera) {

        const positionInCamera: ScreenPoint = camera.convert({ x: this.x, y: GROUND });
        const destinationOption: { dx: Pixel, dy: Pixel } = {
            dx: positionInCamera.x - ((this.options.imageWidth * METER_UNIT) / 2),
            dy: (positionInCamera.y - (this.height * METER_UNIT))
        }
        const dimensionOption: { dw: Pixel, dh: Pixel } = {
            dw: this.options.imageWidth * METER_UNIT,
            dh: this.options.imageHeight * METER_UNIT
        }

        ctx.drawImage(this.options.image, destinationOption.dx, destinationOption.dy, dimensionOption.dw, dimensionOption.dh)

        if (this.marked) {
            ctx.drawImage(this.options.marker, destinationOption.dx, destinationOption.dy, dimensionOption.dw, dimensionOption.dh)
        }
    }

    private mark(): void {
        this.requestedAt = performance.now();
    }

}