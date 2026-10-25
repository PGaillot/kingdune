import { GameMeter, METER_UNIT, Pixel, ScreenPoint, WorldPoint } from "./game/config";

/**
 * La caméra est définie par la taille de l'écran qu'elle remplit (en pixels)
 * et par le point du monde qu'elle regarde (en mètres).
 * Ce point est toujours affiché au milieu de l'écran.
 * @param height hauteur de l'écran, en pixels
 * @param width largeur de l'écran, en pixels
 * @param position point du monde regardé, en mètres
 */
export class Camera {

    //Décalage entre la cible suivie et le point réellement regardé, en mètres.
    offset: WorldPoint = { x: 0, y: 3 };

    constructor(private height: Pixel, private width: Pixel, public position: WorldPoint) { }

    follow(target: WorldPoint): void {
        this.position = { x: target.x + this.offset.x, y: target.y + this.offset.y };
    }

    /** Convertit un point du monde (en mètres) en point de l'écran (en pixels). */
    convert(point: WorldPoint): ScreenPoint {
        return { x: this.toScreenX(point.x), y: this.toScreenY(point.y) };
    }

    private toScreenX(worldX: GameMeter): Pixel {
        // Distance entre l'objet et le point regardé, positive si l'objet est à droite.
        const distance: GameMeter = worldX - this.position.x;
        return (this.width / 2) + distance * METER_UNIT;
    }

    private toScreenY(worldY: GameMeter): Pixel {
        // Distance entre l'objet et le point regardé, positive si l'objet est au-dessus.
        const distance: GameMeter = worldY - this.position.y;
        // Dans le canvas, y augmente vers le bas, d'où la soustraction.
        return (this.height / 2) - distance * METER_UNIT;
    }

}
