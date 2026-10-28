import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, Pixel, ScreenPoint } from "../config";

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

export class Catchbasin {
    readonly options: CatchbasinOptions;

    private width: GameMeter = 1;
    private height: GameMeter = 2;
    private marker: boolean = false; // Marqué pour etre fouillé, il est toujours initialisé à faux.
    public readonly price: number = 1; // le prix qu'il en coute en WaterRing pour la fouiller et la faire disparaitre.
    public hoverByPlayer: boolean = false; // est ce que le joueur est devant le catchbasin.

    constructor(readonly x: GameMeter, option?: Partial<CatchbasinOptions>) {
        this.options = { ...DEFAULT_CATCHBASIN_OPTION, ...option }
    }

    get hitbox(): Hitbox {
        return {
            height: this.height,
            width: this.width,
            x: this.x,
            y: GROUND
        }
    };

    mark(): void {
        this.marker = true;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.save()
        ctx.imageSmoothingEnabled = false;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.x, y: GROUND });
        const destinationOption: { dx: Pixel, dy: Pixel } = {
            dx: positionInCamera.x - ((this.options.imageWidth * METER_UNIT - this.width * METER_UNIT) / 2),
            dy: (positionInCamera.y - (this.height * METER_UNIT))
        }
        const dimensionOption: { dw: Pixel, dh: Pixel } = {
            dw: this.options.imageWidth * METER_UNIT,
            dh: this.options.imageHeight * METER_UNIT
        }

        if (this.hoverByPlayer) {
            ctx.filter = 'brightness(0.6)';
        }
        ctx.drawImage(this.options.image, destinationOption.dx, destinationOption.dy, dimensionOption.dw, dimensionOption.dh)
        if (this.marker) {
            ctx.drawImage(this.options.marker, destinationOption.dx, destinationOption.dy, dimensionOption.dw, dimensionOption.dh)
        }

        ctx.restore();
    }

}