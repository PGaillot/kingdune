import { Camera } from "../camera";
import { Clock } from "../clock";
import { DAY_LENGTH, GameMeter, GROUND, METER_UNIT, Pixel, SCREEN_HEIGHT, SCREEN_WIDTH } from "../config";

export class Celestial {

    /**
     * La class des Objets céléste, permet de créer des trucs
     * dans le ciels, et de les faires tourner.
     * trop classe.
     * @param size hauteur et largeur.
     * @param image 
     * @param clock 
     * @param offset le decalage en ° de l'objet céléste (par rapport au soleil)
     */
    constructor(
        public size: GameMeter,
        public image: HTMLImageElement,
        public clock: Clock,
        public offset: number,
        public radius: Pixel = SCREEN_HEIGHT / 1.5
    ) { }

    get celestialSize(): Pixel {
        return this.size * METER_UNIT;
    }

    get celestialAngle(): number {
        return (this.clock.timeInDay / DAY_LENGTH) * 2 * Math.PI + (this.offset * Math.PI / 180);
    }

    positionX(camera: Camera): number {
        return (SCREEN_WIDTH / 2 - this.radius * Math.cos(this.celestialAngle)) - (this.size / 2) * METER_UNIT;
    }

    positionY(camera: Camera): number {
        return (camera.convert({ x: 0, y: GROUND }).y - this.radius * Math.sin(this.celestialAngle)) - (this.size / 2) * METER_UNIT;;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, this.positionX(camera), this.positionY(camera), this.celestialSize, this.celestialSize)
        ctx.restore();
    }
}