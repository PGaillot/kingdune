import { centerX, Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint, Second } from "../config";
import { Cooldown } from "../cooldown";
import { WorldContext } from "./npc";
import { Pyon } from "./pyon";

const MAX_PYONS: number = 2;
const SECONDS_BETWEEN_PYON_CREATION: number = 60;

const PYON_CAMP_IMAGE: HTMLImageElement = new Image();
PYON_CAMP_IMAGE.src = 'ressources/pyons_camp/pyons-camp.png'


/**
 * C'est un lieu / batiment un peu spécial mais important dans le jeu, 
 * il fait apparaitre à un rythme régulier 1 Pyon toute les *SECONDS_BETWEEN_PYON_CREATION* secondes,
 * tant que son maximum de *MAX_PYONS* n'est pas atteint.
 * TODO: le nombre de pyon camp doit etre definit à l'avance dans le niveau car il impacte beaucoup la difficulté de celui-ci.
 * TODO: Les Camps ne peuvent être actif (généré des pyons), que si il sont dans le biome Dune, si le biome sous celui ci change, le camps se détruit.
 */
export class PyonsCamp {

    height: GameMeter = 3;
    width: GameMeter = 6;
    imageHeight: GameMeter = 3;
    imageWidth: GameMeter = 6;
    pyonsCreated: Pyon[] = [];
    private createPyonCooldown: Cooldown = new Cooldown(SECONDS_BETWEEN_PYON_CREATION, false);

    constructor(
        public x: GameMeter,
        public worldContext: WorldContext,
        public readonly initialPyons: number = 0
    ) {
        this.initialPyons = Math.min(this.initialPyons, MAX_PYONS)
    }


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

    update(deltaSeconds: Second): Pyon | undefined {
        const isMaxPyons: boolean = this.pyonsCreated.length >= MAX_PYONS;
        if (isMaxPyons) return undefined
        if (this.createPyonCooldown.isReady) {
            this.createPyonCooldown.start()
            return this.createPyon()
        }
        this.createPyonCooldown.update(deltaSeconds)
        return undefined;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
        ctx.drawImage(PYON_CAMP_IMAGE, positionInCamera.x, positionInCamera.y - (this.imageHeight * METER_UNIT), this.imageWidth * METER_UNIT, this.imageHeight * METER_UNIT)
        ctx.restore();
    }

    public createPyon(): Pyon {
        return new Pyon(centerX(this.hitbox), GROUND, this.worldContext, this);
    }
}