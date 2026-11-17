import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, ScreenPoint } from "../config";
import { Muaddib } from "./muaddib";
import { WorldContext } from "./npc";


const MAX_MUADDIBS:number = 3;
const SECONDS_BETWEEN_MUADDIB_CREATION: number = 10;
const BUSH_IMAGE: HTMLImageElement = new Image();
BUSH_IMAGE.src = '/ressources/bush/bush.png';


export class Bush {

    muaddidsCreated: Muaddib[] = [];
    initialMuaddibsCount:number = 0;
    createMuaddibTimer: number | undefined;

    height: GameMeter = 1;
    width: GameMeter = 2;
    
    constructor(
        private readonly positionX: GameMeter,
        public worldContext:WorldContext,
        readonly initalMuaddids:number = 0
    ) {
        if(initalMuaddids > MAX_MUADDIBS){
            this.initialMuaddibsCount = MAX_MUADDIBS
        } else {
            this.initialMuaddibsCount = initalMuaddids;
        }
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

    update(deltaSeconds: number):Muaddib | undefined{
        const isMaxMuaddibs:boolean = false;
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
        return new Muaddib(this.hitbox.x, this.hitbox.y, this.worldContext, this)
    }
}