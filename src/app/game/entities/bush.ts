import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint, Second } from "../config";
import { Muaddib } from "./muaddib";
import { WorldContext } from "./npc";


const MAX_MUADDIBS:number = 3;
const SECONDS_BETWEEN_MUADDIB_CREATION: number = 10;
const BUSH_IMAGE: HTMLImageElement = new Image();
BUSH_IMAGE.src = 'ressources/bush/bush.png';

/**
 * Inspiré des **Buisson du desert**, ils apparaissent sur les biomes roches 
 * avec une distance minimale entre deux buisson, et disparraissent quand ils 
 * se retrouvent dans la sietch zone (entre des murs).
 * C'est dans ces buisson qu'apparaissent les Muaddibs, au maximum de 3 par buisson.
 * @param positionX est la postion ou apparait le centre du buisson.
 * @param worldContext le contexte du monde, mis a jours via updateWorldContext()
 * @param initialMuaddids permet d'initaliser un Buisson avec déjà des Muaddibs. Vaut 0 si undefined.
 */
export class Bush {
    createMuaddibTimer: number | undefined;
    height: GameMeter = 1;
    width: GameMeter = 2;
    
    constructor(
        private readonly positionX: GameMeter,
        public worldContext:WorldContext,
        public readonly initialMuaddids:number = 0
    ) {
        this.initialMuaddids = Math.min(this.initialMuaddids, MAX_MUADDIBS)
    }

    get hitbox(): Hitbox {
        return {
            height: this.height,
            width: this.width,
            x: this.positionX - (this.width / 2),
            y: GROUND,
        }
    }

    updateWorldContext(worldContext: WorldContext) {
        this.worldContext = worldContext;
    }

    update(deltaSeconds: Second, muaddibsAttached: number):Muaddib | undefined{
        const isMaxMuaddibs:boolean = muaddibsAttached >= MAX_MUADDIBS;
        const haveTimer:boolean = this.createMuaddibTimer !== undefined;
        if(!isMaxMuaddibs && !haveTimer) this.createMuaddibTimer = 0;
        if(this.createMuaddibTimer !== undefined && this.createMuaddibTimer > SECONDS_BETWEEN_MUADDIB_CREATION){
            this.createMuaddibTimer = undefined;
            return this.createMuaddib()
        } else if(this.createMuaddibTimer !== undefined) {
            this.createMuaddibTimer += deltaSeconds;
        }
        return undefined
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const position: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y });
        ctx.drawImage(BUSH_IMAGE, position.x, (position.y - this.height * METER_UNIT), this.width * METER_UNIT, this.height * METER_UNIT);
        ctx.restore();
    }

    createMuaddib():Muaddib {
        return new Muaddib(this.positionX, this.hitbox.y, this.worldContext, this)
    }
}