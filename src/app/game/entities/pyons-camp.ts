import { centerX, Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../config";
import { WorldContext } from "./npc";
import { Pyon } from "./pyon";

const MAX_PYONS: number = 2;
const SECONDS_BETWEEN_PYON_CREATION: number = 60;

export class PyonsCamp {

    height: GameMeter = 3;
    width: GameMeter = 6;

    pyonsCreated: Pyon[] = [];
    createPyonTimer: number | undefined;

    constructor(
        public x: GameMeter,
        public worldContext: WorldContext
    ) { }

    get hitbox(): Hitbox {
        return {
            height: this.height,
            width: this.width,
            x: this.x - (this.width / 2),
            y: GROUND
        }
    };

    updateWorldContext(worldContext: WorldContext) {
        this.worldContext = worldContext;
    }

    update(deltaSeconds: number): Pyon | undefined {
        // si le max de Pyon pour ce camps ne depasse pas le nombre de pyon actuel && que aucun timer ne tourne, 
        const isMaxPyons: boolean = this.pyonsCreated.length >= MAX_PYONS;
        const haveTimer: boolean = this.createPyonTimer !== undefined
        if (!isMaxPyons && !haveTimer) {
            // alors on lance un timer de la durée de création d'un Pyon 
            this.createPyonTimer = 0
        }
        if (this.createPyonTimer !== undefined && this.createPyonTimer > SECONDS_BETWEEN_PYON_CREATION) {
            // une fois le timer terminé on crée un pion et on l'ajoute dans le monde ... mais la y'a pas le monde ...
            this.createPyonTimer = undefined;
            return this.createPyon()
        } else if (this.createPyonTimer !== undefined) {
            this.createPyonTimer += deltaSeconds;
        }
        return undefined;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
        ctx.fillStyle = 'hotpink';
        ctx.fillRect(positionInCamera.x, positionInCamera.y - (this.height * METER_UNIT), this.hitbox.width * METER_UNIT, this.hitbox.height * METER_UNIT)
    }

    createPyon(): Pyon {
        return new Pyon(centerX(this.hitbox), GROUND, this);
    }
}